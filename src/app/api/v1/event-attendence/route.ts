import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db, eventAttendance, events } from "@/db";
import { getCurrentUserAccess } from "@/lib/access";

type AttendanceRequestBody = {
  qrCodeToken?: string;
};

export async function PUT(request: Request) {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: AttendanceRequestBody;

  try {
    body = (await request.json()) as AttendanceRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.qrCodeToken !== "string") {
    return NextResponse.json(
      { error: "QR code token must be a string" },
      { status: 400 },
    );
  }

  const qrCodeToken = body.qrCodeToken.trim();

  if (!qrCodeToken) {
    return NextResponse.json(
      { error: "QR code token is required" },
      { status: 400 },
    );
  }

  try {
    const [event] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.qrCodeToken, qrCodeToken))
      .limit(1);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const inserted = await db
      .insert(eventAttendance)
      .values({
        eventId: event.id,
        userId: access.userId,
      })
      .onConflictDoNothing({
        target: [eventAttendance.eventId, eventAttendance.userId],
      })
      .returning();

    if (inserted.length === 0) {
      return NextResponse.json(
        { error: "User has already checked in to this event" },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Error adding event attendance:", error);
    return NextResponse.json(
      { error: "Failed to add event attendance" },
      { status: 500 },
    );
  }
}

export const POST = PUT;
