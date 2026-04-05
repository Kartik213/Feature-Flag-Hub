import Link from "next/link";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full max-w-4xl">
      <div className="ring-border bg-card flex overflow-hidden rounded-2xl shadow-sm ring-1">
        {/* Left: Form */}
        <div className="flex-1 p-10">
          <h1 className="mb-1 text-2xl font-bold">Start your free account</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Ship features safely with gradual rollouts.
          </p>
          <RegisterForm />
        </div>

        {/* Right: Feature highlights */}
        <FeatureHighlights />
      </div>

      {/* Bottom: Sign in link */}
      <p className="text-muted-foreground mt-8 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
