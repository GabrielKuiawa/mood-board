import { getAuthToken } from "./authTokenStorage";

type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  token?: string | null;
  authenticated?: boolean;
  json?: unknown;
  body?: BodyInit;
  headers?: Record<string, string>;
  errorMessage: string | ((status: number) => string);
  useServerErrorMessage?: boolean;
};

type ErrorResponse = {
  message?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function resolveApiUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl)
    ? pathOrUrl
    : `${import.meta.env.VITE_API_URL}${pathOrUrl}`;
}

export async function apiRequest<ResponseBody>(
  pathOrUrl: string,
  {
    token,
    authenticated = false,
    json,
    body: requestBody,
    headers: customHeaders,
    errorMessage,
    useServerErrorMessage = true,
    ...requestOptions
  }: ApiRequestOptions,
): Promise<ResponseBody> {
  const headers: Record<string, string> = { ...customHeaders };

  if (json !== undefined && requestBody !== undefined) {
    throw new Error("A requisição não pode enviar JSON e FormData juntos.");
  }

  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const authToken = token ?? (authenticated ? getAuthToken() : null);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(resolveApiUrl(pathOrUrl), {
    ...requestOptions,
    ...(Object.keys(headers).length > 0 && { headers }),
    ...(json !== undefined && { body: JSON.stringify(json) }),
    ...(requestBody !== undefined && { body: requestBody }),
  });

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  const body = (await response.json().catch(() => ({}))) as unknown;

  if (!response.ok) {
    const fallbackMessage =
      typeof errorMessage === "function"
        ? errorMessage(response.status)
        : errorMessage;
    const errorBody =
      typeof body === "object" && body !== null && "message" in body
        ? (body as ErrorResponse)
        : undefined;
    const serverMessage = useServerErrorMessage
      ? errorBody?.message
      : undefined;

    throw new ApiError(serverMessage ?? fallbackMessage, response.status);
  }

  return body as ResponseBody;
}
