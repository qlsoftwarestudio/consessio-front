import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehiclesService, type VehicleFilters } from "../api/vehicles.service";

export const vehiclesKeys = {
  all: ["vehicles"] as const,
  list: (p: VehicleFilters) => ["vehicles", "list", p] as const,
};

export const useVehicles = (params: VehicleFilters = {}) =>
  useQuery({
    queryKey: vehiclesKeys.list(params),
    queryFn: () => vehiclesService.list(params),
  });

export const useCreateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: vehiclesService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehiclesKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useReserveVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehiclesService.reserve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehiclesKeys.all }),
  });
};

export const useSellVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehiclesService.sell(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehiclesKeys.all }),
  });
};
