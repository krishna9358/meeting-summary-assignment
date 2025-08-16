export const baseAPIUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
export const API_PREFIX = '/api';

export const API_ENDPOINTS = {
  SUMMARIZE: `${API_PREFIX}/summarize`,
  SEND_EMAIL: `${API_PREFIX}/send-email`,
} as const;
