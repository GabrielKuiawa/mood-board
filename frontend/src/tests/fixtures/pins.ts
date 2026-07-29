import type { Pin, PinPage } from "@/features/pins/types";

export function createPin(overrides: Partial<Pin> = {}): Pin {
  return {
    id: "image-id",
    title: "Referência",
    pathImage: "https://example.com/image.jpg",
    description: "Uma imagem de referência",
    author: {
      id: "user-id",
      name: "Maria Silva",
      pathImageUser: "https://example.com/avatar.jpg",
    },
    folders: [],
    savedFolderIds: [],
    likeCount: 0,
    likedByCurrentUser: false,
    commentCount: 0,
    ...overrides,
  };
}

type PinPageOptions = {
  data?: Pin[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  next?: string | null;
  previous?: string | null;
};

export function createPinPage({
  data = [createPin()],
  page = 1,
  limit = 20,
  total = data.length,
  totalPages = total > 0 ? 1 : 0,
  next = null,
  previous = null,
}: PinPageOptions = {}): PinPage {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      next,
      previous,
    },
  };
}
