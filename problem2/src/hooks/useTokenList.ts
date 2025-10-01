import { useMemo } from "react";
import { getTokenIconUrl } from "../utils/tokens";
import { usePrices } from "./usePrices";

export type TokenMeta = {
  symbol: string;
  icon: string;
  hasPrice: boolean;
};

export function useTokenList(): {
  tokens: TokenMeta[];
  isLoading: boolean;
  error?: string;
} {
  const { data, isLoading, error } = usePrices();
  const tokens = useMemo(() => {
    if (!data) return [];
    return Object.keys(data)
      .map((symbol) => ({
        symbol,
        icon: getTokenIconUrl(symbol),
        hasPrice: Number.isFinite(data[symbol].price),
      }))
      .filter((t) => t.hasPrice);
  }, [data]);

  return {
    tokens,
    isLoading,
    error: error
      ? (error as any).message ?? "Failed to load prices"
      : undefined,
  };
}
