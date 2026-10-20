# Career Path Finder

Career Path Finder is a full-stack web application designed to help users discover and plan their career paths. It leverages a modern tech stack and integrates with AI to provide intelligent insights.

## Tech Stack

### Frontend
- **Framework:** Next.js (v14)
- **Library:** React (v18)
- **Styling:** Tailwind CSS (v4)
- **UI Components:** Radix UI, Lucide React
- **Forms & Validation:** React Hook Form, Zod
- **Data Visualization:** Recharts
- **Language:** TypeScript

### Backend
- **Environment:** Node.js
- **Framework:** Express.js (v5)
- **Language:** TypeScript
- **Database:** PostgreSQL (via `pg` driver)
- **Authentication:** Passport.js (Local & Google OAuth20)
- **AI Integration:** Google GenAI (`@google/genai`)
- **Other Tools:** Multer (file uploads), bcryptjs, express-session

## Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Career-path-Finder
```

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and configure the necessary environment variables. Example:
   ```env
   # Server Port
   PORT=5001
   
   # Database Configuration (Supabase or other Postgres provider)
   DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
   
   # Authentication
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # AI Integration
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5001` (or the port specified in `.env`).

### 3. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` directory if needed (e.g., for API URLs). Example:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## Features
- User Authentication (Local and Google OAuth)
- AI-Powered Career Insights using Google Gemini API
- Interactive dashboards with charts
- Responsive and modern UI

## License
ISC
