"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, ChevronRight, Trash2 } from "lucide-react";
import { CreateProjectModal } from "@/components/modals/CreateProjectModal";
import { DeleteProjectModal } from "@/components/modals/DeleteProjectModal";

export default function OrgPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { data: projects, isPending } = trpc.projects.list.useQuery({
    organizationSlug: orgSlug,
  });

  const [showCreate, setShowCreate] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage projects in this organization</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-1.5">
          + New Project
        </Button>
      </div>

      <CreateProjectModal open={showCreate} onOpenChange={setShowCreate} orgSlug={orgSlug} />

      <DeleteProjectModal
        orgSlug={orgSlug}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
      />

      {isPending ? (
        <div className="text-muted-foreground py-12 text-center text-sm">Loading projects...</div>
      ) : !projects?.length ? (
        <Card className="py-16 text-center">
          <CardContent>
            <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
              <FolderOpen className="text-primary size-5" />
            </div>
            <h3 className="mb-1 font-medium">No projects yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Create your first project to start managing feature flags.
            </p>
            <Button onClick={() => setShowCreate(true)} className="gap-1.5">
              + New Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card ring-foreground/10 hover:ring-primary/20 group flex items-center gap-4 rounded-xl p-4 ring-1 transition-all"
            >
              <Link
                href={`/org/${orgSlug}/project/${project.id}`}
                className="flex min-w-0 flex-1 items-center gap-4"
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors">
                  <FolderOpen className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{project.name}</div>
                  <div className="text-muted-foreground truncate text-xs">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive size-8 transition-colors"
                  onClick={() => {
                    setDeleteTarget({ id: project.id, name: project.name });
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <Link href={`/org/${orgSlug}/project/${project.id}`} className="shrink-0">
                <ChevronRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
