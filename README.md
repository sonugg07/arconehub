# 🌌 ArcOne Hub — One Hub. Everything Onchain.

> **Pay. Swap. Launch. Work.**  
> The unified financial super-app designed for the **Arc Ecosystem** with sub-second EVM finality and predictable native USDC gas fees.

![ArcOne Hub](https://raw.githubusercontent.com/sonugg07/arconehub/main/public/brand/preview.png)

---

## ⚡ Overview

ArcOne Hub bridges the gap between institutional-grade financial rails and high-speed Web3 applications. Powered by the **Arc Testnet** and **Native USDC gas**, ArcOne provides a multi-purpose onchain portal combining payments, decentralized exchange (DEX), token launching, and smart contract escrow.

---

## 🌐 Arc Testnet Network Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | `Arc Testnet` |
| **Chain ID (Decimal)** | `5042002` |
| **Chain ID (Hex)** | `0x4cef52` |
| **Native Gas Token** | `USDC` (18 / 6 decimals) |
| **RPC URL** | `https://rpc.testnet.arc.network` |
| **Block Explorer** | [https://testnet.arcscan.app](https://testnet.arcscan.app) |
| **Circle Faucet** | [https://faucet.circle.com](https://faucet.circle.com) |

---

## 🚀 Core Modules

### 1. 💳 ArcOne Pay (`/app/pay` & `/pay/[id]`)
- **Instant USDC Settlement**: P2P and merchant payments settling in `< 400ms`.
- **Shareable Payment Links**: Generate dynamic onchain invoice requests with QR codes and 1-click payment dispatch.
- **Onchain Verification**: Automatic receipt polling and ArcScan transaction tracking.

### 2. 🔄 ArcOne Swap (`/app/swap`)
- **Live Onchain AMM DEX**: Trade native USDC and any deployed Arc tokens.
- **Fair-Launch AMM Architecture**: Real-time pricing via Constant Product curve ($x \cdot y = k$).
- **Percentage Quick-Selectors**: `25%`, `50%`, `75%`, `100% (MAX)` auto-calculating off real wallet balances.
- **Zero-Error Gas Engine**: Safe gas-limit dispatching preventing EVM call reverts.

### 3. 🚀 Token Launchpad (`/app/launch`)
- **1-Click ERC-20 Factory**: Deploy audited, standard OpenZeppelin-compatible smart contracts directly to Arc Testnet.
- **Live 3D Coin Preview**: Real-time Three.js metallic coin emblem visualization with custom gradients.
- **Automatic DEX Sync**: Deployed tokens immediately register in the shared token registry and become available for trading on ArcOne Swap.

### 4. 💼 Jobs & Milestone Escrow (`/app/jobs`)
- **Onchain Freelance & Grants Directory**: Find Web3 talent, hire protocol engineers, and fund milestone escrows.
- **Smart Contract Escrow**: 100% funds locked until milestone approval and cryptographic release.
- **Persistent State**: Full client-side sync preserving listings across all sessions.

### 5. 🏢 Company Suite (`/app/company`)
- **Streamed Payroll & Multi-Sig Vaults**: Schedule continuous token streaming and manage team compensation.
- **Corporate Treasury Dashboard**: Financial health index, burn rate analytics, and compliance reporting.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org) + [React 18](https://react.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + Dark Glassmorphism + [PostCSS](https://postcss.org)
- **3D Graphics**: [Three.js](https://threejs.org) + Canvas WebGL Shaders + 3D HUD Visuals
- **Blockchain Interop**: [ethers.js v6](https://docs.ethers.org) + Solidity Compiler (`solc`) + OpenZeppelin Contracts
- **Icons & Micro-interactions**: [Lucide React](https://lucide.dev) + [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 📦 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher
- npm / yarn / pnpm
- Web3 Wallet (MetaMask, Rabby, Coinbase Wallet) configured with Arc Testnet

### Installation

```bash
# 1. Clone repository
git clone https://github.com/sonugg07/arconehub.git
cd arconehub

# 2. Install dependencies
npm install

# 3. Compile Smart Contracts
node scripts/compile.js

# 4. Start Local Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT © [ArcOne Hub](https://arcone.hub) — One Hub. Everything Onchain.
