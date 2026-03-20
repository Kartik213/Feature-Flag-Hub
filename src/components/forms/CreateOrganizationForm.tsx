"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { type Organization } from "better-auth/plugins";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CreateOrganizationFormProps {
  onSuccess?: (org: Organization) => void;
  onCancel?: () => void;
}

export function CreateOrganizationForm({ onSuccess, onCancel }: CreateOrganizationFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const normalizedSlug = slug || slugify(name);
    const { data, error } = await authClient.organization.create({
      name,
      slug: normalizedSlug,
    });

    if (error) {
      setError(error.message ?? "Failed to create organization");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess?.(data);
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
          <Label htmlFor="org-name" className="text-[13px] font-medium">
            Organization Name
          </Label>
          <Input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            required
            className="h-9 text-[13px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-slug" className="text-[13px] font-medium">
            Slug (Optional)
          </Label>
          <Input
            id="org-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={name ? slugify(name) : "acme-corp"}
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
          {loading ? "Creating..." : "Create Organization"}
        </Button>
      </div>
    </form>
  );
}
