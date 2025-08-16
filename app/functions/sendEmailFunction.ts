import { API_ENDPOINTS } from '../config/apiPrefix/apiPrefix';

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export interface SendEmailResponse {
  success?: boolean;
  error?: string;
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  from?: string
): Promise<SendEmailResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.SEND_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body, from }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Send email function error:', error);
    return { error: 'Network error occurred while sending email' };
  }
}