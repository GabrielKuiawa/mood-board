import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Image, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Pin, PinPage } from "../types";
import { pinService } from "../services/pinService";

const createdPinsQueryKey = (userId: string) =>
  ["pins", "created", userId] as const;

type CreatedPinsSectionProps = {
  userId: string;
  readOnly?: boolean;
};

export function CreatedPinsSection({
  userId,
  readOnly = false,
}: CreatedPinsSectionProps) {
  const queryClient = useQueryClient();
  const [pinPendingDeletion, setPinPendingDeletion] = useState<Pin>();
  const queryKey = createdPinsQueryKey(userId);
  const pinsQuery = useQuery({
    queryKey,
    queryFn: ({ signal }) => pinService.getCreatedByUser(userId, signal),
  });
  const deleteMutation = useMutation({
    mutationFn: (pinId: string) => pinService.delete(pinId),
    onSuccess: async (_data, pinId) => {
      queryClient.setQueryData<PinPage>(queryKey, (current) =>
        current
          ? {
              data: current.data.filter((pin) => pin.id !== pinId),
              meta: {
                ...current.meta,
                total: Math.max(0, current.meta.total - 1),
              },
            }
          : current,
      );
      setPinPendingDeletion(undefined);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pins"] }),
        queryClient.invalidateQueries({ queryKey: ["folders"] }),
      ]);
    },
  });
  const pins = pinsQuery.data?.data ?? [];

  return (
    <section aria-labelledby="created-pins-title">
      <header className="mb-8">
        <p className="text-sm font-semibold text-muted-foreground">
          Seu conteúdo
        </p>
        <h1
          id="created-pins-title"
          className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Seus Pins
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {readOnly
            ? "Explore os Pins publicados por esta conta de demonstração."
            : "Visualize e exclua os Pins publicados pela sua conta."}
        </p>
      </header>

      {pinsQuery.isPending ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="aspect-4/3 animate-pulse rounded-3xl bg-muted"
            />
          ))}
        </div>
      ) : pinsQuery.isError ? (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {pinsQuery.error.message}
        </p>
      ) : pins.length === 0 ? (
        <div className="mt-6 flex items-center gap-3 rounded-3xl border bg-card p-5 text-sm text-muted-foreground">
          <Image aria-hidden="true" className="size-5" />
          Você ainda não criou nenhum Pin.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pins.map((pin) => (
            <article
              key={pin.id}
              className="overflow-hidden rounded-3xl border bg-card shadow-sm"
            >
              <Link
                to="/pins/$pinId"
                params={{ pinId: pin.id }}
                aria-label={`Ver ${pin.title}`}
                className="block overflow-hidden"
              >
                <img
                  src={pin.pathImage}
                  alt={pin.description}
                  className="aspect-4/3 w-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </Link>
              <div className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{pin.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {pin.folders.length === 0
                      ? "Sem pasta"
                      : `${pin.folders.length} ${
                          pin.folders.length === 1 ? "pasta" : "pastas"
                        }`}
                  </p>
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Excluir ${pin.title}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      deleteMutation.reset();
                      setPinPendingDeletion(pin);
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {!readOnly && (
        <ConfirmDialog
          open={Boolean(pinPendingDeletion)}
          title="Excluir Pin?"
          description={
            pinPendingDeletion
              ? `“${pinPendingDeletion.title}” será removido das suas pastas e a imagem será apagada do armazenamento.`
              : ""
          }
          confirmLabel="Excluir Pin"
          busy={deleteMutation.isPending}
          errorMessage={deleteMutation.error?.message}
          onCancel={() => {
            deleteMutation.reset();
            setPinPendingDeletion(undefined);
          }}
          onConfirm={() => {
            if (pinPendingDeletion) {
              deleteMutation.mutate(pinPendingDeletion.id);
            }
          }}
        />
      )}
    </section>
  );
}
