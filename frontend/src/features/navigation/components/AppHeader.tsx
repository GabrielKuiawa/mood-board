import type { ReactNode } from "react";
import { SearchBar } from "@/features/search/components/SearchBar";

type AppHeaderProps = {
  userMenu: ReactNode;
};

export function AppHeader({ userMenu }: AppHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden h-16 border-b bg-white/95 px-3 backdrop-blur-sm md:left-17 md:flex md:border-b-0 md:bg-background/95 md:px-4">
      <div className="flex h-full w-full items-center gap-3">
        <SearchBar />

        {userMenu}
      </div>
    </header>
  );
}
