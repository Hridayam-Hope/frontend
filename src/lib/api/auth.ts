import { apiFetch, setTokens, clearTokens, getTokens } from "./client";
import type { LoginRequest, TokenResponse, User, MessageResponse } from "@/types/api";

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const res = await apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  setTokens({
    access_token: res.access_token,
    refresh_token: res.refresh_token,
  });
  return res;
}

export async function logout(): Promise<void> {
  const tokens = getTokens();
  if (tokens?.refresh_token) {
    try {
      await apiFetch<MessageResponse>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: tokens.refresh_token }),
      });
    } catch {
      // Ignore logout errors
    }
  }
  clearTokens();
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>("/auth/me");
}
