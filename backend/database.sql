-- database.sql

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'merchant' -- 'merchant' or 'staff'
);

CREATE TABLE IF NOT EXISTS shelves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shelf_code TEXT UNIQUE NOT NULL, -- e.g., 'A1', 'B2'
    capacity INTEGER NOT NULL,
    current_load INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'Dairy', 'Grain'
    expiry_date DATE NOT NULL,
    qr_code_data TEXT UNIQUE NOT NULL, -- Unique ID for the QR
    shelf_id INTEGER,
    price_per_unit REAL,
    status TEXT DEFAULT 'IN_STOCK', -- 'IN_STOCK', 'SOLD', 'EXPIRED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelf_id) REFERENCES shelves(id)
);

CREATE TABLE IF NOT EXISTS staff_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_name TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'PRESENT'
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    type TEXT NOT NULL, -- 'DEPOSIT' or 'WITHDRAW'
    amount REAL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Seed some initial shelf data
INSERT OR IGNORE INTO shelves (shelf_code, capacity) VALUES ('A1', 50), ('A2', 50), ('B1', 100);
INSERT OR IGNORE INTO users (username, password_hash, role) VALUES ('admin', 'password', 'merchant');