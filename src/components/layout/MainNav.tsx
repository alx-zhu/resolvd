import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "py-4 px-1 border-b-2 transition-colors",
      isActive
        ? "border-primary text-foreground font-medium"
        : "border-transparent text-muted-foreground hover:text-foreground"
    );

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          <NavLink to="/" className={linkClass}>
            My Goals
          </NavLink>
          <NavLink to="/activity" className={linkClass}>
            Activity
          </NavLink>
          <NavLink to="/friends" className={linkClass}>
            Friends
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
