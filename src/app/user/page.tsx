import { getCurrentUserAccess } from "@/lib/access";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const access = await getCurrentUserAccess();

  if (access.status === "no_role") {
    return redirect("/"); // Find sign in path lowkey don't know where it is
  }

  if (access.status === "admin") {
    return redirect("/admin");
  }

  return redirect("/user/stamps");
}
