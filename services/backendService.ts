import type { BookRequest, RequestStatus } from '../types';

const STORAGE_KEY = 'libraryBookRequests';

// Función para obter todas as solicitudes
export const getRequests = (): BookRequest[] => {
  try {
    const requestsJson = localStorage.getItem(STORAGE_KEY);
    if (!requestsJson) return [];
    const parsed = JSON.parse(requestsJson);
    if (!Array.isArray(parsed)) return [];
    // Filtrar elementos malformados por seguridade
    const valid: BookRequest[] = parsed.filter((item: any) => isValidBookRequest(item));
    return valid;
  } catch (error) {
    console.error("Error fetching requests from localStorage", error);
    return [];
  }
};

// Función para gardar todas as solicitudes
const saveRequests = (requests: BookRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving requests to localStorage", error);
  }
};

// Validación simple para asegurar que el objeto cumpre a forma esperada
const isValidBookRequest = (obj: any): obj is BookRequest => {
  if (!obj || typeof obj !== 'object') return false;
  const hasId = typeof obj.id === 'string' && obj.id.length > 0;
  const hasName = typeof obj.name === 'string';
  const hasEmail = typeof obj.email === 'string';
  const hasBook = typeof obj.book === 'string';
  const hasDate = typeof obj.date === 'string';
  const validStatus = ['Pendente', 'Aprobado', 'Mercado', 'Rexeitado'].includes(obj.status);
  return hasId && hasName && hasEmail && hasBook && hasDate && validStatus;
};

// Función para engadir unha nova solicitude
export const addRequest = (newRequestData: Omit<BookRequest, 'id' | 'status'>): BookRequest => {
  const currentRequests = getRequests();
  const newRequest: BookRequest = {
    ...newRequestData,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    status: 'Pendente',
  };
  const updatedRequests = [...currentRequests, newRequest];
  saveRequests(updatedRequests);
  return newRequest;
};

// Función para actualizar o estado dunha solicitude
export const updateRequestStatus = (id: string, status: RequestStatus): BookRequest[] => {
  const currentRequests = getRequests();
  const updatedRequests = currentRequests.map(req =>
    req.id === id ? { ...req, status } : req
  );
  saveRequests(updatedRequests);
  return updatedRequests;
};

// Función para eliminar unha solicitude
export const deleteRequest = (id: string): BookRequest[] => {
  const currentRequests = getRequests();
  const updatedRequests = currentRequests.filter(req => req.id !== id);
  saveRequests(updatedRequests);
  return updatedRequests;
};
