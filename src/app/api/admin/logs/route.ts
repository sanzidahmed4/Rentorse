import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth-server";
import { clearAllAdminLogs } from "@/lib/admin-audit";

export async function DELETE(req: Request) {
  // Only authenticated administrators with "admin" role can clear audit logs
  const authError = await requireAdminRole(req);
  if (authError) {
    return authError;
  }

  try {
    const result = await clearAllAdminLogs();
    return NextResponse.json({
      success: true,
      message: "All login activity and audit logs have been reset successfully.",
      count: result.count,
    });
  } catch (error: any) {
    console.error("Error clearing admin audit logs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to reset login audit logs",
      },
      { status: 500 }
    );
  }
}
