class TodoAPIClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private onError?: (message: string, status: number) => void;

  constructor(baseURL: string = 'http://localhost:8000/api/v1', onError?: (message: string, status: number) => void) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.onError = onError;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || response.statusText || 'API Error';
        const errorStatus = response.status;
        
        if (this.onError) {
          this.onError(errorMessage, errorStatus);
        }
        
        throw new APIError(errorMessage, errorStatus);
      }

      if (response.status === 204) {
        return null as T;
      }

      const responseData = await response.json();
      console.log('[API Client] Response from', endpoint, ':', responseData);
      return responseData;
    } catch (error) {
      if (error instanceof APIError) {
        if (this.onError) {
          this.onError(error.message, error.status);
        }
        throw error;
      }
      const errorMessage = 'Сервис недоступен. Проверьте подключение к интернету.';
      if (this.onError) {
        this.onError(errorMessage, 0);
      }
      throw new APIError(errorMessage, 0);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    console.log('[API Client] GET', endpoint);
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const keysToKeepNull = ['project_id', 'context_id', 'area_id', 'waiting_for'];
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([key, v]) => v !== null || keysToKeepNull.includes(key))
    );
    console.log('[API Client] PATCH', endpoint, '- Original data:', data);
    console.log('[API Client] PATCH', endpoint, '- Cleaned data:', cleanedData);
    console.log('[API Client] PATCH', endpoint, '- Request body JSON:', JSON.stringify(cleanedData, null, 2));
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(cleanedData),
    });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request<void>(endpoint, { method: 'DELETE' });
  }
}

class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

export { TodoAPIClient, APIError };
