import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full py-6 px-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary-foreground">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <span className="font-bold text-lg">FeatureFlagHub</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
