"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Key, Copy, RefreshCw, Trash2 } from "lucide-react";
import { CreateApiKeyModal } from "@/components/modals/CreateApiKeyModal";
import { DeleteApiKeyModal } from "@/components/modals/DeleteApiKeyModal";

export default function SettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const utils = trpc.useUtils();
  const { data: apiKeys, isPending } = trpc.apiKeys.list.useQuery({ projectId });
  const apiKey = apiKeys?.[0];

  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/projects/${projectId}`}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; Back to flags
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage API key for SDK authentication
          </p>
        </div>
        <Button 
          variant={apiKey ? "outline" : "default"}
          onClick={() => { setShowCreate(true); setNewKey(null); }}
          className="gap-2"
        >
          {apiKey ? (
            <>
              <RefreshCw className="size-4" />
              Regenerate Key
            </>
          ) : (
            <>+ New API Key</>
          )}
        </Button>
      </div>

      <CreateApiKeyModal
        open={showCreate}
        onOpenChange={setShowCreate}
        projectId={projectId}
        onSuccess={setNewKey}
      />

      <DeleteApiKeyModal
        projectId={projectId}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
      />

      {/* Newly created key */}
      {newKey && (
        <Alert className="mb-6 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
          <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
          <AlertDescription>
            <span className="font-medium text-emerald-800 dark:text-emerald-300 block mb-1 text-[13px]">
              API key created successfully
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 block mb-3">
              Copy this key now. You won&apos;t be able to see it again.
            </span>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-background border border-emerald-300 dark:border-emerald-700 rounded-lg text-[13px] font-mono break-all leading-relaxed">
                {newKey}
              </code>
              <Button variant="outline" onClick={copyKey} className="shrink-0 h-10 px-4 text-[13px]">
                {copied ? <Check className="size-4 mr-2" /> : <Copy className="size-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Key display */}
      {isPending ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Loading API key...</div>
      ) : !apiKey ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <Key className="size-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1">No API key yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create an API key to use the SDK.</p>
            <Button onClick={() => setShowCreate(true)}>
              + New API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 border-b text-[13px]">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Active API Key</span>
              <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wider h-5">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <div className="p-0">
            <Table>
              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="py-4 pl-6 text-[13px] font-medium text-muted-foreground w-1/4">Name</TableCell>
                  <TableCell className="py-4 text-[13px] font-medium">{apiKey.name}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-t">
                  <TableCell className="py-2 pl-6 text-[13px] font-medium text-muted-foreground">Prefix</TableCell>
                  <TableCell className="py-2 h-auto">
                    <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5 pointer-events-none">
                      {apiKey.keyPrefix}...
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-t">
                  <TableCell className="py-4 pl-6 text-[13px] font-medium text-muted-foreground">Created</TableCell>
                  <TableCell className="py-4 text-[13px] text-muted-foreground">
                    {new Date(apiKey.createdAt).toLocaleDateString()} at {new Date(apiKey.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-t bg-muted/20">
                  <TableCell className="py-4 pl-6 text-[13px] font-medium text-muted-foreground">Risk Actions</TableCell>
                  <TableCell className="py-4 pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 -ml-3 gap-2 h-8 px-3"
                      onClick={() => setDeleteTarget({ id: apiKey.id, name: apiKey.name })}
                    >
                      <Trash2 className="size-3.5" />
                      Revoke this key
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* SDK usage */}
      <Card className="mt-8 border-dashed bg-muted/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">SDK Integration</CardTitle>
          <CardDescription className="text-xs">Install the SDK and use your API key to evaluate flags.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Install</div>
              <pre className="p-3 bg-card border rounded-lg text-xs font-mono overflow-x-auto ring-1 ring-foreground/5">
                npm install featureflaghub-sdk
              </pre>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Usage</div>
              <pre className="p-3 bg-card border rounded-lg text-xs font-mono overflow-x-auto ring-1 ring-foreground/5">
{`import { createClient } from "featureflaghub-sdk"

const client = createClient({
  apiKey: "ffh_your_api_key",
  baseUrl: "${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}"
})

const enabled = await client.isEnabled(
  "your_flag_name",
  { userId: "user_123" }
)

if (enabled) {
  // Show new feature
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
