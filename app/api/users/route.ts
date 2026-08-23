import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/db/prisma";

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

function errorResponse(code: string, status: number) {
  return NextResponse.json({ code }, { status });
}

export async function POST(request: Request) {
  let auth: Awaited<ReturnType<typeof requireAuth>>;

  try {
    auth = await requireAuth(request);
  } catch {
    return errorResponse("UNAUTHORIZED", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("INVALID_INPUT", 400);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { name?: unknown }).name !== "string" ||
    typeof (body as { username?: unknown }).username !== "string"
  ) {
    return errorResponse("INVALID_INPUT", 400);
  }

  const parsedBody = body as { name: string; username: string };
  const name = parsedBody.name.trim();
  const username = parsedBody.username.trim().toLowerCase();

  if (!name || !USERNAME_PATTERN.test(username)) {
    return errorResponse("INVALID_INPUT", 400);
  }

  try {
    const existingProfile = await prisma.user.findUnique({
      where: { firebaseUid: auth.firebaseUid },
    });

    if (existingProfile) {
      return errorResponse("PROFILE_ALREADY_EXISTS", 409);
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return errorResponse("USERNAME_TAKEN", 409);
    }

    const user = await prisma.user.create({
      data: {
        firebaseUid: auth.firebaseUid,
        email: auth.email ?? "",
        name,
        username,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
  console.error("POST /api/users ERROR:", error);

  if (isUniqueConstraintError(error)) {
    return errorResponse("USERNAME_TAKEN", 409);
  }

  return NextResponse.json(
    {
      code: "INTERNAL_SERVER_ERROR",
      message:
        error instanceof Error ? error.message : "Unknown server error",
    },
    { status: 500 }
  );
}
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}