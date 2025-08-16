export const baseAPIUrl = process.env.NEXT_PUBLIC_BASE_API_URL || '';
export const API_PREFIX = '/api';

// Helper function to construct full URL
const getFullUrl = (endpoint: string) => {
  if (baseAPIUrl) {
    return `${baseAPIUrl}${endpoint}`;
  }
  return endpoint; // Use relative path for local development
};

export const API_ENDPOINTS = {
  SUMMARIZE: getFullUrl(`${API_PREFIX}/summarize`),
  SEND_EMAIL: getFullUrl(`${API_PREFIX}/send-email`),
} as const;
