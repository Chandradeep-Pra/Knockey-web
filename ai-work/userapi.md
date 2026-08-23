Implement the first Knockey user APIs in the existing Next.js App Router project.

Existing:
- Root-based App Router, no src/
- Firebase Auth already works in mobile
- firebase-admin installed and env vars configured
- Prisma 7 + Supabase PostgreSQL configured
- User Prisma model already exists
- Reuse existing project structure/code where possible

Create:

1. lib/auth/firebase-admin.ts
- Initialize Firebase Admin once using:
  FIREBASE_PROJECT_ID
  FIREBASE_CLIENT_EMAIL
  FIREBASE_PRIVATE_KEY

2. lib/auth/require-auth.ts
- Read `Authorization: Bearer <firebase-id-token>`
- Verify using Firebase Admin `verifyIdToken()`
- Return verified `firebaseUid` and `email`
- Never trust firebaseUid/email from request body

3. lib/db/prisma.ts
- Create/reuse production-safe Prisma 7 client using existing DATABASE_URL configuration.

4. POST /api/users

Body:
{
  "name": "Chandradeep",
  "username": "chandradeep"
}

- Must require Firebase authentication
- firebaseUid + email come from verified Firebase token
- trim name
- normalize username to lowercase
- username: 3-30 chars, a-z, 0-9, underscore only
- check existing firebaseUid
- check username uniqueness
- create Prisma User
- return 201

Important responses:
400 invalid input
401 invalid/missing Firebase token
409 PROFILE_ALREADY_EXISTS
409 USERNAME_TAKEN
500 unexpected error

5. GET /api/me
- Require Firebase authentication
- Find Prisma User using verified firebaseUid
- Return user if found
- If authenticated but profile doesn't exist:
  404 { code: "PROFILE_NOT_FOUND" }

Keep route handlers clean and simple.
Do not add Home, Door, QR, notifications, Supabase Auth, middleware, or mobile changes.

At the end tell me what files were created and anything I need to run.