import ModeToggle from "@/components/mode-toggle";
import { useTheme } from "next-themes";
import ModeToggleLogo from "./mode-toggle-logo";

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center space-x-4">
          <nav className="flex items-center space-x-1">
            <ModeToggleLogo />
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end  space-x-4">
          <nav className="flex items-center space-x-1">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
