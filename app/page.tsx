import { SiteShell } from "@/components/ui/SiteShell";
import { ProfessionalView } from "@/components/professional/ProfessionalView";
import { ArtisticView } from "@/components/artistic/ArtisticView";

/**
 * Root page — Server Component.
 * Both views are slotted through the client SiteShell as ReactNode props.
 * Both ship in the initial payload — switching is instant, nothing is fetched.
 */
export default function Page() {
  return (
    <SiteShell
      professional={<ProfessionalView />}
      artistic={<ArtisticView />}
    />
  );
}
