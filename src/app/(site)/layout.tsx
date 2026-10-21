import SiteChrome from "@/components/layout/SiteChrome";
import { getContent } from "@/lib/store";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteChrome content={await getContent()}>{children}</SiteChrome>;
}
