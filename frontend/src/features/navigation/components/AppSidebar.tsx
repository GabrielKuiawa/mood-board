import { Link } from "@tanstack/react-router";
import { Home, LibraryBig, SquarePlus } from "lucide-react";
import { Brand } from "@/components/shared/Brand";

export function AppSidebar() {
  return (
    <aside
      aria-label="Barra lateral"
      className="fixed inset-y-0 left-0 z-50 flex w-17 flex-col items-center border-r bg-background"
    >
      <div className="flex h-16 shrink-0 items-center justify-center">
        <Brand
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          labelClassName="sr-only"
          logoClassName="size-8"
        />
      </div>

      <nav
        aria-label="Navegação principal"
        className="mt-1 flex flex-col items-center gap-3"
      >
        <Link
          to="/feed"
          aria-label="Início"
          activeProps={{
            className: "bg-foreground text-background",
          }}
          inactiveProps={{
            className: "bg-background text-foreground hover:bg-accent",
          }}
          className="flex size-12 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          title="Início"
        >
          <Home aria-hidden="true" className="size-5.5" strokeWidth={2.2} />
        </Link>

        <Link
          to="/saved"
          aria-label="Ideias salvas"
          activeProps={{
            className: "bg-foreground text-background",
          }}
          inactiveProps={{
            className: "bg-background text-foreground hover:bg-accent",
          }}
          className="group relative flex size-12 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LibraryBig aria-hidden="true" className="size-6" strokeWidth={2.2} />
          <span
            role="tooltip"
            className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Salvos
          </span>
        </Link>

        <Link
          to="/create"
          aria-label="Criar Pin"
          activeProps={{
            className: "bg-foreground text-background",
          }}
          inactiveProps={{
            className: "bg-background text-foreground hover:bg-accent",
          }}
          className="group relative flex size-12 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SquarePlus aria-hidden="true" className="size-6" strokeWidth={2.2} />
          <span
            role="tooltip"
            className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Criar
          </span>
        </Link>
      </nav>
    </aside>
  );
}
