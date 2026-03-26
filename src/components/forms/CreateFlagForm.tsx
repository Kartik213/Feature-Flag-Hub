"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CreateFlagFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateFlagForm({ projectId, onSuccess, onCancel }: CreateFlagFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [rollout, setRollout] = useState(0);
  const [rolloutInput, setRolloutInput] = useState("0");

  const createFlag = trpc.flags.create.useMutation({
    onSuccess: () => onSuccess?.(),
  });

  const handleRolloutChange = (val: number) => {
    setRollout(val);
    setRolloutInput(val.toString());
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createFlag.mutate({
      projectId,
      name,
      description: description || undefined,
      enabled,
      rolloutPercentage: rollout,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {createFlag.error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{createFlag.error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label className="text-foreground/80 text-[13px] font-medium">Flag Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          pattern="[a-z0-9_]+"
          title="Lowercase letters, numbers, and underscores only"
          className="h-9 font-mono text-[13px]"
          placeholder="new_checkout_ui"
        />
        <p className="text-muted-foreground text-[11px]">
          Lowercase letters, numbers, and underscores only
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-foreground/80 text-[13px] font-medium">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="What does this flag control?"
          className="resize-none text-[13px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-foreground/80 text-[13px] font-medium">Rollout Percentage</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[rollout]}
            onValueChange={(val) => handleRolloutChange(Array.isArray(val) ? val[0] : val)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <div className="relative">
            <Input
              type="number"
              min={0}
              max={100}
              value={rolloutInput}
              onBlur={() => {
                // Ensure input shows current numeric value on blur
                setRolloutInput(rollout.toString());
              }}
              onChange={(e) => {
                const valStr = e.target.value;
                setRolloutInput(valStr);

                const val = parseInt(valStr);
                if (!isNaN(val)) {
                  setRollout(Math.min(100, Math.max(0, val)));
                } else if (valStr === "") {
                  setRollout(0);
                }
              }}
              className="h-9 w-20 [appearance:textfield] pr-7 pl-3 font-mono text-[13px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-medium">
              %
            </span>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border-border/50 flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={enabled} onCheckedChange={setEnabled} className="scale-90" />
        <Label
          className="cursor-pointer text-[13px] font-medium select-none"
          onClick={() => setEnabled(!enabled)}
        >
          Enable flag immediately
        </Label>
      </div>

      <div className="flex justify-start gap-2 pt-2">
        <Button
          type="submit"
          disabled={createFlag.isPending}
          size="sm"
          className="h-9 px-6 text-[13px]"
        >
          {createFlag.isPending ? "Creating..." : "Create Flag"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-9 text-[13px]"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
