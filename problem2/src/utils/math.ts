export function safeDiv(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return 0;
  return a / b;
}

export function toFixedFloor(n: number, decimals = 6): string {
  if (!Number.isFinite(n) || n <= 0) return "0.000000";
  const factor = Math.pow(10, decimals);
  return (Math.floor(n * factor) / factor).toFixed(decimals);
}

export function computeRate(priceFrom: number, priceTo: number): number {
  // 1 from = priceFrom USD; 1 to = priceTo USD
  // Therefore: 1 from = (priceFrom / priceTo) to
  return safeDiv(priceFrom, priceTo);
}

export function computeReceive(amount: number, rate: number): number {
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isFinite(rate) ||
    rate <= 0
  )
    return 0;
  return amount * rate;
}
