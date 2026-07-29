import { apiRequest } from "@/lib/api";

export type Folder = {
  id: string;
  name: string;
  pinCount: number;
  previewPins: FolderPin[];
};

export type FolderPin = {
  id: string;
  title: string;
  pathImage: string;
  description: string;
};

export type FolderDetails = Folder & {
  pins: FolderPin[];
};

export type FolderPage = {
  data: Folder[];
};

type FolderResponse = {
  message: string;
  data: Folder;
};

export const folderQueryKey = (userId?: string) =>
  ["folders", "mine", userId] as const;
export const folderDetailsQueryKey = (folderId: string) =>
  ["folders", "detail", folderId] as const;

export const folderService = {
  getMine(signal?: AbortSignal): Promise<FolderPage> {
    return apiRequest<FolderPage>("/api/folder/mine?page=1&limit=100", {
      signal,
      authenticated: true,
      errorMessage: "Não foi possível carregar suas pastas.",
    });
  },

  create(name: string): Promise<FolderResponse> {
    return apiRequest<FolderResponse>("/api/folder", {
      method: "POST",
      json: { name },
      authenticated: true,
      errorMessage: "Não foi possível criar a pasta.",
    });
  },

  getById(folderId: string, signal?: AbortSignal): Promise<FolderDetails> {
    return apiRequest<FolderDetails>(`/api/folder/${folderId}`, {
      signal,
      authenticated: true,
      errorMessage: "Não foi possível carregar esta pasta.",
    });
  },

  delete(folderId: string): Promise<void> {
    return apiRequest<void>(`/api/folder/${folderId}`, {
      method: "DELETE",
      authenticated: true,
      errorMessage: "Não foi possível excluir a pasta.",
    });
  },

  savePin(folderId: string, pinId: string): Promise<FolderResponse> {
    return apiRequest<FolderResponse>(`/api/folder/${folderId}/pins/${pinId}`, {
      method: "POST",
      authenticated: true,
      errorMessage: "Não foi possível salvar o Pin.",
    });
  },

  removePin(folderId: string, pinId: string): Promise<void> {
    return apiRequest<void>(`/api/folder/${folderId}/pins/${pinId}`, {
      method: "DELETE",
      authenticated: true,
      errorMessage: "Não foi possível remover o Pin da pasta.",
    });
  },
};
