import type { CreatePinData, CreatePinResponse, Pin, PinPage } from "../types";
import { apiRequest } from "@/lib/api";
import type { ActiveSearch } from "@/features/search/types";

const pinsPath = "/api/pin";

type PinMutationResponse = {
  message: string;
  data: Pin;
};

export const initialPinsPage = `${pinsPath}?page=1&limit=20`;

export function createInitialPinsPage(search: ActiveSearch | null): string {
  if (!search) return initialPinsPage;

  const searchParams = new URLSearchParams({
    page: "1",
    limit: "20",
    q: search.query,
  });

  if (search.type && search.id) {
    searchParams.set("type", search.type);
    searchParams.set("id", search.id);
  }

  return `${pinsPath}?${searchParams.toString()}`;
}

export const pinService = {
  create({
    title,
    description,
    image,
    folderIds,
  }: CreatePinData): Promise<CreatePinResponse> {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    for (const folderId of folderIds) {
      formData.append("folderIds", folderId);
    }

    return apiRequest<CreatePinResponse>(pinsPath, {
      method: "POST",
      body: formData,
      authenticated: true,
      errorMessage: "Não foi possível criar o Pin. Tente novamente.",
    });
  },

  getById(pinId: string, signal?: AbortSignal): Promise<Pin> {
    return apiRequest<Pin>(`${pinsPath}/${pinId}`, {
      signal,
      authenticated: true,
      errorMessage: (status) =>
        status === 401
          ? "Sua sessão expirou. Entre novamente."
          : `Não foi possível carregar o Pin: ${status}`,
      useServerErrorMessage: false,
    });
  },

  getPage(pageUrl: string, signal?: AbortSignal): Promise<PinPage> {
    return apiRequest<PinPage>(pageUrl, {
      signal,
      authenticated: true,
      errorMessage: (status) =>
        status === 401
          ? "Sua sessão expirou. Entre novamente."
          : `Não foi possível carregar os Pins: ${status}`,
      useServerErrorMessage: false,
    });
  },

  like(pinId: string): Promise<PinMutationResponse> {
    return apiRequest<PinMutationResponse>(`${pinsPath}/${pinId}/likes`, {
      method: "POST",
      authenticated: true,
      errorMessage: "Não foi possível curtir o Pin.",
    });
  },

  unlike(pinId: string): Promise<PinMutationResponse> {
    return apiRequest<PinMutationResponse>(`${pinsPath}/${pinId}/likes`, {
      method: "DELETE",
      authenticated: true,
      errorMessage: "Não foi possível remover a curtida.",
    });
  },
};
