# CampusCare Database

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | ⭐ **The only file you need** — complete schema, RLS policies, triggers |

## How to Apply

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/fgptgizlbueusdjavvpb)
2. Paste the contents of `schema.sql` and click **Run**

This drops and recreates both tables from scratch. Run it whenever:
- Setting up a new environment
- Resetting to a clean state
- After schema changes

## Table Structure

```
users       (id, name, email, role, avatar, google_id, created_at, updated_at)
    ↕ one-to-many via user_id
complaints  (id, title, description, category, priority, status,
             user_id, assigned_to, resolution_notes, timeline, ...)
    ↕ many-to-one via assigned_to
users       (staff members)
```

## RLS Policy Summary

| Table | Who | Can do |
|-------|-----|--------|
| users | Own | SELECT, UPDATE |
| users | Staff/Admin | SELECT (all rows) |
| users | Authenticated | INSERT (own row only) |
| complaints | Student | SELECT/INSERT/UPDATE/DELETE (own, pending) |
| complaints | Staff | SELECT/UPDATE (all) |
| complaints | Admin | SELECT/UPDATE/DELETE (all) |

## Backend Environment Variables Required

```env
SUPABASE_URL=https://fgptgizlbueusdjavvpb.supabase.co
SUPABASE_ANON_KEY=...        # public, respects RLS
SUPABASE_SERVICE_ROLE_KEY=... # secret, bypasses RLS — SERVER ONLY
```

> ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.**
> It is only used by the backend to create user profile rows after Supabase Auth signup.
