import { useCallback } from "react";
import { useToast } from "@/lib/toast";
import { ApiError } from "@/lib/api/client";

/**
 * Hook to handle API errors with toast notifications
 */
export function useApiError() {
  const { showToast } = useToast();

  const handleError = useCallback(
    (error: unknown, fallbackMessage = "An error occurred") => {
      if (error instanceof ApiError) {
        // Show the user-friendly error message from the API
        showToast("error", error.getUserMessage());
      } else if (error instanceof Error) {
        // Generic error
        showToast("error", error.message || fallbackMessage);
      } else {
        // Unknown error
        showToast("error", fallbackMessage);
      }
    },
    [showToast]
  );

  return { handleError };
}
