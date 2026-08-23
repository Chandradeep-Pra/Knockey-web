Create the initial TypeScript domain types for my Next.js project "Knockey".

Create this structure:

types/
    user.ts
    home.ts
    door.ts
    qr.ts
    visit.ts
    index.ts

Requirements:

1. user.ts

Create:

type User = {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

Rules/comments:
- id is the internal system-generated unique identifier.
- username is a globally unique, human-readable Knockey username.
- Database relationships must use id, never username.


2. home.ts

Create:

type HomeStatus = "ACTIVE" | "INACTIVE"

type Home = {
  id: string
  ownerId: string
  name: string
  address: string
  latitude: number
  longitude: number
  proximityRadius: number
  status: HomeStatus
  createdAt: Date
  updatedAt: Date
}

Relationship:
User 1:N Home
Home.ownerId -> User.id


3. door.ts

Create:

type DoorStatus = "ACTIVE" | "INACTIVE"

type Door = {
  id: string
  homeId: string
  doorNo: string
  name?: string
  status: DoorStatus
  createdAt: Date
  updatedAt: Date
}

Relationship:
Home 1:N Door
Door.homeId -> Home.id

Business constraint:
(homeId, doorNo) should be unique.


4. qr.ts

Create:

type QRTokenStatus = "ACTIVE" | "REVOKED"

type QRToken = {
  id: string
  doorId: string
  tokenHash: string
  status: QRTokenStatus
  createdAt: Date
  revokedAt?: Date
}

tokenHash:
Hashed server-side value of the unique random token embedded in the QR.
The raw token must not be stored in the database.

Relationship:
Door 1:N QRToken

Only one QRToken should normally be ACTIVE for a Door.

Also create:

type ScanQRRequest = {
  rawToken: string
  latitude: number
  longitude: number
}


5. visit.ts

For v1, DO NOT create a separate Visitor entity.
Visitors do not need a Knockey account and access Knockey through the web after scanning a QR.

Store lightweight visitor information directly on the VisitEvent.

Create:

type VisitStatus =
  | "WAITING"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"

type VisitEvent = {
  id: string
  homeId: string
  doorId: string
  visitorName?: string
  visitorPhone?: string
  purpose?: string
  status: VisitStatus
  createdAt: Date
  respondedAt?: Date
}

Relationships:
Home 1:N VisitEvent
Door 1:N VisitEvent


6. index.ts

Export all domain types from one place.


Important:
- Do not create database schemas yet.
- Do not create API routes.
- Do not add authentication.other future features.
- Do not invent additional fields.
- Keep the implementation simple and production-readable.
- Use exported TypeScript types.
- Follow the project's existing formatting/lint conventions.