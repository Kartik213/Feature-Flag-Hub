"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPERATORS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "not equals" },
  { value: "contains", label: "contains" },
  { value: "starts_with", label: "starts with" },
  { value: "ends_with", label: "ends with" },
  { value: "in", label: "in (comma-separated)" },
] as const;

export default function FlagDetailPage() {
  const { projectId, flagId } = useParams<{
    projectId: string;
    flagId: string;
  }>();
  const utils = trpc.useUtils();
  const { data: flag, isPending } = trpc.flags.get.useQuery({ id: flagId });

  const updateFlag = trpc.flags.update.useMutation({
    onSuccess: () => utils.flags.get.invalidate({ id: flagId }),
  });

  const addRule = trpc.flags.addRule.useMutation({
    onSuccess: () => {
      utils.flags.get.invalidate({ id: flagId });
      setRuleAttribute("");
      setRuleOperator("equals");
      setRuleValue("");
      setShowAddRule(false);
    },
  });

  const removeRule = trpc.flags.removeRule.useMutation({
    onSuccess: () => utils.flags.get.invalidate({ id: flagId }),
  });

  const [showAddRule, setShowAddRule] = useState(false);
  const [ruleAttribute, setRuleAttribute] = useState("");
  const [ruleOperator, setRuleOperator] = useState("equals");
  const [ruleValue, setRuleValue] = useState("");
  const [rolloutInput, setRolloutInput] = useState("");

  // Sync rollout input when flag data loads
  const [hasSyncedRollout, setHasSyncedRollout] = useState(false);
  if (flag && !hasSyncedRollout) {
    setRolloutInput(flag.rolloutPercentage.toString());
    setHasSyncedRollout(true);
  }

  if (isPending) {
    return <div className="text-muted-foreground py-12 text-center text-sm">Loading flag...</div>;
  }

  if (!flag) {
    return <div className="text-destructive py-12 text-center text-sm">Flag not found</div>;
  }

  const handleRolloutUpdate = (val: number) => {
    updateFlag.mutate({
      id: flag.id,
      rolloutPercentage: val,
    });
    setRolloutInput(val.toString());
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/projects/${projectId}`}
          className="text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          &larr; Back to flags
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold">{flag.name}</h1>
            <Switch
              checked={flag.enabled}
              onCheckedChange={() => updateFlag.mutate({ id: flag.id, enabled: !flag.enabled })}
            />
            <Badge variant={flag.enabled ? "default" : "secondary"}>
              {flag.enabled ? "ENABLED" : "DISABLED"}
            </Badge>
          </div>
          {flag.description && (
            <p className="text-muted-foreground mt-2 text-sm">{flag.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Rollout */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rollout Percentage</CardTitle>
            <CardDescription>
              Controls what percentage of users see this feature, based on a deterministic hash of
              their user ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Slider
                value={[flag.rolloutPercentage]}
                onValueChange={(val) => {
                  const values = Array.isArray(val) ? val : [val];
                  handleRolloutUpdate(values[0]);
                }}
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
                    setRolloutInput(flag.rolloutPercentage.toString());
                  }}
                  onChange={(e) => {
                    const valStr = e.target.value;
                    setRolloutInput(valStr);

                    const val = parseInt(valStr);
                    if (!isNaN(val)) {
                      handleRolloutUpdate(Math.min(100, Math.max(0, val)));
                    } else if (valStr === "") {
                      handleRolloutUpdate(0);
                    }
                  }}
                  className="h-9 w-20 [appearance:textfield] pr-7 pl-3 font-mono text-[13px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-medium">
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Targeting Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Targeting Rules</CardTitle>
                <CardDescription>
                  If any rule matches the user&apos;s attributes, the flag is enabled regardless of
                  rollout percentage.
                </CardDescription>
              </div>
              <Button variant="link" size="sm" onClick={() => setShowAddRule(!showAddRule)}>
                + Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddRule && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addRule.mutate({
                    flagId: flag.id,
                    attribute: ruleAttribute,
                    operator: ruleOperator as "equals",
                    value: ruleValue,
                  });
                }}
                className="bg-muted mb-5 space-y-4 rounded-lg p-4"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Attribute</Label>
                    <Input
                      type="text"
                      value={ruleAttribute}
                      onChange={(e) => setRuleAttribute(e.target.value)}
                      required
                      placeholder="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Operator</Label>
                    <Select
                      value={ruleOperator}
                      onValueChange={(val) => {
                        if (val) setRuleOperator(val);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Value</Label>
                    <Input
                      type="text"
                      value={ruleValue}
                      onChange={(e) => setRuleValue(e.target.value)}
                      required
                      placeholder="@company.com"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={addRule.isPending}>
                    {addRule.isPending ? "Adding..." : "Add Rule"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddRule(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {flag.rules.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                No targeting rules. Flag relies on rollout percentage only.
              </div>
            ) : (
              <div className="space-y-2">
                {flag.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-muted flex items-center justify-between rounded-lg p-3"
                  >
                    <div className="font-mono text-sm">
                      <span className="text-foreground font-semibold">{rule.attribute}</span>{" "}
                      <span className="text-muted-foreground">
                        {rule.operator.replace("_", " ")}
                      </span>{" "}
                      <span className="text-primary font-medium">&quot;{rule.value}&quot;</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => removeRule.mutate({ ruleId: rule.id })}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
