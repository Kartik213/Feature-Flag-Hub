"use client";

import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppModal } from "@/components/AppModal";
import { AlertCircle } from "lucide-react";

interface DeleteApiKeyModalProps {
  projectId: string;
  deleteTarget: { id: string; name: string } | null;
  setDeleteTarget: (target: { id: string; name: string } | null) => void;
  onSuccess?: () => void;
}

export function DeleteApiKeyModal({
  projectId,
  deleteTarget,
  setDeleteTarget,
  onSuccess,
}: DeleteApiKeyModalProps) {
  const utils = trpc.useUtils();

  const revokeKey = trpc.apiKeys.revoke.useMutation({
    onSuccess: () => {
      utils.apiKeys.list.invalidate({ projectId });
      setDeleteTarget(null);
      onSuccess?.();
    },
  });

  const handleRevoke = () => {
    if (deleteTarget) {
      revokeKey.mutate({ id: deleteTarget.id });
    }
  };

  return (
    <AppModal
      open={!!deleteTarget}
      onOpenChange={(open) => !open && setDeleteTarget(null)}
      title="Revoke API Key"
      description={
        <>
          Are you sure you want to revoke the API key{" "}
          <span className="text-foreground font-semibold">{deleteTarget?.name}</span>? 
          This will immediately disable any applications using this key.
        </>
      }
    >
      {revokeKey.error && (
        <Alert variant="destructive" className="mb-4 py-2">
          <AlertCircle className="size-4" />
          <AlertDescription className="text-xs">{revokeKey.error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end gap-2 text-[13px]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteTarget(null)}
          className="h-9 text-[13px]"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRevoke}
          disabled={revokeKey.isPending}
          className="h-9 px-6 text-[13px]"
        >
          {revokeKey.isPending ? "Revoking..." : "Revoke Key"}
        </Button>
      </div>
    </AppModal>
  );
}
