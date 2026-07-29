import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { saveAuthToken } from "@/lib/authTokenStorage";
import { authService } from "../services/authService";
import type { RegistrationData } from "../services/authService";

export function useRegisterMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationData: RegistrationData) => {
      const normalizedData = {
        ...registrationData,
        name: registrationData.name.trim(),
        email: registrationData.email.trim(),
      };

      await authService.register(normalizedData);

      return authService.login({
        email: normalizedData.email,
        password: normalizedData.password,
      });
    },
    onSuccess: async ({ token }) => {
      queryClient.removeQueries();
      saveAuthToken(token);
      await navigate({ to: "/feed" });
    },
  });
}
