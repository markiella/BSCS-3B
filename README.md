# BSCS3B Project Compilation System

A centralized web-based platform to showcase, manage, and organize all individual web application projects from the **BSCS 3B** class. Students can register, log in, and manage their projects; the instructor (admin) can review, approve, and manage all submissions.

---

## Tech Stack

- **Frontend:** React + Vite, TypeScript, TailwindCSS, Framer Motion, React Router, Axios
- **Backend:** Node.js, Express, JWT auth, Multer (file uploads)
- **Database:** MongoDB Atlas (Mongoose)
- **Deployment:**
  - Backend: Render (`https://bscs-3b.onrender.com`)
  - Frontend: Netlify (`https://bscs-3b.netlify.app`)

---

## Local Development

### 1. Backend (API)

1. Copy env example and configure:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and set values:

   ```env
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=BSCS3B@gmail.com
   ADMIN_PASSWORD=bscsclass2025
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. Install deps and run dev server:

   ```bash
   npm install
   npm run dev
   ```

Backend runs at `http://localhost:5000` and exposes routes under `/api` (e.g. `/api/auth/login`, `/api/projects`, `/api/admin`).

### 2. Frontend (Vite React)

1. In `frontend/` copy env example:

   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `frontend/.env` and set the API base URL for local dev:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Install deps and run Vite dev server:

   ```bash
   npm install
   npm run dev
   ```

Frontend will be available at `http://localhost:5173`.

---

## Production Deployment

### Backend – Render

- **Service type:** Web Service
- **Root directory:** `backend`
- **Runtime:** Node
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Health check path:** `/`
- **Environment variables:**

  ```env
  MONGODB_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret
  ADMIN_EMAIL=BSCS3B@gmail.com
  ADMIN_PASSWORD=bscsclass2025
  CLIENT_ORIGIN=https://bscs-3b.netlify.app
  ```

Render URL: `https://bscs-3b.onrender.com`  
API base URL: `https://bscs-3b.onrender.com/api`

> Note: The `uploads/` folder on Render is **ephemeral**. Uploaded images may be cleared on redeploy. This is acceptable for the class project, but a permanent storage (e.g. Cloudinary) would be needed for production use.

### Frontend – Netlify

- **Repository:** `markiella/BSCS-3B`
- **Branch:** `main`
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `dist`  
  (Netlify will show it as `frontend/dist` when base directory is `frontend`.)
- **Environment variables:**

  ```env
  VITE_API_URL=https://bscs-3b.onrender.com/api
  ```

Netlify URL: `https://bscs-3b.netlify.app`

---

## What to Do After Code Changes

### 1. Normal code changes (frontend or backend)

1. Make and test your changes locally.
2. Commit them:

   ```bash
   git add .
   git commit -m "Describe your change"
   git push origin main
   ```

3. Because both **Render** and **Netlify** are configured with **Auto-deploy on commit**, pushing to `main` will automatically:
   - Rebuild & redeploy the backend on Render (using `backend/`).
   - Rebuild & redeploy the frontend on Netlify (using `frontend/`).

You usually **do not need to click anything** – just wait for both deploys to finish and then refresh `https://bscs-3b.netlify.app`.

### 2. Backend-only changes

If you only change backend code (e.g. controllers, routes):

- Pushing to `main` will auto-redeploy the backend on Render.  
- The frontend on Netlify does **not** need to be rebuilt unless you changed the frontend code.

If auto-deploy is disabled on Render, you can trigger it manually from the Render dashboard (**Manual Deploy → Clear build cache & deploy**).

### 3. Frontend-only changes

If you only change React components, styles, or frontend logic:

- Pushing to `main` will auto-redeploy the frontend on Netlify.  
- No backend changes are needed.

If auto-deploy is disabled on Netlify, use **Deploys → Trigger deploy → Clear cache and deploy site**.

### 4. When you must redeploy **manually**

You should manually trigger a new deploy when you:

- **Change environment variables** on Render or Netlify (e.g. new `MONGODB_URI`, new `CLIENT_ORIGIN`, new `VITE_API_URL`).
- **Change deployment settings** (build command, publish directory, root directory).

In those cases, after editing settings:

- On **Render**: click **Manual Deploy → Clear build cache & deploy**.
- On **Netlify**: click **Trigger deploy → Clear cache and deploy site**.

### 5. Quick checklist after any change

- [ ] Backend builds and boots successfully on Render (check service logs).  
- [ ] Frontend build on Netlify succeeded (green check).  
- [ ] `VITE_API_URL` points to the correct backend `/api` URL.  
- [ ] `CLIENT_ORIGIN` on Render matches your Netlify URL.

If the live site breaks, first check **Render logs**, then **Netlify deploy logs**, and finally browser **Network** tab for failing requests.
