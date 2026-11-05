# 💸 FinTrack – Personal Finance Tracker

A full-stack MERN app to record income/expenses, visualize spending with charts, and track a monthly budget. Secured with JWT authentication.

**Live demo:** _add Vercel link_ · **API:** _add Render/Railway link_

## Features
- Register / login with JWT, protected routes (frontend + backend)
- Add, list, delete income & expense transactions
- Filter by type, category and date range
- Pie chart (spending by category) and bar chart (monthly income vs expense)
- Summary cards (income, expenses, balance) and monthly budget progress bar
- Toast notifications, loading states, form validation
- Responsive layout (mobile / tablet / desktop) with dark mode
- Export transactions to CSV

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Context API, Axios, React Router |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| Security | Helmet, CORS allow-list, rate limiting on auth routes |
| Deploy | Vercel (client), Render/Railway (server) |

## Project Structure
```
finance-tracker/
├── client/                # React app
│   └── src/ api/ context/ components/ pages/ utils/
└── server/                # Express API
    ├── config/ models/ routes/
    ├── controllers/       # HTTP layer
    ├── services/          # business logic (controller/service pattern)
    └── middleware/        # auth + error handling
```

## API Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Create account |
| POST | /api/auth/login | – | Login, returns JWT |
| GET | /api/auth/me | ✅ | Current user |
| PATCH | /api/auth/budget | ✅ | Set monthly budget |
| POST | /api/transactions | ✅ | Add transaction |
| GET | /api/transactions | ✅ | List (filters: type, category, startDate, endDate) |
| GET | /api/transactions/summary | ✅ | Totals + current month expense (aggregation) |
| DELETE | /api/transactions/:id | ✅ | Delete own transaction |

## Run Locally
```bash
# 1. Backend
cd server
npm install
cp .env.example .env        # fill in MONGO_URI and JWT_SECRET
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

## Environment Variables
**server/.env**: `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`
**client/.env**: `VITE_API_URL`

## Deployment
**Backend (Render):** New Web Service → root dir `server` → build `npm install` → start `npm start` → add env vars (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL=<your vercel url>`). In MongoDB Atlas, allow network access (0.0.0.0/0 or Render's IPs).
**Frontend (Vercel):** Import repo → root dir `client` → framework Vite → env `VITE_API_URL=<render url>/api`.

## Screenshots
_Add screenshots of login, dashboard (light + dark) and mobile view._

## Future Improvements
Recurring transactions, monthly email reports (Nodemailer), PDF export, PWA support, automated tests.
