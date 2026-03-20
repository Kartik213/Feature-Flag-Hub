"use client";

import { AppModal } from "@/components/AppModal";
import { EditOrganizationForm } from "@/components/forms/EditOrganizationForm";

interface EditOrganizationModalProps {
  organization: {
    id: string;
    name: string;
    slug: string | null;
  } | null;
  setOrganization: (org: { id: string; name: string; slug: string | null } | null) => void;
  onSuccess?: () => void;
}

export function EditOrganizationModal({
  organization,
  setOrganization,
  onSuccess,
}: EditOrganizationModalProps) {
  return (
    <AppModal
      open={!!organization}
      onOpenChange={(open) => !open && setOrganization(null)}
      title="Edit Organization"
      description="Update your organization details and settings."
    >
      {organization && (
        <EditOrganizationForm
          organization={organization}
          onSuccess={() => {
            setOrganization(null);
            onSuccess?.();
          }}
          onCancel={() => setOrganization(null)}
        />
      )}
    </AppModal>
  );
}
