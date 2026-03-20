import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppModal } from "@/components/AppModal";
import { AlertCircle } from "lucide-react";

interface DeleteOrganizationModalProps {
  deleteTarget: { id: string; name: string } | null;
  setDeleteTarget: (target: { id: string; name: string } | null) => void;
  onSuccess?: () => void;
}

export const DeleteOrganizationModal = ({
  deleteTarget,
  setDeleteTarget,
  onSuccess,
}: DeleteOrganizationModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError("");
    setDeleting(true);

    const { error } = await authClient.organization.delete({
      organizationId: deleteTarget.id,
    });

    if (error) {
      setDeleteError(error.message ?? "Failed to delete organization");
      setDeleting(false);
      return;
    }

    setDeleting(false);
    setDeleteTarget(null);
    onSuccess?.();
  };
  return (
    <AppModal
      open={!!deleteTarget}
      onOpenChange={(open) => {
        if (!open) {
          setDeleteTarget(null);
          setDeleteError("");
        }
      }}
      title="Delete Organization"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="text-foreground font-semibold">{deleteTarget?.name}</span>? This action
          is irreversible. All projects, feature flags, and data within this organization will be
          permanently removed.
        </>
      }
    >
      {deleteError && (
        <Alert variant="destructive" className="mb-4 py-2">
          <AlertCircle className="size-4" />
          <AlertDescription className="text-xs">{deleteError}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDeleteTarget(null);
            setDeleteError("");
          }}
          className="h-9 text-[13px]"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="h-9 px-6 text-[13px]"
        >
          {deleting ? "Deleting..." : "Delete Organization"}
        </Button>
      </div>
    </AppModal>
  );
};
