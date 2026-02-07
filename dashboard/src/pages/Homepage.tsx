import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  User,
  Coins,
  ArrowLeftRight,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Github,
  Wallet,
  CircleDollarSign,
  Layers,
  Zap,
  ChevronRight,
  AtSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";

interface Feature {
  icon: typeof User;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: User,
    title: "ENS Name Resolution",
    description:
      "Send to human-readable addresses like dad.eth or mom.eth instead of complex hex addresses",
  },
  {
    icon: Coins,
    title: "Unified USDC Balance",
    description:
      "Circle Gateway provides single balance view across Ethereum, Arbitrum, and Base",
  },
  {
    icon: ArrowLeftRight,
    title: "Smart Swap Routing",
    description:
      "Automatically routes through Uniswap v4 or LI.FI for best execution and lowest fees",
  },
  {
    icon: Users,
    title: "N-of-M Approvals",
    description:
      "Require multiple family members to approve large transactions via Discord reactions",
  },
  {
    icon: MessageSquare,
    title: "Discord Native",
    description:
      "Manage your treasury with simple chat commands - no complex UI to learn",
  },
  {
    icon: TrendingUp,
    title: "Price Monitoring",
    description:
      "Real-time ETH price tracking via Uniswap v3 subgraph on The Graph network",
  },
];

interface Integration {
  icon: typeof User;
  name: string;
  description: string;
  useCase: string;
  bounty?: string;
}

const integrations: Integration[] = [
  {
    icon: CircleDollarSign,
    name: "Circle Gateway",
    description:
      "Chain-abstracted USDC with instant cross-chain transfers in under 500ms. One balance across Ethereum, Arbitrum, and Base.",
    useCase: "Cross-chain USDC",
    bounty: "$5,000",
  },
  {
    icon: ArrowLeftRight,
    name: "Uniswap",
    description:
      "Same-chain token swaps with real-time price data from The Graph decentralized network. Fastest and cheapest for on-chain trades.",
    useCase: "Same-chain swaps",
    bounty: "$5,000",
  },
  {
    icon: Layers,
    name: "LI.FI",
    description:
      "Cross-chain swaps with automatic bridge routing. Finds the best path across chains and tokens in a single transaction.",
    useCase: "Cross-chain swaps",
    bounty: "$2,000",
  },
  {
    icon: AtSign,
    name: "ENS",
    description:
      "Human-readable names for wallets and contracts. Send to dad.eth instead of 0x addresses.",
    useCase: "Name resolution",
  },
];

const steps = [
  {
    number: "1",
    label: "You say",
    text: '"Swap 1 USDC to ETH on Arbitrum"',
  },
  {
    number: "2",
    label: "Agent routes",
    text: "Picks Uniswap, LI.FI, or Circle",
  },
  {
    number: "3",
    label: "Executed on-chain",
    text: "Transaction confirmed in seconds",
  },
];

function FadeInSection({ children, id }: { children: React.ReactNode; id?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

export function Homepage() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        {/* Content */}
        <div className="container relative z-10 text-center space-y-8 py-20 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Treasury Management for
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Families & Teams
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Just chat. The AI handles the complexity. Chain-abstracted,
            Discord-native treasury management built for EthGlobal HackMoney
            2026.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base">
              <Link to="/dashboard">
                <Wallet className="mr-2 h-5 w-5" />
                Launch Dashboard
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
              className="text-base"
            >
              View Features
            </Button>
          </div>

          {/* Status badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            All systems operational
          </div>
        </div>
      </section>

      {/* How It Works */}
      <FadeInSection>
        <section className="py-16 sm:py-20 border-b border-border/50">
          <div className="container space-y-10 px-4">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Chat naturally. The agent handles routing, execution, and
                settlement.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 max-w-4xl mx-auto">
              {steps.map((step, i) => (
                <div key={step.number} className="contents">
                  <div className="flex flex-col items-center text-center gap-3 flex-1 max-w-xs">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                      {step.number}
                    </div>
                    <div>
                      <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                        {step.label}
                      </p>
                      <p className="text-base mt-1">{step.text}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight className="hidden md:block h-6 w-6 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Features Section */}
      <FadeInSection id="features">
        <section className="py-16 sm:py-20 md:py-24">
          <div className="container space-y-12 px-4">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything you need for treasury management
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Built with best-in-class Web3 infrastructure
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-2 hover:border-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Partner Integrations */}
      <FadeInSection>
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-accent/5 via-background to-primary/5">
          <div className="container space-y-12 px-4">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Powered by best-in-class infrastructure
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Four partner integrations targeting $12,000 in bounty prizes
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {integrations.map((integration) => {
                const Icon = integration.icon;
                return (
                  <Card
                    key={integration.name}
                    className="border-2 border-primary/20 hover:border-primary transition-all duration-300 relative overflow-hidden"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {integration.bounty && (
                          <Badge variant="secondary" className="text-xs font-bold">
                            {integration.bounty}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {integration.name}
                        </CardTitle>
                        <CardDescription className="text-sm mt-2">
                          {integration.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        {integration.useCase}
                      </Badge>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Final CTA Section */}
      <FadeInSection>
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container text-center space-y-8 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Ready to simplify your treasury?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join families and teams managing crypto the easy way
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <a
                  href="https://github.com/smartpiggies/treasury-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                EthGlobal HackMoney 2026
              </Badge>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Footer */}
      <Footer />
    </>
  );
}
