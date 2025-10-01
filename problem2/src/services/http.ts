import axios, { AxiosError } from "axios";

export const http = axios.create({
  timeout: 8000,
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    const message =
      error.response?.data && typeof error.response.data === "object"
        ? (error.response.data as { message: string }).message ??
          "Request failed"
        : error.message;

    return Promise.reject({
      status,
      message,
      cause: "NETWORK_ERROR",
      original: error,
    });
  }
);
