import { getRealUSDCBalance } from "./blockchain";
import { DeployedToken } from "./tokenRegistry";

const USER_BALANCES_KEY_PREFIX = "arcone_user_token_balances_v2_";
const USER_USDC_DELTA_KEY_PREFIX = "arcone_user_usdc_delta_v1_";

export function getLocalUSDCDelta(address?: string | null): number {
  if (typeof window === "undefined" || !address) return 0;
  try {
    const raw = localStorage.getItem(`${USER_USDC_DELTA_KEY_PREFIX}${address.toLowerCase()}`);
    if (raw) {
      const val = parseFloat(raw);
      return isNaN(val) ? 0 : val;
    }
  } catch (err) {
    console.error("Error reading local USDC delta:", err);
  }
  return 0;
}

export function addLocalUSDCDelta(address: string, deltaAmount: number): void {
  if (typeof window === "undefined" || !address) return;
  try {
    const current = getLocalUSDCDelta(address);
    const updated = Math.max(0, current + deltaAmount);
    localStorage.setItem(`${USER_USDC_DELTA_KEY_PREFIX}${address.toLowerCase()}`, updated.toString());
  } catch (err) {
    console.error("Error saving local USDC delta:", err);
  }
}

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
    const delta = getLocalUSDCDelta(address);
    if (realUsdcBalance !== undefined) return Math.max(0, realUsdcBalance);
    const onchain = await getRealUSDCBalance(address);
    return Math.max(0, onchain + delta);
  }

  // 2. Swapped token balance in user's personal wallet
  const localBalances = getLocalTokenBalances(address);
  const sym = token.symbol.toUpperCase();
  if (localBalances[sym] !== undefined) {
    return localBalances[sym];
  }

  // 3. Newly deployed tokens start with 0 in user's personal wallet
  return 0;
}
