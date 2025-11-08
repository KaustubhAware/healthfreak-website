import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get the currently logged-in user from Clerk
    const user = await currentUser();
    console.log("Clerk currentUser:", user);

    if (!user) {
      return NextResponse.json({ error: "No user logged in" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Logged-in user has no email" }, { status: 400 });
    }

    // 2️⃣ Check if the user already exists in the database
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    console.log("Existing users:", existingUsers);

    // 3️⃣ If user does not exist, insert into DB
    if (existingUsers.length === 0) {
      const insertedUsers = await db
        .insert(usersTable)
        .values({
          name: user.fullName ?? "Anonymous",
          email,
          credits: 10,
        })
        .returning();

      console.log("Inserted user:", insertedUsers[0]);
      return NextResponse.json(insertedUsers[0]);
    }

    // 4️⃣ If user exists, return existing user
    return NextResponse.json(existingUsers[0]);

  } catch (e) {
    console.error("Error creating user:", e);

    const errorMessage =
      e && typeof e === "object" && "message" in e
        ? (e as { message: string }).message
        : String(e);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
