import { getCurrentUserAccess } from "@/lib/access";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import StampsGrid from "@/components/user/StampsGrid";
import StampsSummary from "@/components/user/StampsSummary";

export default async function StampsPage() {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") {
    redirect("/");
  }
  if (access.status === "admin") {
    redirect("/admin");
  }

  const h = await headers();
  const cookieHeader = h.get("cookie") ?? "";

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/v1/stamps`, {
    method: "GET",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    return <p>Unable to load stamps</p>;
  }

  const { stamps = [] } = await res.json();

  return (
    <div>
      <h1>Your stamps</h1>
      <StampsSummary stamps={stamps} />
      <StampsGrid stamps={stamps} />
    </div>
  );
}
