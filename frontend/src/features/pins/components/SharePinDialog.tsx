import { Check, Image, Link2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CopyTarget = "pin" | "image";

export function SharePinDialog({
  open,
  pinId,
  pinTitle,
  imageUrl,
  onClose,
}: {
  open: boolean;
  pinId: string;
  pinTitle: string;
  imageUrl: string;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget>();
  const [copyError, setCopyError] = useState("");
  const pinUrl = `${window.location.origin}/pins/${encodeURIComponent(pinId)}`;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setCopiedTarget(undefined);
    setCopyError("");
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  const copy = async (target: CopyTarget, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      setCopyError("");
    } catch {
      setCopyError("Não foi possível copiar o link.");
    }
  };

  const copyFields = [
    {
      target: "pin" as const,
      label: "Link do Pin",
      value: pinUrl,
      icon: <Link2 aria-hidden="true" />,
    },
    {
      target: "image" as const,
      label: "URL da imagem",
      value: imageUrl,
      icon: <Image aria-hidden="true" />,
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-pin-title"
        className="relative w-full max-w-lg rounded-3xl border bg-card p-6 text-card-foreground shadow-2xl"
      >
        <Button
          ref={closeButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Fechar compartilhamento"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-3 pr-12">
          <img
            src={imageUrl}
            alt=""
            className="size-16 shrink-0 rounded-2xl object-cover"
          />
          <div className="min-w-0">
            <h2 id="share-pin-title" className="text-xl font-bold">
              Compartilhar Pin
            </h2>
            <p className="truncate text-sm text-muted-foreground">{pinTitle}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {copyFields.map(({ target, label, value, icon }) => {
            const wasCopied = copiedTarget === target;

            return (
              <div key={target}>
                <label
                  htmlFor={`share-${target}`}
                  className="mb-1.5 flex items-center gap-2 text-sm font-semibold"
                >
                  {icon}
                  {label}
                </label>
                <div className="flex gap-2">
                  <Input
                    id={`share-${target}`}
                    value={value}
                    readOnly
                    onFocus={(event) => event.currentTarget.select()}
                  />
                  <Button
                    type="button"
                    variant={wasCopied ? "secondary" : "default"}
                    aria-label={`${wasCopied ? "Copiado" : "Copiar"} ${label}`}
                    className="min-w-24"
                    onClick={() => void copy(target, value)}
                  >
                    {wasCopied && <Check aria-hidden="true" />}
                    {wasCopied ? "Copiado" : "Copiar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {copyError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {copyError}
          </p>
        )}
      </section>
    </div>,
    document.body,
  );
}
