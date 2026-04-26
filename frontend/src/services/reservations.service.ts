import { request } from './http-client';

export type ReservationItem = {
  id: string;
  userId: string;
  concertId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditReservationItem = {
  id: string;
  userId: string;
  userEmail: string | null;
  concertId: string;
  concertName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const reservationsApi = {
  mine: () => request<ReservationItem[]>('/reservations/me'),
  cancel: (id: string) =>
    request<ReservationItem>(`/reservations/${id}`, { method: 'DELETE' }),
  audit: () => request<AuditReservationItem[]>('/reservations'),
};
