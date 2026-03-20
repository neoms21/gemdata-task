import { useQuery } from "@tanstack/react-query";
import type { UniverseDefinitionItem } from "../types/universe-definition";
import { format } from "date-fns";

const DATE_FORMAT = "dd/MM/yyyy hh:mm aa";

const orderDataAndFormatDate = (data: UniverseDefinitionItem[]) => {
  const sorted = [...data].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  const seenServices = new Set<string>();
  return sorted.map((item) => {
    const originalDate = format(new Date(item.date), DATE_FORMAT);
    if (!seenServices.has(item.service)) {
      seenServices.add(item.service);
      return { ...item, date: "Latest", originalDate };
    }
    return { ...item, date: originalDate, originalDate };
  });
};

export function useUniverseDefinitions() {
  return useQuery<UniverseDefinitionItem[], Error>({
    queryKey: ["universeDefinitions"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/universeDefinitions");
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
