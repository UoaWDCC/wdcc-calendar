import { getCurrentUserAccess } from "@/lib/access";
import { getStampsForUser } from "@/lib/stamps";
import { redirect } from "next/navigation";

export default async function StampsPage() {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") {
    redirect("/");
  }
  if (access.status === "admin") {
    redirect("/admin");
  }

  const stamps = await getStampsForUser(access.userId);

  if (stamps.length === 0) {
    return <p>No stamps yet</p>;
  }

  return (
    <div>
      <img
        src={stamps[0].imageUrl ?? "/test.png"}
        alt={stamps[0].name ?? "Stamp"}
      />
    </div>
  );
}
