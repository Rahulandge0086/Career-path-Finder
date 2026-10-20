import express, { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { pool } from "../models/db.js";
import { type User } from "../models/User.js";

const router = express.Router();

// Passport session serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const res = await pool.query<User>(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id]
    );
    if (res.rows.length === 0) {
      return done(null, false);
    }
    done(null, res.rows[0]);
  } catch (err) {
    done(err as Error, null);
  }
});

// POST /api/auth/register - Create a new user with email & password
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if email already registered
    const existing = await pool.query("SELECT id FROM users WHERE LOWER(email) = $1", [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const insertResult = await pool.query<User>(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [trimmedName, trimmedEmail, hashedPassword]
    );

    const newUser = insertResult.rows[0];
    if (!newUser) {
      return res.status(500).json({ error: "Failed to create user record" });
    }

    // Establish session immediately
    req.login(newUser, (err) => {
      if (err) {
        console.error("Session login error after registration:", err);
        return res.status(500).json({ error: "User registered, but failed to establish session" });
      }
      return res.status(201).json({
        message: "Account created successfully",
        user: newUser,
      });
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: err.message || "Registration failed" });
  }
});

// POST /api/auth/login - Credential login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query user by email
    const result = await pool.query(
      "SELECT id, name, email, password, created_at FROM users WHERE LOWER(email) = $1",
      [trimmedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const dbUser = result.rows[0];

    if (!dbUser.password) {
      return res.status(401).json({ error: "This account was not configured with a password. Please register or contact support." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const safeUser: User = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      created_at: dbUser.created_at,
    };

    // Establish session
    req.login(safeUser, (err) => {
      if (err) {
        console.error("Session login error:", err);
        return res.status(500).json({ error: "Failed to establish session" });
      }
      return res.json({
        message: "Logged in successfully",
        user: safeUser,
      });
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message || "Login failed" });
  }
});

// GET /api/auth/getUser - Get current authenticated user
router.get("/getUser", (req: Request, res: Response) => {
  if (req.user) {
    return res.json(req.user);
  }
  return res.status(401).json({ user: null });
});

// POST /api/auth/logout - Logout current user
router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    if (req.session) {
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Session destroy error:", destroyErr);
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
      });
    } else {
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully" });
    }
  });
});

export default router;
