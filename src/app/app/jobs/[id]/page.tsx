"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useJobsEscrow, JobMilestone } from "@/context/JobsEscrowContext";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { formatUSDC, formatAddress } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  Users,
  Building2,
  Send,
  Sparkles,
  ExternalLink,
  Lock,
  X,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { jobs, applyForJob } = useJobsEscrow();
  const { requestTransactionSignature } = useWeb3();
  const { addNotification } = useNotifications();

  const jobId = (params?.id as string) || "job-001";
  const job = jobs.find((j) => j.id === jobId) || jobs[0];

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("Alex Developer");
  const [applicantEmail, setApplicantEmail] = useState("alex@web3dev.xyz");
  const [portfolioLink, setPortfolioLink] = useState("https://github.com/alex-web3");
  const [proposalNote, setProposalNote] = useState("I have 4+ years of EVM & Next.js dApp experience and can deliver this milestone ahead of schedule.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplyModalOpen(false);

    requestTransactionSignature({
      title: `Apply for ${job.title}`,
      type: "Onchain Job Application",
      amount: "0.00 USDC (Application Bid)",
      gasFee: "0.0005 USDC",
      details: [
        { label: "Employer", value: job.company },
        { label: "Target Escrow", value: formatAddress(job.escrowContract, 4) },
        { label: "Bid Amount", value: formatUSDC(job.totalBudgetUSDC) },
      ],
      onConfirm: async () => {
        setIsSubmitting(true);
        await applyForJob(job.id, {
          name: applicantName,
          email: applicantEmail,
          portfolio: portfolioLink,
          note: proposalNote,
          bidUSDC: job.totalBudgetUSDC,
        });
        setIsSubmitting(false);

        addNotification({
          title: "Application Submitted",
          message: `Your application for "${job.title}" at ${job.company} was submitted onchain.`,
          type: "success",
        });

        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        
        {/* Back Link */}
        <div>
          <Link
            href="/app/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all jobs</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Job Description, Milestones & Requirements (Left 7 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Header Card */}
            <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${job.companyLogoBg} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{job.company}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <span className="text-xs text-slate-400">{job.category} • {job.experience}</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Protected by Onchain Escrow</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white mb-4">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-white/[0.04] text-xs font-mono text-cyan-300 border border-white/[0.08]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Project Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Escrow Milestones Card */}
            <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Smart Contract Milestones</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Funds are released upon milestone completion</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">100% Locked</span>
              </div>

              <div className="flex flex-col gap-3">
                {job.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{m.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{m.description}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>Duration: {m.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-white font-sans">
                        {formatUSDC(m.amountUSDC)}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements Card */}
            <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Candidate Requirements</h4>
              <ul className="flex flex-col gap-2.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Company Profile & Action Card (Right 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            
            {/* Quick Summary Card */}
            <div className="rounded-3xl bg-[#080D26]/95 border border-white/[0.08] backdrop-blur-xl p-6 shadow-glass flex flex-col gap-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Payout Budget</div>
                <div className="text-3xl font-black text-white font-sans">
                  {formatUSDC(job.totalBudgetUSDC)}
                </div>
                <div className="text-xs text-cyan-300 font-semibold mt-1">Paid in Native USDC</div>
              </div>

              <div className="flex flex-col gap-3 py-3 border-y border-white/[0.06] text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Payment Type:</span>
                  <span className="font-semibold text-white">{job.paymentType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Application Deadline:</span>
                  <span className="text-white font-semibold">{job.deadline}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Applicants:</span>
                  <span className="text-cyan-400 font-bold">{job.applicantsCount} applied</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Escrow Contract:</span>
                  <span className="font-mono text-slate-300">{formatAddress(job.escrowContract, 3)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Apply for this Job</span>
              </button>
            </div>

            {/* Verified Employer Reputation Card */}
            <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-5 shadow-glass flex flex-col gap-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Employer Reputation</h4>
              <div className="flex justify-between text-slate-300">
                <span>Rating:</span>
                <span className="font-bold text-emerald-400">★ {job.companyRating} / 5.0</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Completed Contracts:</span>
                <span className="font-bold text-white">{job.completedJobsCount} jobs</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Payout Success Rate:</span>
                <span className="font-bold text-emerald-400">{job.payoutRate}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Application Modal */}
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#080D26] border border-emerald-400/30 p-6 shadow-2xl flex flex-col gap-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Apply for {job.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Submit your onchain proposal to {job.company}</p>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApply} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Full Name / Alias</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Contact Email / Telegram</label>
                    <input
                      type="text"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Portfolio URL / GitHub / Resume</label>
                  <input
                    type="url"
                    required
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Cover Proposal & Milestone Commitment</label>
                  <textarea
                    rows={4}
                    required
                    value={proposalNote}
                    onChange={(e) => setProposalNote(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glass-button w-full py-3.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider mt-2 cursor-pointer"
                >
                  {isSubmitting ? "Submitting Application..." : "Authorize Application Signature"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
