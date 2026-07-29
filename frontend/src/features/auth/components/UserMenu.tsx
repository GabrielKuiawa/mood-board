import { Camera, ChevronDown, Eye, EyeOff, LogOut, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageFileInput } from "@/hooks/useImageFileInput";
import { useCurrentUserQuery } from "../hooks/useCurrentUserQuery";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation";

type UserMenuProps = {
  onLogout: () => void;
  triggerMode?: "menu" | "edit";
};

function getUserInitial(name?: string): string {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

export function UserMenu({ onLogout, triggerMode = "menu" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: user, isError, isPending } = useCurrentUserQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const profileImageInput = useImageFileInput({
    onSelectionChange: updateProfileMutation.reset,
  });

  const cancelEditing = () => {
    setIsEditing(false);
    setName(user?.name ?? "");
    setPassword("");
    setIsPasswordVisible(false);
    profileImageInput.reset();
    updateProfileMutation.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) return;

    updateProfileMutation.mutate(
      {
        id: user.id,
        name,
        password: password || undefined,
        image: profileImageInput.file ?? undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setPassword("");
          setIsPasswordVisible(false);
          profileImageInput.reset();
        },
      },
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        type="button"
        variant={triggerMode === "edit" ? "secondary" : "ghost"}
        className={triggerMode === "edit" ? "h-11 px-5" : "h-11 gap-1 px-1.5"}
        aria-label={
          triggerMode === "edit" ? "Editar perfil" : "Abrir menu do usuário"
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="user-menu"
        onClick={() => {
          if (triggerMode === "edit" && user) {
            setName(user.name);
            setPassword("");
            setIsPasswordVisible(false);
            setIsEditing(true);
            setIsOpen(true);
            return;
          }

          setIsOpen((open) => !open);
        }}
      >
        {triggerMode === "edit" ? (
          <>
            <Pencil aria-hidden="true" />
            Editar perfil
          </>
        ) : (
          <>
            <Avatar className="size-9">
              <AvatarImage src={user?.pathImageUser} alt="" />
              <AvatarFallback className="bg-slate-500 text-sm text-white">
                {getUserInitial(user?.name)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              aria-hidden="true"
              className={`size-4 text-muted-foreground transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </Button>

      {isOpen && (
        <div
          id="user-menu"
          role="dialog"
          aria-label="Menu do usuário"
          className="fixed top-17 right-3 left-3 z-50 rounded-2xl border bg-popover p-2 text-popover-foreground shadow-xl sm:absolute sm:top-[calc(100%+0.5rem)] sm:right-0 sm:left-auto sm:w-80"
        >
          <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Conta
          </p>

          {isPending && (
            <div
              aria-label="Carregando usuário"
              className="flex items-center gap-3 px-3 py-3"
            >
              <Skeleton className="size-11 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          )}

          {isError && (
            <p role="alert" className="px-3 py-3 text-sm text-destructive">
              Não foi possível carregar seu perfil.
            </p>
          )}

          {user &&
            (isEditing ? (
              <form className="space-y-3 px-3 py-3" onSubmit={handleSubmit}>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="profile-avatar"
                    className="group relative shrink-0 cursor-pointer rounded-full outline-none focus-within:ring-2 focus-within:ring-ring"
                    title="Trocar foto"
                  >
                    <Avatar className="size-12">
                      <AvatarImage
                        src={profileImageInput.previewUrl || user.pathImageUser}
                        alt=""
                      />
                      <AvatarFallback>
                        {getUserInitial(name || user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <Camera aria-hidden="true" className="size-4" />
                    </span>
                    <input
                      id="profile-avatar"
                      name="image"
                      type="file"
                      accept={profileImageInput.accept}
                      onChange={profileImageInput.onChange}
                      className="sr-only"
                      aria-label="Trocar foto de perfil"
                    />
                  </label>

                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="profile-name"
                      className="mb-1 block text-xs font-medium text-muted-foreground"
                    >
                      Nome
                    </label>
                    <Input
                      id="profile-name"
                      name="name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        updateProfileMutation.reset();
                      }}
                      className="h-9 rounded-lg px-3"
                      maxLength={100}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>

                <div>
                  <label
                    htmlFor="profile-password"
                    className="mb-1 block text-xs font-medium text-muted-foreground"
                  >
                    Nova senha
                  </label>
                  <div className="relative">
                    <Input
                      id="profile-password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        updateProfileMutation.reset();
                      }}
                      className="h-9 rounded-lg pr-10 pl-3"
                      placeholder="Deixe em branco para não alterar"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={72}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-0.5 size-8 -translate-y-1/2"
                      onClick={() =>
                        setIsPasswordVisible((visible) => !visible)
                      }
                      aria-label={
                        isPasswordVisible ? "Ocultar senha" : "Mostrar senha"
                      }
                      aria-pressed={isPasswordVisible}
                    >
                      {isPasswordVisible ? (
                        <EyeOff aria-hidden="true" />
                      ) : (
                        <Eye aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </div>

                {(profileImageInput.error ||
                  updateProfileMutation.error?.message) && (
                  <p role="alert" className="text-xs text-destructive">
                    {profileImageInput.error ??
                      updateProfileMutation.error?.message}
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancelar
                  </Button>
                  <LoadingButton
                    type="submit"
                    size="sm"
                    isLoading={updateProfileMutation.isPending}
                    loadingLabel="Salvando..."
                  >
                    Salvar
                  </LoadingButton>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="size-11">
                  <AvatarImage src={user.pathImageUser} alt="" />
                  <AvatarFallback>{getUserInitial(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                {!user.readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-lg"
                    aria-label="Editar perfil"
                    title="Editar perfil"
                    onClick={() => {
                      setName(user.name);
                      setPassword("");
                      setIsPasswordVisible(false);
                      setIsEditing(true);
                    }}
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                )}
              </div>
            ))}

          <div className="my-1 border-t" />

          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start rounded-xl px-3"
            onClick={onLogout}
          >
            <LogOut aria-hidden="true" />
            Sair
          </Button>
        </div>
      )}
    </div>
  );
}
