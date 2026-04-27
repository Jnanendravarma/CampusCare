# CampusCare 🏫

A full-stack campus complaint management system built with **React + Vite** (frontend) and **Node.js + Express** (backend), using **Supabase** for authentication and database.

---

## 🗂️ Project Structure

```
CampusCare/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/     # Auth, Student, Staff, Admin, Profile pages
│   │   ├── components/# Reusable UI components
│   │   ├── services/  # API service layer
│   │   └── utils/     # Helpers & animations
│   ├── .env.example   # Copy to .env and fill in values
│   └── package.json
│
├── backend/           # Node.js + Express REST API
│   ├── src/
│   │   ├── config/    # Supabase client config
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── .env.example   # Copy to .env and fill in values
│   └── package.json
│
└── README.md
```

---

## 🚀 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, Framer Motion |
| Backend    | Node.js, Express.js               |
| Database   | Supabase (PostgreSQL)             |
| Auth       | Supabase Auth (Email + Google OAuth) |
| Deployment | Railway (backend) · Vercel (frontend) |

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/Jnanendravarma/CampusCare.git
cd CampusCare
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in your Supabase + JWT values
npm run dev            # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env   # Fill in your Supabase + API URL
npm run dev            # Starts on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin operations) |
| `JWT_SECRET` | Secret for signing JWT tokens (min 32 chars) |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `PORT` | Server port (default: `5000`) |
| `FRONTEND_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5000/api`) |

---

## 👥 User Roles

| Role    | Capabilities |
|---------|-------------|
| **Student** | Register, raise complaints, track status |
| **Staff**   | View assigned complaints, update status & resolution notes |
| **Admin**   | View all complaints, assign to staff, full management |

---

## 🔑 Authentication

- **Email/Password** — Managed via Supabase Auth with server-side JWT
- **Google OAuth** — Handled entirely by Supabase (`signInWithOAuth`), no backend redirect needed

---

## 📦 Deployment

### Backend → Railway
1. Push to GitHub
2. Create new Railway project → Deploy from GitHub
3. Add environment variables from `backend/.env.example`
4. Set start command: `node src/server.js`

### Frontend → Vercel
1. Import GitHub repo in Vercel
2. Set root directory to `frontend`
3. Add environment variables from `frontend/.env.example`
4. Build command: `npm run build` | Output: `dist`
