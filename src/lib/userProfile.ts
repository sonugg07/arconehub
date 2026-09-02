import { arcTestnet } from "@/config/network";
import { formatAddress } from "./utils";

export interface UserProfile {
  displayName: string;
  arcDomain: string;
  bio: string;
  rpcUrl: string;
  chainId: string;
  notifTx: boolean;
  notifEscrow: boolean;
  notifMarketing: boolean;
}

const STORAGE_PREFIX = "arcone_profile_";

export function getDefaultProfile(address?: string | null): UserProfile {
  const shortAddr = address ? address.slice(2, 6).toUpperCase() : "71C";
  const domainPrefix = address ? address.slice(2, 8).toLowerCase() : "arc";

  return {
    displayName: address ? `Arc Developer #${shortAddr}` : "Arc Developer #71C",
    arcDomain: `${domainPrefix}.arcone.hub`,
    bio: "Fullstack Web3 engineer and protocol architect building on Arc & USDC.",
    rpcUrl: arcTestnet.rpcUrl,
    chainId: arcTestnet.chainId.toString(),
    notifTx: true,
    notifEscrow: true,
    notifMarketing: false,
  };
}

export function getUserProfile(address?: string | null): UserProfile {
  if (typeof window === "undefined") return getDefaultProfile(address);

  const key = address ? `${STORAGE_PREFIX}${address.toLowerCase()}` : `${STORAGE_PREFIX}default`;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultProfile(address),
        ...parsed,
        rpcUrl: arcTestnet.rpcUrl,
        chainId: arcTestnet.chainId.toString(),
      };
    }
  } catch (err) {
    console.error("Failed to read user profile:", err);
  }

  return getDefaultProfile(address);
}

export function saveUserProfile(address: string | null | undefined, profile: UserProfile): void {
  if (typeof window === "undefined") return;

  const key = address ? `${STORAGE_PREFIX}${address.toLowerCase()}` : `${STORAGE_PREFIX}default`;
  try {
    localStorage.setItem(key, JSON.stringify(profile));
    // Also save as latest active profile
    localStorage.setItem(`${STORAGE_PREFIX}active`, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save user profile:", err);
  }
}
