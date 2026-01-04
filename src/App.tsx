import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrentUser } from "./hooks/useUsers";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Friends from "./pages/Friends";
import { UserSwitcher } from "./components/common/UserSwitcher";
import { ThemeProvider } from "./providers";
import { ThemeToggle } from "./components/common";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type Tab = "dashboard" | "feed" | "friends";

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Goals</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserSwitcher />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === "dashboard"
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Goals
            </button>
            <button
              onClick={() => setActiveTab("feed")}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === "feed"
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === "friends"
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Friends
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard userId={currentUser.id} />}
        {activeTab === "feed" && <Feed userId={currentUser.id} />}
        {activeTab === "friends" && <Friends userId={currentUser.id} />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
