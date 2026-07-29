import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FolderIcon, Images, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageFeedback } from "@/components/shared/PageFeedback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { CreatedPinsSection } from "@/features/pins/components/CreatedPinsSection";
import {
  folderQueryKey,
  folderService,
  type Folder,
} from "../services/folderService";

function FolderCover({ folder }: { folder: Folder }) {
  const previews = folder.previewPins ?? [];

  if (previews.length === 0) {
    return (
      <div className="flex aspect-4/3 items-center justify-center bg-muted">
        <FolderIcon
          aria-hidden="true"
          className="size-12 text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <div className="grid aspect-4/3 grid-cols-2 grid-rows-2 gap-px overflow-hidden bg-border">
      {Array.from({ length: 4 }, (_, index) => {
        const pin = previews[index];
        return pin ? (
          <img
            key={pin.id}
            src={pin.pathImage}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <span key={`empty-${index}`} className="bg-muted" />
        );
      })}
    </div>
  );
}

export function SavedFoldersPage() {
  const queryClient = useQueryClient();
  const [folderPendingDeletion, setFolderPendingDeletion] = useState<Folder>();
  const [activeTab, setActiveTab] = useState<"created" | "saved">("saved");
  const {
    data: currentUser,
    isError: isCurrentUserError,
    isPending: isCurrentUserPending,
  } = useCurrentUserQuery();
  const logout = useLogout();
  const queryKey = folderQueryKey(currentUser?.id);
  const foldersQuery = useQuery({
    queryKey,
    queryFn: ({ signal }) => folderService.getMine(signal),
    enabled: Boolean(currentUser),
  });
  const deleteMutation = useMutation({
    mutationFn: folderService.delete,
    onSuccess: async () => {
      setFolderPendingDeletion(undefined);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: ["pins"] }),
      ]);
    },
  });

  if (isCurrentUserPending) {
    return <PageFeedback>Carregando sua conta...</PageFeedback>;
  }

  if (isCurrentUserError || !currentUser) {
    return (
      <PageFeedback variant="error">
        Não foi possível carregar sua conta.
      </PageFeedback>
    );
  }

  const folders = foldersQuery.data?.data ?? [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <header className="mx-auto flex max-w-2xl flex-col items-center text-center md:hidden">
        <Avatar className="size-24 ring-1 ring-border sm:size-28">
          <AvatarImage src={currentUser.pathImageUser} alt="" />
          <AvatarFallback className="bg-slate-500 text-3xl text-white">
            {currentUser.name.trim().charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {currentUser.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentUser.email}
        </p>
        {!currentUser.readOnly && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <UserMenu onLogout={logout} triggerMode="edit" />
          </div>
        )}
      </header>

      <div
        role="tablist"
        aria-label="Conteúdo da conta"
        className="mt-8 flex justify-center gap-7 border-b md:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "created"}
          className={`border-b-2 px-1 py-3 text-sm font-bold ${
            activeTab === "created"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setActiveTab("created")}
        >
          Criados
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "saved"}
          className={`border-b-2 px-1 py-3 text-sm font-bold ${
            activeTab === "saved"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Salvos
        </button>
      </div>

      {activeTab === "created" && (
        <div className="mt-6 md:hidden">
          <CreatedPinsSection
            userId={currentUser.id}
            readOnly={currentUser.readOnly}
            showHeader={false}
          />
        </div>
      )}

      <div className={activeTab === "saved" ? "block" : "hidden md:block"}>
        {foldersQuery.isPending ? (
          <PageFeedback>Carregando suas pastas...</PageFeedback>
        ) : foldersQuery.isError ? (
          <PageFeedback variant="error">
            {foldersQuery.error.message}
          </PageFeedback>
        ) : folders.length === 0 ? (
          <section className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/30 px-6 text-center md:mt-2">
            <Images
              aria-hidden="true"
              className="mb-4 size-10 text-muted-foreground"
            />
            <h2 className="text-xl font-bold">Nenhuma pasta criada</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Use o botão Salvar em qualquer Pin para criar sua primeira pasta.
            </p>
          </section>
        ) : (
          <section aria-labelledby="folders-heading" className="mt-6 md:mt-2">
            <h2 id="folders-heading" className="mb-4 text-xl font-bold">
              Todas as pastas
            </h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
              {folders.map((folder) => (
                <article key={folder.id} className="group relative min-w-0">
                  <Link
                    to="/saved/$folderId"
                    params={{ folderId: folder.id }}
                    className="block overflow-hidden rounded-3xl bg-muted outline-none ring-offset-2 transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Abrir pasta ${folder.name}`}
                  >
                    <FolderCover folder={folder} />
                  </Link>
                  <div className="mt-3 flex items-start gap-2 px-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold">
                        {folder.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {folder.pinCount}{" "}
                        {folder.pinCount === 1 ? "Pin" : "Pins"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Excluir pasta ${folder.name}`}
                      title="Excluir pasta"
                      disabled={
                        deleteMutation.isPending &&
                        deleteMutation.variables === folder.id
                      }
                      onClick={() => {
                        deleteMutation.reset();
                        setFolderPendingDeletion(folder);
                      }}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {deleteMutation.isError && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {deleteMutation.error.message}
        </p>
      )}

      <ConfirmDialog
        open={Boolean(folderPendingDeletion)}
        title="Excluir esta pasta?"
        description={`A pasta “${folderPendingDeletion?.name ?? ""}” será excluída, mas os Pins continuarão disponíveis no feed.`}
        confirmLabel="Excluir pasta"
        busy={deleteMutation.isPending}
        errorMessage={
          deleteMutation.isError ? deleteMutation.error.message : undefined
        }
        onCancel={() => setFolderPendingDeletion(undefined)}
        onConfirm={() => {
          if (folderPendingDeletion) {
            deleteMutation.mutate(folderPendingDeletion.id);
          }
        }}
      />
    </main>
  );
}
