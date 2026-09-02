export interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  usdcAddress: string;
  faucetUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const arcTestnet: NetworkConfig = {
  chainId: 5042002,
  chainIdHex: "0x4cef52", // Exactly 5042002 in hex (5042002.toString(16) === "4cef52")
  name: "Arc Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_ARC_TESTNET_RPC_URL || "https://rpc.testnet.arc.network",
  explorerUrl: process.env.NEXT_PUBLIC_ARC_TESTNET_EXPLORER_URL || "https://testnet.arcscan.app",
  usdcAddress: process.env.NEXT_PUBLIC_ARC_TESTNET_USDC_ADDRESS || "0x3600000000000000000000000000000000000000",
  faucetUrl: "https://faucet.circle.com/",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
};

export const getExplorerTxUrl = (txHash: string) => `${arcTestnet.explorerUrl}/tx/${txHash}`;
export const getExplorerAddressUrl = (address: string) => `${arcTestnet.explorerUrl}/address/${address}`;
export const getExplorerBlockUrl = (blockNumber: number | string) => `${arcTestnet.explorerUrl}/block/${blockNumber}`;
