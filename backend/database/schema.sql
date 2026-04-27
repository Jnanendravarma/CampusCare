-- ============================================================
-- CAMPUSCARE - CANONICAL DATABASE SCHEMA
-- ============================================================
-- Run this ONCE in Supabase SQL Editor to set up or reset
-- the database from scratch.
--
-- Project: Campuscare (fgptgizlbueusdjavvpb)
-- Last updated: 2026-02-23
-- ============================================================

-- ============================================================
-- STEP 1: DROP EXISTING TABLES (clean slate)
-- ============================================================

DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop the old trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- ============================================================
-- STEP 2: CREATE USERS TABLE
-- ============================================================
-- NOTE: The `id` column must match the Supabase Auth user UUID.
-- The backend inserts a row here after Supabase Auth creates
-- the account (using the service role key to bypass RLS).

CREATE TABLE users (
    id         UUID PRIMARY KEY,                          -- matches auth.users.id
    name       TEXT NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    role       TEXT NOT NULL DEFAULT 'student'
                   CHECK (role IN ('student', 'staff', 'admin')),
    avatar     TEXT,
    google_id  TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email     ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_role      ON users(role);

-- ============================================================
-- STEP 3: CREATE COMPLAINTS TABLE
-- ============================================================

CREATE TABLE complaints (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL,
    description      TEXT NOT NULL,
    category         TEXT NOT NULL
                         CHECK (category IN ('infrastructure','maintenance','cleanliness','safety','other')),
    priority         TEXT NOT NULL DEFAULT 'medium'
                         CHECK (priority IN ('low','medium','high','urgent')),
    status           TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','in-progress','resolved','rejected')),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to      UUID           REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    timeline         JSONB DEFAULT '[]'::jsonb,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_complaints_user_id    ON complaints(user_id);
CREATE INDEX idx_complaints_assigned   ON complaints(assigned_to);
CREATE INDEX idx_complaints_status     ON complaints(status);
CREATE INDEX idx_complaints_category   ON complaints(category);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);

-- ============================================================
-- STEP 4: AUTO-UPDATE `updated_at` TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_complaints_updated_at
    BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STEP 5: ROW LEVEL SECURITY
-- ============================================================
-- RLS is enabled on both tables.
-- The backend uses the SERVICE ROLE KEY to bypass RLS when
-- creating users after auth. All other operations respect RLS.

ALTER TABLE users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS TABLE POLICIES
-- ============================================================

-- Any user can view their own row
CREATE POLICY "users: view own"
    ON users FOR SELECT
    USING ((SELECT auth.uid()) = id);

-- Staff and Admin can view all users (needed to assign complaints)
CREATE POLICY "users: staff and admin view all"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = (SELECT auth.uid())
              AND u.role IN ('staff', 'admin')
        )
    );

-- Users can update their own profile
CREATE POLICY "users: update own"
    ON users FOR UPDATE
    USING ((SELECT auth.uid()) = id);

-- Only authenticated users can insert, and only their own row
-- (Backend uses service role key so this mainly covers direct client calls)
CREATE POLICY "users: insert own"
    ON users FOR INSERT
    TO authenticated
    WITH CHECK (id = (SELECT auth.uid()));

-- ============================================================
-- COMPLAINTS TABLE POLICIES
-- ============================================================

-- Students view their own complaints
CREATE POLICY "complaints: student views own"
    ON complaints FOR SELECT
    USING (user_id = (SELECT auth.uid()));

-- Staff view complaints assigned to them
CREATE POLICY "complaints: staff views assigned"
    ON complaints FOR SELECT
    USING (assigned_to = (SELECT auth.uid()));

-- Staff view ALL complaints (for management and assignment)
CREATE POLICY "complaints: staff views all"
    ON complaints FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = (SELECT auth.uid())
              AND u.role = 'staff'
        )
    );

-- Admin views ALL complaints
CREATE POLICY "complaints: admin views all"
    ON complaints FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = (SELECT auth.uid())
              AND u.role = 'admin'
        )
    );

-- Any authenticated user can create a complaint (for themselves)
CREATE POLICY "complaints: create own"
    ON complaints FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

-- Students can update their own pending complaints
CREATE POLICY "complaints: student updates pending"
    ON complaints FOR UPDATE
    USING (
        user_id = (SELECT auth.uid())
        AND status = 'pending'
    );

-- Staff can update complaints assigned to them
CREATE POLICY "complaints: staff updates assigned"
    ON complaints FOR UPDATE
    USING (assigned_to = (SELECT auth.uid()));

-- Staff can update ANY complaint (re-assign, change status etc.)
CREATE POLICY "complaints: staff updates all"
    ON complaints FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = (SELECT auth.uid())
              AND u.role = 'staff'
        )
    );

-- Admin can update ANY complaint
CREATE POLICY "complaints: admin updates all"
    ON complaints FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = (SELECT auth.uid())
              AND u.role = 'admin'
        )
    );

-- Students can delete their own pending complaints
CREATE POLICY "complaints: student deletes pending"
    ON complaints FOR DELETE
    USING (
        user_id = (SELECT auth.uid())
        AND status = 'pending'
    );

-- Admin can delete ANY complaint
CREATE POLICY "complaints: admin deletes all"
    ON complaints FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = (SELECT auth.uid())
              AND u.role = 'admin'
        )
    );

-- ============================================================
-- DONE
-- Tables, indexes, triggers, and RLS policies are all set.
-- ============================================================
