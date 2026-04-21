# 🎓 StudyAI — AI-Powered Personalized Study Companion

> Built with React 18 + Firebase + Google Gemini AI

## 🎥 Project Demo Video

Watch the full project walkthrough here: [StudyAI Demo Video](https://drive.google.com/file/d/1E8UVOyalTBrAhR9JIWsSSgcvV96Isrh0/view?usp=sharinghttps://drive.google.com/file/d/1E8UVOyalTBrAhR9JIWsSSgcvV96Isrh0/view?usp=sharing)


---

## 📋 Problem Statement

### Who is the user?
**University and high school students** preparing for semester exams, competitive exams, or certification tests who need a structured, intelligent approach to managing their study material across multiple subjects.

### What problem are we solving?
Students overwhelmingly struggle with:
- **Fragmented study planning** — managing dozens of topics across multiple subjects without a centralized system
- **No personalized pacing** — generic study plans ignore individual strengths, weaknesses, and available time
- **Lack of self-assessment** — students don't know what they've mastered vs. what needs revision until the exam
- **Motivation gaps** — without progress visibility and streak tracking, students lose consistency

### Why does this problem matter?
Studies show that **structured study planning** combined with **active recall testing** dramatically improves retention. Yet most students rely on unorganized notes and last-minute cramming. StudyAI solves this by combining **AI-driven personalization** with **real-time progress analytics** to create a study experience that adapts to each student's unique needs.

---

## ✨ Features

### Core Features
- **📚 Subject & Topic Management** — Full CRUD: Create subjects, add topics with priority levels (High/Medium/Low) and estimated hours, toggle completion, add notes, delete
- **🗓️ AI Study Planner** — Gemini AI generates personalized weekly roadmaps based on exam date, available hours, and topic priorities

- **📊 Analytics Dashboard** — Visual progress tracking with subject breakdowns, priority-based completion stats, and AI-powered weak area detection
- **✨ Intelligent AI Assistant** — Conversational AI tutor with a **Three-Tier Fallback System** (Gemini 2.5 → Gemini 2.0 → Groq Llama 3) ensuring 99.9% availability
- **💾 Chat Persistence** — Conversation history is now automatically saved to `localStorage`, so your study sessions are never lost on refresh
- **🛡️ Resilient Failover** — Smart fallback logic that provides helpful study tips even if ALL AI services are temporarily unreachable

### User Experience
- **🔐 Authentication** — Email/password signup & login with Firebase Auth; protected routes prevent unauthorized access
- **🔥 Streak Tracking** — Daily study streak counter that persists across sessions
- **⚡ Navigation Safety** — Unsaved progress warnings when navigating away from active sessions (custom `useNavigationBlocker` hook)
- **🎨 Dark Theme UI** — Purpose-built dark interface with custom design system

---

## ⚛️ React Concepts Demonstrated



### Core Concepts
| Concept | Where Used |
|---------|------------|
| Functional Components | Every component in the project |
| Props & Composition | `<Card>`, `<Button>`, `<Badge>`, `<StatCard>`, `<TopicItem>` |
| `useState` | Auth forms, state toggles, UI toggles, form inputs |
| `useEffect` | Data loading, profile sync, auth state listener |
| Conditional Rendering | Auth guard, empty states, loading states |
| Lists & Keys | Subject lists, topic lists, schedule items |

### Intermediate Concepts
| Concept | Where Used |
|---------|------------|
| Lifting State Up | Subject data in context |
| Controlled Components | All form inputs (Input, Select, textarea) |
| React Router | `BrowserRouter`, `<Routes>`, `<Route>`, `useNavigate`, `useLocation`, `<Navigate>` |
| Context API | `AuthContext` (auth state), `AppContext` (global app state) |

### Advanced Concepts
| Concept | Where Used |
|---------|------------|
| `useMemo` | Progress calculations, exam day countdown, pending topics, priority breakdown |
| `useCallback` | All CRUD operations, navigation blocker |
| `useRef` | Navigation blocker location tracking (`useNavigationBlocker` hook) |
| `React.lazy` + `Suspense` | All page components are code-split in `AppLayout.jsx` |
| Performance optimization | Memoized derived state, lazy loading, debounced updates |

---

## 🔐 Authentication & Database

| Feature | Implementation |
|---------|---------------|
| **BaaS Provider** | Firebase (Auth + Cloud Firestore) |
| **Auth Method** | Email/Password via `createUserWithEmailAndPassword` / `signInWithEmailAndPassword` |
| **Protected Routes** | `<ProtectedRoute>` component wraps all app routes; redirects to `/auth` if unauthenticated |
| **Persistent Data** | Subjects, topics, schedule, and user profile stored in Firestore collections |
| **CRUD Operations** | Full Create, Read, Update, Delete on subjects, topics, schedule items, and user profiles |

### Firestore Collections
```
users/{uid}          → User profile, preferences, streak
subjects/{id}        → Subject data with nested topics array (uid-filtered)
schedule/{id}        → Study session items (uid-filtered)
sessions/{uid_date}  → Study session logs for streak tracking
```

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI primitives
│   ├── UI.jsx + UI.css          # Card, Button, Badge, Modal, Input, Select, etc.
│   ├── Sidebar.jsx + Sidebar.css
│   ├── Topbar.jsx + Topbar.css
│   ├── AppLayout.jsx            # Route definitions + lazy loading
│   └── ProtectedRoute.jsx       # Auth guard wrapper
├── pages/               # Route-level page components
│   ├── Dashboard.jsx
│   ├── Subjects.jsx
│   ├── Planner.jsx
│   ├── Analytics.jsx + Analytics.css
│   ├── Settings.jsx
│   ├── AIAssistant.jsx
│   └── Auth.jsx
├── context/             # Global state management
│   ├── AuthContext.jsx          # Firebase auth state + user profile
│   └── AppContext.jsx           # Subjects, schedule, settings, CRUD
├── hooks/               # Custom React hooks
│   ├── useProgress.js           # Derived progress calculations
│   └── useNavigationBlocker.js  # Dirty state navigation guard
├── services/            # External service integrations
│   ├── firebase.js              # Firebase app initialization
│   ├── firestore.js             # All Firestore CRUD operations
│   └── ai.js                    # Gemini API integration
├── utils/               # Constants and helpers
│   └── demoData.js              # Color maps, icons, demo defaults
├── App.jsx              # Root component with BrowserRouter
└── index.css            # Global design system + animations
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6 |
| **Styling** | Vanilla CSS (custom design system) |
| **State** | React Context API + `useState`/`useEffect` |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore |
| **AI (Primary)** | Google Gemini 2.5 Flash / 2.0 Flash |
| **AI (Fallback)** | Groq (Llama 3 70B) |
| **Build** | Vite 5 |
| **Deployment** | Vercel |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Firebase project with Email/Password auth enabled
- A Google Gemini API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/studyai.git
cd studyai

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Add your VITE_GEMINI_API_KEY and VITE_GROQ_API_KEY to .env

# 4. Start development server
npm run dev
```

### Environment Variables
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📦 Features Checklist

- ✅ **Authentication system** — Email/password login & signup with Firebase
- ✅ **Dashboard** — Personalized greeting, stats, progress overview, today's schedule
- ✅ **Core Feature 1: Subject Management** — Full CRUD with topics, priorities, notes
- ✅ **Core Feature 2: Core Analytics** — Dynamic progress tracking and detailed dashboards
- ✅ **Core Feature 3: AI Study Planner** — Personalized weekly roadmap generation
- ✅ **CRUD functionality** — Create, Read, Update, Delete on subjects, topics, and schedule
- ✅ **Persistent storage** — Cloud Firestore with per-user data isolation
- ✅ **Routing** — React Router v6 with named routes + protected route guard
- ✅ **State management** — Dual Context providers (AuthContext + AppContext)

---

## 👤 Author

**Sambasiva Naidu**  
End-Term Project, Building Web Applications with React (2029 Batch)
Email: sambasiva.25bcs10667@sst.scaler.com

---

*Built with ❤️ using React, Firebase, and Google Gemini AI*
