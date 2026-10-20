# Architecture Overview

This document outlines the high-level architecture and design patterns used in the **Career Path Finder** application.

## 1. System Architecture

The application follows a standard Client-Server architecture separated into two main repositories/folders:
- **Frontend (Client):** Built with Next.js, serving as the user interface and handling client-side state, routing, and rendering.
- **Backend (Server):** Built with Node.js and Express, serving as the REST API provider, handling business logic, database interactions, and third-party integrations (like Google Gemini).

Communication between the frontend and backend is done via HTTP/REST APIs.

---

## 2. Frontend Architecture

The frontend is a Next.js (App Router) application.

### Key Technologies
- **Next.js:** Handles routing (App Router), server-side rendering (SSR), and static site generation (SSG) where applicable.
- **Tailwind CSS & Radix UI:** Used for building a highly customizable, accessible, and responsive user interface.
- **State Management & Forms:** `react-hook-form` paired with `zod` for robust client-side form validation.
- **Data Visualization:** `recharts` for rendering interactive charts and graphs related to career paths.

### Directory Structure Highlights
- `app/`: Next.js App Router definitions (pages, layouts).
- `components/`: Reusable UI components (buttons, dialogs, forms, Radix UI wrappers).
- `hooks/`: Custom React hooks for shared logic.
- `lib/`: Utility functions and helper classes.
- `public/`: Static assets (images, icons).
- `styles/`: Global CSS and Tailwind configuration.

---

## 3. Backend Architecture

The backend is an Express.js server written in TypeScript, following a Model-View-Controller (MVC) -like pattern for separation of concerns.

### Key Technologies
- **Express.js:** Web framework for handling HTTP requests.
- **PostgreSQL (`pg`):** Relational database used for persistent storage of user data, career paths, and application state.
- **Passport.js:** Middleware for handling authentication strategies (Local and Google OAuth20).
- **Google GenAI (`@google/genai`):** SDK used to interact with Gemini models for AI-driven features.

### Directory Structure (`backend/src`)
- `controllers/`: Handles incoming HTTP requests, processes input, interacts with services/models, and returns HTTP responses.
- `models/`: Represents data structures and handles direct database interactions/queries.
- `routes/`: Defines the API endpoints and maps them to their respective controllers.
  - `/api/auth`: Authentication endpoints (login, register, OAuth).
  - `/api/users`: User management and profile endpoints.
  - `/api/gemini`: Endpoints bridging to the Google Gemini AI integration.
- `services/`: Contains complex business logic and integrations (e.g., formatting prompts for the AI, complex data transformations).

### Authentication Flow
1. **Session-based Authentication:** The app uses `express-session` combined with Passport.js.
2. Cookies are sent with the `sameSite: 'lax'` and HTTP-only configuration to the frontend (running on `http://localhost:3000`).
3. Cross-Origin Resource Sharing (CORS) is configured to allow credentials from the frontend origin.

---

## 4. Database Schema (PostgreSQL)

*The exact schema may evolve, but generally includes:*
- **Users Table:** Stores user credentials (hashed passwords via `bcryptjs`), OAuth IDs, and profile information.
- **Career Paths / Insights:** Tables to store user-generated or AI-generated career roadmaps and preferences.

---

## 5. Third-Party Integrations

### Google Gemini API
The backend acts as a proxy to the Gemini API. The frontend never exposes API keys. 
1. Client requests AI insight.
2. Backend validates the request and session.
3. Backend calls Gemini API using `@google/genai`.
4. Result is parsed and sent back to the frontend.

### Google OAuth2.0
Used for seamless Single Sign-On (SSO). Managed entirely by Passport.js on the backend, interacting with Google's OAuth endpoints and creating/fetching user records in the local PostgreSQL database.
