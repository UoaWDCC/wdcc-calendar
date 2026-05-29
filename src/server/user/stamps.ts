"use server";

import { eq } from "drizzle-orm";
import { db, eventAttendance, events } from "@/db";
import type { ServerResponse } from "@/lib/error";

export type Stamp = {
  id: number;
  name: string;
  imageUrl: string;
  date: string | null;
};

export async function getStampsForUser(
  userId: number,
): Promise<ServerResponse<Stamp[]>> {
  try {
    const rows = await db
      .select({
        id: events.id,
        name: events.title,
        date: events.startsAt,
      })
      .from(eventAttendance)
      .innerJoin(events, eq(eventAttendance.eventId, events.id))
      .where(eq(eventAttendance.userId, userId));

    const stamps = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: "/test.png",
      date: row.date?.toISOString() ?? null,
    }));
    console.log(`Loaded ${stamps.length} stamps for user ${userId}`);
    return { ok: true, value: stamps };
  } catch (err) {
    console.error("getStampsForUser error:", err);
    return { ok: false, error: "Failed to load stamps" };
  }
}
