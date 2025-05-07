# Barter Circle Connect

A platform for exchanging skills with user profiles and skill matching, powered by PostgreSQL.

## Features
- User signup/login.
- Profile management (bio, skills).
- Skill listings and offer exchange.
- Skill matching suggestions.
- Ratings and real-time notifications.

## Tech Stack
- Frontend: Next.js, Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- Real-Time: Socket.io

## Setup
1. Clone the repo: `git clone <your-repo>`.
2. Install dependencies: `cd barter-circle-connect && npm install && cd server && npm install`.
3. Set up PostgreSQL and run `postgres.sql`.
4. Create `.env` with `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`.
5. Start Next.js: `npm run dev`.
6. Start Express: `cd server && node index.js`.