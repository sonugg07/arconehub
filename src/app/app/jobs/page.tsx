"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useJobsEscrow, JobListing } from "@/context/JobsEscrowContext";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { useActivity } from "@/context/ActivityContext";
import { formatUSDC, formatAddress } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Briefcase,
  Search,
  Plus,
  ShieldCheck,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  Building,
  DollarSign,
  Layers,
} from "lucide-react";

export default function JobsDirectoryPage() {
  const { jobs, postJob } = useJobsEscrow();
  const { isConnected, address, openConnectModal, requestTransactionSignature } = useWeb3();
  const { addNotification } = useNotifications();
  const { addActivity } = useActivity();

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newCategory, setNewCategory] = useState<JobListing["category"]>("Development");
  const [newBudget, setNewBudget] = useState("5000");
  const [newSkills, setNewSkills] = useState("Solidity, React, TypeScript");
  const [newDescription, setNewDescription] = useState("");

  const categories = ["All", "Development", "Design", "Marketing", "Community", "Research", "Security"];

  const filteredJobs = jobs.filter((job) => {
    if (categoryFilter !== "All" && job.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();

    const title = newTitle.trim() || "Senior Web3 Engineer";
    const company = newCompany.trim() || "Aura Protocol";
    const budgetVal = parseFloat(newBudget) || 5000;
    const skillsList = newSkills
      ? newSkills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Solidity", "TypeScript", "React"];
    const description = newDescription.trim() || "Looking for a top-tier Web3 engineer to build on Arc.";

    const executePost = () => {
      const createdJob = postJob({
        title,
        company,
        companyLogoBg: "from-blue-600 to-cyan-600",
        category: newCategory,
        totalBudgetUSDC: budgetVal,
        paymentType: "Milestone-based",
        experience: "Senior",
        deadline: "14 days left",
        skills: skillsList,
        description,
        requirements: ["Strong TypeScript & React skills", "EVM smart contract experience"],
        milestones: [
          {
            id: `m-${Date.now()}-1`,
            title: "Phase 1: Architecture & Prototyping",
            amountUSDC: budgetVal * 0.5,
            duration: "1 week",
            status: "funded",
            description: "Initial architecture and design specs.",
          },
          {
            id: `m-${Date.now()}-2`,
            title: "Phase 2: Production Delivery & Verification",
            amountUSDC: budgetVal * 0.5,
            duration: "1 week",
            status: "pending",
            description: "Final code delivery, audits, and deployment.",
          },
        ],
      });

      addNotification({
        title: "Job Posted & Escrow Funded!",
        message: `Successfully published "${title}" with ${formatUSDC(budgetVal)} in smart contract escrow.`,
        type: "success",
      });

      addActivity({
        category: "escrow",
        title: `Job Posted: ${title}`,
        subtitle: `Escrow funded for ${company}`,
        amount: `-${budgetVal}`,
        token: "USDC",
        usdValue: budgetVal,
        recipientOrContract: createdJob.escrowContract,
        status: "confirmed",
      });

      // Clear Form
      setNewTitle("");
      setNewCompany("");
      setNewBudget("5000");
      setNewSkills("Solidity, React, TypeScript");
      setNewDescription("");
      setIsPostModalOpen(false);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10B981", "#0066FF", "#00D2FF"],
        });
      } catch {}
    };

    if (isConnected) {
      requestTransactionSignature({
        title: "Fund Escrow & Post Job",
        type: "Escrow Deposit",
        amount: `${formatUSDC(budgetVal)}`,
        gasFee: "0.0012 USDC",
        details: [
          { label: "Job Title", value: title },
          { label: "Company", value: company },
          { label: "Escrow Contract", value: "ArcOne Milestone Escrow v1" },
          { label: "Payment Release", value: "Smart Contract Milestones" },
        ],
        onConfirm: async () => {
          executePost();
        },
      });
    } else {
      executePost();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header with Post Job Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Onchain Talent & Escrow ({jobs.length} Active Listings)</span>
            </div>
            <h1 className="text-3xl font-black text-white">ArcOne Jobs</h1>
            <p className="text-sm text-slate-400 mt-1">
              Find work, hire verified talent, and get paid in USDC with 100% smart contract escrow.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="glass-button px-6 py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Job</span>
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col gap-4">
          
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills (e.g. Next.js, Solidity)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#080D26]/90 border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-400/40 transition-colors shadow-glass font-sans"
            />
          </div>

          {/* Horizontal Category Pill List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.04]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Jobs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-2 p-12 text-center rounded-3xl bg-[#080D26]/60 border border-white/[0.08] text-slate-400">
              <Briefcase className="w-12 h-12 stroke-1 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No jobs found</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your category filter or search query.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group relative rounded-3xl bg-[#080D26]/90 border border-white/[0.08] hover:border-emerald-400/40 backdrop-blur-xl p-6 sm:p-7 shadow-glass flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar: Company, Category & Escrow Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${job.companyLogoBg} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                        {job.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{job.company}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </h4>
                        <span className="text-[10px] text-slate-400">{job.category}</span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Escrow Funded</span>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {job.title}
                  </h3>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] text-[10px] font-mono text-slate-300 border border-white/[0.06]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Stats & Apply Action */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Budget (USDC)</div>
                    <div className="text-base font-black text-white font-sans">
                      {formatUSDC(job.totalBudgetUSDC)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.applicantsCount}</span>
                    </div>

                    <Link
                      href={`/app/jobs/${job.id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition-colors"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Post a Job Modal */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#080D26] border border-white/[0.12] p-6 sm:p-7 shadow-2xl flex flex-col gap-5 text-white max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Post an Onchain Job</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Budget is secured in smart contract escrow</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Smart Contract Auditor"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-400/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aura Labs"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-400/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as JobListing["category"])}
                      className="px-3 py-3 rounded-2xl bg-[#060919] border border-white/[0.1] text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {categories.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Total Budget (USDC)</label>
                    <input
                      type="number"
                      required
                      placeholder="5000"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Required Skills</label>
                    <input
                      type="text"
                      placeholder="Solidity, React, Rust"
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Job Description & Milestones</label>
                  <textarea
                    rows={3}
                    placeholder="Describe deliverables, expectations, and milestone roadmap..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-400/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider mt-2 shadow-glow-blue cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Publish Job & Escrow Deposit</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
