import { Link } from "react-router-dom";
import { PiggyBank } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header - absolute positioned to overlay content */}
      <header className="absolute top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <PiggyBank className="h-6 w-6" />
            <span className="text-xl">PigAiBank</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link to="/dashboard">Launch App</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content - no container constraint */}
      <main>{children}</main>
    </div>
  );
}
