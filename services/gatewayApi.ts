import apiLinks from "@/utils/api-links";

/**
 * Check login
 */
export async function checkAuthOrRedirect(returnUrl?: string) {
  try {
    const redirectUrl = returnUrl ?? window.location.href;

    const res = await fetch(apiLinks.account.info, {
      method: "GET",
      credentials: "include",
      redirect: "manual",
    });

    if (res.status === 302 || res.status === 301) {
      const location = res.headers.get("Location")!;
      window.location.href = location;
      return false;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      window.location.href = `${apiLinks.account.login}?redirectUri=${encodeURIComponent(
        redirectUrl
      )}`;
      return false;
    }

    return true;
  } catch (err) {
    console.error("Auth check failed:", err);
    return false;
  }
}

/**
 * Call API
 */
export async function fetchGatewayApi<T = any>(
  url: string,
  requireAuth: true,
  options: RequestInit = {},
): Promise<T> {
  if (requireAuth) {
    const isAuth = await checkAuthOrRedirect();
    if (!isAuth) throw new Error("Not authenticated");
  }

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    redirect: "manual",
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON but got: ${text.substring(0, 200)}`);
  }

  return res.json();
}

/**
 * Logout user
 */
export function logout(returnUrl?: string) {
  const url = `${apiLinks.account.logout}?redirectUri=${encodeURIComponent(
    returnUrl ?? window.location.href
  )}`;
  window.location.href = url;
}
