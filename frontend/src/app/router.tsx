import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppLayout } from "@/app/layouts/AppLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import {
  redirectAuthenticatedSession,
  requireAuthenticatedSession,
} from "@/features/auth/routeGuards";
import { FolderDetailsPage } from "@/features/folders/pages/FolderDetailsPage";
import { SavedFoldersPage } from "@/features/folders/pages/SavedFoldersPage";
import { PinDetailsPage } from "@/features/pins/pages/PinDetailsPage";
import { PinFeedPage } from "@/features/pins/pages/PinFeedPage";
import { CreatePinPage } from "@/features/pins/pages/CreatePinPage";
import { ManagePinsPage } from "@/features/pins/pages/ManagePinsPage";
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { SearchPage } from "@/features/search/pages/SearchPage";

const rootRoute = createRootRoute({
  component: Outlet,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  beforeLoad: requireAuthenticatedSession,
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: redirectAuthenticatedSession,
  component: LandingPage,
});

const feedRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/feed",
  component: PinFeedPage,
});

const searchRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/search",
  component: SearchPage,
});

const createPinRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/create",
  component: CreatePinPage,
});

const managePinsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/my-pins",
  component: ManagePinsPage,
});

const savedFoldersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/saved",
  component: SavedFoldersPage,
});

const folderDetailsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/saved/$folderId",
  component: FolderDetailsPage,
});

export const pinDetailsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/pins/$pinId",
  component: PinDetailsPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: redirectAuthenticatedSession,
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  beforeLoad: redirectAuthenticatedSession,
  component: RegisterPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authenticatedRoute.addChildren([
    feedRoute,
    searchRoute,
    createPinRoute,
    managePinsRoute,
    savedFoldersRoute,
    folderDetailsRoute,
    pinDetailsRoute,
  ]),
  loginRoute,
  registerRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
