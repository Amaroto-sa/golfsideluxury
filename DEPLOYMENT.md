# Golfside Luxury Hotel - Application Architecture

This project is tailored for **Cloud Deployment (Vercel + Hosted PostgreSQL)**.
All configurations are built strictly cloud-first.

## Setup Instructions for Cloud Environment

1. **Database:**
   - Create a managed PostgreSQL database (e.g. Vercel Postgres, Supabase, Neon).
   - Get your `DATABASE_URL`.

2. **Environment Variables:**
   - Review `.env.example`.
   - Add these variables to your Vercel Project Settings > Environment Variables:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (your deployed vercel domain)
     - `NEXTAUTH_SECRET` (generate a random secure string)

3. **Deploying on Vercel:**
   - Connect your GitHub repository to Vercel.
   - The framework preset should auto-detect as **Next.js**.
   - The Build command is automatically set to `next build`.
   - The Install command is automatically set to `npm install`.
   - `prisma generate` will run automatically post-install (defined in `package.json` scripts: `postinstall: prisma generate`).

4. **Database Migrations on Vercel Context:**
   - Since Vercel handles the deployment, you should run database migrations against your remote DB prior to finalizing the first deploy. Usually, this is handled locally by pointing the `.env` to the remote DB and running `npx prisma db push`, or managing it securely via CI/CD pipelines.

## Project Structure Highlights
- `/prisma/schema.prisma`: Fully realized hotel operational models, including `HotelSettings` to prevent hardcoded site configuration.
- `/src/lib/prisma.ts`: Singleton Prisma client for Edge/Serverless Next.js compatibility.
- `/src/app/page.tsx`: Luxury dark-themed Public Homepage. Content pulled dynamically from Admin.
- `/src/app/admin/*`: Protected Admin Dashboard layout and panels.
- `/src/app/actions/*`: Next.js Server Actions used for secure database manipulations without exposing API keys.

## Data Philosophy
**Zero Hardcoded Data.** The public interface strictly relies on the database for content like Room Prices, Contact Info, Booking Rules, and Hotel Meta. The Admin can edit this dynamically via the `/admin/settings` panel without requiring redeployments.
