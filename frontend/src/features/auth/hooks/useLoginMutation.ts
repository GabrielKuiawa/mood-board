import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { saveAuthToken } from "@/lib/authTokenStorage";
import { authService } from "../services/authService";

export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async ({ token }) => {
      queryClient.removeQueries();
      saveAuthToken(token);
      await navigate({ to: "/feed" });
    },
  });
}
