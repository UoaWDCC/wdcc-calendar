import { eq } from "drizzle-orm";

import { db, eventAttendance, events } from "@/db";
import { getCurrentUserAccess } from "@/lib/access";

type AttendanceRequestBody = {
  qrCodeToken?: string;
};

function isUniqueViolation(error: unknown) {
  let current: unknown = error;

  while (typeof current === "object" && current !== null) {
    if ("code" in current && current.code === "23505") {
      return true;
    }

    current = "cause" in current ? current.cause : null;
  }

  return false;
}

export async function PUT(request: Request) {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: AttendanceRequestBody;

  try {
    body = (await request.json()) as AttendanceRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.qrCodeToken !== "string") {
    return Response.json(
      { error: "QR code token must be a string" },
      { status: 400 },
    );
  }

  const qrCodeToken = body.qrCodeToken.trim();

  if (!qrCodeToken) {
    return Response.json(
      { error: "QR code token is required" },
      { status: 400 },
    );
  }

  try {
    const [event] = await db
      .select({
        id: events.id,
      })
      .from(events)
      .where(eq(events.qrCodeToken, qrCodeToken))
      .limit(1);

    if (!event) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    await db.insert(eventAttendance).values({
      eventId: event.id,
      userId: access.userId,
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json(
        { error: "User has already checked in to this event" },
        { status: 409 },
      );
    }

    console.error("Error adding event attendance:", error);
    return Response.json(
      { error: "Failed to add event attendance" },
      { status: 500 },
    );
  }
}

export const POST = PUT;
