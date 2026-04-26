import { request } from './http-client';
import type { ReservationItem } from './reservations.service';

export type ConcertListItem = {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  reservedCount: number;
  remainingSeats: number;
  soldOut: boolean;
};

export const concertsApi = {
  list: () => request<ConcertListItem[]>('/concerts'),
  get: (id: string) => request<ConcertListItem>(`/concerts/${id}`),
  create: (body: { name: string; description: string; totalSeats: number }) =>
    request<ConcertListItem>('/concerts', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    request<void>(`/concerts/${id}`, { method: 'DELETE' }),
  reserve: (concertId: string) =>
    request<ReservationItem>(`/concerts/${concertId}/reservations`, {
      method: 'POST',
    }),
};
