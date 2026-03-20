"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EditOrganizationFormProps {
  organization: {
    id: string;
    name: string;
    slug: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditOrganizationForm({
  organization,
  onSuccess,
  onCancel,
}: EditOrganizationFormProps) {
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.organization.update({
      organizationId: organization.id,
      data: {
        name,
        slug,
      },
    });

    if (error) {
      setError(error.message ?? "Failed to update organization");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-org-name" className="text-[13px] font-medium">
            Organization Name
          </Label>
          <Input
            id="edit-org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            required
            className="h-9 text-[13px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-org-slug" className="text-[13px] font-medium">
            Slug
          </Label>
          <Input
            id="edit-org-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="acme-corp"
            required
            className="h-9 text-[13px]"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            size="sm"
            className="h-9 text-[13px]"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} size="sm" className="h-9 px-6 text-[13px]">
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
