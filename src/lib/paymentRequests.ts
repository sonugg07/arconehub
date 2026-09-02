export interface PaymentRequest {
  id: string;
  sender?: string;
  recipient: string;
  amount: number;
  message: string;
  createdAt: string;
  expiry: string;
  status: "Pending" | "Paid" | "Expired" | "Cancelled";
  txHash?: string;
  confirmedAt?: string;
}

// In-memory / localStorage payment requests storage
const STORAGE_KEY = "arcone_payment_requests_v1";

const INITIAL_REQUESTS: PaymentRequest[] = [
  {
    id: "req_arc_9821",
    recipient: "0x71C94B98E2A7d1eF8459427bE48A1054C542E61F",
    amount: 25.0,
    message: "Arc Testnet Web3 Design Retainer",
    createdAt: "2026-09-01T12:00:00Z",
    expiry: "2026-09-10T12:00:00Z",
    status: "Pending",
  },
  {
    id: "req_arc_1042",
    recipient: "0x4B20194801928304918203948102938401928304",
    amount: 150.0,
    message: "Smart Contract Security Review",
    createdAt: "2026-08-31T14:30:00Z",
    expiry: "2026-09-07T14:30:00Z",
    status: "Paid",
    txHash: "0x892a019480192830491820394810293840192830491820394810293840192830",
    confirmedAt: "2026-08-31T14:45:10Z",
  },
];

export function getStoredPaymentRequests(): PaymentRequest[] {
  if (typeof window === "undefined") return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function getPaymentRequestById(id: string): PaymentRequest | null {
  const all = getStoredPaymentRequests();
  return all.find((r) => r.id === id) || null;
}

export function savePaymentRequest(req: PaymentRequest): void {
  if (typeof window === "undefined") return;
  const all = getStoredPaymentRequests();
  const index = all.findIndex((r) => r.id === req.id);
  let updated: PaymentRequest[];
  if (index >= 0) {
    updated = all.map((item, idx) => (idx === index ? req : item));
  } else {
    updated = [req, ...all];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function markPaymentRequestPaid(id: string, txHash: string): PaymentRequest | null {
  const req = getPaymentRequestById(id);
  if (!req) return null;
  const updated: PaymentRequest = {
    ...req,
    status: "Paid",
    txHash,
    confirmedAt: new Date().toISOString(),
  };
  savePaymentRequest(updated);
  return updated;
}
