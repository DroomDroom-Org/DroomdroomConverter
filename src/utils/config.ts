import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const config = {
  basePath: publicRuntimeConfig.basePath as string,
  apiPath: publicRuntimeConfig.apiPath as string,
  cmcImageUrl: publicRuntimeConfig.cmcImageUrl as string,
} as const;
// Helper functions to generate URLs
export const getApiUrl = (path: string) => {
  // `${config.apiPath}${path}`;
  let uri = path;
  if (path.startsWith('/')) {
    uri = path.slice(1);
  }
  let finalUri = `${process.env.NEXT_PUBLIC_API_URL}/api/${uri}`;
  if (finalUri.includes("/undefined")) {
    finalUri = finalUri.replace("/undefined", "");
    finalUri = finalUri.replace("undefined", "");
  }
  return finalUri;
}
export const getCmcImageUrl = (cmcId: string | number) => `${config.cmcImageUrl}/${cmcId}.png`;
export const getPageUrl = (path: string) => path == "" || path == undefined ? `${config.basePath}` : `${config.basePath}${path}`;
export const getHostPageUrl = (path: string) => {
  // Check if NEXT_PUBLIC_URL is defined
  if (!process.env.NEXT_PUBLIC_URL) {
    // Fallback to a default URL or relative path during build
    path = path.startsWith('/') ? path : `/${path}`;
    return path;
  }
  
  // Use url module to get the host
  const url = new URL(process.env.NEXT_PUBLIC_URL);
  path = path.startsWith('/') ? path : `/${path}`;
  
  // If port is not 80, then add it to the url
  return `${url.protocol}//${url.host}${path}`;
}