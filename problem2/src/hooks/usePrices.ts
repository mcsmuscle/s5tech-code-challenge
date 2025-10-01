import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { http } from "../services/http";
import type { PriceItem, PricesResponse } from "../types/prices";

type PricesMap = Record<string, PriceItem>;

function toPricesMap(items: PricesResponse): PricesMap {
  const map: PricesMap = {};
  for (const item of items) {
    const existing = map[item.currency];
    if (!existing || new Date(item.date) > new Date(existing.date)) {
      map[item.currency] = item;
    }
  }
  return map;
}

export function usePrices() {
  return useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      const res = await http.get<PricesResponse>(
        "https://interview.switcheo.com/prices.json"
      );
      return toPricesMap(res.data);
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 3,
    placeholderData: keepPreviousData,
  });
}
