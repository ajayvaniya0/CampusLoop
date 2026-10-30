# CampusLoop: project context (read before every task)

Campus resource-sharing app. Students list items, others request them, owner approves,
QR handover and QR return, history, admin control.

## Stack (do not change)
- client/: React + Vite + Tailwind + React Router (JavaScript)
- server/: Node + Express + Mongoose (JavaScript), MongoDB Atlas
- Auth: own JWT + bcrypt (no Firebase). Roles: STUDENT, ADMIN
- QR: qrcode.react to show, html5-qrcode to scan, plus a paste-token fallback

## Rules
- All status changes are validated on the SERVER only. Never trust frontend status.
- Item status: AVAILABLE, RESERVED, BORROWED, HIDDEN
- Transaction status: APPROVED, BORROWED, COMPLETED
- QR tokens: crypto.randomBytes, store only the hash, mark used after success
- Every handover/return writes an Event (transactionId, type, actorId, timestamp)
- Points awarded once, on COMPLETED
- Cannot request own item; only owner decides requests
- Secrets only in .env (keep .env.example updated)

## Structure
server/src/{models,controllers,routes,middleware,utils}
client/src/{pages,components,services,context}

## Working style
- Do only the task asked. No extra features, no refactoring unrelated files.
- Keep code short and simple. Brief summary at the end, no long explanations.
- Tell me how to test what you built (one curl or click path).

## Reference
- Full spec is at docs/spec.pdf. Do NOT read it by default.
  Open it only when a task needs detail that is not in this file
  (for example: exact API routes, database fields, or the QR security checklist).