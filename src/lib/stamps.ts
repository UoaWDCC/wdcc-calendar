import { eq } from "drizzle-orm";

import { db, eventAttendance, events } from "@/db";

export type Stamp = {
  id: number;
  name: string;
  imageUrl: string;
  date: string | null;
};

export async function getStampsForUser(userId: number): Promise<Stamp[]> {
  const rows = await db
    .select({
      id: events.id,
      name: events.title,
      date: events.startsAt,
    })
    .from(eventAttendance)
    .innerJoin(events, eq(eventAttendance.eventId, events.id))
    .where(eq(eventAttendance.userId, userId));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    imageUrl: "/test.png",
    date: row.date?.toISOString() ?? null,
  }));
}
