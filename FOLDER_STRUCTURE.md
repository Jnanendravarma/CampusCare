# CampusCare - Project Structure

## 📁 Current Folder Structure

```
Campuscare/
├── frontend/                    # ← All frontend code is here
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   │   │   └── complaints/     # Complaint-specific components
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register pages
│   │   │   ├── student/        # Student dashboard pages
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   └── staff/          # Staff dashboard pages
│   │   ├── data/               # Mock data
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # ← Backend will go here (to be created)
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth, validation middleware
│   │   ├── config/             # Database, environment config
│   │   └── server.js           # Express server
│   ├── package.json
│   └── .env
│
└── README.md                    # Main project README

```

## 🎯 Note About Current Structure

**Currently, all files are in the root directory** because this is a frontend-only demo. When you're ready to add a backend, you can:

1. Create a `frontend/` folder
2. Move all current files into `frontend/`
3. Create a `backend/` folder for your Express/Node.js server
4. Update the `package.json` scripts to run both frontend and backend

## 🔄 How to Reorganize (When Ready for Backend)

### Option 1: Manual Reorganization
```bash
# Create folders
mkdir frontend backend

# Move frontend files
move src frontend/
move public frontend/
move index.html frontend/
move package.json frontend/
move vite.config.js frontend/
move tailwind.config.js frontend/
move postcss.config.js frontend/
move node_modules frontend/

# Initialize backend
cd backend
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
```

### Option 2: Monorepo Structure
Keep everything in root and use separate folders:
```
Campuscare/
├── client/          # Frontend (current code)
├── server/          # Backend
└── package.json     # Root package.json with scripts for both
```

## 🚀 Current Setup (Frontend Only)

The application is currently running as a **frontend-only demo** with:
- ✅ React + Vite
- ✅ Tailwind CSS
- ✅ Framer Motion animations
- ✅ React Router
- ✅ Mock data (no real backend)
- ✅ Google Sign-In UI (frontend only, not connected)

## 📝 Next Steps for Full-Stack

When you're ready to build the backend:

1. **Create Backend Structure**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. **Install Backend Dependencies**
   ```bash
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken
   npm install -D nodemon
   ```

3. **Set Up Database**
   - Create MongoDB database (MongoDB Atlas or local)
   - Add connection string to `.env`

4. **Implement Google OAuth**
   - Install `passport` and `passport-google-oauth20`
   - Set up Google Cloud Console project
   - Configure OAuth credentials

5. **Connect Frontend to Backend**
   - Replace mock data with API calls
   - Add authentication tokens
   - Implement real-time updates

## 🔐 Google Authentication

The Google Sign-In buttons are currently **UI-only**. To make them functional:

1. **Set up Google Cloud Console**
   - Create a project
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Backend Integration**
   ```javascript
   // Example: passport-google-oauth20
   passport.use(new GoogleStrategy({
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: "/auth/google/callback"
   }, (accessToken, refreshToken, profile, done) => {
       // Handle user authentication
   }));
   ```

3. **Frontend Integration**
   - Replace onClick handlers with actual Google OAuth flow
   - Handle OAuth callbacks
   - Store JWT tokens

## 📚 Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
