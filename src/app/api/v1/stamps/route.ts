import { eq } from "drizzle-orm";

import { db, eventAttendance, events } from "@/db";
import { getCurrentUserAccess } from "@/lib/access";

export async function GET() {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const stamps = await db
      .select({
        stampPath: events.stampPath,
      })
      .from(eventAttendance)
      .innerJoin(events, eq(eventAttendance.eventId, events.id))
      .where(eq(eventAttendance.userId, access.userId));

    return Response.json({ stamps }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stamps:", error);
    return Response.json(
      { error: "Failed to fetch stamps from database" },
      { status: 500 },
    );
  }
}
