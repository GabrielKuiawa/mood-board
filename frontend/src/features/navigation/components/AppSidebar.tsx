import { Link } from "@tanstack/react-router";
import {
  CircleAlert,
  Home,
  Images,
  LibraryBig,
  LockKeyhole,
  Search,
  SquarePlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/shared/Brand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { clearAuthToken } from "@/lib/authTokenStorage";

export function AppSidebar() {
  const { data: user } = useCurrentUserQuery();
  const isDemoAccount = user?.readOnly === true;
  const [isDemoNoticeOpen, setIsDemoNoticeOpen] = useState(true);

  return (
    <aside
      aria-label="Barra lateral"
      className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(4.25rem+env(safe-area-inset-bottom))] items-start border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:inset-y-0 md:right-auto md:h-auto md:w-17 md:flex-col md:items-center md:border-t-0 md:border-r md:bg-background md:pb-0"
    >
      <div className="hidden h-16 shrink-0 items-center justify-center md:flex">
        <Brand
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          labelClassName="sr-only"
          logoClassName="size-8"
        />
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex h-17 w-full items-center justify-around px-2 md:mt-1 md:h-auto md:flex-col md:justify-start md:gap-3 md:px-0"
      >
        <Link
          to="/feed"
          aria-label="Início"
          activeProps={{
            className: "text-foreground md:bg-foreground md:text-background",
          }}
          inactiveProps={{
            className:
              "text-muted-foreground hover:bg-accent hover:text-foreground md:bg-background md:text-foreground",
          }}
          className="flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring md:size-12 md:flex-none md:rounded-full"
          title="Início"
        >
          <Home aria-hidden="true" className="size-5.5" strokeWidth={2.2} />
          <span className="md:sr-only">Início</span>
        </Link>

        <Link
          to="/search"
          aria-label="Pesquisar"
          activeProps={{
            className: "text-foreground",
          }}
          inactiveProps={{
            className:
              "text-muted-foreground hover:bg-accent hover:text-foreground",
          }}
          className="flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          <Search aria-hidden="true" className="size-6" strokeWidth={2.2} />
          <span>Pesquisar</span>
        </Link>

        <Link
          to="/saved"
          aria-label="Ideias salvas"
          activeProps={{
            className: "text-foreground md:bg-foreground md:text-background",
          }}
          inactiveProps={{
            className:
              "text-muted-foreground hover:bg-accent hover:text-foreground md:bg-background md:text-foreground",
          }}
          className="group relative order-4 flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring md:order-none md:size-12 md:flex-none md:rounded-full"
        >
          <Avatar className="size-7 md:hidden">
            <AvatarImage src={user?.pathImageUser} alt="" />
            <AvatarFallback className="bg-slate-500 text-[10px] text-white">
              {user?.name.trim().charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <LibraryBig
            aria-hidden="true"
            className="hidden size-6 md:block"
            strokeWidth={2.2}
          />
          <span className="md:sr-only">Salvos</span>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 hidden rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
          >
            Salvos
          </span>
        </Link>

        <Link
          to="/my-pins"
          aria-label="Meus Pins"
          activeProps={{
            className: "text-foreground md:bg-foreground md:text-background",
          }}
          inactiveProps={{
            className:
              "text-muted-foreground hover:bg-accent hover:text-foreground md:bg-background md:text-foreground",
          }}
          className="group relative hidden outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring md:flex md:size-12 md:flex-none md:items-center md:justify-center md:rounded-full"
        >
          <Images aria-hidden="true" className="size-6" strokeWidth={2.2} />
          <span className="md:sr-only">Meus Pins</span>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 hidden rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
          >
            Meus Pins
          </span>
        </Link>

        {isDemoAccount ? (
          <span
            aria-label="Criar Pin indisponível na conta demo"
            aria-disabled="true"
            className="group relative order-3 flex h-16 min-w-0 flex-1 cursor-not-allowed flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-muted-foreground md:order-none md:size-12 md:flex-none md:rounded-full md:bg-muted"
          >
            <LockKeyhole
              aria-hidden="true"
              className="size-5.5"
              strokeWidth={2.2}
            />
            <span className="md:sr-only">Criar</span>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 hidden rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block"
            >
              Indisponível na conta demo
            </span>
          </span>
        ) : (
          <Link
            to="/create"
            aria-label="Criar Pin"
            activeProps={{
              className: "text-foreground md:bg-foreground md:text-background",
            }}
            inactiveProps={{
              className:
                "text-muted-foreground hover:bg-accent hover:text-foreground md:bg-background md:text-foreground",
            }}
            className="group relative order-3 flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring md:order-none md:size-12 md:flex-none md:rounded-full"
          >
            <SquarePlus
              aria-hidden="true"
              className="size-6"
              strokeWidth={2.2}
            />
            <span className="md:sr-only">Criar</span>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-[calc(100%+0.7rem)] z-50 hidden rounded-lg bg-foreground px-3 py-2 text-xs font-semibold whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
            >
              Criar
            </span>
          </Link>
        )}
      </nav>

      {isDemoAccount && isDemoNoticeOpen && (
        <section
          aria-label="Aviso da conta demo"
          className="fixed right-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] left-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-lg md:absolute md:right-auto md:bottom-4 md:left-[calc(100%+0.75rem)] md:w-72"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar aviso da conta demo"
            className="absolute top-2 right-2 size-8 text-amber-950 hover:bg-amber-200 hover:text-amber-950"
            onClick={() => setIsDemoNoticeOpen(false)}
          >
            <X aria-hidden="true" />
          </Button>
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-200">
              <CircleAlert aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0 pr-6">
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
