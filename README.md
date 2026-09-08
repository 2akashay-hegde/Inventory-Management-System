# 📦 InventoryHub — Inventory Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

*A full-stack Inventory Management System built with React, Node.js, Express & MongoDB.*

</div>

---

## What This App Does

InventoryHub lets you manage your product catalog from a single dashboard:

- ➕ **Add, edit, and delete** products with distinct **Unique IDs** (duplicate validation prevents reassignment)
- 🔍 **Search** by product name or Unique ID (server-side MongoDB query)
- 🗂️ **Filter** by category (server-side)
- 🚨 **Low stock alerts** — rows highlighted automatically when `quantity ≤ minStock`
- 📊 **Live dashboard stats** — total products, units, and inventory value (updates with active filters)
- ⚡ **Quick stock adjust** — `+` / `−` buttons directly in the table row
- 🔔 **Toast notifications** — success/error feedback on every action

---

## Setup Steps

### Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) installed and running locally

> **Windows:** Open `Services` → Find `MongoDB` → Click **Start**

---

### Option 1 — Double Click (Easiest)

Double-click **`START.bat`** in the project folder.

It automatically:
1. Checks MongoDB is running
2. Installs dependencies (first time only)
3. Loads demo data
4. Starts both server + client
5. Opens **http://localhost:3000** in your browser

---

### Option 2 — Terminal

Open a terminal in the project root folder and run these in order:

**Step 1 — Install dependencies** *(first time only)*
```bash
npm install --prefix server
npm install --prefix client
```

**Step 2 — Load demo data** *(first time only — adds 10 sample products)*
```bash
npm run seed
```

**Step 3 — Start the app**
```bash
npm start
```

You should see:
```
[SERVER] Inventory Management API running on http://localhost:5000
[SERVER] [MongoDB] Connected successfully to host: 127.0.0.1
[CLIENT] VITE ready → http://localhost:3000/
```

Open **http://localhost:3000** in your browser.

---

### Available Scripts

| Command | What it does |
|---|---|
| `npm start` | Starts **both** server + client together |
| `npm run seed` | Loads 10 demo products into MongoDB |
| `npm run server` | Starts backend only (`http://localhost:5000`) |
| `npm run client` | Starts frontend only (`http://localhost:3000`) |

---

### Troubleshooting

**Port already in use (EADDRINUSE on port 5000)?**
Another server process is already running. Kill it first:
```powershell
# Find the PID using port 5000
netstat -ano | findstr ":5000"

# Kill it (replace XXXX with the PID number shown)
taskkill /PID XXXX /F

# Then start again
npm start
```

**MongoDB not connecting?**
Open Windows `Services` → Find `MongoDB` → Click **Start**

---

## 🎥 Demo Video

> **[▶️ Watch Demo Video](https://youtu.be/PpD8GBaXaNk)**

---

## Structure

```
Inventory Management System/
│
├── START.bat                  ← Double-click to run everything on Windows
├── package.json               ← Root scripts: npm start, npm run seed
│
├── server/                    ← Node.js + Express backend
│   ├── .env                   ← Environment config (PORT, MONGODB_URI)
│   └── src/
│       ├── server.js          ← Express app entry point
│       ├── seed.js            ← Demo data loader (10 sample products)
│       ├── config/
│       │   └── db.js          ← MongoDB connection setup
│       ├── models/
│       │   └── Product.js     ← Mongoose schema with validation + virtual fields
│       ├── controllers/
│       │   └── productController.js  ← Business logic for all 5 API endpoints
│       ├── routes/
│       │   └── productRoutes.js      ← Express router mapping URLs to controllers
│       └── middleware/
│           └── errorHandler.js       ← Centralized error response formatting
│
└── client/                    ← React + Vite frontend
    └── src/
        ├── App.jsx            ← Main app: state, data fetching, event handlers
        ├── index.css          ← Full design system (Midnight Pro dark theme)
        ├── api/
        │   └── productApi.js  ← All fetch() calls to the backend in one file
        └── components/
            ├── Navbar.jsx           ← Top bar with brand, sync, add button
            ├── StatsOverview.jsx    ← 4 KPI cards (updates with active filter)
            ├── ProductTable.jsx     ← Table with edit/delete/stepper + smart empty state
            ├── ProductModal.jsx     ← Add / Edit product form modal
            ├── DeleteConfirmModal.jsx ← Confirmation dialog before deleting
            └── Toast.jsx            ← Floating notification system
```

### API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/products` | Add a new product |
| `GET` | `/products` | Get all products (`?search=` and `?category=` supported) |
| `PUT` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |
| `GET` | `/products/low-stock` | Get products where `quantity ≤ minStock` |

### Product Schema

| Field | Type | Notes |
|---|---|---|
| `id` | String | Auto-generated from MongoDB `_id` |
| `name` | String | Required, 2–120 characters |
| `category` | String | Required, free text |
| `price` | Number | Required, ≥ 0 |
| `quantity` | Number | Required, ≥ 0 |
| `minStock` | Number | Required, ≥ 0 |
| `createdAt` | Date | Auto-set via Mongoose `timestamps: true` |
| `isLowStock` | Boolean | Computed virtual — `true` when `quantity ≤ minStock` |

---

## Assumptions

The following design decisions were made based on the assignment brief:

1. **No authentication** — The brief did not require login or user management, so none was added.
2. **Currency in ₹ (Indian Rupees)** — All prices are displayed in INR.
3. **Free-text categories** — Categories are typed by the user rather than chosen from a fixed list, allowing flexibility.
4. **Per-product minStock** — Each product has its own minimum stock threshold since different items have different reorder needs (e.g., a ₹50 pen vs a ₹5000 laptop).
5. **Hard delete** — Products are permanently deleted with no recycle bin or soft-delete, keeping the data model simple.
6. **Server-side filtering** — Search and category filters hit the MongoDB server (not filtered in the browser), so results stay accurate even with large datasets.
7. **Optimistic UI for stock updates** — The `+`/`−` quantity steppers update the UI immediately and sync with the backend in the background, making the interface feel instant.

---

## Improvements

Given more time, the following features would be added:

| # | Improvement | Why |
|---|---|---|
| 1 | **JWT Authentication** | Secure the API so only authorized users can add/edit/delete products |
| 2 | **Pagination** | Efficient handling of large product lists (currently loads all at once) |
| 3 | **CSV Import / Export** | Bulk-add products from a spreadsheet; export inventory reports |
| 4 | **Stock History Graph** | Visual chart showing quantity changes over time per product |
| 5 | **Email / SMS Alerts** | Automatically notify when a product drops below `minStock` |
| 6 | **Unit Tests** | Jest + React Testing Library for controller and component coverage |
| 7 | **Barcode / SKU support** | Scan or enter product barcodes for faster cataloguing |
| 8 | **Multi-warehouse support** | Track stock across different storage locations |

---

## Assignment Checklist

### Backend ✅
- [x] `POST /products` — Add product
- [x] `GET /products` — Get all products (with `?search` and `?category` query support)
- [x] `PUT /products/:id` — Update product
- [x] `DELETE /products/:id` — Delete product
- [x] `GET /products/low-stock` — Products where quantity ≤ minStock
- [x] Fields: `id`, `name`, `category`, `price`, `quantity`, `minStock`, `createdAt`

### Frontend ✅
- [x] Add products
- [x] View all products in a table
- [x] Update products (edit modal with pre-filled form)
- [x] Delete products (confirmation dialog)
- [x] Search by name
- [x] Filter by category
- [x] Highlight low stock items (red badge + row tint)

### Technical ✅
- [x] React + Node.js + MongoDB
- [x] Clean, readable, well-structured code
- [x] Error handling — validation at controller level + Mongoose schema level + centralized middleware
- [x] Runs locally

---

*Built as part of a Full-Stack Developer Internship Technical Evaluation.*
