"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ChevronRight, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { DeleteOrganizationModal } from "@/components/modals/DeleteOrganizationModal";
import { CreateOrganizationModal } from "@/components/modals/CreateOrganizationModal";
import { EditOrganizationModal } from "@/components/modals/EditOrganizationModal";

export default function OrganizationsPage() {
  const { data: orgs, isPending, refetch } = authClient.useListOrganizations();

  const [showCreate, setShowCreate] = useState(false);

  const [editingOrg, setEditingOrg] = useState<{
    id: string;
    name: string;
    slug: string | null;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your organizations</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-1.5">
          <PlusCircle className="size-4" />
          New Organization
        </Button>
      </div>

      <CreateOrganizationModal open={showCreate} onOpenChange={setShowCreate} onSuccess={refetch} />

      <EditOrganizationModal
        organization={editingOrg}
        setOrganization={setEditingOrg}
        onSuccess={refetch}
      />

      <DeleteOrganizationModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        onSuccess={refetch}
      />

      <div className="space-y-2">
        <h2 className="text-muted-foreground mb-4 text-sm font-medium tracking-wider uppercase">
          Your Organizations
        </h2>

        {isPending ? (
          <div className="text-muted-foreground py-12 text-center text-sm">
            Loading organizations...
          </div>
        ) : !orgs?.length ? (
          <Card className="py-16 text-center">
            <CardContent>
              <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                <Building2 className="text-primary size-5" />
              </div>
              <h3 className="mb-1 font-medium">No organizations yet</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Create your first organization to get started.
              </p>
              <Button onClick={() => setShowCreate(true)} className="gap-1.5">
                <PlusCircle className="size-4" />
                New Organization
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {orgs.map((org) => (
              <div
                key={org.id}
                className="bg-card ring-foreground/10 hover:ring-primary/20 group flex h-full items-center gap-4 rounded-xl p-4 ring-1 transition-all"
              >
                <Link href={`/org/${org.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{org.name}</div>
                    <div className="text-muted-foreground truncate text-xs">{org.slug}</div>
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => {
                      setEditingOrg({
                        id: org.id,
                        name: org.name,
                        slug: org.slug,
                      });
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive size-8"
                    onClick={() => {
                      setDeleteTarget({ id: org.id, name: org.name });
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <Link href={`/org/${org.slug}`} className="shrink-0">
                  <ChevronRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
