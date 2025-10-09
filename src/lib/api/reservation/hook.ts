import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReservations,
  createReservation,
  cancelReservation,
  getLocations,
} from "./provider";
import { ReservationEntity, CreateReservationEntity } from "./entity";

export const reservationQueryKeys = {
  all: (hackathonId: string) => ["reservations", hackathonId] as const,
  locations: ["locations"] as const,
};

export function useReservations(hackathonId: string) {
  return useQuery<ReservationEntity[]>({
    queryKey: reservationQueryKeys.all(hackathonId),
    queryFn: () => getReservations(hackathonId),
    enabled: Boolean(hackathonId),
  });
}

export function useLocations() {
  return useQuery({
    queryKey: reservationQueryKeys.locations,
    queryFn: getLocations,
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationEntity) => createReservation(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: reservationQueryKeys.all(variables.hackathonId),
      });
    },
  });
}

export function useCancelReservation(hackathonId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) => cancelReservation(reservationId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: reservationQueryKeys.all(hackathonId),
      });
    },
  });
}