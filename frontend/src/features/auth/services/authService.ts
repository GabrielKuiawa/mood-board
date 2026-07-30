import { ApiError, apiRequest } from "@/lib/api";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
  image: File;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  pathImageUser: string;
  role: string;
  readOnly: boolean;
};

export type UpdateProfileData = {
  id: string;
  name: string;
  password?: string;
  image?: File;
};

type LoginResponse = {
  message: string;
  token: string;
};

type RegistrationResponse = {
  message: string;
  data: CurrentUser;
};

type UpdateProfileResponse = {
  message: string;
  data: CurrentUser;
};

const currentUserPath = "/api/user/me";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const body = await apiRequest<LoginResponse>("/api/user/login", {
      method: "POST",
      json: credentials,
      errorMessage: "Não foi possível entrar. Tente novamente em instantes.",
    });

    if (!body.token) {
      throw new Error("A resposta do servidor não contém uma sessão válida.");
    }

    return body;
  },

  register(registrationData: RegistrationData): Promise<RegistrationResponse> {
    const formData = new FormData();
    formData.append("name", registrationData.name);
    formData.append("email", registrationData.email);
    formData.append("password", registrationData.password);
    formData.append("image", registrationData.image);

    return apiRequest<RegistrationResponse>("/api/user", {
      method: "POST",
      body: formData,
      errorMessage:
        "Não foi possível criar sua conta. Tente novamente em instantes.",
    });
  },

  getCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
    return apiRequest<CurrentUser>(currentUserPath, {
      signal,
      authenticated: true,
      errorMessage: "Não foi possível carregar seu perfil.",
      useServerErrorMessage: false,
    });
  },

  updateProfile({
    id,
    name,
    password,
    image,
  }: UpdateProfileData): Promise<UpdateProfileResponse> {
    const formData = new FormData();
    formData.append("name", name);
    if (password) {
      formData.append("password", password);
    }
    if (image) {
      formData.append("image", image);
    }

    return apiRequest<UpdateProfileResponse>(`/api/user/${id}`, {
      method: "PUT",
      body: formData,
      authenticated: true,
      errorMessage:
        "Não foi possível atualizar seu perfil. Tente novamente em instantes.",
    });
  },

  async validateSession(token: string): Promise<boolean> {
    try {
      await apiRequest<unknown>(currentUserPath, {
        token,
        errorMessage: "Não foi possível validar sua sessão.",
        useServerErrorMessage: false,
      });
    } catch (error) {
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        return false;
      }

      throw error;
    }

    return true;
  },
};
