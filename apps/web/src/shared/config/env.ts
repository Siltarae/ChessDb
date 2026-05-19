export const resolveApiBaseUrl = (apiBaseUrl: string | undefined): string => {
  if (apiBaseUrl === undefined) {
    throw new Error('VITE_API_BASE_URL is required');
  }

  return apiBaseUrl;
};

export const env = {
  API_BASE_URL: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
};
