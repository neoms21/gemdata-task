import { useQuery } from "@tanstack/react-query";
import type { UniverseDefinitionItem } from "../types/universe-definition";
import { format } from "date-fns";

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
