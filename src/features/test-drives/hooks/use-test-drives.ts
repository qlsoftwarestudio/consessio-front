import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { testDrivesService } from "../api/test-drives.service";

export const testDrivesKeys = {
  all: ["test-drives"] as const,
};

export const useTestDrives = () =>
  useQuery({
    queryKey: testDrivesKeys.all,
    queryFn: () => testDrivesService.list(),
  });

export const useCreateTestDrive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: testDrivesService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: testDrivesKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
