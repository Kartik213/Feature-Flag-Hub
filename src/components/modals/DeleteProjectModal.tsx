"use client";

import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppModal } from "@/components/AppModal";
import { AlertCircle } from "lucide-react";

interface DeleteProjectModalProps {
  orgSlug: string;
  deleteTarget: { id: string; name: string } | null;
  setDeleteTarget: (target: { id: string; name: string } | null) => void;
  onSuccess?: () => void;
}

export function DeleteProjectModal({
  orgSlug,
  deleteTarget,
  setDeleteTarget,
  onSuccess,
}: DeleteProjectModalProps) {
  const utils = trpc.useUtils();

  const deleteProject = trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate({ organizationSlug: orgSlug });
      setDeleteTarget(null);
      onSuccess?.();
    },
  });

  const handleDelete = () => {
    if (deleteTarget) {
      deleteProject.mutate({ id: deleteTarget.id });
    }
  };

  return (
    <AppModal
      open={!!deleteTarget}
      onOpenChange={(open) => !open && setDeleteTarget(null)}
      title="Delete Project"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="text-foreground font-semibold">{deleteTarget?.name}</span>? This action
          is irreversible. All feature flags and data within this project will be permanently
          removed.
        </>
      }
    >
      {deleteProject.error && (
        <Alert variant="destructive" className="mb-4 py-2">
          <AlertCircle className="size-4" />
          <AlertDescription className="text-xs">{deleteProject.error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end gap-2">
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
          disabled={deleteProject.isPending}
          className="h-9 px-6 text-[13px]"
        >
          {deleteProject.isPending ? "Deleting..." : "Delete Project"}
        </Button>
      </div>
    </AppModal>
  );
}
