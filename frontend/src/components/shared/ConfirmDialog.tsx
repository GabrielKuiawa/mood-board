import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy = false,
  errorMessage,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [busy, onCancel, open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative w-full max-w-md rounded-3xl border bg-card p-6 text-card-foreground shadow-2xl sm:p-7"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Fechar confirmação"
          className="absolute top-4 right-4"
          disabled={busy}
          onClick={onCancel}
        >
          <X aria-hidden="true" />
        </Button>

        <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Trash2 aria-hidden="true" className="size-5" />
        </span>

        <h2
          id="confirm-dialog-title"
          className="pr-10 text-2xl font-bold tracking-tight"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-description"
          className="mt-2 text-sm leading-6 text-muted-foreground"
        >
          {description}
        </p>

        {errorMessage && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Excluindo..." : confirmLabel}
          </Button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
