import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { clearAuthToken } from "@/lib/authTokenStorage";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearAuthToken();
    queryClient.removeQueries();
    void navigate({ to: "/login" });
  }, [navigate, queryClient]);
}
