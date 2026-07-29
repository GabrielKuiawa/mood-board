import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PinIcon, LoaderCircle, Search, UserRound, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useSearchContext } from "../hooks/useSearchContext";
import { searchService } from "../services/searchService";
import type { SearchSuggestion, SearchSuggestionType } from "../types";

const suggestionIcons = {
  pin: PinIcon,
  user: UserRound,
} satisfies Record<SearchSuggestionType, typeof Search>;

export function SearchBar() {
  const navigate = useNavigate();
  const { activeSearch, applySearch, clearSearch } = useSearchContext();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const debouncedValue = useDebouncedValue(inputValue.trim(), 250);
  const suggestionsQuery = useQuery({
    queryKey: ["search-suggestions", debouncedValue],
    queryFn: ({ signal }) =>
      searchService.getSuggestions(debouncedValue, signal),
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
  const suggestions = suggestionsQuery.data?.data ?? [];

  useEffect(() => {
    if (!activeSearch) setInputValue("");
  }, [activeSearch]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedValue]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const applySuggestion = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.label);
    applySearch({
      query: suggestion.label,
      label: suggestion.label,
      type: suggestion.type,
      id: suggestion.id,
    });
    setIsOpen(false);
    void navigate({ to: "/feed" });
  };

  const submitTextSearch = () => {
    const query = inputValue.trim();
    if (!query) {
      clearSearch();
      setIsOpen(false);
      return;
    }

    applySearch({ query, label: query });
    setIsOpen(false);
    void navigate({ to: "/feed" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        suggestions.length === 0 ? -1 : (index + 1) % suggestions.length,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        suggestions.length === 0
          ? -1
          : (index - 1 + suggestions.length) % suggestions.length,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const suggestion = suggestions[activeIndex];
      if (suggestion) applySuggestion(suggestion);
      else submitTextSearch();
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const clearInput = () => {
    setInputValue("");
    clearSearch();
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} role="search" className="relative min-w-0 flex-1">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        role="combobox"
        aria-label="Pesquisar"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        }
        autoComplete="off"
        className="h-12 rounded-2xl border-0 bg-muted pr-20 pl-11 text-base shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Pesquise Pins ou pessoas"
        type="search"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      <div className="absolute top-1/2 right-2 z-10 flex -translate-y-1/2 items-center">
        {suggestionsQuery.isFetching && (
          <LoaderCircle
            aria-label="Carregando sugestões"
            className="size-4 animate-spin text-muted-foreground"
          />
        )}
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9"
            aria-label="Limpar pesquisa"
            onClick={clearInput}
          >
            <X aria-hidden="true" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-14 right-0 left-0 z-50 overflow-hidden rounded-2xl border bg-popover shadow-2xl">
          <div className="border-b px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {debouncedValue ? "Sugestões" : "Explore"}
          </div>

          <div
            id={listboxId}
            role="listbox"
            aria-label="Sugestões de pesquisa"
            className="max-h-96 overflow-y-auto p-2"
          >
            {suggestionsQuery.isPending &&
              Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  role="status"
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-2 w-1/3 rounded" />
                  </div>
                </div>
              ))}

            {suggestionsQuery.isError && (
              <p
                role="alert"
                className="px-3 py-6 text-center text-sm text-red-600"
              >
                {suggestionsQuery.error.message}
              </p>
            )}

            {!suggestionsQuery.isPending &&
              !suggestionsQuery.isError &&
              suggestions.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nenhuma sugestão encontrada.
                </p>
              )}

            {suggestions.map((suggestion, index) => {
              const Icon = suggestionIcons[suggestion.type];
              const isActive = activeIndex === index;

              return (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={isActive}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    isActive ? "bg-accent" : "hover:bg-accent/70",
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applySuggestion(suggestion)}
                >
                  <Avatar className="size-10 rounded-xl">
                    {suggestion.imageUrl && (
                      <AvatarImage
                        src={suggestion.imageUrl}
                        alt=""
                        className="rounded-xl"
                      />
                    )}
                    <AvatarFallback className="rounded-xl text-muted-foreground">
                      <Icon aria-hidden="true" className="size-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {suggestion.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {suggestion.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
