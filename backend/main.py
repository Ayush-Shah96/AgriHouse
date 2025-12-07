import sqlite3
import qrcode
import io
import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_NAME = "warehouse.db"

# --- Database Helper ---
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# --- Models ---
class UserLogin(BaseModel):
    username: str
    password: str

class ProductCreate(BaseModel):
    name: str
    type: str
    expiry_date: str # YYYY-MM-DD
    shelf_code: str
    price: float

class StockAction(BaseModel):
    qr_data: str

# --- Feature 1: Auth ---
@app.post("/login")
def login(user: UserLogin):
    # In production, use bcrypt for password hashing
    conn = get_db_connection()
    u = conn.execute("SELECT * FROM users WHERE username = ? AND password_hash = ?", 
                     (user.username, user.password)).fetchone()
    conn.close()
    if u:
        return {"status": "success", "role": u['role']}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# --- Feature 2: AI Integrated Dashboard Data ---
@app.get("/dashboard-stats")
def get_dashboard_stats():
    conn = get_db_connection()
    today = datetime.date.today().isoformat()
    
    # i) Number of products
    total_products = conn.execute("SELECT COUNT(*) as count FROM products WHERE status='IN_STOCK'").fetchone()['count']
    
    # ii) Products expiring today or passed
    expiring = conn.execute("SELECT COUNT(*) as count FROM products WHERE expiry_date <= ? AND status='IN_STOCK'", (today,)).fetchone()['count']
    
    # iii) Empty Shelves / Capacity
    shelves = conn.execute("SELECT * FROM shelves").fetchall()
    total_capacity = sum(s['capacity'] for s in shelves)
    current_load = sum(s['current_load'] for s in shelves)
    empty_spots = total_capacity - current_load
    
    # iv) Staff today
    staff_count = conn.execute("SELECT COUNT(*) as count FROM staff_attendance WHERE date = ? AND status='PRESENT'", (today,)).fetchone()['count']
    
    # v) Financials (Simple logic for demonstration)
    money_in = conn.execute("SELECT SUM(amount) as total FROM transactions WHERE type='WITHDRAW' AND date(timestamp) = ?", (today,)).fetchone()['total'] or 0
    money_out = conn.execute("SELECT SUM(amount) as total FROM transactions WHERE type='DEPOSIT' AND date(timestamp) = ?", (today,)).fetchone()['total'] or 0
    
    conn.close()
    
    return {
        "total_stock": total_products,
        "expiring_soon": expiring,
        "warehouse_capacity": f"{current_load}/{total_capacity}",
        "empty_slots": empty_spots,
        "staff_active": staff_count,
        "financials": {"in": money_in, "out": money_out}
    }

# --- Feature 3: QR Generator & Invoice ---
@app.post("/create-invoice")
def create_invoice(product: ProductCreate):
    conn = get_db_connection()
    
    # 1. Check shelf availability
    shelf = conn.execute("SELECT id, current_load, capacity FROM shelves WHERE shelf_code = ?", (product.shelf_code,)).fetchone()
    if not shelf or shelf['current_load'] >= shelf['capacity']:
        conn.close()
        raise HTTPException(status_code=400, detail="Shelf full or not found")
        
    # 2. Generate Unique QR Data string
    qr_data = f"{product.name}-{product.shelf_code}-{datetime.datetime.now().timestamp()}"
    
    # 3. Insert into DB
    conn.execute("INSERT INTO products (name, type, expiry_date, qr_code_data, shelf_id, price_per_unit) VALUES (?, ?, ?, ?, ?, ?)",
                 (product.name, product.type, product.expiry_date, qr_data, shelf['id'], product.price))
    
    # 4. Update Shelf Load
    conn.execute("UPDATE shelves SET current_load = current_load + 1 WHERE id = ?", (shelf['id'],))
    
    # 5. Log Transaction (Money Out/Stock In)
    prod_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    conn.execute("INSERT INTO transactions (product_id, type, amount) VALUES (?, 'DEPOSIT', ?)", (prod_id, product.price))
    
    conn.commit()
    conn.close()
    
    # Generate QR Image
    img = qrcode.make(qr_data)
    buf = io.BytesIO()
    img.save(buf)
    buf.seek(0)
    
    return StreamingResponse(buf, media_type="image/png")

# --- Feature 4: Deposit/Withdraw via Scan ---
@app.post("/scan-action")
def scan_action(action: StockAction):
    conn = get_db_connection()
    product = conn.execute("SELECT * FROM products WHERE qr_code_data = ?", (action.qr_data,)).fetchone()
    
    if not product:
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")

    message = ""
    if product['status'] == 'IN_STOCK':
        # WITHDRAW LOGIC
        conn.execute("UPDATE products SET status = 'SOLD' WHERE id = ?", (product['id'],))
        conn.execute("UPDATE shelves SET current_load = current_load - 1 WHERE id = ?", (product['shelf_id'],))
        conn.execute("INSERT INTO transactions (product_id, type, amount) VALUES (?, 'WITHDRAW', ?)", (product['id'], product['price_per_unit']))
        message = "Stock Withdrawn successfully"
    else:
        # If sold, logic to return? For now, let's assume scan only withdraws active stock
        message = "Product already processed/sold."

    conn.commit()
    conn.close()
    return {"status": "success", "message": message}

if __name__ == "__main__":
    import uvicorn
    # Initialize DB
    conn = sqlite3.connect(DB_NAME)
    with open('database.sql', 'r') as f:
        conn.executescript(f.read())
    conn.close()
    
    uvicorn.run(app, host="0.0.0.0", port=8000)