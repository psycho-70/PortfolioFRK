const TOKEN_COOKIE = "adminToken";

export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(TOKEN_COOKIE.length + 1)) : null;
}

export function setAdminToken(token: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
}

export function clearAdminToken(): void {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
