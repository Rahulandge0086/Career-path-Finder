import express, { type Request, type Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy,type Profile } from "passport-google-oauth20";
import { pool } from "../models/db.js";
import {type User } from "../models/User.js";

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const client = await pool.connect();

        // Check if user exists
        const result = await client.query<User>(
          "SELECT * FROM users WHERE googleid = $1",
          [String(profile.id)]
        );
        
        let user: User;
        // If user does not exist, insert into DB
        if (result.rows.length === 0) {
          const insert = await client.query<User>(
            "INSERT INTO users (googleid, name, email) VALUES ($1, $2, $3)",
            [
              String(profile.id),
              profile.displayName || null,
              profile.emails?.[0]?.value || null,
            ]
          );
          user = insert.rows[0] as User;
        }else{
          user = result.rows[0] as User;
        }

        client.release();
        return done(null, user);
      } catch (err: any) {
        console.error("❌ DB error in GoogleStrategy:", err.message);
        return done(err, false);
      }
    }
  )
);


passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const res = await pool.query<User>("SELECT * FROM users WHERE id = $1", [id]);
    done(null, res.rows[0]);
  } catch (err) {
    done(err as Error, null);
  }
});

// Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:3000/");
  }
);

router.get("/getUser", (req: Request, res: Response) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ user: null });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out" });
  });
});

export default router;
