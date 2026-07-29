import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, getRouteApi, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FolderOpen, Trash2, X } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageFeedback } from "@/components/shared/PageFeedback";
import { Button } from "@/components/ui/button";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import {
  folderDetailsQueryKey,
  folderQueryKey,
  folderService,
  type FolderDetails,
} from "../services/folderService";

const route = getRouteApi("/authenticated/saved/$folderId");

type DeletionTarget =
  { type: "folder"; name: string } | { type: "pin"; id: string; title: string };

export function FolderDetailsPage() {
  const { folderId } = route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserQuery();
  const [deletionTarget, setDeletionTarget] = useState<DeletionTarget>();
  const detailsQueryKey = folderDetailsQueryKey(folderId);
  const folderListQueryKey = folderQueryKey(currentUser?.id);
  const folderQuery = useQuery({
    queryKey: detailsQueryKey,
    queryFn: ({ signal }) => folderService.getById(folderId, signal),
  });
  const removePinMutation = useMutation({
    mutationFn: (pinId: string) => folderService.removePin(folderId, pinId),
    onSuccess: (_data, pinId) => {
      setDeletionTarget(undefined);
      queryClient.setQueryData<FolderDetails>(
        detailsQueryKey,
        (currentFolder) =>
          currentFolder
            ? {
                ...currentFolder,
                pinCount: currentFolder.pinCount - 1,
                pins: currentFolder.pins.filter((pin) => pin.id !== pinId),
                previewPins: currentFolder.previewPins.filter(
                  (pin) => pin.id !== pinId,
                ),
              }
            : currentFolder,
      );
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: folderListQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["pins"] }),
        queryClient.invalidateQueries({ queryKey: ["pin", pinId] }),
      ]);
    },
  });
  const deleteFolderMutation = useMutation({
    mutationFn: () => folderService.delete(folderId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: detailsQueryKey });
      await queryClient.invalidateQueries({ queryKey: folderListQueryKey });
      await navigate({ to: "/saved" });
    },
  });

  if (folderQuery.isPending) {
    return <PageFeedback>Carregando pasta...</PageFeedback>;
  }

  if (folderQuery.isError) {
    return (
      <PageFeedback variant="error">{folderQuery.error.message}</PageFeedback>
    );
  }

  const folder = folderQuery.data;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8">
      <header className="mb-7 flex flex-wrap items-center gap-3">
        <Button asChild type="button" variant="ghost" size="icon">
          <Link to="/saved" aria-label="Voltar para suas pastas">
            <ArrowLeft aria-hidden="true" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-3xl font-bold tracking-tight">
            {folder.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {folder.pinCount}{" "}
            {folder.pinCount === 1 ? "Pin salvo" : "Pins salvos"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={deleteFolderMutation.isPending}
          onClick={() => {
            deleteFolderMutation.reset();
            setDeletionTarget({ type: "folder", name: folder.name });
          }}
        >
          <Trash2 aria-hidden="true" />
          Excluir pasta
        </Button>
      </header>

      {folder.pins.length === 0 ? (
        <section className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/30 px-6 text-center">
          <FolderOpen
            aria-hidden="true"
            className="mb-4 size-10 text-muted-foreground"
          />
          <h2 className="text-xl font-bold">Esta pasta está vazia</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Salve novos Pins nela para vê-los aqui.
          </p>
        </section>
      ) : (
        <section
          aria-label={`Pins da pasta ${folder.name}`}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {folder.pins.map((pin) => (
            <article
              key={pin.id}
              className="group relative overflow-hidden rounded-3xl bg-muted"
            >
              <Link
                to="/pins/$pinId"
                params={{ pinId: pin.id }}
                aria-label={`Abrir Pin ${pin.title}`}
                className="absolute inset-0 z-10 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <img
                src={pin.pathImage}
                alt={pin.description}
                className="aspect-3/4 size-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />
              <h2 className="pointer-events-none absolute inset-x-3 bottom-3 z-20 line-clamp-2 text-sm font-semibold text-white">
                {pin.title}
              </h2>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={`Remover ${pin.title} da pasta`}
                title="Remover da pasta"
                className="absolute top-2 right-2 z-30 bg-white text-zinc-950 shadow-md hover:bg-zinc-200"
                disabled={
                  removePinMutation.isPending &&
                  removePinMutation.variables === pin.id
                }
                onClick={() => {
                  removePinMutation.reset();
                  setDeletionTarget({
                    type: "pin",
                    id: pin.id,
                    title: pin.title,
                  });
                }}
              >
                <X aria-hidden="true" />
              </Button>
            </article>
          ))}
        </section>
      )}

      {(removePinMutation.isError || deleteFolderMutation.isError) && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {removePinMutation.error?.message ??
            deleteFolderMutation.error?.message}
        </p>
      )}

      <ConfirmDialog
        open={Boolean(deletionTarget)}
        title={
          deletionTarget?.type === "folder"
            ? "Excluir esta pasta?"
            : "Remover este Pin?"
        }
        description={
          deletionTarget?.type === "folder"
            ? `A pasta “${deletionTarget.name}” será excluída, mas os Pins continuarão disponíveis no feed.`
            : `“${deletionTarget?.title ?? ""}” será removido desta pasta, mas continuará disponível no feed.`
        }
        confirmLabel={
          deletionTarget?.type === "folder" ? "Excluir pasta" : "Remover Pin"
        }
        busy={removePinMutation.isPending || deleteFolderMutation.isPending}
        errorMessage={
          removePinMutation.error?.message ??
          deleteFolderMutation.error?.message
        }
        onCancel={() => setDeletionTarget(undefined)}
        onConfirm={() => {
          if (deletionTarget?.type === "folder") {
            deleteFolderMutation.mutate();
          } else if (deletionTarget?.type === "pin") {
            removePinMutation.mutate(deletionTarget.id);
          }
        }}
      />
    </main>
  );
}
