import { getCurrentUserAccess } from "@/lib/access";
import { getStampsForUser } from "@/server/user/getUserStamps";
import { redirect } from "next/navigation";
import StampsGrid from "@/components/user/StampsGrid";
import StampsSummary from "@/components/user/StampsSummary";

export default async function StampsPage() {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") redirect("/");
  if (access.status === "admin") redirect("/admin");

  const res = await getStampsForUser(access.userId);
  const hasError = !res.ok;
  const errorMsg = res.ok ? null : (res.error ?? "Unable to fetch stamps");
  const stamps = res.ok ? res.value : [];

  return (
    <div>
      <h1>Your stamps</h1>
      {hasError ? (
        <p className="text-red-600"> {errorMsg} </p>
      ) : (
        <>
          <StampsSummary stamps={stamps} />
          <StampsGrid stamps={stamps} />
        </>
      )}
    </div>
  );
}
