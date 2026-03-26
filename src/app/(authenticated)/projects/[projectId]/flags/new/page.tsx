"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CreateFlagForm } from "@/components/forms/CreateFlagForm";

export default function CreateFlagPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

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

      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create Feature Flag</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Define a new feature flag for this project
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="pt-6">
              <CreateFlagForm
                projectId={projectId}
                onSuccess={() => router.push(`/projects/${projectId}`)}
                onCancel={() => router.push(`/projects/${projectId}`)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <h3 className="mb-3 text-[13px] font-semibold">Tips & Best Practices</h3>
              <ul className="text-muted-foreground marker:text-primary ml-4 list-disc space-y-3 text-[12px]">
                <li>
                  Use <strong>snake_case</strong> for flag names to ensure compatibility across
                  different SDKs.
                </li>
                <li>
                  Start with a <strong>0% rollout</strong> and <strong>disabled</strong> status if
                  you're still deploying the code.
                </li>
                <li>
                  Group related flags using prefixes (e.g., <code>v2_</code>, <code>beta_</code>).
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10 border shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-primary mb-2 text-[13px] font-semibold">Need Help?</h3>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                Feature flags allow you to decouple deployment from release. Check our documentation
                to learn more about advanced targeting and rollout strategies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
