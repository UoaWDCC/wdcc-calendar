import { getCurrentUserAccess } from "@/lib/access";
import { getStampsForUser } from "@/server/user/stamps";
import { redirect } from "next/navigation";
import StampsGrid from "@/components/user/StampsGrid";
import StampsSummary from "@/components/user/StampsSummary";

export default async function StampsPage() {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") redirect("/");
  if (access.status === "admin") redirect("/admin");

  const stamps = await getStampsForUser(access.userId);

  return (
    <div>
      <h1>Your stamps</h1>
      <StampsSummary stamps={stamps} />
      <StampsGrid stamps={stamps} />
    </div>
  );
}
