"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function OrgsPage() {
  const router = useRouter();
  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations();

  useEffect(() => {
    if (!organizationsPending && organizations) {
      if (!organizations.length) {
        router.replace("/onboarding");
        return;
      }

      const lastOrg = localStorage.getItem("lastOrg");
      if (lastOrg) {
        router.replace(`/org/${lastOrg}`);
      } else {
        router.replace(`/org/${organizations[0].slug}`);
      }
    }
  }, [organizations, organizationsPending, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-muted-foreground flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}
