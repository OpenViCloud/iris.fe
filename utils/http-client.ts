import axios, { AxiosResponse, ResponseType } from "axios";
import apiLinks from "./api-links";

interface Options {
  url: ((al: typeof apiLinks) => string) | string;
  data?: object | string;
  params?: object;
  signal?: AbortSignal;
  contentType?: string;
  responseType?: ResponseType;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";

const axiosInstance = axios.create({
  withCredentials: true,
});

// 🔐 Global 401 handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href =
        `${apiLinks.account.login}?redirectUri=${encodeURIComponent(
          window.location.href
        )}`;
      return Promise.resolve(null);
    }

    return Promise.reject(error);
  }
);

const request = async <T = unknown>({
  method,
  url,
  data,
  params,
  signal,
  contentType = "application/json",
  responseType = "json",
}: Options & { method: HttpMethod }): Promise<AxiosResponse<T>> => {
  return axiosInstance.request<T>({
    method,
    url: typeof url === "string" ? url : url(apiLinks),
    data,
    params,
    signal,
    responseType,
    headers: {
      "content-type": contentType,
    },
  });
};

const httpClient = {
  request,
  ...(["GET", "POST", "PUT", "DELETE", "OPTIONS"] as const).reduce(
    (acc, method) => {
      acc[method.toLowerCase() as Lowercase<typeof method>] = <T = unknown>(
        options: Options
      ) => request<T>({ ...options, method });
      return acc;
    },
    {} as Record<
      Lowercase<HttpMethod>,
      <T>(options: Options) => Promise<AxiosResponse<T>>
    >
  ),
};

export default httpClient;
