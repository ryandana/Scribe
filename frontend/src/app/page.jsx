import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ClientLandingContent from "@/components/landing-content.component";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Redirect authenticated users to feed
  if (token) {
    redirect("/feed");
  }

  return <ClientLandingContent />;
}
