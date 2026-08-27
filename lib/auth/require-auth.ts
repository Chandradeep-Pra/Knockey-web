import { getAdminAuth } from "./firebase-admin";

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export async function requireAuth(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authorization.slice(7);

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);

    return {
      firebaseUid: decoded.uid,
      email: decoded.email,
    };
  } catch {
    throw new UnauthorizedError();
  }
}
