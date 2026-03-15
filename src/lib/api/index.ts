import { TodoAPIClient } from './client';

let apiClient: TodoAPIClient | null = null;
let errorHandler: ((message: string, status: number) => void) | null = null;

export function initAPIClient(baseURL?: string) {
  apiClient = new TodoAPIClient(baseURL, (message, status) => {
    if (errorHandler) {
      errorHandler(message, status);
    }
  });
  return apiClient;
}

export function setErrorHandler(handler: (message: string, status: number) => void) {
  errorHandler = handler;
}

export function getAPIClient(): TodoAPIClient {
  if (!apiClient) {
    apiClient = initAPIClient();
  }
  return apiClient;
}
