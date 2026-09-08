import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth-server";
import { revokeAllAdminSessions } from "@/lib/auth";

export async function POST(req: Request) {
  // Only authenticated admins can trigger global revocation
  const authError = await requireAdmin(req);
  if (authError) {
    return authError;
  }

  const revokedEpoch = revokeAllAdminSessions();

  // Clear caller's cookie as well
  const cookieStore = await cookies();
  cookieStore.delete({
    name: "apartmento_admin_token",
    path: "/",
  });

  return NextResponse.json({
    success: true,
    message: "All admin sessions on all devices have been revoked.",
    revokedAtEpoch: revokedEpoch,
  });
}
