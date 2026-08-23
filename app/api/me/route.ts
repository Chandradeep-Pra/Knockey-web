import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  let auth: Awaited<ReturnType<typeof requireAuth>>;

  try {
    auth = await requireAuth(request);
  } catch {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: auth.firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { code: "PROFILE_NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}