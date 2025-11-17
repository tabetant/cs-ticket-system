📬 CS Ticket System
A full-stack support ticket management system for internal use by property management teams. Designed to simplify support workflows, track tenant requests, and optimize resolution times — all through a clean, responsive interface.

🛠 Tech Stack
Frontend: React, TypeScript, Tailwind CSS, Tremor UI
Backend: Next.js API Routes, Supabase (PostgreSQL + Auth)
State Management: React Hooks, SWR
Other Libraries:
react-hook-form + zod (form validation)
react-phone-input-2 (phone input)
react-draggable (drag & drop ticket status)
resend + react-email (email notifications)

✨ Features
👤 Tenant-Facing Page (/)
Submit support requests (title, description, contact info, status)
Attach optional images/screenshots
Real-time validation + mobile-friendly

🔐 Support Dashboard (/support)
Login-only access (via Supabase Auth)
Filter tickets by status: Open, In Progress, Resolved, Closed
Drag & drop tickets between statuses
View ticket logs with Popover history
Delete tickets with confirmation
Email notifications to tenants on status change

📦 Ticket Statuses
Open 🟢
In Progress 🛠️
Resolved ✅
Closed 🗃️

💻 System Architecture
Client ↔ Next.js API Routes ↔ Supabase (Postgres + Auth)
                           ↘ Email Service (resend)
Authentication is handled via Supabase
Support team is whitelisted manually
API routes are protected on the backend
Ticket logs are saved and displayed as status history
Status changes trigger email notifications via resend

🚀 Getting Started
git clone https://github.com/yourusername/cs-ticket-system
cd cs-ticket-system
npm install

Set up environment variables:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...

Run locally:
npm run dev

🧠 Key Design Decisions
Drag & Drop Status Management: Implemented only when status=all for clarity and simplicity.
Client-Side Form Validation: Built with react-hook-form + zod for speed and DX.
Logs System: Automatically captures user, timestamp, and status transitions.
Responsiveness: Built mobile-first using Tailwind and Tremor UI components.

🧪 To-Do / Future Improvements
Add file upload preview before submission
Admin role management with RBAC
Analytics dashboard (ticket trends)
Optional live chat integration
