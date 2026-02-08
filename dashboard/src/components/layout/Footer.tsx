import { PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/analytics", label: "Analytics" },
  { path: "/history", label: "History" },
  { path: "/settings", label: "Settings" },
];

const resourceLinks = [
  { href: "https://docs.pigaibank.com", label: "Documentation" },
  { href: "https://github.com/smartpiggies/treasury-agent", label: "GitHub" },
];

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3.5 2.5H9.5V8.5M9.5 2.5L2.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs text-muted-foreground">
        All systems operational
      </span>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      {/* Main footer content */}
      <div className="container pt-16 pb-8">
        {/* Top section: Brand + columns */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-1 lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 hover:text-primary transition-colors">
              <PiggyBank />
              <span className="text-lg font-semibold tracking-tight">
                PigAiBank
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Chain-abstracted treasury management for families & teams. Built
              for the next generation of collaborative finance.
            </p>
            <div className="mt-6">
              <a
                href="https://smartpiggies.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <span className="text-muted-foreground">Built by</span>
                <img
                  src="/logo.svg"
                  alt="SmartPiggies"
                  className="h-5 w-auto"
                />
                <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:col-span-1 lg:col-span-8">
            {/* Navigation */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Product
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {navLinks.map(({ path, label }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Resources
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {resourceLinks.map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {label}
                      <ArrowUpRight className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-border" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} PigAIBank. All rights reserved.
            </p>
            <StatusIndicator />
          </div>

          <a
            href="https://github.com/smartpiggies/treasury-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            Open Source
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
