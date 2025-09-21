// src/routes/userRoutes.ts
import { type Request, type Response,Router } from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import { pool } from "../models/db.js";

const router = Router();

router.get("/", getUsers);

router.get("/getUserWithOnboarding", async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.googleid,
          o.currentrole, o.experience, o.skills, o.interests, 
          o.goals, o.preferred_industries, o.has_completed
   FROM users u
   LEFT JOIN user_onboarding o ON u.id = o.user_id
   WHERE u.id = $1`,[userId]
    );

    const row = result.rows[0];

    if (!row) return res.status(404).json({ error: "User not found" });

    // Format onboarding data
    const onboarding = {
      currentrole: row.currentrole,
      experience: row.experience,
      skills: row.skills,
      interests: row.interests,
      goals: row.goals,
      preferred_industries: row.preferred_industries,
      has_completed: row.has_completed || false,
    };

    // Return full user with onboarding
    res.json({
      id: row.id,
      name: row.name,
      email: row.email,
      googleid: row.googleid,
      created_at: row.created_at,
      onboarding,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});


router.post("/onboarding", async (req: Request, res: Response) => {
   const { userId, onboarding } = req.body;
   const { currentRole, experience, skills, interests, goals, preferredIndustries } = onboarding;

  console.log("Onboarding query fired.", onboarding);
  try {
    // Check if onboarding record already exists
    const result = await pool.query(
    "SELECT * FROM user_onboarding WHERE user_id = $1",
    [userId]
    );
    if (result.rows.length === 0) {
      // Insert new onboarding record
      await pool.query(
        `INSERT INTO user_onboarding 
        (user_id, currentrole, experience, skills, interests, goals, preferred_industries, has_completed)
        VALUES ($1,$2,$3,$4,$5,$6,$7, TRUE)`,
        [
          userId,
          currentRole,
          experience,
          JSON.stringify(skills),
          JSON.stringify(interests),
          goals,
          JSON.stringify(preferredIndustries),
        ]
      );
    } else {
      // Update existing record
      await pool.query(
        `UPDATE user_onboarding SET
          currentrole = $1,
          experience = $2,
          skills = $3,
          interests = $4,
          goals = $5,
          preferred_industries = $6,
          has_completed = TRUE
         WHERE user_id = $7`,
        [
          currentRole,
          experience,
          JSON.stringify(skills),
          JSON.stringify(interests),
          goals,
          JSON.stringify(preferredIndustries),
          userId,
        ]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save onboarding data" });
  }
});


router.post("/", createUser);

export default router;
