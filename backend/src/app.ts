import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";

import userRoutes from "./routes/userRoutes.js";
import authRouter from "./routes/auth.js";
import geminiRoutes from "./routes/geminiRoutes.js";

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret", // replace with strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set true in production with https
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/gemini", geminiRoutes);

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);

export default app;
