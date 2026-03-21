"use client";

import { AppModal } from "@/components/AppModal";
import { CreateApiKeyForm } from "@/components/forms/CreateApiKeyForm";

interface CreateApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess?: (key: string) => void;
}

export function CreateApiKeyModal({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}: CreateApiKeyModalProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="New API Key"
      description="Create a new API key to authenticate your SDK requests."
    >
      <CreateApiKeyForm
        projectId={projectId}
        onSuccess={(key) => {
          onOpenChange(false);
          onSuccess?.(key);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </AppModal>
  );
}
