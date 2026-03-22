# Kailas Singer Portfolio 🎵

A professional full-stack singer portfolio website for **Kailas** — featuring 3D music animations, academic achievements portfolio, and a MongoDB Atlas-backed contact form.

## 🗂 Project Structure

```
KAILAS-PORTFOLIO/
├── Frontend/
│   ├── index.html          # Main singer portfolio page
│   ├── portfolio.html      # Academic portfolio + Let's Connect
│   ├── css/
│   │   ├── styles.css      # Main styles (music-themed dark design)
│   │   └── portfolio.css   # Portfolio page styles
│   └── js/
│       ├── main.js         # Three.js 3D scene + animations
│       └── portfolio.js    # Contact form + portfolio interactions
├── Backend/
│   ├── server.js           # Express API server
│   ├── models/
│   │   └── Contact.js      # MongoDB contact schema
│   ├── package.json
│   └── .env.example        # Environment variable template
├── vercel.json             # Vercel deployment configuration
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Git + GitHub account
- Vercel account

### 1. Clone and Install Backend Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp Backend/.env.example Backend/.env
```

Edit `Backend/.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/kailas-portfolio?retryWrites=true&w=majority
PORT=5000
FRONTEND_ORIGIN=http://localhost:5500
```

### 3. Run Locally

**Backend:**
```bash
cd Backend
npm run dev
```

**Frontend:**
Open `Frontend/index.html` in your browser using VS Code Live Server (port 5500) or any local HTTP server.

---

## 📦 Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Kailas Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kailas-portfolio.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"** → Import your `kailas-portfolio` repository
3. Set **Root Directory** to `./` (project root)
4. Add **Environment Variables** in Vercel dashboard:
   - `MONGODB_URI` → your MongoDB Atlas connection string
   - `FRONTEND_ORIGIN` → your Vercel app URL (e.g. `https://kailas-portfolio.vercel.app`)
5. Click **Deploy**

### Step 3: MongoDB Atlas Setup

1. Create a cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist `0.0.0.0/0` in Network Access (for Vercel)
4. Copy the connection string into your Vercel env variables

---

## ✨ Features

- **3D Vinyl Record** with Three.js — rotating disc with grooves, center label, orbit ring
- **Audio Visualizer Bars** — animated 3D equalizer bars
- **Floating Particle System** — music-themed star particles
- **Floating DOM Music Notes** — animated background musical symbols
- **Custom Laggy Cursor** — purple/gold dot + outline cursor
- **Music Waveform** — animated bottom-of-hero waveform
- **Scroll Reveal** — IntersectionObserver-powered reveals
- **Counter Animation** — hero stats count up on scroll
- **Skill Bars** — animated progress bars for vocal abilities
- **Vinyl Record Cards** — spinning vinyl on hover in Works section
- **Achievement Filter** — filter academic/music/awards
- **Contact Form** — validated, submitted to MongoDB Atlas via `/api/contact`
- **Responsive Design** — mobile-first, works on all screen sizes
- **Hamburger Nav** — slide-in mobile menu

---

## 🛠 Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JS        |
| 3D Engine | Three.js r134                 |
| Animations| GSAP 3.12, CSS Animations     |
| Icons     | Font Awesome 6.5              |
| Fonts     | Google Fonts (Playfair Display, Inter, Montserrat) |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB Atlas (Mongoose)       |
| Hosting   | Vercel (frontend + backend)   |
| VCS       | Git + GitHub                  |

---

## 📄 License

© 2025 Kailas. All rights reserved.
