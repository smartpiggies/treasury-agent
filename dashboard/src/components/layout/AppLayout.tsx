import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  History,
  Settings,
  PiggyBank,
  Menu,
} from "lucide-react";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/history", label: "History", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
            <PiggyBank className="h-5 w-5" />
            <span>PigAIBank</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex ml-8 items-center gap-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === path
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile navigation dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden ml-auto mr-4">
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navItems.map(({ path, label, icon: Icon }) => (
                <DropdownMenuItem key={path} asChild>
                  <Link
                    to={path}
                    className={cn(
                      "flex items-center gap-2 w-full cursor-pointer",
                      location.pathname === path && "bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto md:ml-auto flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
