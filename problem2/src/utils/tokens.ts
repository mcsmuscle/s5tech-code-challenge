export function getTokenIconUrl(symbol: string) {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${encodeURIComponent(
    symbol
  )}.svg`;
}

export function displaySymbol(symbol: string) {
  return symbol.toUpperCase();
}
