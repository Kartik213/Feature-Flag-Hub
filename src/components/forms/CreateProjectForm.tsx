"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CreateProjectFormProps {
  orgSlug: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProjectForm({ orgSlug, onSuccess, onCancel }: CreateProjectFormProps) {
  const [name, setName] = useState("");
  const utils = trpc.useUtils();

  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate({ organizationSlug: orgSlug });
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createProject.mutate({ organizationSlug: orgSlug, name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {createProject.error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{createProject.error.message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="project-name" className="text-[13px] font-medium">
          Project Name
        </Label>
        <Input
          id="project-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Web App"
          required
          className="h-9 text-[13px]"
        />
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
        <Button
          type="submit"
          disabled={createProject.isPending}
          size="sm"
          className="h-9 px-6 text-[13px]"
        >
          {createProject.isPending ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
