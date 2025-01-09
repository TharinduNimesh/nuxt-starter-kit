import type { UseFetchOptions } from "nuxt/app";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export function useApiFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const { accessToken } = useAuth();

  const defaults: UseFetchOptions<T> = {
    key: url,
    headers: accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {},
    watch: false,
    ...options,
  };

  if (import.meta.client) {
    defaults.headers = {
      ...defaults.headers,
      "client-platform": "browser",
    };
  }

  return useFetch(url, defaults);
}

export async function $apiFetch<T>(
  url: string,
  options: NitroFetchOptions<NitroFetchRequest> = {}
) {
  const { accessToken } = useAuth();

  const headers = {
    ...(accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {}),
    ...(import.meta.client ? { "client-platform": "browser" } : {}),
    ...options.headers,
  };

  try {
    return await $fetch<T>(url, {
      ...options,
      headers,
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error?.response?._data?.message || error.message,
    });
  }
}
