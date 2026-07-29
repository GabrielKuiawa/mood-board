export type PinAuthor = {
  id: string;
  name: string;
  pathImageUser: string;
};

export type Folder = {
  id: string;
  name: string;
};

export type Pin = {
  id: string;
  title: string;
  pathImage: string;
  description: string;
  author: PinAuthor;
  folders: Folder[];
  savedFolderIds: string[];
  likeCount: number;
  likedByCurrentUser: boolean;
  commentCount: number;
};

export type PinComment = {
  id: string;
  content: string;
  createdAt: string;
  author: PinAuthor;
  likeCount: number;
  likedByCurrentUser: boolean;
  canDelete: boolean;
};

export type PinPage = {
  data: Pin[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    next: string | null;
    previous: string | null;
  };
};

export type CreatePinData = {
  title: string;
  description: string;
  image: File;
  folderIds: string[];
};

export type CreatePinResponse = {
  message: string;
  data: Pin;
};
