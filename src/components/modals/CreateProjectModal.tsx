"use client";

import { AppModal } from "@/components/AppModal";
import { CreateProjectForm } from "@/components/forms/CreateProjectForm";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgSlug: string;
  onSuccess?: () => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  orgSlug,
  onSuccess,
}: CreateProjectModalProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="New Project"
      description="Create a new project to start managing feature flags and environments."
    >
      <CreateProjectForm
        orgSlug={orgSlug}
        onSuccess={() => {
          onOpenChange(false);
          onSuccess?.();
        }}
        onCancel={() => onOpenChange(false)}
      />
    </AppModal>
  );
}
