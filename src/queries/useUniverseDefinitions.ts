import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UniverseDefinitionItem } from "../types/universe-definition";
import { format } from "date-fns";
import { API_URL } from "@/helpers/constants";

const DATE_FORMAT = "dd/MM/yyyy hh:mm aa";

const orderDataAndFormatDate = (data: UniverseDefinitionItem[]) => {
  const withTimestamps = data.map((item) => ({
    ...item,
    timestamp: new Date(item.date).getTime(),
  }));

  const sorted = withTimestamps.sort((a, b) => b.timestamp - a.timestamp);

  const latest: (UniverseDefinitionItem & { originalDate: string })[] = [];
  const others: (UniverseDefinitionItem & { originalDate: string })[] = [];
  const seenServices = new Set<string>();

  for (const item of sorted) {
    const originalDate = format(item.timestamp, DATE_FORMAT);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { timestamp, ...rest } = item;

    if (!seenServices.has(item.service)) {
      seenServices.add(item.service);
      latest.push({ ...rest, date: "Latest", originalDate });
    } else {
      others.push({ ...rest, date: originalDate, originalDate });
    }
  }

  return [...latest, ...others];
};

export function useUniverseDefinitions() {
  return useQuery<UniverseDefinitionItem[], Error>({
    queryKey: ["universeDefinitions"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    },
    select: (data) => {
      return orderDataAndFormatDate(data);
    },
  });
}

export function useDeleteUniverseDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete universe definition");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universeDefinitions"] });
    },
  });
}

export function useUploadUniverseDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEntry: Omit<UniverseDefinitionItem, "id">) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEntry,
          id: Date.now().toString(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to upload universe definition");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universeDefinitions"] });
    },
  });
}
