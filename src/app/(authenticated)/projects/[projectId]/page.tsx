"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Flag, Key } from "lucide-react";
import { DeleteProjectModal } from "@/components/modals/DeleteProjectModal";
import { DeleteFlagModal } from "@/components/modals/DeleteFlagModal";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: project } = trpc.projects.get.useQuery({ id: projectId });
  const { data: flags, isPending } = trpc.flags.list.useQuery({ projectId });

  const [deleteProjectTarget, setDeleteProjectTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [deleteFlagTarget, setDeleteFlagTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const updateFlag = trpc.flags.update.useMutation({
    onSuccess: () => utils.flags.list.invalidate({ projectId }),
  });

  return (
    <div>
      <div className="mb-6">
        <Link
          href={project ? `/org/${project.organization.slug}` : "/"}
          className="text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          &larr; Back to projects
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project?.name ?? "Project"}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage feature flags</p>
        </div>
        <div className="flex gap-2">
          {project && (
            <DeleteProjectModal
              orgSlug={project.organization.slug || ""}
              deleteTarget={deleteProjectTarget}
              setDeleteTarget={setDeleteProjectTarget}
              onSuccess={() => router.push(`/org/${project.organization.slug}`)}
            />
          )}
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive cursor-pointer"
            onClick={() => {
              if (project) {
                setDeleteProjectTarget({ id: project.id, name: project.name });
              }
            }}
          >
            Delete
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${projectId}/api-key`}>API Key</Link>
          </Button>
          {project?.apiKey && (
            <Button asChild>
              <Link href={`/projects/${projectId}/flags/new`}>+ New Flag</Link>
            </Button>
          )}
        </div>
      </div>

      <DeleteFlagModal
        projectId={projectId}
        deleteTarget={deleteFlagTarget}
        setDeleteTarget={setDeleteFlagTarget}
      />

      {isPending ? (
        <div className="text-muted-foreground py-12 text-center text-sm">Loading flags...</div>
      ) : !flags?.length ? (
        <Card className="py-16 text-center">
          {project?.apiKey ? (
            <CardContent>
              <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                <Flag className="text-primary size-5" />
              </div>
              <h3 className="mb-1 font-medium">No feature flags yet</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Create your first flag to control feature rollout.
              </p>
              <Button asChild>
                <Link href={`/projects/${projectId}/flags/new`}>+ New Flag</Link>
              </Button>
            </CardContent>
          ) : (
            <CardContent>
              <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                <Key className="text-primary size-5" />
              </div>
              <h3 className="mb-1 font-medium">No API key yet</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Create an API key to use the SDK.
              </p>
              <Button asChild>
                <Link href={`/projects/${projectId}/api-key`}>+ Create API Key</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden px-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rollout</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.map((flag: any) => (
                <TableRow key={flag.id}>
                  <TableCell>
                    <Link
                      href={`/projects/${projectId}/flags/${flag.id}`}
                      className="hover:text-primary font-mono text-sm font-medium transition-colors"
                    >
                      {flag.name}
                    </Link>
                    {flag.description && (
                      <p className="text-muted-foreground mt-0.5 text-xs">{flag.description}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() =>
                        updateFlag.mutate({ id: flag.id, enabled: !flag.enabled })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground font-mono text-xs">
                      {flag.rolloutPercentage}%
                    </p>
                  </TableCell>
                  <TableCell>
                    {/* <Badge variant="secondary">
                      {flag.rules.length} rule{flag.rules.length !== 1 && "s"}
                    </Badge> */}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => {
                        setDeleteFlagTarget({ id: flag.id, name: flag.name });
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
