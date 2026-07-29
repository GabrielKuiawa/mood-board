import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  Folder,
  FolderPlus,
  LoaderCircle,
  Lock,
  Plus,
  Search,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { cn } from "@/lib/utils";
import { folderQueryKey, folderService } from "../services/folderService";

type FolderSaveControlProps = {
  pinId: string;
  pinTitle?: string;
  pinDescription?: string;
  savedFolderIds: string[];
  variant?: "toolbar" | "overlay";
};

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase();
}

const ignoredSuggestionWords = new Set([
  "uma",
  "umas",
  "um",
  "uns",
  "com",
  "para",
  "por",
  "sob",
  "sobre",
  "durante",
  "perto",
  "entre",
  "the",
  "with",
  "from",
  "under",
  "over",
  "near",
  "during",
  "and",
  "that",
  "this",
  "its",
  "into",
  "view",
]);

function capitalize(value: string): string {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";
  return `${trimmedValue.charAt(0).toLocaleUpperCase()}${trimmedValue.slice(1).toLocaleLowerCase()}`;
}

function getSuggestionKeywords(title = "", description = ""): string[] {
  const words = `${title} ${description}`.match(/[\p{L}\p{N}]+/gu) ?? [];
  const uniqueWords = new Map<string, string>();

  for (const word of words) {
    const normalizedWord = normalizeSearch(word);
    if (
      normalizedWord.length < 3 ||
      ignoredSuggestionWords.has(normalizedWord) ||
      uniqueWords.has(normalizedWord)
    ) {
      continue;
    }
    uniqueWords.set(normalizedWord, word);
    if (uniqueWords.size === 3) break;
  }

  return [...uniqueWords.values()];
}

function getFolderSuggestions(
  title: string | undefined,
  description: string | undefined,
  search: string,
  existingFolderNames: string[],
): string[] {
  const searchedName = capitalize(search);
  const keywords = getSuggestionKeywords(title, description);
  const suggestions = searchedName
    ? [searchedName]
    : [
        keywords[0] && `Inspirações de ${capitalize(keywords[0])}`,
        keywords[1] && `Ideias de ${capitalize(keywords[1])}`,
        keywords[2] && `Referências de ${capitalize(keywords[2])}`,
      ].filter((name): name is string => Boolean(name));
  const normalizedExistingNames = new Set(
    existingFolderNames.map(normalizeSearch),
  );

  return suggestions.filter(
    (name) => !normalizedExistingNames.has(normalizeSearch(name)),
  );
}

export function FolderSaveControl({
  pinId,
  pinTitle,
  pinDescription,
  savedFolderIds,
  variant = "toolbar",
}: FolderSaveControlProps) {
  const queryClient = useQueryClient();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    left: number;
    top: number;
  }>();
  const [selectedFolderId, setSelectedFolderId] = useState<string>();
  const [localSavedFolderIds, setLocalSavedFolderIds] =
    useState(savedFolderIds);
  const [folderSearch, setFolderSearch] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { data: currentUser } = useCurrentUserQuery();

  const foldersQuery = useQuery({
    queryKey: folderQueryKey(currentUser?.id),
    queryFn: ({ signal }) => folderService.getMine(signal),
    enabled: Boolean(currentUser),
  });
  const folders = useMemo(
    () => foldersQuery.data?.data ?? [],
    [foldersQuery.data],
  );
  const filteredFolders = useMemo(() => {
    const query = normalizeSearch(folderSearch.trim());
    if (!query) return folders;
    return folders.filter((folder) =>
      normalizeSearch(folder.name).includes(query),
    );
  }, [folderSearch, folders]);
  const suggestedFolderNames = useMemo(
    () =>
      getFolderSuggestions(
        pinTitle,
        pinDescription,
        folderSearch,
        folders.map((folder) => folder.name),
      ),
    [folderSearch, folders, pinDescription, pinTitle],
  );
  const selectedFolder = folders.find(
    (folder) => folder.id === selectedFolderId,
  );
  const isSaved = selectedFolderId
    ? localSavedFolderIds.includes(selectedFolderId)
    : false;

  useEffect(() => {
    setLocalSavedFolderIds(savedFolderIds);
  }, [savedFolderIds]);

  useEffect(() => {
    if (folders.length === 0) {
      setSelectedFolderId(undefined);
      return;
    }
    if (folders.some((folder) => folder.id === selectedFolderId)) return;

    setSelectedFolderId(
      folders.find((folder) => savedFolderIds.includes(folder.id))?.id ??
        folders[0].id,
    );
  }, [folders, savedFolderIds, selectedFolderId]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPosition(undefined);
      return;
    }

    const updateMenuPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const menuWidth = Math.min(448, window.innerWidth - 16);
      const menuHeight = menuRef.current?.offsetHeight ?? 0;
      const left = Math.min(
        Math.max(8, triggerRect.left),
        window.innerWidth - menuWidth - 8,
      );
      const spaceBelow = window.innerHeight - triggerRect.bottom - 8;
      const canOpenAbove =
        menuHeight > 0 && triggerRect.top - menuHeight - 8 >= 8;
      const top =
        menuHeight > spaceBelow && canOpenAbove
          ? triggerRect.top - menuHeight - 8
          : Math.min(
              triggerRect.bottom + 8,
              window.innerHeight - menuHeight - 8,
            );

      setMenuPosition({ left, top: Math.max(8, top) });
    };

    updateMenuPosition();
    const animationFrame = window.requestAnimationFrame(updateMenuPosition);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen]);

  const refreshData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["pins"] }),
      queryClient.invalidateQueries({ queryKey: ["pin", pinId] }),
      queryClient.invalidateQueries({
        queryKey: folderQueryKey(currentUser?.id),
      }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: async ({
      folderId,
      remove,
    }: {
      folderId: string;
      remove: boolean;
    }) =>
      remove
        ? folderService.removePin(folderId, pinId)
        : folderService.savePin(folderId, pinId),
    onSuccess: async (_data, { folderId, remove }) => {
      setLocalSavedFolderIds((current) =>
        remove
          ? current.filter((id) => id !== folderId)
          : [...new Set([...current, folderId])],
      );
      await refreshData();
    },
  });

  const createMutation = useMutation({
    mutationFn: folderService.create,
    onSuccess: async ({ data }) => {
      setNewFolderName("");
      await queryClient.invalidateQueries({
        queryKey: folderQueryKey(currentUser?.id),
      });
      setSelectedFolderId(data.id);
      saveMutation.mutate({ folderId: data.id, remove: false });
      setIsCreatingFolder(false);
      setIsOpen(false);
    },
  });

  const handleCreateFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newFolderName.trim();
    if (name) createMutation.mutate(name);
  };

  const error =
    (saveMutation.error instanceof Error && saveMutation.error.message) ||
    (createMutation.error instanceof Error && createMutation.error.message);

  const renderFolderOption = (folder: (typeof folders)[number]) => {
    const folderHasPin = localSavedFolderIds.includes(folder.id);
    return (
      <button
        key={folder.id}
        type="button"
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-accent"
        onClick={() => {
          setSelectedFolderId(folder.id);
          saveMutation.reset();
          if (!folderHasPin) {
            saveMutation.mutate({
              folderId: folder.id,
              remove: false,
            });
          }
          setIsOpen(false);
        }}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Folder className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate font-semibold">
          {folder.name}
        </span>
        {folderHasPin ? (
          <Check className="size-5 text-primary" aria-label="Salvo" />
        ) : (
          <Lock
            className="size-4 text-muted-foreground"
            aria-label="Pasta privada"
          />
        )}
      </button>
    );
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex items-center gap-1",
        variant === "overlay" &&
          "pointer-events-auto absolute inset-x-3 top-3 z-20 justify-between",
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className={cn("relative min-w-0", variant === "overlay" && "flex-1")}
      >
        <Button
          ref={triggerRef}
          type="button"
          variant="ghost"
          className={cn(
            "max-w-45 gap-1 px-2",
            variant === "overlay" &&
              "w-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white",
          )}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() =>
            setIsOpen((open) => {
              if (!open) {
                setFolderSearch("");
                setIsCreatingFolder(false);
              }
              return !open;
            })
          }
        >
          <span className="truncate">
            {foldersQuery.isPending
              ? "Carregando..."
              : (selectedFolder?.name ?? "Escolher pasta")}
          </span>
          <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
        </Button>

        {isOpen &&
          menuPosition &&
          createPortal(
            <div
              ref={menuRef}
              role="dialog"
              aria-label="Salvar Pin"
              className="fixed z-[100] w-[28rem] max-w-[calc(100vw-1rem)] overflow-hidden rounded-3xl border bg-popover text-popover-foreground shadow-2xl"
              style={menuPosition}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="px-5 pt-5 text-center text-xl font-bold">
                Salvar
              </h2>

              <div className="relative mx-4 mt-4">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
                />
                <Input
                  value={folderSearch}
                  onChange={(event) => setFolderSearch(event.target.value)}
                  placeholder="Pesquisar"
                  aria-label="Pesquisar suas pastas"
                  className="h-12 rounded-2xl pr-4 pl-11 text-base"
                />
              </div>

              <div className="mt-3 max-h-[32rem] overflow-y-auto px-2 pb-2">
                {filteredFolders.length > 0 && (
                  <section>
                    <h3 className="px-3 py-2 text-sm font-semibold">
                      Todas as pastas
                    </h3>
                    {filteredFolders.map((folder) =>
                      renderFolderOption(folder),
                    )}
                  </section>
                )}

                {suggestedFolderNames.length > 0 && (
                  <section>
                    <h3 className="px-3 pt-4 pb-2 text-sm font-semibold">
                      Sugestões
                    </h3>
                    {suggestedFolderNames.map((name) => (
                      <button
                        key={name}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-accent"
                        disabled={createMutation.isPending}
                        onClick={() => createMutation.mutate(name)}
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Plus className="size-6" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 truncate font-semibold">
                          {name}
                        </span>
                        <span className="rounded-full bg-destructive px-4 py-2 font-semibold text-white">
                          Criar
                        </span>
                      </button>
                    ))}
                  </section>
                )}

                {!foldersQuery.isPending && filteredFolders.length === 0 && (
                  <p className="px-3 py-5 text-center text-sm text-muted-foreground">
                    Nenhuma pasta sua encontrada.
                  </p>
                )}
              </div>

              <div className="border-t p-3">
                {isCreatingFolder ? (
                  <form className="flex gap-2" onSubmit={handleCreateFolder}>
                    <Input
                      value={newFolderName}
                      onChange={(event) => {
                        setNewFolderName(event.target.value);
                        createMutation.reset();
                      }}
                      placeholder="Nome da nova pasta"
                      maxLength={100}
                      aria-label="Nome da nova pasta"
                      className="h-11 rounded-xl"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={
                        !newFolderName.trim() || createMutation.isPending
                      }
                      className="h-11 rounded-xl"
                    >
                      {createMutation.isPending ? (
                        <LoaderCircle
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        "Criar"
                      )}
                    </Button>
                  </form>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-14 w-full justify-start gap-3 rounded-2xl px-2 text-base font-semibold"
                    onClick={() => {
                      setNewFolderName(folderSearch.trim());
                      setIsCreatingFolder(true);
                    }}
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
                      <Plus className="size-6" aria-hidden="true" />
                    </span>
                    Criar pasta
                  </Button>
                )}
              </div>

              {error && (
                <p className="px-5 pb-4 text-xs text-destructive">{error}</p>
              )}
            </div>,
            document.body,
          )}
      </div>

      <Button
        type="button"
        variant={isSaved ? "secondary" : "destructive"}
        className={cn(
          "shrink-0",
          variant === "overlay" && isSaved && "bg-white text-zinc-950",
        )}
        disabled={saveMutation.isPending}
        onClick={() => {
          if (!selectedFolderId) {
            setIsOpen(true);
            return;
          }
          saveMutation.mutate({
            folderId: selectedFolderId,
            remove: isSaved,
          });
        }}
      >
        {saveMutation.isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : isSaved ? (
          <>
            <Check aria-hidden="true" />
            Salvo
          </>
        ) : folders.length === 0 ? (
          <>
            <FolderPlus aria-hidden="true" />
            Criar pasta
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </div>
  );
}
