import Link from "next/link";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { LoginForm } from "@/components/forms/LoginForm";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full max-w-4xl">
      <div className="ring-border bg-card flex overflow-hidden rounded-2xl shadow-sm ring-1">
        <div className="flex-1 p-10">
        {/* Left: Form */}
          <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Sign in to manage your feature flags.
          </p>
          <LoginForm />
        </div>

        {/* Right: Feature highlights */}
        <FeatureHighlights />
      </div>

      {/* Bottom: Sign up link */}
      <p className="text-muted-foreground mt-8 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
