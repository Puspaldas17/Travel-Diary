import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Trips from "./pages/Trips";
import { Plane } from "lucide-react";

// Persist QueryClient across HMR to prevent tearing during remounts
const queryClient: QueryClient = (window as any).__rq || new QueryClient();
(window as any).__rq = queryClient;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Plane className="h-4 w-4" />
            </span>
            <span>Natpac TravelLog</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/trips"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }
            >
              Trips
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t text-sm text-muted-foreground">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            &copy; {new Date().getFullYear()} NATPAC. For research and planning
            use.
          </p>
          <p>Privacy-first. Data stored locally with optional sync.</p>
        </div>
      </footer>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/trips"
            element={
              <Layout>
                <Trips />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
// Reuse root across HMR to avoid double createRoot
let root = (window as any).__app_root;
if (!root) {
  root = createRoot(container);
  (window as any).__app_root = root;
}
root.render(<App />);
