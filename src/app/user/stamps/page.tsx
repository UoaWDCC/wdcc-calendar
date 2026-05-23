import { getCurrentUserAccess } from "@/lib/access";

export default async function StampsPage() {
  await getCurrentUserAccess();
  return <p> Stamps page</p>;
}
