import {
  ArrowsUpDownIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { usePrices } from "../../hooks/usePrices";
import { computeRate, computeReceive, toFixedFloor } from "../../utils/math";
import { swapSchema, type SwapFormValues } from "../../validation/swapSchema";
import { TokenSelect } from "../tokens/TokenSelect";

export function SwapForm() {
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  const form = useForm<SwapFormValues>({
    resolver: zodResolver(swapSchema),
    defaultValues: { fromToken: "", toToken: "", amount: "" },
    mode: "onChange",
  });

  const { data: prices, isLoading, error } = usePrices();

  const from = form.watch("fromToken");
  const to = form.watch("toToken");
  const amountStr = form.watch("amount");
  const amount = Number(amountStr);

  const rate = useMemo(() => {
    if (!prices || !from || !to) return 0;
    const pFrom = prices[from]?.price;
    const pTo = prices[to]?.price;
    if (!Number.isFinite(pFrom) || !Number.isFinite(pTo)) return 0;
    return computeRate(pFrom, pTo);
  }, [prices, from, to]);

  const receive = useMemo(() => {
    if (!Number.isFinite(amount) || amount <= 0 || rate <= 0) return 0;
    return computeReceive(amount, rate);
  }, [amount, rate]);

  function flipTokens() {
    const prevFrom = form.getValues("fromToken");
    const prevTo = form.getValues("toToken");
    if (!prevFrom || !prevTo) return;
    form.setValue("fromToken", prevTo, { shouldValidate: true });
    form.setValue("toToken", prevFrom, { shouldValidate: true });
  }

  async function onSubmit(values: SwapFormValues) {
    try {
      await new Promise((r) => setTimeout(r, 600));
      alert(
        `Swapping ${values.amount} ${values.fromToken} → ${toFixedFloor(
          receive
        )} ${values.toToken} at rate ${toFixedFloor(rate)}`
      );
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Unknown error during swap";
      alert(`Swap failed: ${message}`);
    }
  }

  const disableSubmit =
    !form.formState.isValid ||
    isLoading ||
    !!error ||
    rate <= 0 ||
    receive <= 0 ||
    !from ||
    !to;

  const fromUsdValue =
    amount && from && prices?.[from] ? amount * prices[from].price : 0;
  const toUsdValue =
    receive && to && prices?.[to] ? receive * prices[to].price : 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-2xl"
      >
        {/* Header with Settings */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Swap</h2>
              <p className="text-xs text-white/50">Trade tokens instantly</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:rotate-90"
          >
            <Cog6ToothIcon className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 animate-in slide-in-from-top duration-300">
            <label className="text-white/70 text-sm font-medium mb-3 block">
              Slippage Tolerance
            </label>
            <div className="flex gap-2">
              {["0.1", "0.5", "1.0"].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSlippage(val)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    slippage === val
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {val}%
                </button>
              ))}
              <input
                type="text"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-20 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold text-center focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                placeholder="%"
              />
            </div>
          </div>
        )}

        {/* From Section */}
        <div className="mb-2 relative z-30">
          <div className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
            You Pay
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 group-hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between gap-4 mb-3">
                <input
                  {...form.register("amount")}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="flex-1 min-w-0 bg-transparent text-4xl font-bold text-white outline-none placeholder-white/20"
                />
                <div className="flex-shrink-0">
                  <TokenSelect
                    value={from}
                    onChange={(s) =>
                      form.setValue("fromToken", s, { shouldValidate: true })
                    }
                    exclude={to}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-white/50">
                  {fromUsdValue > 0 ? `${fromUsdValue.toFixed(2)}` : "$0.00"}
                </div>
                <div className="text-white/50">Balance: 0.00</div>
              </div>
              {form.formState.errors.amount && (
                <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  {form.formState.errors.amount.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-4 relative z-20">
          <button
            type="button"
            onClick={flipTokens}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-180 border-4 border-[#0a0a0f]"
          >
            <ArrowsUpDownIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* To Section */}
        <div className="mb-6 relative z-10">
          <div className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
            You Receive
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 group-hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex-1 text-4xl font-bold text-white">
                  {receive > 0 ? (
                    toFixedFloor(receive)
                  ) : (
                    <span className="text-white/20">0.00</span>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <TokenSelect
                    value={to}
                    onChange={(s) =>
                      form.setValue("toToken", s, { shouldValidate: true })
                    }
                    exclude={from}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-white/50">
                  {toUsdValue > 0 ? `${toUsdValue.toFixed(2)}` : "$0.00"}
                </div>
                <div className="text-white/50">Balance: 0.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Info */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-white/50 py-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Fetching prices...</span>
            </div>
          )}
          {error && (
            <div className="text-red-400 text-sm text-center py-2">
              ⚠️ Failed to fetch prices
            </div>
          )}
          {!isLoading && !error && from && to && rate > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Rate</span>
                <span className="text-white font-semibold">
                  1 {from} = {toFixedFloor(rate)} {to}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Slippage</span>
                <span className="text-white font-semibold">{slippage}%</span>
              </div>
            </div>
          ) : !isLoading && !error ? (
            <div className="text-white/30 text-sm text-center py-2">
              Select tokens to see exchange rate
            </div>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disableSubmit}
          className={`w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 ${
            disableSubmit
              ? "bg-white/5 text-white/30 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {!form.formState.isValid ? "Enter an amount" : "Swap Now"}
        </button>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-white/30">
          Powered by Switcheo • Decentralized Exchange
        </div>
      </form>
    </div>
  );
}
