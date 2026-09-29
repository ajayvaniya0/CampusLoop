# CampusLoop Agent Guidelines & Project Architecture

## Project Overview
CampusLoop is a smart campus resource sharing web application helping verified students discover and circulate underused academic and campus gear (calculators, lab kits, textbooks, electronics). It incorporates:
- Student email / campus verification
- Resource listings & marketplace discovery
- Request & owner approval lifecycle
- QR-code based physical handover & return verification
- Green Points sustainability incentive system
- Admin moderation, dispute management, and metrics

---

## Repository Structure & Conventions

```text
CampusLoop/
├── client/                     # Vite + React (Tailwind CSS, React Router v7, Lucide Icons)
│   ├── src/
│   │   ├── components/         # Reusable UI widgets & layouts (Navbar, Footer, Layout)
│   │   ├── pages/              # Page views (Landing, Login, Register, Marketplace, Dashboard)
│   │   ├── features/           # Feature slices / domain logic
│   │   ├── services/           # TanStack Query or Axios/fetch API wrappers
│   │   ├── routes/             # Client route definitions
│   │   ├── App.jsx             # React Router hierarchy
│   │   ├── index.css           # Tailwind design tokens & base styling
│   │   └── main.jsx            # React root mount
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express (Mongoose, Dotenv, CORS)
│   ├── src/
│   │   ├── config/             # DB & cloud configurations (db.js)
│   │   ├── controllers/        # Express route handler logic
│   │   ├── middleware/         # Auth, validation, rate limiting, role guards
│   │   ├── models/             # Mongoose schemas (User, Item, Request, Transaction, Event, Notification, Dispute)
│   │   ├── routes/             # Express API routers (health, auth, items, requests, transactions)
│   │   ├── services/           # Core domain services & business rules
│   │   ├── utils/              # Token hashing, QR generation, date checks
│   │   ├── app.js              # Express app initialization & middleware stack
│   │   └── index.js            # Server entry point & DB startup
│   ├── .env.example
│   └── package.json
│
├── docs/                       # Project specs and architectural references (specs.pdf)
├── .env.example                # Root environment template
├── .gitignore
├── AGENTS.md                   # Agent guidelines & project specification
└── README.md                   # Setup and execution instructions
```

---

## Core Technical Rules & Backend Constraints

1. **Security First**:
   - Store secure QR token hashes instead of raw secrets in the database.
   - Handover & return state transitions must be verified by backend endpoints with authenticated scanner context.
   - Never trust client-sent item or transaction statuses directly.
   - Restrict CORS to configured frontend origin (`CLIENT_ORIGIN`).

2. **Core Domain Validation**:
   - A student cannot request their own item.
   - Only the item owner can accept or reject a request.
   - An item cannot have overlapping approved active transactions.
   - Handover flow: `APPROVED` → `HANDOVER_PENDING` → `BORROWED`.
   - Return flow: `BORROWED` → `RETURN_PENDING` → `COMPLETED` → `AVAILABLE`.
   - Green points are awarded once upon successful transaction completion.

3. **Database Schemas (Mongoose)**:
   - `users`: `_id, authUid, name, email, department, semester, role, verificationStatus, reputationScore, points, createdAt`
   - `items`: `_id, ownerId, title, description, categoryId, images, condition, actionTypes, status, location, availability, maxDuration, qrTokenHash, createdAt`
   - `requests`: `_id, itemId, ownerId, borrowerId, startDate, dueDate, purpose, status, createdAt, decidedAt`
   - `transactions`: `_id, requestId, itemId, ownerId, borrowerId, status, handoverEvent, returnEvent, dueDate, createdAt, completedAt`
   - `events`: `_id, transactionId, type, actorId, timestamp, metadata`
   - `notifications`: `_id, recipientId, type, title, message, relatedId, readAt, createdAt`
   - `disputes`: `_id, transactionId, reporterId, type, description, evidence, status, resolution, resolvedBy`

---

## Sprint Implementation Order (Strict Sequence)

1. **Sprint 0**: Project Setup & Scaffolding (Current)
2. **Sprint 1**: Authentication, Roles, Layout & Protected Routes
3. **Sprint 2**: Item Model, Create/Edit Listing, Image Upload, Marketplace Search
4. **Sprint 3**: Borrow Requests, Owner Approval, Status Transitions, Notifications
5. **Sprint 4**: Transaction Model, Due Dates, Active Borrowing, History
6. **Sprint 5**: QR Generation, Scan Handover, Return Verification Events
7. **Sprint 6**: Admin Dashboard, Dispute Resolution, Points, Overdue Reminders
8. **Sprint 7**: End-to-end Testing, Security Auditing, Usability, Mentor Demo
