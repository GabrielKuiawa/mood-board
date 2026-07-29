import { Link } from "@tanstack/react-router";
import {
  CircleAlert,
  Home,
  Images,
  LibraryBig,
  LockKeyhole,
  SquarePlus,
} from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { Button } from "@/components/ui/button";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { clearAuthToken } from "@/lib/authTokenStorage";

export function AppSidebar() {
  const { data: user } = useCurrentUserQuery();
  const isDemoAccount = user?.readOnly === true;

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
          to="/my-pins"
          aria-label="Meus Pins"
          activeProps={{
            className: "bg-foreground text-background",
          }}
          inactiveProps={{
            className: "bg-background text-foreground hover:bg-accent",
          }}
          className="group relative flex size-12 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Images aria-hidden="true" className="size-6" strokeWidth={2.2} />
          <span
            role="tooltip"
            className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Meus Pins
          </span>
        </Link>

        {isDemoAccount ? (
          <span
            aria-label="Criar Pin indisponível na conta demo"
            aria-disabled="true"
            className="group relative flex size-12 cursor-not-allowed items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <LockKeyhole
              aria-hidden="true"
              className="size-5.5"
              strokeWidth={2.2}
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
            >
              Indisponível na conta demo
            </span>
          </span>
        ) : (
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
            <SquarePlus
              aria-hidden="true"
              className="size-6"
              strokeWidth={2.2}
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Criar
            </span>
          </Link>
        )}
      </nav>

      {isDemoAccount && (
        <section
          aria-label="Aviso da conta demo"
          className="absolute bottom-4 left-[calc(100%+0.75rem)] w-[min(18rem,calc(100vw-5.5rem))] rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-lg"
        >
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-200">
              <CircleAlert aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-sm font-bold">
                Você está em uma conta demo
              </h2>
              <p className="mt-1 text-xs leading-5 text-amber-900">
                Esta conta é somente para visualização. Não é possível alterar
                dados, salvar ideias ou publicar Pins.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="mt-3 w-full bg-amber-950 text-amber-50 hover:bg-amber-900"
          >
            <Link to="/signup" onClick={clearAuthToken}>
              Criar minha conta
            </Link>
          </Button>
        </section>
      )}
    </aside>
  );
}
