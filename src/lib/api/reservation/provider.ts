import { apiFetch } from "@/lib/api/apiClient";
import { ReservationEntity, CreateReservationEntity, LocationEntity } from "./entity";

export async function getReservations(
  hackathonId: string
): Promise<ReservationEntity[]> {
  return apiFetch<ReservationEntity[]>(
    `/reservations?hackathonId=${hackathonId}`,
    { method: "GET" }
  );
}

export async function createReservation(
  data: CreateReservationEntity
): Promise<ReservationEntity> {
  return apiFetch<ReservationEntity>("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export async function cancelReservation(reservationId: string): Promise<void> {
  return apiFetch<void>(`/reservations/${reservationId}`, {
    method: "DELETE",
  });
}

export async function getLocations(): Promise<LocationEntity[]> {
  return apiFetch<LocationEntity[]>("/locations", { method: "GET" });
}