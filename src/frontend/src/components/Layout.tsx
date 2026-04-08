import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings } from "@/lib/storage";
import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Menu, Moon, Shield, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => getSettings().darkMode);
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    const settings = getSettings();
    saveSettings({ ...settings, darkMode: dark });
  }, [dark]);

  // Initialise dark mode on mount
  useEffect(() => {
    const s = getSettings();
    if (s.darkMode) document.documentElement.classList.add("dark");
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  const currentPath = router.state.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-lg text-foreground hover:text-primary transition-colors"
            data-ocid="nav-brand"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="tracking-tight hidden sm:block">RecruitIQ</span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            data-ocid="nav-desktop"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden md:flex"
              data-ocid="nav-dashboard-btn"
            >
              <Button variant="ghost" size="icon" aria-label="Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDark((d) => !d)}
              data-ocid="nav-theme-toggle"
            >
              {dark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            {/* Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
              data-ocid="nav-hamburger"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1"
            data-ocid="nav-mobile-menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Separator className="mb-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-display font-semibold text-foreground">
                RecruitIQ
              </span>
            </div>
            <p className="text-center italic text-xs">
              Practice makes perfect. Train hard, serve well.
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Built with love using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
