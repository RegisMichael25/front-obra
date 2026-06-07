const API_URL = import.meta.env.VITE_API_JAVA_URL || 'http://localhost:8080';

type FetchOptions = RequestInit & {
  data?: any;
};

type DownloadOptions = FetchOptions & {
  filename?: string;
};

function getFilenameFromDisposition(disposition: string | null) {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/"/g, ''));
  }

  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
  return filenameMatch?.[1] || null;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      // Token expirou ou é inválido (apenas se não for a própria chamada de login)
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject('Sessão expirada');
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro na requisição da API');
  }

  // Verifica se não há conteúdo (ex: DELETE 204)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

async function downloadApi(endpoint: string, options: DownloadOptions = {}): Promise<void> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    method: options.method || 'GET',
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject('Sessao expirada');
    }

    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro ao baixar arquivo');
  }

  const blob = await response.blob();
  const filename = getFilenameFromDisposition(response.headers.get('Content-Disposition')) || options.filename || 'exportacao';

  triggerDownload(blob, filename);
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: any, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'POST', data }),
  put: <T>(endpoint: string, data?: any, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'PUT', data }),
  delete: <T>(endpoint: string, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
  download: (endpoint: string, options?: DownloadOptions) => downloadApi(endpoint, options),
};
