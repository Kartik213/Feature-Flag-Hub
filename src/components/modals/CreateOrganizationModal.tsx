"use client";

import { AppModal } from "@/components/AppModal";
import { CreateOrganizationForm } from "@/components/forms/CreateOrganizationForm";

interface CreateOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateOrganizationModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateOrganizationModalProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="New Organization"
      description="Create a new organization to manage your projects and team members."
    >
      <CreateOrganizationForm
        onSuccess={() => {
          onOpenChange(false);
          onSuccess?.();
        }}
        onCancel={() => onOpenChange(false)}
      />
    </AppModal>
  );
}
