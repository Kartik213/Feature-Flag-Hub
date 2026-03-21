"use client";

import { useParams } from "next/navigation";
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
import { Flag } from "lucide-react";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const utils = trpc.useUtils();
  const { data: project } = trpc.projects.get.useQuery({ id: projectId });
  const flags: any = [];
  const isPending = false;

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
          <Button variant="outline">
            <Link href={`/projects/${projectId}/api-keys`}>API Keys</Link>
          </Button>
          <Button>
            <Link href={`/projects/${projectId}/flags/new`}>+ New Flag</Link>
          </Button>
        </div>
      </div>

      {isPending ? (
        <div className="text-muted-foreground py-12 text-center text-sm">Loading flags...</div>
      ) : !flags?.length ? (
        <Card className="py-16 text-center">
          <CardContent>
            <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
              <Flag className="text-primary size-5" />
            </div>
            <h3 className="mb-1 font-medium">No feature flags yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Create your first flag to control feature rollout.
            </p>
            <Button>
              <Link href={`/projects/${projectId}/flags/new`}>+ New Flag</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
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
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${flag.rolloutPercentage}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground font-mono text-xs">
                        {flag.rolloutPercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {flag.rules.length} rule{flag.rules.length !== 1 && "s"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => {}}
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
