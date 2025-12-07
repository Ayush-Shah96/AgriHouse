# 🌾 AgriStore AI - Smart Warehouse Management System

> **Reducing agricultural wastage through intelligent storage tracking and AI-driven analytics.**

AgriStore AI is a full-stack solution designed to help farmers and warehouse merchants manage inventory efficiently. It tackles the major issue of livestock and produce wastage caused by poor storage techniques by providing real-time tracking, expiry alerts, and automated shelf management.

---

## 🚀 Key Features

### 1. 📊 AI Integrated Dashboard
A live command center that provides real-time insights:
* **Inventory Status:** Total products in stock vs. warehouse capacity.
* **Expiry Alerts:** Immediate notification of products expiring today or soon.
* **Space Management:** Tracks empty shelves and available slots.
* **Staff Tracking:** Monitors daily staff attendance.
* **Financial Overview:** Tracks daily stock-in costs vs. stock-out revenue.

### 2. 🧾 QR & Invoice Generator
* Generates a unique Invoice with an embedded **QR Code** for every new product.
* Encodes essential data: *Quantity, Shelf Position, Expiry Date, and Product Type*.
* Simplifies the labeling process for farmers.

### 3. 📲 Scan-to-Action (Deposit/Withdraw)
* **Automated Logistics:** Users simply scan the product's QR code to perform actions.
* **Deposit:** Registers the item into the database and assigns a shelf.
* **Withdraw:** Updates inventory status to 'Sold' and frees up shelf space instantly.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Custom Hooks, Tailwind-logic styling)
* **Backend:** Python (FastAPI)
* **Database:** SQLite (Relational DB for tracking shelves/products)
* **Tools:** `qrcode` (Python library), `react-router-dom`

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/agri-warehouse.git](https://github.com/YOUR_USERNAME/agri-warehouse.git)
cd agri-warehouse
```
### 2. Backend Setup (Python)
Open a terminal and navigate to the backend folder:

```bash
cd backend
pip install fastapi uvicorn qrcode[pil] python-multipart
python main.py
The server will start at http://localhost:8000
```


3. Frontend Setup (React)
Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
npm start
The app will open at http://localhost:3000
```


## 🔑 Login Credentials
To access the system, use the default admin credentials:
Username: admin
Password: password

(Note: These are seeded automatically in database.sql)

## 🔮 Future Scope
IoT Integration: Connect with temperature sensors for cold storage monitoring.
Blockchain: Supply chain transparency for end-consumers.
Mobile App: React Native version for field usage.
