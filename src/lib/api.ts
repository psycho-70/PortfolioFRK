const DEFAULT_PRODUCTION_API_URL = 'https://backendproject-01.vercel.app';
const DEFAULT_DEVELOPMENT_API_URL = 'http://localhost:5000';

export function isLocalApiUrl(value: string): boolean {
  try {
    const hostname = new URL(value).hostname;
    return hostname === 'localhost' || hostname === '[::1]' || /^127(?:\.\d{1,3}){3}$/.test(hostname);
  } catch {
    return false;
  }
}

export function getApiBaseUrl(configuredUrl = process.env.NEXT_PUBLIC_API_URL): string {
  const configured = configuredUrl?.trim();
  const deployment = (
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL?.trim() || DEFAULT_PRODUCTION_API_URL
  ).replace(/\/+$/, '');
  const productionFallback = isLocalApiUrl(deployment)
    ? DEFAULT_PRODUCTION_API_URL
    : deployment;

  if (configured) {
    if (process.env.NODE_ENV === 'production' && isLocalApiUrl(configured)) {
      return productionFallback;
    }

    return configured.replace(/\/+$/, '');
  }

  return process.env.NODE_ENV === 'production'
    ? productionFallback
    : DEFAULT_DEVELOPMENT_API_URL;
}

export const API_BASE_URL = getApiBaseUrl();
