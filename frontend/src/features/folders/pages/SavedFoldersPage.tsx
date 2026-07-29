import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FolderIcon, Images, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageFeedback } from "@/components/shared/PageFeedback";
import { Button } from "@/components/ui/button";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
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
  const { data: currentUser } = useCurrentUserQuery();
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

  if (foldersQuery.isPending) {
    return <PageFeedback>Carregando suas pastas...</PageFeedback>;
  }

  if (foldersQuery.isError) {
    return (
      <PageFeedback variant="error">{foldersQuery.error.message}</PageFeedback>
    );
  }

  const folders = foldersQuery.data.data;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold text-muted-foreground">
          Sua biblioteca
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Suas ideias salvas
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Organize suas pastas e remova Pins que não quer mais guardar.
        </p>
      </header>

      {folders.length === 0 ? (
        <section className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/30 px-6 text-center">
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
        <section aria-labelledby="folders-heading">
          <h2 id="folders-heading" className="mb-4 text-xl font-bold">
            Todas as pastas
          </h2>
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      {folder.pinCount} {folder.pinCount === 1 ? "Pin" : "Pins"}
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
