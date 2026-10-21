import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardApp from "@/components/dashboard/DashboardApp";
import { isMongoConfigured } from "@/lib/mongo";
import { isAuthenticated } from "@/lib/session";
import { getContent } from "@/lib/store";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/** Private editor. Server-rendered on every request (it reads the session cookie). */
export default async function DashboardPage() {
  if (!(await isAuthenticated())) redirect("/");
  return <DashboardApp initial={await getContent()} dbReady={isMongoConfigured()} />;
}
