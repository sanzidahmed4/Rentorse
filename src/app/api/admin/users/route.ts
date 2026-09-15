import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession, requireAdminRole } from "@/lib/auth-server";
import { createAdminToken } from "@/lib/auth";
import { getAllAdminUsers, createAdminUser, deleteAdminUser, updateAdminUserRole, updateAdminUserProfile } from "@/lib/admin-users";
import { AdminUserRole } from "@/types";


export async function GET(req: Request) {
  try {
    // Only users with "admin" role can access users list
    const unauthorized = await requireAdminRole(req);
    if (unauthorized) return unauthorized;

    const users = await getAllAdminUsers();
    // Sanitize users list (omit passwords)
    const sanitized = users.map((u) => ({
      id: u._id || u.id,
      username: u.username,
      displayName: u.displayName,
      role: u.role,
      createdBy: u.createdBy || "system",
      isActive: u.isActive,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, users: sanitized });
  } catch (error: any) {
    console.error("Error retrieving admin users:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Only users with "admin" role can register new users
    const unauthorized = await requireAdminRole(req);
    if (unauthorized) return unauthorized;

    const session = await getAdminSession(req);
    const body = await req.json();

    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";
    const role: AdminUserRole = body.role === "admin" ? "admin" : "editor";

    // Validations
    if (!username || username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { success: false, error: "Username must be between 3 and 30 characters." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        { success: false, error: "Username can only contain letters, numbers, underscores, and dashes." },
        { status: 400 }
      );
    }

    if (username === "admin") {
      return NextResponse.json(
        { success: false, error: "The username 'admin' is reserved and cannot be used." },
        { status: 400 }
      );
    }

    if (!displayName || displayName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Display Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const newUser = await createAdminUser({
      username,
      displayName,
      password,
      role,
      createdBy: session.username || "sanzid",
    });

    return NextResponse.json({
      success: true,
      message: `User ${newUser.displayName} (@${newUser.username}) registered successfully as ${role.toUpperCase()}.`,
      user: {
        id: newUser._id || newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
        createdBy: newUser.createdBy,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create user" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Only users with "admin" role can delete users
    const unauthorized = await requireAdminRole(req);
    if (unauthorized) return unauthorized;

    const session = await getAdminSession(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    let targetId = id;
    let targetUsername = username;
    if (!targetId && !targetUsername) {
      try {
        const body = await req.json();
        targetId = body.id;
        targetUsername = body.username;
      } catch {}
    }

    if (!targetId && !targetUsername) {
      return NextResponse.json(
        { success: false, error: "User ID or Username is required." },
        { status: 400 }
      );
    }

    const result = await deleteAdminUser({
      id: targetId || undefined,
      username: targetUsername || undefined,
      requestingUsername: session.username,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      deletedUsername: result.deletedUsername,
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete user" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session.authenticated || !session.username) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const targetUsername = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";

    if (!targetUsername) {
      return NextResponse.json(
        { success: false, error: "Target username is required." },
        { status: 400 }
      );
    }

    const isSelf = session.username.toLowerCase() === targetUsername;
    const isAdmin = session.role === "admin";

    // Non-admins can only modify their own profile
    if (!isAdmin && !isSelf) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You only have permission to edit your own account." },
        { status: 403 }
      );
    }

    // If role is being changed, only admin can do it
    if (body.role && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only administrators can assign or change roles." },
        { status: 403 }
      );
    }

    const result = await updateAdminUserProfile({
      targetUsername,
      newUsername: typeof body.newUsername === "string" ? body.newUsername : undefined,
      displayName: typeof body.displayName === "string" ? body.displayName : undefined,
      password: typeof body.password === "string" ? body.password : undefined,
      role: body.role as AdminUserRole | undefined,
      requestingUsername: session.username,
      requestingRole: session.role,
    });

    // If user edited their own profile, refresh session cookie
    if (isSelf) {
      try {
        const cookieStore = await cookies();
        const updatedToken = await createAdminToken({
          username: result.user.username,
          role: result.user.role,
          displayName: result.user.displayName,
        });
        const cookieOpts = {
          value: updatedToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        };
        cookieStore.set({
          name: "rentorce_admin_token",
          ...cookieOpts,
        });
        cookieStore.set({
          name: "apartmento_admin_token",
          ...cookieOpts,
        });
      } catch (cookieErr) {
        console.warn("Could not refresh session cookie:", cookieErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      usernameChanged: result.usernameChanged,
      user: {
        id: result.user._id || result.user.id,
        username: result.user.username,
        displayName: result.user.displayName,
        role: result.user.role,
        createdBy: result.user.createdBy,
        isActive: result.user.isActive,
      },
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update user" },
      { status: 400 }
    );
  }
}


