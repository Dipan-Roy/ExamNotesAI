# ExamNotes AI

ExamNotes AI is a full-stack web application designed to help students and learners transform dense syllabus topics into structured, high-yield study materials. By combining Google Gemini generative AI with custom prompt schemas, the system produces exam-focused notes categorized by topic priority, complete with interactive Mermaid flowcharts, Recharts analytics, 5-minute quick-revision bullet points, and server-generated PDF exports. The platform includes a token-metered credit system backed by Stripe checkout and webhooks, with Firebase Google OAuth for authentication.

---

## Demo & Visuals

The application interface features a responsive dashboard built with modern glassmorphism design principles, interactive animations, and visual rendering modules.

```
+-----------------------------------------------------------------------------------+
|  ExamNotes AI                         [Credits: 50]  [Your Notes]  [Profile]     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Topic Input: e.g. "Binary Search Trees" ]                                      |
|  [ Class / Level: "B.Tech CSE" ]    [ Exam Type: "Gate / Finals" ]                |
|  [x] Exam Revision Mode    [x] Include Diagram    [x] Include Charts              |
|                                                                                   |
|  [========================== Generate Notes ==========================]          |
|                                                                                   |
|  +---------------------------+-------------------------------------------------+  |
|  | Quick Exam View (Sidebar) | Detailed Notes & Interactive Visualizations     |  |
|  | * Subtopics by Priority   | * Formatted Markdown Study Material             |  |
|  |   - *** Most Frequent     | * Interactive Mermaid.js Flowchart              |  |
|  |   - **  Important         | * Recharts Visual Distribution (Bar/Line/Pie)   |  |
|  |   - *   Basic Concepts    | * Toggleable 5-Minute Quick Revision Mode       |  |
|  | * Targeted Questions      | * [Download PDF] Button                         |  |
|  +---------------------------+-------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

## Key Features

- **Automated Exam-Oriented Note Generation:** Generates comprehensive yet concise study notes tailored by subject topic, class/academic level, and exam type (e.g., CBSE, JEE, NEET, University).
- **Dual Study Modes:**
  - **Comprehensive Mode:** In-depth conceptual explanations with definitions, examples, and structured markdown headings.
  - **Quick Revision Mode (5-Minute Cheat Sheet):** Single-line summaries, formulas, and high-yield bullet points optimized for last-minute exam review.
- **Priority-Tiered Subtopic Breakdown:** Classifies subtopics into three distinct weightage tiers:
  - `⭐` Basic Concepts
  - `⭐⭐` Important Topics
  - `⭐⭐⭐` Frequently Asked Exam Questions
- **Dynamic Conceptual Diagrams (Mermaid.js):** Generates structured flowchart graphs (`graph TD`) directly from AI output with custom client-side node sanitization and auto-repair routines.
- **Topic Analytics & Weightage Charts (Recharts):** Visualizes exam weightage, procedural steps, and concept distribution using dynamic Bar, Line, and Pie charts.
- **Server-Side PDF Compilation:** Compiles structured note data into clean, formatted, printable PDFs using Node.js streaming with `pdfkit`.
- **Note History & Persistence:** MongoDB persistence allows users to archive, review, and revisit previously generated notes anytime.
- **Google OAuth Authentication:** Frictionless authentication via Firebase Auth and server-managed JWTs delivered over secure HTTP-only cookies.
- **Credit-Based Usage & Stripe Monetization:**
  - New users receive 50 complimentary credits upon registration (1 note generation = 10 credits).
  - Multi-tier credit top-ups (₹100 for 50 credits, ₹200 for 120 credits, ₹500 for 300 credits) integrated with Stripe Checkout and automated webhook fulfillment.

---

## Technology Stack

| Layer / Domain | Technology | Purpose in Project |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`react`, `react-dom`) | Declarative component hierarchy and client-side UI rendering |
| **Build Tool & Bundler** | Vite 7 (`vite`) | High-performance local development server and optimized production bundling |
| **Styling & Design** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first responsive styling and glassmorphism UI theme |
| **Motion & Animation** | Motion (`motion`) | Spring-based interactive UI animations, card hover transitions, and progress loaders |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) | Centralized management for user session state and real-time credit tracking |
| **Routing** | React Router v7 (`react-router-dom`) | Client-side routing, navigation, and protected route redirection |
| **Diagram Rendering** | Mermaid.js (`mermaid`) | Client-side dynamic rendering of AI-generated flowchart syntaxes |
| **Data Visualization** | Recharts (`recharts`) | Responsive SVG rendering of Bar, Line, and Pie charts for exam weightage |
| **Markdown Rendering** | React Markdown (`react-markdown`) | Safe rendering of markdown-formatted note bodies with custom HTML mappings |
| **Backend Framework** | Node.js / Express 5 (`express`) | RESTful API server, routing, middleware orchestration, and webhook handling |
| **Database & ODM** | MongoDB / Mongoose (`mongoose`) | Document data modeling for user accounts, credit balances, and generated notes |
| **AI Generative Engine** | Google Gemini (`gemini-3-flash-preview`) | Generative language model queried via Google Generative Language REST API |
| **Authentication** | Firebase Auth & JSON Web Tokens (`jsonwebtoken`) | Client Google OAuth popup combined with server-issued 7-day HTTP-only JWT cookies |
| **Document Processing** | PDFKit (`pdfkit`) | Server-side programmatic PDF generation streamed directly over HTTP responses |
| **Payments & Webhooks** | Stripe API (`stripe`) | Stripe Checkout Session creation and cryptographic webhook signature verification |
| **HTTP Client** | Axios (`axios`) | Promise-based HTTP client configured with cookie credential persistence |

---

## Architecture and How It Works

### High-Level Architecture Flow


### End-to-End User Workflow

1. **Authentication:**
   The user signs in using Google OAuth via Firebase popup in the client (`client/src/pages/Auth.jsx`). The retrieved profile is submitted to `POST /api/auth/google`. The server checks or creates the user record in MongoDB, grants 50 initial credits to new users, and attaches a signed 7-day JWT inside a secure `httpOnly` cookie.
2. **Topic Configuration & Submission:**
   On the `/notes` dashboard, the user inputs a topic (e.g., *"Operating System Scheduling Algorithms"*), selects optional educational level and target exam, and toggles:
   - **Exam Revision Mode** (toggles concise cheat-sheet format vs. full-length notes).
   - **Include Diagram** (requests Mermaid flowchart data).
   - **Include Charts** (requests Recharts-compatible metrics).
3. **Credit Verification & Prompt Construction:**
   `POST /api/notes/generate-notes` validates that the authenticated user holds at least 10 credits. The server's `promptBuilder.js` utility injects the user's inputs into an engineered system prompt enforcing strict, valid JSON output matching an established schema.
4. **AI Generation & Defensive Sanitization:**
   The backend dispatches the payload to the Gemini API (`gemini-3-flash-preview`). Upon response, the backend strips markdown code fences (` ```json `), executes `JSON.parse()`, saves the note document to MongoDB, deducts 10 credits from the user, and sends the structured JSON to the client.
5. **Interactive Visualization & Parsing:**
   The frontend renders:
   - **Subtopics & Priority Levels:** Displayed in the sidebar and top view with star ratings.
   - **Markdown Content:** Custom-rendered through `react-markdown` with tailored typography.
   - **Mermaid Flowchart:** Sanitized via client regex (`autoFixNodes`) to normalize node IDs and labels, preventing syntax crashes before invoking `mermaid.render()`.
   - **Recharts Diagrams:** Dynamically mapped to SVG Bar, Line, or Pie components depending on data type.
   - **Revision View:** One-click toggle switching between standard text and high-yield revision bullet points.
6. **PDF Compilation:**
   Clicking "Download PDF" issues a `POST /api/pdf/generate-pdf`. The backend uses `PDFKit` to dynamically layout document headers, importance metrics, priority topics, body notes, revision points, and practice questions directly into a binary stream returned with `Content-Disposition: attachment`.
7. **Monetization & Credit Top-Up:**
   When credits are depleted, users select a credit package on `/pricing`. The backend initiates a Stripe Checkout Session. Once payment is confirmed, Stripe dispatches a signed webhook event (`checkout.session.completed`) to `/api/credits/webhook`, which atomically updates the user's balance (`$inc: { credits: creditsToAdd }`).

---

## Project Structure

```
ExamNotesAI/
├── client/                         # Frontend React application (Vite)
│   ├── public/
│   │   └── logo.png                # Application favicon and brand icon
│   ├── src/
│   │   ├── assets/                 # Static graphical assets (img1.png, logo.png)
│   │   ├── components/
│   │   │   ├── FinalResult.jsx     # Main note viewer (Markdown, Mermaid, Recharts, Questions)
│   │   │   ├── Footer.jsx          # Application footer and quick links
│   │   │   ├── MermaidSetup.jsx    # Mermaid diagram sanitizer and dynamic SVG renderer
│   │   │   ├── Navbar.jsx          # Header with user profile menu and live credit badge
│   │   │   ├── RechartSetUp.jsx    # Dynamic Recharts renderer (Bar, Line, and Pie charts)
│   │   │   ├── Sidebar.jsx         # Sticky summary sidebar displaying priority subtopics
│   │   │   └── TopicForm.jsx       # Topic input form, option toggles, and simulated progress bar
│   │   ├── pages/
│   │   │   ├── Auth.jsx            # Authentication landing page with Google sign-in
│   │   │   ├── History.jsx         # Historical notes browser with preview drawer
│   │   │   ├── Home.jsx            # Landing page with product introduction
│   │   │   ├── Notes.jsx           # Primary note generation workspace
│   │   │   ├── PaymentFailed.jsx   # Stripe cancel / failure redirect screen
│   │   │   ├── PaymentSuccess.jsx  # Stripe success redirect screen
│   │   │   └── Pricing.jsx         # Credit plan selection and Stripe checkout trigger
│   │   ├── redux/
│   │   │   ├── store.js            # Redux store configuration
│   │   │   └── userSlice.js        # Redux slice managing user auth state and credit balance
│   │   ├── services/
│   │   │   └── api.js              # Axios service endpoints (auth, generate, PDF download)
│   │   ├── utils/
│   │   │   └── firebase.js         # Firebase client SDK initialization and Google provider
│   │   ├── App.jsx                 # Route definitions and session initialization
│   │   ├── main.jsx                # React root mount point with Redux Provider
│   │   └── index.css               # Global Tailwind CSS directives
│   ├── package.json                # Frontend dependencies and npm scripts
│   └── vite.config.js              # Vite configuration with Tailwind CSS plugin
│
└── server/                         # Backend REST API (Node.js & Express)
    ├── controllers/
    │   ├── auth.controller.js      # Google OAuth user upsert and cookie management
    │   ├── credits.controller.js   # Stripe Checkout session creation and webhook handling
    │   ├── generate.controller.js  # Credit validation, Gemini invocation, note persistence
    │   ├── notes.controller.js     # User note collection retrieval and single note fetch
    │   ├── pdf.controller.js       # Programmatic PDF generation and HTTP stream via PDFKit
    │   └── user.controller.js       # Current authenticated user details resolver
    ├── middleware/
    │   └── isAuth.js               # JWT cookie verification middleware
    ├── models/
    │   ├── notes.model.js          # Mongoose schema for generated notes and metadata
    │   └── user.model.js           # Mongoose schema for users, credits, and note references
    ├── routes/
    │   ├── auth.route.js           # Routes for /api/auth (google, logout)
    │   ├── credits.route.js        # Routes for /api/credit (order)
    │   ├── genrate.route.js        # Routes for /api/notes (generate-notes, getnotes, :id)
    │   ├── pdf.route.js            # Routes for /api/pdf (generate-pdf)
    │   └── user.route.js           # Routes for /api/user (currentuser)
    ├── services/
    │   └── gemini.services.js      # Google Gemini REST API integration and response parser
    ├── utils/
    │   ├── connectDb.js            # MongoDB Mongoose connection handler
    │   ├── promptBuilder.js        # System prompt builder enforcing strict JSON schema
    │   └── token.js                # JWT token signing utility
    ├── index.js                    # Express application entry, middleware, and route mounting
    └── package.json                # Backend dependencies and server scripts
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed locally:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: A running local MongoDB instance (e.g., `mongodb://localhost:27017`) or a MongoDB Atlas connection string.
- External API Credentials:
  - Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))
  - Firebase Project credentials ([Firebase Console](https://console.firebase.google.com/))
  - Stripe Account API keys ([Stripe Dashboard](https://dashboard.stripe.com/))

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Dipan-Roy/ExamNotesAI.git
cd ExamNotesAI
```

---

### Step 2: Configure Environment Variables

Create `.env` configuration files in both the `client/` and `server/` directories.

#### Client Environment Configuration (`client/.env`)

```env
VITE_FIREBASE_APIKEY=your_firebase_web_api_key_here
```

#### Server Environment Configuration (`server/.env`)

```env
PORT=8000
MONGODB_URL=mongodb://localhost:27017/examnotesai
JWT_SECRET=your_jwt_secret_signing_key_here
GEMINI_API_KEY=your_gemini_api_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_signing_secret_here
CLIENT_URL=http://localhost:5173
```

> **Note on Server Port:** The client application (`client/src/App.jsx`) connects to the backend at `http://localhost:8000`. Ensure `PORT=8000` is defined in `server/.env`.

---

### Step 3: Install Dependencies

#### Install Backend Dependencies

```bash
cd server
npm install
```

#### Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

### Step 4: Run the Application

#### Start the Backend Server

```bash
cd server
npm run dev
```
*The server will start on `http://localhost:8000` with Nodemon watching for file modifications.*

#### Start the Frontend Client

Open a second terminal window:

```bash
cd client
npm run dev
```
*The Vite development server will start on `http://localhost:5173`.*

Open your browser and navigate to `http://localhost:5173`.

---

## Environment Variables

### Client (`client/.env`)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `VITE_FIREBASE_APIKEY` | Yes | Firebase project web API key used by the Firebase Auth SDK for Google authentication popup. |

### Server (`server/.env`)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `PORT` | Yes | Port on which the Express server listens (configured to `8000` to align with client requests). |
| `MONGODB_URL` | Yes | MongoDB connection URI string (local instance or MongoDB Atlas cluster). |
| `JWT_SECRET` | Yes | Cryptographic secret used by `jsonwebtoken` to sign and verify user authentication cookies. |
| `GEMINI_API_KEY` | Yes | API key granting access to Google Gemini language models (`gemini-3-flash-preview`). |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret API key (`sk_test_...`) used to instantiate checkout billing sessions. |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook endpoint secret (`whsec_...`) used to cryptographically verify incoming webhook events. |
| `CLIENT_URL` | Yes | Base URL of the client frontend (e.g., `http://localhost:5173`) used for payment redirection callbacks. |

---

## API Documentation

The backend exposes a structured RESTful API under the `/api` route prefix. All data requests and responses use JSON format, except the PDF endpoint which returns binary stream data.

### Authentication & Users

| Method | Endpoint | Auth | Description | Request Body / Parameters | Response |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/auth/google` | Public | Authenticates Google user, creates record if new, issues HTTP-only cookie. | `{ "name": "string", "email": "string" }` | `200 OK` + User JSON object + `Set-Cookie: token` |
| `GET` | `/api/auth/logout` | Public | Clears the `token` authentication cookie. | None | `200 OK` `{ "message": "LogOut Successfully" }` |
| `GET` | `/api/user/currentuser` | `isAuth` | Resolves authenticated user profile and remaining credits. | Cookie Header: `token` | `200 OK` + User JSON object |

### Notes & AI Generation

| Method | Endpoint | Auth | Description | Request Body / Parameters | Response |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/notes/generate-notes` | `isAuth` | Checks credits (min 10), queries Gemini, saves note, deducts 10 credits. | `{ "topic": "string", "classLevel"?: "string", "examType"?: "string", "revisionMode"?: boolean, "includeDiagram"?: boolean, "includeChart"?: boolean }` | `200 OK` `{ "data": { ...noteContent }, "noteId": "...", "creditsLeft": 40 }` |
| `GET` | `/api/notes/getnotes` | `isAuth` | Returns list of authenticated user's generated notes (newest first). | None | `200 OK` Array of note metadata objects |
| `GET` | `/api/notes/:id` | `isAuth` | Returns full content and metadata for a specific note. | Route param `:id` | `200 OK` `{ "content": { ... }, "topic": "...", "createdAt": "..." }` |

### PDF Export & Billing

| Method | Endpoint | Auth | Description | Request Body / Parameters | Response |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/pdf/generate-pdf` | `isAuth` | Builds and streams a formatted PDF document using PDFKit. | `{ "result": { ...noteContentObject } }` | `200 OK` (`application/pdf` binary stream attachment) |
| `POST` | `/api/credit/order` | `isAuth` | Initiates a Stripe Checkout Session for selected credit tier. | `{ "amount": 100 \| 200 \| 500 }` | `200 OK` `{ "url": "https://checkout.stripe.com/..." }` |
| `POST` | `/api/credits/webhook` | Stripe Sig | Webhook endpoint receiving Stripe payment notifications. | Raw JSON request body + `stripe-signature` header | `200 OK` `{ "received": true }` |

---

### Models Overview

- **`UserModel` (`server/models/user.model.js`):**
  - Tracks user credentials (`name`, unique `email`).
  - Maintains credit balance (`credits`, defaults to `50`, with a minimum constraint of `0`).
  - Flags account generation permission status (`isCreditAvailable`).
  - Holds an array of `Notes` ObjectIds referencing user-generated note history.
- **`Notes` (`server/models/notes.model.js`):**
  - References the owning `UserModel` instance via `user`.
  - Stores generation parameters: `topic`, `classLevel`, `examType`, `revisionMode`, `includeDiagram`, `includeChart`.
  - Stores the full AI output within a flexible schema `content: mongoose.Schema.Types.Mixed`, preserving the structured JSON object returned by Gemini.

---

## AI Implementation & Prompt Engineering

### Problem Addressed
Standard LLM responses often produce conversational, unstructured text with unpredictable formatting, making it difficult to render reliable diagrams, data charts, and clean PDF documents in an automated frontend pipeline.

### Model & Provider
- **Provider:** Google Generative AI
- **Model:** `gemini-3-flash-preview`
- **Interface:** Direct REST invocation (`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`) without heavy wrapper SDKs, reducing runtime overhead.

### Schema & Prompt Architecture (`server/utils/promptBuilder.js`)
The server enforces a strict system prompt instructing Gemini to act as a **STRICT JSON generator**. The prompt enforces:
1. **Output Constraints:** Output must be valid, parseable JSON with double quotes, escaped newlines, and no conversational preambles or trailing commas.
2. **Dynamic Content Branching:**
   - When `revisionMode` is `ON`, output is limited to concise one-liner definitions, formulas, and revision points.
   - When `revisionMode` is `OFF`, output produces comprehensive, exam-oriented explanations formatted in Markdown.
3. **Structured Subtopic Hierarchy:** Divides subtopics into three priority buckets (`⭐`, `⭐⭐`, `⭐⭐⭐`) based on exam weightage.
4. **Mermaid Flowchart Rules:**
   - Must output valid `graph TD` Mermaid diagram syntax wrapped in labels.
   - Outputs an empty string `""` when diagrams are disabled.
5. **Recharts Data Structure Rules:**
   - Outputs an array of chart objects specifying `type` (`bar`, `line`, `pie`), `title`, and an array of `{ "name": string, "value": number }` entries.
6. **Targeted Exam Questions:** Produces dedicated short-answer, long-answer, and diagram-based questions.

### Defensive Post-Processing (`server/services/gemini.services.js` & `client/src/components/MermaidSetup.jsx`)
- **JSON Stripping:** Removes markdown backticks (` ```json ` and ` ``` `) before passing the string to `JSON.parse()`.
- **Mermaid Auto-Repair:** The client inspects the raw Mermaid graph string, prepends `graph TD\n` if missing, and executes `autoFixNodes()` to standardize node tokens into clean identifiers (`N1["Label"]`), preventing parser syntax crashes in the Mermaid runtime.

---

## Testing & Code Quality

- **Static Analysis & Linting:**
  - Configured with ESLint 9 flat configuration (`client/eslint.config.js`).
  - Incorporates `@eslint/js`, `eslint-plugin-react-hooks` (enforcing Rules of Hooks and exhaustive dependencies), and `eslint-plugin-react-refresh`.
  - Command:
    ```bash
    cd client
    npm run lint
    ```
- **Input Validation & Guard Rails:**
  - Topic presence checks on both client (`TopicForm.jsx`) and server (`generate.controller.js`).
  - Server-side credit verification guarding AI execution (rejects requests when credits < 10 with HTTP 403).
  - Stripe webhook cryptographic signature verification preventing unauthorized credit tampering.
  - Safe null-checking guards across all visualization components (`MermaidSetup.jsx`, `RechartSetUp.jsx`, `FinalResult.jsx`).

---

## Deployment

The application is structured as a decoupled client-server architecture ready for standard cloud hosting platforms.

### Production Build

To build the client application for production:

```bash
cd client
npm run build
```
*The compiled assets will be output to `client/dist/`.*

### Deployment Guidelines

1. **Frontend Hosting (Vercel, Netlify, or Cloudflare Pages):**
   - Deploy the `client/` directory.
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist`
   - Configure Environment Variable: `VITE_FIREBASE_APIKEY`.
   - Update `serverUrl` in `client/src/App.jsx` to point to the live backend domain instead of `localhost:8000`.
2. **Backend Hosting (Render, Railway, or AWS EC2):**
   - Deploy the `server/` directory.
   - Start Command: `node index.js`
   - Configure Server Environment Variables (`PORT`, `MONGODB_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLIENT_URL`).
   - In `server/index.js`, update the CORS configuration `origin` to match the production client domain.
3. **Stripe Webhook Configuration:**
   - In the Stripe Dashboard, register a new webhook endpoint pointing to `https://<YOUR_BACKEND_DOMAIN>/api/credits/webhook`.
   - Subscribe to the `checkout.session.completed` event.
   - Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## Limitations and Future Improvements

### Current Limitations
- **Hardcoded URLs in Source Code:** `client/src/App.jsx` and `server/index.js` define localhost fallback URLs (`http://localhost:8000` and `http://localhost:5173`) in source code rather than relying exclusively on dynamic environment variables (`VITE_SERVER_URL`).
- **PDF Diagram Visuals:** The server-side PDF generator (`pdfkit`) compiles text, headings, revision points, and questions, but does not currently render client-side SVG Mermaid diagrams or Recharts graphics into the output document.
- **Automated Test Coverage:** The repository currently does not include automated unit or end-to-end test suites (e.g., Vitest, Jest, Cypress).

### Planned Improvements
- **Headless SVG to PDF Rendering:** Integrate SVG-to-canvas rendering or Puppeteer-based server printing to embed Mermaid flowcharts and Recharts visual graphics directly inside downloaded PDFs.
- **Configurable Backend URL:** Refactor `client/src/services/api.js` to read backend endpoints dynamically from `import.meta.env.VITE_SERVER_URL`.
- **Automated Test Suite:** Introduce Vitest and React Testing Library for frontend component testing, alongside Supertest for backend endpoint integration coverage.
- **Search & Filter in History:** Add search queries and tag filtering for saved notes in `History.jsx`.

---

## License

This project is licensed under the **ISC License** as specified in `server/package.json`.
