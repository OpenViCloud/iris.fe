import apiLinks from "@/utils/api-links";

/**
 * Call Gateway API
 */
export async function fetchGatewayApi<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      redirect: "manual",
    });

    const contentType = res.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      window.location.href =
        `${apiLinks.account.login}?redirectUri=${encodeURIComponent(
          window.location.href
        )}`;
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Auth check failed:", err);
    return null;
  }
}

/**
 * Logout
 */
export function logout(returnUrl?: string) {
  const url =
    `${apiLinks.account.logout}?redirectUri=${encodeURIComponent(
      returnUrl ?? window.location.href
    )}`;

  window.location.href = url;
}
