import { Stamp } from "@/types/stamps/stamps";

export default function StampsGrid({ stamps }: { stamps: Stamp[] }) {
  if (stamps.length === 0) {
    return <p>No stamps yet</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stamps.map((stamp) => (
        <div key={stamp.id} className="rounded-lg border p-3">
          <img
            src={stamp.imageUrl ?? "/test.png"}
            alt={stamp.name ?? "Stamp"}
            className="h-24 w-24 object-contain"
          />
          <p className="mt-2 text-sm">{stamp.name ?? "Stamp"}</p>
        </div>
      ))}
    </div>
  );
}
