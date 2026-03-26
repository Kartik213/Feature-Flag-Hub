"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CreateApiKeyFormProps {
  projectId: string;
  onSuccess?: (key: string) => void;
  onCancel?: () => void;
}

export function CreateApiKeyForm({ projectId, onSuccess, onCancel }: CreateApiKeyFormProps) {
  const [name, setName] = useState("");
  const utils = trpc.useUtils();

  const createKey = trpc.apiKeys.create.useMutation({
    onSuccess: (data) => {
      utils.apiKeys.list.invalidate({ projectId });
      setTimeout(() => {
        onSuccess?.(data.key);
      }, 600);
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createKey.mutate({ projectId, name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {createKey.error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{createKey.error.message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="key-name" className="text-[13px] font-medium">
          Key Name
        </Label>
        <Input
          id="key-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Production, Staging"
          required
          className="h-9 text-[13px]"
        />
      </div>
      <div className="flex justify-start gap-2 pt-2">
        <Button
          type="submit"
          disabled={createKey.isPending}
          size="sm"
          className="h-9 px-6 text-[13px]"
        >
          {createKey.isPending ? "Creating..." : "Create API Key"}
        </Button>
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
      </div>
    </form>
  );
}
