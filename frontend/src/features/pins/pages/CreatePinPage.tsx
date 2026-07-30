import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, ImagePlus, Upload } from "lucide-react";
import { useState } from "react";
import type { DragEvent, FormEvent } from "react";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  folderQueryKey,
  folderService,
} from "@/features/folders/services/folderService";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { useImageFileInput } from "@/hooks/useImageFileInput";
import { cn } from "@/lib/utils";
import { pinService } from "../services/pinService";

export function CreatePinPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [folderIds, setFolderIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { data: currentUser } = useCurrentUserQuery();
  const createPinMutation = useMutation({
    mutationFn: pinService.create,
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({ queryKey: ["pins"] });
      await navigate({
        to: "/pins/$pinId",
        params: { pinId: data.id },
      });
    },
  });
  const imageInput = useImageFileInput({
    onSelectionChange: createPinMutation.reset,
    requiredMessage: "Adicione uma imagem para criar o Pin.",
  });
  const foldersQuery = useQuery({
    queryKey: folderQueryKey(currentUser?.id),
    queryFn: ({ signal }) => folderService.getMine(signal),
    enabled: Boolean(currentUser),
  });

  const toggleFolder = (folderId: string) => {
    setFolderIds((selectedIds) =>
      selectedIds.includes(folderId)
        ? selectedIds.filter((id) => id !== folderId)
        : [...selectedIds, folderId],
    );
    createPinMutation.reset();
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    imageInput.selectFile(event.dataTransfer.files[0] ?? null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const image = imageInput.getRequiredFile();
    if (!image) return;

    createPinMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      image,
      folderIds,
    });
  };

  const error =
    imageInput.error ??
    (createPinMutation.error instanceof Error
      ? createPinMutation.error.message
      : null);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-9">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex items-end justify-between gap-3 sm:mb-7 sm:items-center sm:gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Nova inspiração
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Criar Pin
            </h1>
          </div>
          <LoadingButton
            type="submit"
            className="h-11 px-5 sm:h-12 sm:px-7"
            isLoading={createPinMutation.isPending}
            loadingLabel="Publicando..."
          >
            Publicar
          </LoadingButton>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(280px,0.85fr)_minmax(360px,1.15fr)] lg:gap-10">
          <div>
            <label
              htmlFor="pin-image"
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "group relative flex min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-muted/70 p-5 text-center outline-none transition-colors hover:border-primary/50 hover:bg-secondary/60 focus-within:border-primary focus-within:ring-4 focus-within:ring-ring/15 sm:min-h-105 sm:rounded-4xl sm:p-6",
                isDragging && "border-primary bg-secondary",
                imageInput.previewUrl && "border-solid bg-black",
              )}
            >
              <input
                id="pin-image"
                name="image"
                type="file"
                accept={imageInput.accept}
                onChange={imageInput.onChange}
                className="sr-only"
              />

              {imageInput.previewUrl ? (
                <>
                  <img
                    src={imageInput.previewUrl}
                    alt="Prévia do Pin"
                    className="absolute inset-0 size-full object-contain"
                  />
                  <span className="absolute right-4 bottom-4 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    Trocar imagem
                  </span>
                </>
              ) : (
                <>
                  <span className="flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg">
                    <Upload aria-hidden="true" className="size-6" />
                  </span>
                  <span className="mt-5 text-lg font-bold">
                    Escolha uma imagem
                  </span>
                  <span className="mt-1 max-w-60 text-sm leading-6 text-muted-foreground">
                    ou arraste e solte aqui
                  </span>
                  <span className="mt-12 max-w-68 text-xs leading-5 text-muted-foreground">
                    JPEG, PNG ou WebP com até 10 MB.
                  </span>
                </>
              )}
            </label>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="pin-title"
                className="mb-2 block text-sm font-semibold"
              >
                Título
              </label>
              <Input
                id="pin-title"
                name="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  createPinMutation.reset();
                }}
                placeholder="Dê um nome para sua ideia"
                className="h-14 rounded-2xl bg-card px-5 text-base shadow-sm"
                maxLength={150}
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="pin-description"
                className="mb-2 block text-sm font-semibold"
              >
                Descrição
              </label>
              <textarea
                id="pin-description"
                name="description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  createPinMutation.reset();
                }}
                placeholder="Conte o que torna este Pin especial"
                className="min-h-36 w-full resize-y rounded-3xl border border-input bg-card px-5 py-4 text-sm leading-6 shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                maxLength={500}
                required
              />
              <p className="mt-1.5 text-right text-xs text-muted-foreground">
                {description.length}/500
              </p>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">
                Pastas{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </legend>

              {foldersQuery.isPending ? (
                <div className="h-20 animate-pulse rounded-3xl bg-muted" />
              ) : foldersQuery.isError ? (
                <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  Não foi possível carregar suas pastas.
                </p>
              ) : foldersQuery.data.data.length > 0 ? (
                <div className="flex flex-wrap gap-2 rounded-3xl border bg-card p-3 shadow-sm">
                  {foldersQuery.data.data.map((folder) => {
                    const isSelected = folderIds.includes(folder.id);
                    return (
                      <Button
                        key={folder.id}
                        type="button"
                        size="sm"
                        variant={isSelected ? "default" : "ghost"}
                        aria-pressed={isSelected}
                        onClick={() => toggleFolder(folder.id)}
                      >
                        {isSelected && <Check aria-hidden="true" />}
                        {folder.name}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-3xl border bg-card p-4 text-sm text-muted-foreground shadow-sm">
                  <ImagePlus aria-hidden="true" className="size-5 shrink-0" />
                  Você ainda não possui pastas. O Pin será salvo sem uma.
                </div>
              )}
            </fieldset>

            {error && (
              <Alert className="border-destructive/30 bg-destructive/5 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}
