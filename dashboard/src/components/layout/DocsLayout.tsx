import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  PiggyBank,
  BookOpen,
  Rocket,
  Network,
  CircleDollarSign,
  ArrowLeftRight,
  Layers,
  AtSign,
  MessageSquare,
  Users,
  LayoutDashboard,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const sidebarSections = [
  {
    label: "Getting Started",
    items: [
      { path: "/docs", label: "Overview", icon: BookOpen },
      { path: "/docs/getting-started", label: "Quick Start", icon: Rocket },
    ],
  },
  {
    label: "Architecture",
    items: [
      { path: "/docs/architecture", label: "System Design", icon: Network },
    ],
  },
  {
    label: "Integrations",
    items: [
      { path: "/docs/circle-gateway", label: "Circle Gateway", icon: CircleDollarSign },
      { path: "/docs/uniswap", label: "Uniswap", icon: ArrowLeftRight },
      { path: "/docs/lifi", label: "LI.FI", icon: Layers },
      { path: "/docs/ens", label: "ENS", icon: AtSign },
    ],
  },
  {
    label: "Reference",
    items: [
      { path: "/docs/discord-commands", label: "Discord Commands", icon: MessageSquare },
      { path: "/docs/approvals", label: "N-of-M Approvals", icon: Users },
      { path: "/docs/dashboard-guide", label: "Dashboard Guide", icon: LayoutDashboard },
    ],
  },
];


export function DocsLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
          >
            <PiggyBank className="h-5 w-5" />
            <span>PigAiBank</span>
          </Link>

          <span className="mx-3 text-border">/</span>
          <Link
            to="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Docs
          </Link>

          {/* Mobile sidebar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden ml-auto mr-4">
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Docs menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sidebarSections.map((section, i) => (
                <div key={section.label}>
                  {i > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {section.label}
                  </DropdownMenuLabel>
                  {section.items.map(({ path, label, icon: Icon }) => (
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
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                App
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-0 lg:gap-8">
        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-64 shrink-0 border-r py-8 pr-6">
          <nav className="space-y-6 sticky top-20">
            {sidebarSections.map((section) => (
              <div key={section.label} className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  {section.label}
                </p>
                {section.items.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors",
                      location.pathname === path
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            ))}

            <div className="border-t pt-4 mt-6">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to site
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-8 lg:py-10">
          <div className="max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
