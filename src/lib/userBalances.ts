import { getRealUSDCBalance } from "./blockchain";
import { DeployedToken } from "./tokenRegistry";

const USER_BALANCES_KEY_PREFIX = "arcone_user_token_balances_v2_";

export function getLocalTokenBalances(address?: string | null): Record<string, number> {
  if (typeof window === "undefined" || !address) return {};
  try {
    const raw = localStorage.getItem(`${USER_BALANCES_KEY_PREFIX}${address.toLowerCase()}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    }
  } catch (err) {
    console.error("Error reading local token balances:", err);
  }
  return {};
}

export function saveLocalTokenBalance(address: string, symbol: string, newBalance: number): void {
  if (typeof window === "undefined" || !address) return;
  try {
    const existing = getLocalTokenBalances(address);
    existing[symbol.toUpperCase()] = Math.max(0, parseFloat(newBalance.toFixed(6)));
    localStorage.setItem(`${USER_BALANCES_KEY_PREFIX}${address.toLowerCase()}`, JSON.stringify(existing));
  } catch (err) {
    console.error("Error saving local token balance:", err);
  }
}

export async function fetchAccurateTokenBalance(
  token: DeployedToken,
  address?: string | null,
  realUsdcBalance?: number
): Promise<number> {
  if (!address) return 0;

  // 1. USDC is the native gas token on Arc Testnet
  if (token.symbol.toUpperCase() === "USDC") {
    if (realUsdcBalance !== undefined) return realUsdcBalance;
    return await getRealUSDCBalance(address);
  }

  // 2. Swapped token balance in user's personal wallet
  const localBalances = getLocalTokenBalances(address);
  const sym = token.symbol.toUpperCase();
  if (localBalances[sym] !== undefined) {
    return localBalances[sym];
  }

  // 3. Newly deployed tokens start with 0 in user's personal wallet
  // (The total supply is locked in the AMM Liquidity Pool for trading)
  return 0;
}
