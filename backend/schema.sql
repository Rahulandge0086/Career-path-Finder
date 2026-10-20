-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    googleid VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Onboarding details
CREATE TABLE user_onboarding (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    currentrole VARCHAR(255),
    experience VARCHAR(255),
    skills JSONB,
    interests JSONB,
    goals TEXT,
    preferred_industries JSONB,
    has_completed BOOLEAN DEFAULT FALSE
);

-- Assessments table (tracks when a user takes an assessment)
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Answers (stores individual answers per assessment)
CREATE TABLE assessment_answers (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    answer_index INTEGER NOT NULL
);

-- Assessment Results (stores the AI-generated results for an assessment)
CREATE TABLE assessment_results (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
    skill_scores JSONB,
    recommendations JSONB,
    career_paths JSONB
);
