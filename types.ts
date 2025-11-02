export type RequestStatus = 'Pendente' | 'Aprobado' | 'Mercado' | 'Rexeitado';

export interface BookRequest {
  id: number | string; // Django devuelve number, localStorage usaba string
  name: string;
  email: string;
  book: string;
  date: string;
  status: RequestStatus;
}

export type User = {
  name: string;
  role: 'student' | 'admin';
};
