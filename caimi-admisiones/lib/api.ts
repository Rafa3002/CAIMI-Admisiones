import type {
  User,
} from "./types";


export const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";


export function getToken() {

  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "caimi_token"
  );
}


export function getStoredUser():
  User | null {

  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const value =
    localStorage.getItem(
      "caimi_user"
    );

  if (!value) {
    return null;
  }

  try {

    return JSON.parse(
      value
    ) as User;

  } catch {

    return null;
  }
}


export function clearSession() {

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    "caimi_token"
  );

  localStorage.removeItem(
    "caimi_user"
  );
}


export async function apiFetch(
  path: string,
  options:
    RequestInit = {}
) {

  const token =
    getToken();

  const headers =
    new Headers(
      options.headers
    );

  if (
    options.body &&
    !headers.has(
      "Content-Type"
    )
  ) {

    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {

    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      }
    );

  if (
    response.status ===
    401
  ) {

    clearSession();
  }

  return response;
}