"use client";

import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppModal } from "@/components/AppModal";
import { AlertCircle } from "lucide-react";

interface DeleteFlagModalProps {
  projectId: string;
  deleteTarget: { id: string; name: string } | null;
  setDeleteTarget: (target: { id: string; name: string } | null) => void;
  onSuccess?: () => void;
}

export function DeleteFlagModal({
  projectId,
  deleteTarget,
  setDeleteTarget,
  onSuccess,
}: DeleteFlagModalProps) {
  const utils = trpc.useUtils();

  const deleteFlag = trpc.flags.delete.useMutation({
    onSuccess: () => {
      utils.flags.list.invalidate({ projectId });
      setDeleteTarget(null);
      onSuccess?.();
    },
  });

  const handleDelete = () => {
    if (deleteTarget) {
      deleteFlag.mutate({ id: deleteTarget.id });
    }
  };

  return (
    <AppModal
      open={!!deleteTarget}
      onOpenChange={(open) => !open && setDeleteTarget(null)}
      title="Delete Feature Flag"
      description={
        <>
          Are you sure you want to delete the flag{" "}
          <span className="text-foreground font-mono font-semibold">{deleteTarget?.name}</span>?
          This action is irreversible and will remove all targeting rules.
        </>
      }
    >
      {deleteFlag.error && (
        <Alert variant="destructive" className="mb-4 py-2">
          <AlertCircle className="size-4" />
          <AlertDescription className="text-xs">{deleteFlag.error.message}</AlertDescription>
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
          onClick={handleDelete}
          disabled={deleteFlag.isPending}
          className="h-9 px-6 text-[13px]"
        >
          {deleteFlag.isPending ? "Deleting..." : "Delete Flag"}
        </Button>
      </div>
    </AppModal>
  );
}
