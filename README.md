# MineOps — Mining Equipment & Inventory Tracker

MineOps is a Vue application for organizing equipment, inventory, suppliers, employees, locations, and maintenance work orders.

## Run locally

Requirements: Node.js 18+ (Node.js 20+ recommended) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Local workspace access

The opening screen includes a mining equipment illustration and an email/password form. Without a backend, the form cannot verify accounts or passwords. Submitting opens a browser-local workspace; only the email is kept in the current tab session, and the password is never saved. This screen is an interface, not a security boundary.

## Workspace data

Records are saved in the browser's local storage on the current device. No server, database, account verification, or network service is used. Data does not synchronize with other devices or users; clearing browser site data removes saved records. Export module records to CSV for a separate backup.

The workspace starts empty rather than displaying made-up mine, employee, equipment, inventory, or work-order details. Add reference records such as equipment statuses, roles, priorities, and brands first, then create the operational records that use them.

## Included

- Vue 3, Vite, Vue Router, and Pinia
- Mining equipment sign-in screen and browser-local workspace access
- Equipment, status, brand, location, employee, role, inventory, supplier, work order, priority, and work-order parts modules
- Local create, edit, delete, filtering, search, pagination, and CSV export
- Dashboard KPIs calculated from records entered in the workspace
- Responsive desktop and mobile layouts
