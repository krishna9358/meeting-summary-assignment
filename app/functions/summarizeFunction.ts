import { API_ENDPOINTS } from '../config/apiPrefix';

export interface SummarizeRequest {
  transcript: string;
  prompt: string;
}

export interface SummarizeResponse {
  summary?: string;
  error?: string;
}

export async function summarizeTranscript(
  transcript: string,
  prompt: string
): Promise<SummarizeResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.SUMMARIZE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, prompt }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Failed to generate summary' };
    }

    return { summary: data.summary || '' };
  } catch (error) {
    console.error('Summarize function error:', error);
    return { error: 'Network error occurred while generating summary' };
  }
}