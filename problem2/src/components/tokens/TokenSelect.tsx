import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Fragment, useMemo, useState } from "react";
import { useTokenList } from "../../hooks/useTokenList";

type Props = {
  value?: string;
  onChange: (symbol: string) => void;
  exclude?: string;
};

export function TokenSelect({ value, onChange, exclude }: Props) {
  const { tokens, isLoading, error } = useTokenList();
  const [query, setQuery] = useState("");

  const selectedToken = useMemo(
    () => tokens.find((t) => t.symbol === value),
    [tokens, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tokens
      .filter((t) => t.symbol !== exclude)
      .filter((t) => !q || t.symbol.toLowerCase().includes(q));
  }, [tokens, query, exclude]);

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton className="group relative cursor-pointer rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/10 hover:border-white/20 py-2.5 pl-3 pr-11 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 min-w-[140px]">
            {selectedToken ? (
              <>
                <div className="relative flex-shrink-0">
                  <img
                    src={selectedToken.icon}
                    alt={selectedToken.symbol}
                    className="w-8 h-8 rounded-full ring-2 ring-white/20"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div className="flex flex-col items-start flex-shrink-0">
                  <span className="text-white font-bold text-base leading-none">
                    {selectedToken.symbol}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-white/50 font-semibold text-sm">
                Select
              </span>
            )}
            <ChevronDownIcon
              className={`absolute right-3 w-5 h-5 text-white/50 group-hover:text-white/70 transition-all duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            afterLeave={() => setQuery("")}
          >
            <ListboxOptions className="absolute right-0 z-[100] mt-2 w-80 origin-top-right rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 shadow-2xl focus:outline-none overflow-hidden">
              {/* Search Box */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tokens..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Token List */}
              <div className="max-h-80 overflow-y-auto overscroll-contain">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white/50 text-sm">
                      Loading tokens...
                    </span>
                  </div>
                )}

                {error && (
                  <div className="py-12 text-center">
                    <div className="text-red-400 text-sm">
                      ⚠️ Failed to load tokens
                    </div>
                    <div className="text-white/30 text-xs mt-1">
                      Please try again
                    </div>
                  </div>
                )}

                {!isLoading && !error && filtered.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="text-white/30 text-sm">No tokens found</div>
                    <div className="text-white/20 text-xs mt-1">
                      Try a different search
                    </div>
                  </div>
                )}

                {!isLoading &&
                  !error &&
                  filtered.map((token) => (
                    <ListboxOption
                      key={token.symbol}
                      value={token.symbol}
                      className={({ active }) =>
                        `relative cursor-pointer select-none transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                            : "hover:bg-white/5"
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <div className="flex items-center gap-3 px-4 py-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={token.icon}
                              alt={token.symbol}
                              className="w-10 h-10 rounded-full ring-2 ring-white/10"
                            />
                            {selected && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-[#0a0a0f]">
                                <CheckIcon className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  active ? "text-white" : "text-white/90"
                                }`}
                              >
                                {token.symbol}
                              </span>
                              {selected && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold">
                                  Selected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </ListboxOption>
                  ))}
              </div>
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
