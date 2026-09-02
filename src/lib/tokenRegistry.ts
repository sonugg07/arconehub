export interface DeployedToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  priceUSDC: number;
  creator?: string;
  txHash?: string;
  createdAt: string;
  color?: string;
}

const STORAGE_KEY = "arcone_deployed_tokens_v2";

export const DEFAULT_TOKENS: DeployedToken[] = [
  {
    address: "0x3600000000000000000000000000000000000000",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    totalSupply: 100000000,
    priceUSDC: 1.0,
    createdAt: "2026-01-01T00:00:00Z",
    color: "#0066ff",
  },
  {
    address: "0x1A20194801928304918203948102938401928301",
    name: "Euro Coin (Circle)",
    symbol: "EURC",
    decimals: 6,
    totalSupply: 50000000,
    priceUSDC: 1.085, // 1 EURC ≈ 1.085 USDC
    createdAt: "2026-01-05T00:00:00Z",
    color: "#0052FF",
  },
  {
    address: "0x2B30194801928304918203948102938401928302",
    name: "Circle Wrapped Bitcoin",
    symbol: "cirBTC",
    decimals: 8,
    totalSupply: 21000000,
    priceUSDC: 64850.0, // 1 cirBTC ≈ 64,850 USDC
    createdAt: "2026-01-10T00:00:00Z",
    color: "#F7931A",
  },
  {
    address: "0x8920194801928304918203948102938401928304",
    name: "ArcX Governance",
    symbol: "ARCX",
    decimals: 18,
    totalSupply: 50000000,
    priceUSDC: 0.8695, // 1 USDC = 1.15 ARCX
    createdAt: "2026-01-15T00:00:00Z",
    color: "#8b5cf6",
  },
  {
    address: "0x4B20194801928304918203948102938401928304",
    name: "Nova Protocol",
    symbol: "NOVA",
    decimals: 18,
    totalSupply: 10000000,
    priceUSDC: 0.25, // 1 USDC = 4 NOVA
    createdAt: "2026-02-01T00:00:00Z",
    color: "#06b6d4",
  },
];

export function getStoredTokens(): DeployedToken[] {
  if (typeof window === "undefined") return DEFAULT_TOKENS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TOKENS));
      return DEFAULT_TOKENS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Ensure all official default tokens exist in the list
      const combined = [...parsed];
      for (const def of DEFAULT_TOKENS) {
        if (!combined.some((t) => t.symbol.toUpperCase() === def.symbol.toUpperCase())) {
          combined.push(def);
        }
      }
      return combined;
    }
    return DEFAULT_TOKENS;
  } catch {
    return DEFAULT_TOKENS;
  }
}

export function saveDeployedToken(token: DeployedToken): void {
  if (typeof window === "undefined") return;
  const existing = getStoredTokens();
  // Check if token already exists
  const exists = existing.some(
    (t) => t.address.toLowerCase() === token.address.toLowerCase() || t.symbol.toUpperCase() === token.symbol.toUpperCase()
  );
  let updated: DeployedToken[];
  if (exists) {
    updated = existing.map((t) =>
      t.address.toLowerCase() === token.address.toLowerCase() ? token : t
    );
  } else {
    updated = [token, ...existing];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
