import type { UniverseDefinitionItem } from "../types/universe-definition";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { createElement } from "react";
import { server } from "../test/setup";
import { describe, it, expect, beforeEach } from "vitest";
import { useUniverseDefinitions } from "./useUniverseDefinitions";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockData: UniverseDefinitionItem[] = [
  {
    id: "1",
    date: "2026-01-01T00:00:00.000Z",
    service: "equity_vanilla_option",
    region: "HKG",
    submittedBy: "Alice",
    canUploadSUD: true,
  },
  {
    id: "2",
    date: "2026-03-20T12:00:00.000Z",
    service: "equity_forward_ndf",
    region: "SGP",
    submittedBy: "Bob",
    canUploadSUD: false,
  },
  {
    id: "3",
    date: "2025-06-15T08:00:00.000Z",
    service: "equity_barrier_option",
    region: "LDN",
    submittedBy: "Carol",
    canUploadSUD: true,
  },
];

const render = (data = mockData) => {
  server.use(
    http.get(API_URL, () => {
      return HttpResponse.json(data);
    }),
  );
  const { result } = renderHook(() => useUniverseDefinitions(), {
    wrapper: createWrapper(),
  });
  return result;
};

const API_URL = "http://localhost:3000/universeDefinitions";

describe("useUniverseDefinitions", () => {
  beforeEach(() => {});
  describe("on Success", () => {
    it("returns data on success", async () => {
      const result = render();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(3);
    });

    it("returns data sorted by date descending (newest first)", async () => {
      const result = render();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Filter out 'Latest' entries (they are the most recent per-service, assigned by the hook)
      const dates = result.current
        .data!.filter((item) => item.date !== "Latest")
        .map((item) => new Date(item.date).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    });

    it("the first item after sort is the most recent entry", async () => {
      const result = render();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data![0].id).toBe("2"); // 2026-03-20 is the most recent
    });
  });

  it("returns an error state on fetch failure", async () => {
    server.use(
      http.get(API_URL, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useUniverseDefinitions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Failed to fetch data");
  });

  it("returns empty array when API returns empty list", async () => {
    server.use(
      http.get(API_URL, () => {
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useUniverseDefinitions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("should return the first row of a every service with date as Latest", async () => {
    const result = render([
      {
        id: "1",
        date: "2026-03-18T15:23:12.000Z",
        service: "equity_vanilla_option",
        region: "HKG",
        submittedBy: "Alice",
        canUploadSUD: true,
      },
      {
        id: "2",
        date: "2026-03-14T15:23:12.000Z",
        service: "equity_vanilla_option",
        region: "HKG",
        submittedBy: "Alice",
        canUploadSUD: true,
      },
      {
        id: "3",
        date: "2026-03-20T12:00:00.000Z",
        service: "equity_forward_ndf",
        region: "SGP",
        submittedBy: "Bob",
        canUploadSUD: false,
      },
      {
        id: "4",
        date: "2025-06-15T08:00:00.000Z",
        service: "equity_barrier_option",
        region: "LDN",
        submittedBy: "Carol",
        canUploadSUD: true,
      },
    ]);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const hkg1Item = result.current.data?.find((item) => item.id === "1");
    console.log("🚀 ~ hkg1Item:", hkg1Item);
    expect(hkg1Item?.date).toBe("Latest");

    const hkg2Item = result.current.data?.find((item) => item.id === "2");
    expect(hkg2Item?.date).toBe("14/03/2026 03:23 PM");
  });
});
