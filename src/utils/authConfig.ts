// This file contains only the client-safe configuration options
export const authConfig = {
  basePath: "/api/auth",
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
};
