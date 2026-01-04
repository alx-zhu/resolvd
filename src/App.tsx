import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrentUser } from "./hooks/useUsers";
import Dashboard from "./pages/Dashboard";
import GoalDetail from "./pages/GoalDetail";
import Activity from "./pages/Activity";
import Friends from "./pages/Friends";
import { UserSwitcher } from "./components/common/UserSwitcher";
import { ThemeProvider } from "./providers";
import { ThemeToggle } from "./components/common";
import { MainNav } from "./components/layout/MainNav";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
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
      <MainNav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard userId={currentUser.id} />} />
          <Route
            path="/goals/:goalId"
            element={<GoalDetail userId={currentUser.id} />}
          />
          <Route
            path="/activity"
            element={<Activity userId={currentUser.id} />}
          />
          <Route
            path="/friends"
            element={<Friends userId={currentUser.id} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
