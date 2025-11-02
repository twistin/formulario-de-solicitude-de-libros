export type RequestStatus = 'Pendente' | 'Aprobado' | 'Mercado' | 'Rexeitado';

export interface BookRequest {
  id: string;
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
