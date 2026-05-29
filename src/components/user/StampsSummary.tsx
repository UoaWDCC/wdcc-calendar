import { Stamp } from "@/lib/stamps";

export default function StampsSummary({ stamps }: { stamps: Stamp[] }) {
  const total = stamps.length;
  const uniqueEvents = new Set(stamps.map((s) => s.id)).size;
  const latestISO = stamps
    .map((s) => s.date)
    .filter(Boolean)
    .sort()
    .reverse()[0];
  const latest = latestISO ? new Date(latestISO).toLocaleDateString() : "—";

  return (
    <section className="mb-6 flex gap-4 items-center">
      <div className="p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-500">Stamps</div>
        <div className="text-xl font-bold">{total}</div>
      </div>
      <div className="p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-500">Events attended</div>
        <div className="text-xl font-bold">{uniqueEvents}</div>
      </div>
      <div className="p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-500">Latest</div>
        <div className="text-xl font-bold">{latest}</div>
      </div>
    </section>
  );
}
