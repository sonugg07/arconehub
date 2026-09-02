"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface JobMilestone {
  id: string;
  title: string;
  amountUSDC: number;
  duration: string;
  status: "pending" | "funded" | "in_review" | "approved" | "released";
  description: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogoBg: string;
  category: "Development" | "Design" | "Marketing" | "Community" | "Research" | "Security";
  totalBudgetUSDC: number;
  paymentType: "Fixed USDC" | "Milestone-based" | "Streamed Payroll";
  experience: "Junior" | "Mid" | "Senior" | "Lead";
  deadline: string;
  applicantsCount: number;
  featured?: boolean;
  skills: string[];
  description: string;
  requirements: string[];
  milestones: JobMilestone[];
  escrowContract: string;
  isEscrowFunded: boolean;
  companyRating: number;
  completedJobsCount: number;
  payoutRate: string;
  createdAt?: string;
}

interface JobsEscrowContextType {
  jobs: JobListing[];
  selectedJob: JobListing | null;
  setSelectedJob: (job: JobListing | null) => void;
  postJob: (
    job: Omit<
      JobListing,
      "id" | "applicantsCount" | "escrowContract" | "isEscrowFunded" | "companyRating" | "completedJobsCount" | "payoutRate"
    >
  ) => JobListing;
  fundEscrow: (jobId: string) => Promise<boolean>;
  releaseMilestone: (jobId: string, milestoneId: string) => Promise<boolean>;
  applyForJob: (
    jobId: string,
    application: { name: string; email: string; portfolio: string; note: string; bidUSDC: number }
  ) => Promise<boolean>;
  activeCompanyEscrows: {
    jobId: string;
    jobTitle: string;
    totalAmount: number;
    releasedAmount: number;
    status: string;
  }[];
}

const STORAGE_KEY = "arcone_jobs_registry_v1";

const INITIAL_JOBS: JobListing[] = [
  {
    id: "job-001",
    title: "Senior Fullstack Web3 Architect",
    company: "ArcOne Core Labs",
    companyLogoBg: "from-blue-600 to-indigo-700",
    category: "Development",
    totalBudgetUSDC: 8500,
    paymentType: "Milestone-based",
    experience: "Senior",
    deadline: "14 days left",
    applicantsCount: 12,
    featured: true,
    skills: ["Next.js", "TypeScript", "Three.js", "Solidity", "Ethers.js"],
    description: "Lead the frontend architecture of ArcOne's next-generation decentralized liquidity & payment protocol. You will work on lightning-fast React components, 3D WebGL interfaces, and sub-second EVM transaction dispatching.",
    requirements: [
      "5+ years of experience in React, Next.js, and TypeScript",
      "Proven track record building production Web3 dApps or fintech dashboards",
      "Deep understanding of EVM smart contract interop, wagmi/viem, and USDC gas models",
      "Eye for high-end micro-interactions, smooth animations, and zero-latency UX",
    ],
    milestones: [
      { id: "m1", title: "Interactive 3D Dashboard & Layout", amountUSDC: 3000, duration: "2 weeks", status: "funded", description: "Implement high-fidelity dashboard views with 3D canvas visualizations." },
      { id: "m2", title: "DEX Swap & Liquidity Routing Integration", amountUSDC: 3000, duration: "2 weeks", status: "pending", description: "Connect multi-hop swap calculations with slippage controls." },
      { id: "m3", title: "Audited Escrow & Payroll Stream Flow", amountUSDC: 2500, duration: "1.5 weeks", status: "pending", description: "Implement real-time streamed milestone release smart contracts." },
    ],
    escrowContract: "0x8920194801928304918203948102938401928304",
    isEscrowFunded: true,
    companyRating: 4.98,
    completedJobsCount: 42,
    payoutRate: "100%",
    createdAt: "2026-02-15T00:00:00Z",
  },
  {
    id: "job-002",
    title: "Lead 3D Brand & Product Designer",
    company: "Aether Protocol",
    companyLogoBg: "from-purple-600 to-pink-600",
    category: "Design",
    totalBudgetUSDC: 6000,
    paymentType: "Fixed USDC",
    experience: "Lead",
    deadline: "9 days left",
    applicantsCount: 8,
    featured: true,
    skills: ["Figma", "Blender", "Spline", "Design Systems", "Fintech UI"],
    description: "Design the futuristic visual language for an onchain cross-border treasury protocol. Create 3D assets, holographic UI widgets, and a cohesive design system.",
    requirements: [
      "Extensive portfolio showing high-end futuristic UI/UX designs",
      "Experience creating 3D web assets and dark glassmorphic themes",
      "Proficiency in Figma components, auto-layout, and token design",
    ],
    milestones: [
      { id: "m1", title: "Design System & Color Tokens", amountUSDC: 2000, duration: "1 week", status: "approved", description: "Foundational tokens, typography, and dark-theme glass specs." },
      { id: "m2", title: "3D Asset Package & Hero Visuals", amountUSDC: 2000, duration: "2 weeks", status: "funded", description: "3D floating orbs, coins, and isometric network diagrams." },
      { id: "m3", title: "Interactive Prototypes & App Handoff", amountUSDC: 2000, duration: "1.5 weeks", status: "pending", description: "Clickable flows in Figma with responsive mobile views." },
    ],
    escrowContract: "0x1928301928301928301928301928301928301928",
    isEscrowFunded: true,
    companyRating: 5.0,
    completedJobsCount: 19,
    payoutRate: "100%",
    createdAt: "2026-02-18T00:00:00Z",
  },
  {
    id: "job-003",
    title: "Smart Contract Security Auditor",
    company: "Veritas Guardian",
    companyLogoBg: "from-emerald-600 to-teal-700",
    category: "Security",
    totalBudgetUSDC: 5000,
    paymentType: "Fixed USDC",
    experience: "Senior",
    deadline: "5 days left",
    applicantsCount: 6,
    skills: ["Solidity", "Foundry", "Slither", "EVM", "Formal Verification"],
    description: "Perform comprehensive security audit and vulnerability assessment for ArcOne's multi-party escrow and streamed payment smart contracts.",
    requirements: [
      "Extensive experience conducting Solidity smart contract audits",
      "Familiarity with reentrancy, oracle manipulation, and USDC permit patterns",
      "Ability to write rigorous Foundry fuzz test suites",
    ],
    milestones: [
      { id: "m1", title: "Threat Model & Initial Code Review", amountUSDC: 2500, duration: "1 week", status: "funded", description: "Comprehensive static analysis and vulnerability triage." },
      { id: "m2", title: "Formal Report & Remediation Verification", amountUSDC: 2500, duration: "1 week", status: "pending", description: "Signed PDF report with severity scores and mitigation sign-off." },
    ],
    escrowContract: "0x4019283049182039481029384019283049182039",
    isEscrowFunded: true,
    companyRating: 4.95,
    completedJobsCount: 31,
    payoutRate: "100%",
    createdAt: "2026-02-20T00:00:00Z",
  },
  {
    id: "job-004",
    title: "Web3 Growth & Ecosystem Strategist",
    company: "Nova Syndicate",
    companyLogoBg: "from-amber-600 to-orange-700",
    category: "Marketing",
    totalBudgetUSDC: 4200,
    paymentType: "Streamed Payroll",
    experience: "Mid",
    deadline: "20 days left",
    applicantsCount: 15,
    skills: ["Growth Marketing", "Dune Analytics", "Community Building", "Content"],
    description: "Scale onchain user acquisition and drive liquidity provider growth for newly launched Arc tokens across global communities.",
    requirements: [
      "2+ years experience in Web3 growth marketing or DeFi protocols",
      "Strong storytelling ability and deep understanding of onchain metrics",
    ],
    milestones: [
      { id: "m1", title: "Growth Playbook & Campaign Launch", amountUSDC: 2100, duration: "2 weeks", status: "funded", description: "Launch initial liquidity incentives and community quests." },
      { id: "m2", title: "Ecosystem Partner Onboarding", amountUSDC: 2100, duration: "2 weeks", status: "pending", description: "Secure 5 high-impact institutional and protocol integrations." },
    ],
    escrowContract: "0x3918203948102938401928304918203948102938",
    isEscrowFunded: true,
    companyRating: 4.88,
    completedJobsCount: 14,
    payoutRate: "100%",
    createdAt: "2026-02-22T00:00:00Z",
  },
];

const JobsEscrowContext = createContext<JobsEscrowContextType | undefined>(undefined);

export function JobsEscrowProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(INITIAL_JOBS[0]);

  // Load persisted jobs on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: JobListing[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
          setSelectedJob(parsed[0]);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
      }
    } catch (err) {
      console.error("Failed to load jobs from localStorage:", err);
    }
  }, []);

  const saveJobsToStorage = (updatedJobs: JobListing[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
    } catch (err) {
      console.error("Failed to save jobs to localStorage:", err);
    }
  };

  const postJob = (
    newJobData: Omit<
      JobListing,
      "id" | "applicantsCount" | "escrowContract" | "isEscrowFunded" | "companyRating" | "completedJobsCount" | "payoutRate"
    >
  ): JobListing => {
    const randomContract = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    const newJob: JobListing = {
      ...newJobData,
      id: `job-${Date.now()}`,
      applicantsCount: 0,
      escrowContract: randomContract,
      isEscrowFunded: true,
      companyRating: 5.0,
      completedJobsCount: 0,
      payoutRate: "100%",
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) => {
      const updated = [newJob, ...prev];
      saveJobsToStorage(updated);
      return updated;
    });

    return newJob;
  };

  const fundEscrow = async (jobId: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1200));
    setJobs((prev) => {
      const updated = prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              isEscrowFunded: true,
              milestones: job.milestones.map((m) =>
                m.status === "pending" ? { ...m, status: "funded" as const } : m
              ),
            }
          : job
      );
      saveJobsToStorage(updated);
      return updated;
    });
    return true;
  };

  const releaseMilestone = async (jobId: string, milestoneId: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000));
    setJobs((prev) => {
      const updated = prev.map((job) => {
        if (job.id !== jobId) return job;
        const updatedMilestones = job.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status: "released" as const } : m
        );
        return {
          ...job,
          milestones: updatedMilestones,
        };
      });
      saveJobsToStorage(updated);
      return updated;
    });
    return true;
  };

  const applyForJob = async (
    jobId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    application: { name: string; email: string; portfolio: string; note: string; bidUSDC: number }
  ): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1200));
    setJobs((prev) => {
      const updated = prev.map((job) =>
        job.id === jobId ? { ...job, applicantsCount: job.applicantsCount + 1 } : job
      );
      saveJobsToStorage(updated);
      return updated;
    });
    return true;
  };

  const activeCompanyEscrows = [
    {
      jobId: "job-001",
      jobTitle: "Senior Fullstack Web3 Architect",
      totalAmount: 8500,
      releasedAmount: 3000,
      status: "Active (Milestone 1 Funded)",
    },
    {
      jobId: "job-002",
      jobTitle: "Lead 3D Brand & Product Designer",
      totalAmount: 6000,
      releasedAmount: 2000,
      status: "Active (Milestone 2 In Progress)",
    },
    {
      jobId: "job-003",
      jobTitle: "Smart Contract Security Auditor",
      totalAmount: 5000,
      releasedAmount: 2500,
      status: "Active (Milestone 1 In Review)",
    },
  ];

  return (
    <JobsEscrowContext.Provider
      value={{
        jobs,
        selectedJob,
        setSelectedJob,
        postJob,
        fundEscrow,
        releaseMilestone,
        applyForJob,
        activeCompanyEscrows,
      }}
    >
      {children}
    </JobsEscrowContext.Provider>
  );
}

export function useJobsEscrow() {
  const context = useContext(JobsEscrowContext);
  if (!context) {
    throw new Error("useJobsEscrow must be used within a JobsEscrowProvider");
  }
  return context;
}
