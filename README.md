# Butcher Shop Management System/ ERP + CRM + Vets approval

A modular,  platform for managing multi‑tenant butcher shops in Rwanda. Provides core functionality for shop owners, suppliers, veterinarians, and end‑customers—including inventory, orders, dynamic JSON‑driven documents, email templates, and more—all secured with JWT authentication. See backend <a href="https://github.com/unmatched78/butcher_mgs">here</a>

---

## 🚀 Features

- **Multi‑Role Authentication**  
  - `shop` (butcher owner/staff)  
  - `supplier` (external suppliers)  
  - `vet` (veterinarians)  
  - `client` (end customers)

- **Shop Management**  
  - Register shop profiles with name, contact, address  
  - Owner/staff can manage suppliers, inventory, orders, and document templates

- **Supplier Lifecycle**  
  - Invite suppliers by email (with tokenized links)  
  - Suppliers respond, submit quotations, record deliveries  
  - Shop staff approve/reject quotations and deliveries

- **Inventory Module**  
  - Categories, items (SKUs), stock entries (incoming) and exits (sales)  
  - Link stock entries to suppliers

- **Customer Orders**  
  - Clients browse shops & items  
  - Place orders with line items; shops confirm, ship, deliver, or cancel

- **Dynamic Documents**  
  - Define JSON‑schema document templates (e.g. delivery notes, checklists)  
  - Fill out form instances via API, store as JSON  
  - Render JSON into printable PDFs with WeasyPrint

- **Email Template Engine**  
  - Per‑shop, editable subject/body templates stored in database  
  - Fallback to file‑based defaults  
  - Render with context and send via SMTP (Gmail)

- **Veterinarian Approvals**  
  - Pre‑ and post‑slaughter inspections on cows  
  - Slaughter approval records per animal  
  - Vets have cross‑shop access; shop staff see status

---

## 📦 Tech Stack

- **Frontend**  
  - Typescript  
  - Reactjs 
  - tailwindcss
  - shadcn UI
  - (JWT auth)  
  - WeasyPrint (PDF generation)
  - Resend[email management]

- **Database**  
  - PostgreSQL

- **Deployment**  
  - Docker & docker‑compose (optional)  
  - GitHub Actions (CI/CD)

---

## 🏗 Architecture

- Client (Web/Mobile)
- ↕ JSON over HTTPS
- Django/Nestjs API (DRF + JWT + Email Templates)
- ↕ Psycopg2
- PostgreSQL


Apps:
- `users`  – custom `User` + `ShopProfile`/`VetProfile`/`Customer`/`SupplierProfile`  
- `clients` – shop directory & customer profiles  
- `inventory` – categories, items, stock entries/exits  
- `suppliers` – supplier profiles, invitations, quotations, deliveries  
- `orders`  – customer orders & line items  
- `docs`   – dynamic JSON document templates & instances  
- `vets`   – veterinarian inspections & slaughter approvals  
- `email_config` – editable email templates per shop  

---

## 🔧 Installation & Setup

1. **Clone & create *

## 📁 Directory Structure


## LICENSE 
<a href="LICENSE">see here</a>
