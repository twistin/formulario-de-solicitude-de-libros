import type { BookRequest, RequestStatus } from '../types';

// URL base da API Django (ajustable mediante variable de entorno)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Función auxiliar para manexar erros HTTP
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error descoñecido' }));
    throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
  }
  return response.json();
};

// Interface para resposta paginada de Django REST Framework
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Función para obter todas as solicitudes desde o backend Django
export const getRequests = async (): Promise<BookRequest[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/`);
    const data = await handleResponse<PaginatedResponse<BookRequest>>(response);
    // Django REST Framework devolve os datos en 'results'
    return data.results || [];
  } catch (error) {
    console.error("Error fetching requests from backend:", error);
    throw error;
  }
};

// Función para engadir unha nova solicitude
export const addRequest = async (newRequestData: Omit<BookRequest, 'id' | 'status'>): Promise<BookRequest> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newRequestData,
        status: 'Pendente', // Estado inicial
      }),
    });
    const data = await handleResponse<BookRequest>(response);
    return data;
  } catch (error) {
    console.error("Error adding request to backend:", error);
    throw error;
  }
};

// Función para actualizar o estado dunha solicitude
export const updateRequestStatus = async (id: string, status: RequestStatus): Promise<BookRequest> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    const data = await handleResponse<BookRequest>(response);
    return data;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

// Función para eliminar unha solicitude
export const deleteRequest = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
};
