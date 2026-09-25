"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft, FaCalendarDays, FaChevronRight, FaCircleExclamation, FaCrown, FaRotateRight,
  FaSitemap, FaUserPlus, FaUsers,
} from "react-icons/fa6";
import { btnNavy, btnOutline, goldGrad, goldText, labelCls } from "@/app/components/auth/ui";
import CopyButton from "@/app/components/auth/CopyButton";
import PageTitle from "@/app/components/InnerPages/layout/PageTitle";
import { getPlcTree } from "./getPlcTree";
import { ApiError } from "@/app/lib/api/client";
import { getUser } from "@/app/lib/auth/token";
import { TreeMember } from "./Plc.types";
import { AuthUser } from "@/app/types/auth.types";

/* ================= Helpers ================= */
type Side = "root" | "west" | "east";

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "U";
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

const countTeam = (m: TreeMember | null): number => (m ? 1 + countTeam(m.west) + countTeam(m.east) : 0);
const countActive = (m: TreeMember | null): number =>
  m ? (m.status === 1 ? 1 : 0) + countActive(m.west) + countActive(m.east) : 0;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const rupees = (v?: string | number) =>
  `₹${Number(v ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const TONE: Record<Side, string> = {
  root: `${goldGrad} text-[#0B1D45] shadow-[0_0_28px_rgba(212,164,55,.6)]`,
  west: "bg-[#0B1D45] text-[#F5D06B]",
  east: "border-2 border-[#D4A437] bg-white text-[#A87A12]",
};
const SIZE = ["h-16 w-16 text-lg", "h-12 w-12 text-sm", "h-10 w-10 text-xs"];

/* ================= Small pieces ================= */
function SideChip({ side }: { side: "west" | "east" }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-[0.18em] ${side === "west" ? "bg-[#0B1D45] text-white" : `${goldGrad} text-[#0B1D45]`}`}>
      {side === "west" ? "WEST" : "EAST"}
    </span>
  );
}

function StatusDot({ status, className = "" }: { status: number; className?: string }) {
  return <span className={`rounded-full border-2 border-white ${status === 1 ? "bg-emerald-500" : "bg-amber-400"} ${className}`} />;
}

/* ================= One node ================= */
function TreeNode({
  member, level, side, chip, selectedId, onSelect,
}: {
  member: TreeMember | null;
  level: 0 | 1 | 2;
  side: Side;
  chip?: boolean;
  selectedId?: number;
  onSelect: (m: TreeMember) => void;
}) {
  // khaali jagah
  if (!member) {
    return (
      <div className="flex flex-col items-center gap-1 py-1">
        <span className={`grid ${SIZE[level]} place-items-center rounded-full border-2 border-dashed border-[#0B1D45]/20 bg-white/60 text-[#0B1D45]/25`}>
          <FaUserPlus className="h-3.5 w-3.5" />
        </span>
        {chip && side !== "root" && <SideChip side={side} />}
        <span className="text-[10px] font-semibold text-[#0B1D45]/35">Vacant</span>
      </div>
    );
  }

  const selected = selectedId === member.id;
  const below = countTeam(member) - 1;

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      aria-pressed={selected}
      aria-label={`${member.name}, ${member.referal_code}`}
      className="group flex w-full min-w-0 flex-col items-center gap-1 rounded-xl px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#D4A437]/60"
    >
      <span className="relative">
        {side === "root" && <FaCrown aria-hidden className="absolute -top-4 left-1/2 h-3.5 w-3.5 -translate-x-1/2 text-[#D4A437]" />}
        <span className={`grid ${SIZE[level]} place-items-center rounded-full font-extrabold transition duration-200 group-hover:-translate-y-0.5 ${TONE[side]} ${selected ? "ring-4 ring-[#D4A437]/40 ring-offset-2 ring-offset-[#FFFBF0]" : ""}`}>
          {initials(member.name)}
        </span>
        <StatusDot status={member.status} className="absolute bottom-0 right-0 h-3 w-3" />
      </span>

      {chip && side !== "root" && <SideChip side={side} />}

      <span className={`w-full truncate text-center font-bold text-[#0B1D45] ${level === 2 ? "text-[10px]" : "text-xs"}`}>
        {level === 2 ? firstName(member.name) : member.name}
      </span>
      {level < 2 && <span className="font-mono text-[9px] tracking-wider text-[#0B1D45]/45">{member.referal_code}</span>}
      {level === 2 && below > 0 && <span className="text-[9px] font-bold text-[#A87A12]">+{below} more</span>}
    </button>
  );
}

/* ================= Lines between levels ================= */
type Link = { from: number; to: number; empty: boolean };

function Connector({ links }: { links: Link[] }) {
  return (
    <svg aria-hidden className="block h-7 w-full" viewBox="0 0 100 28" preserveAspectRatio="none">
      {links.map((l, i) => (
        <path
          key={i}
          d={`M${l.from} 0 V13 H${l.to} V28`}
          fill="none"
          stroke={l.empty ? "rgba(11,29,69,.18)" : "#D4A437"}
          strokeWidth={1.6}
          strokeDasharray={l.empty ? "3 3" : undefined}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/* ================= 3-level binary tree ================= */
function BinaryTree({ root, selectedId, onSelect }: { root: TreeMember; selectedId?: number; onSelect: (m: TreeMember) => void }) {
  const l1 = [root.west, root.east];
  const l2 = [root.west?.west ?? null, root.west?.east ?? null, root.east?.west ?? null, root.east?.east ?? null];

  const links1: Link[] = [
    { from: 50, to: 25, empty: !root.west },
    { from: 50, to: 75, empty: !root.east },
  ];
  const links2: Link[] = [
    ...(root.west ? [{ from: 25, to: 12.5, empty: !root.west.west }, { from: 25, to: 37.5, empty: !root.west.east }] : []),
    ...(root.east ? [{ from: 75, to: 62.5, empty: !root.east.west }, { from: 75, to: 87.5, empty: !root.east.east }] : []),
  ];

  return (
    <div className="pt-4">
      <div className="flex justify-center">
        <div className="w-32">
          <TreeNode member={root} level={0} side="root" selectedId={selectedId} onSelect={onSelect} />
        </div>
      </div>

      <Connector links={links1} />

      <div className="grid grid-cols-2">
        {l1.map((m, i) => (
          <div key={i} className="flex justify-center px-1">
            <div className="w-full max-w-[9rem]">
              <TreeNode member={m} level={1} side={i === 0 ? "west" : "east"} chip selectedId={selectedId} onSelect={onSelect} />
            </div>
          </div>
        ))}
      </div>

      {links2.length > 0 && <Connector links={links2} />}

      <div className="grid grid-cols-4">
        {l2.map((m, i) => (
          <div key={i} className="flex min-w-0 justify-center px-0.5">
            {l1[i < 2 ? 0 : 1] && (
              <TreeNode member={m} level={2} side={i < 2 ? "west" : "east"} selectedId={selectedId} onSelect={onSelect} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Skeleton ================= */
function TreeSkeleton() {
  return (
    <div className="grid animate-pulse gap-4" aria-hidden>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-2xl bg-[#0B1D45]/10" />
        <div className="h-24 rounded-2xl bg-[#D4A437]/20" />
      </div>
      <div className="grid gap-6 rounded-2xl bg-white/70 p-5">
        <div className="mx-auto h-16 w-16 rounded-full bg-[#D4A437]/30" />
        <div className="flex justify-around"><div className="h-12 w-12 rounded-full bg-[#0B1D45]/10" /><div className="h-12 w-12 rounded-full bg-[#0B1D45]/10" /></div>
        <div className="flex justify-around">{[0, 1, 2, 3].map((i) => <div key={i} className="h-10 w-10 rounded-full bg-[#0B1D45]/10" />)}</div>
      </div>
    </div>
  );
}

/* ================= Page ================= */
export default function PlcPage() {
  const router = useRouter();
  const [stack, setStack] = useState<TreeMember[]>([]); // drill-down path
  const [selected, setSelected] = useState<TreeMember | null>(null);
  const [me, setMe] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPlcTree();
      setStack([res.tree]);
      setSelected(res.tree);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login?next=/plc");
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load your team. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setMe(getUser());
    load();
  }, [load]);

  const viewRoot = stack[stack.length - 1] ?? null;
  const isOwnTree = stack.length === 1;

  const drill = (m: TreeMember) => {
    setStack((s) => [...s, m]);
    setSelected(m);
  };
  const jumpTo = (i: number) => {
    setStack((s) => s.slice(0, i + 1));
    setSelected(stack[i]);
  };

  const westCount = countTeam(viewRoot?.west ?? null);
  const eastCount = countTeam(viewRoot?.east ?? null);

  const selSide: Side = selected && viewRoot && selected.id === viewRoot.id ? "root" : selected?.team_position === 2 ? "east" : "west";
  const canDrill = !!selected && !!viewRoot && selected.id !== viewRoot.id && (!!selected.west || !!selected.east);

  return (
    <>
      <PageTitle title={<>My <span className={goldText}>PLC</span></>} sub="Your team on the West and East side." />

      {loading && <TreeSkeleton />}

      {!loading && error && (
        <div role="alert" className="grid gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-5 text-center">
          <FaCircleExclamation className="mx-auto h-5 w-5 text-rose-500" />
          <p className="text-sm text-rose-700">{error}</p>
          <button type="button" onClick={load} className={btnOutline}><FaRotateRight className="h-3.5 w-3.5" /> Try again</button>
        </div>
      )}

      {!loading && !error && viewRoot && (
        <div className="grid gap-4">
          {/* ===== West / East summary ===== */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-2xl bg-[#0B1D45] p-3.5 text-white shadow-[0_14px_30px_-14px_rgba(11,29,69,.8)]">
              <span aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#D4A437]/20 blur-xl" />
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#F5D06B]">WEST TEAM</p>
              <p className="mt-1 text-2xl font-extrabold">{westCount}</p>
              <p className="text-[11px] text-white/60">{countActive(viewRoot.west)} active</p>
              {isOwnTree && <p className="mt-1.5 text-xs font-bold text-[#F5D06B]">{rupees(me?.left_business)}</p>}
            </div>
            <div className={`${goldGrad} relative overflow-hidden rounded-2xl p-3.5 text-[#0B1D45] shadow-[0_14px_30px_-14px_rgba(212,164,55,.9)]`}>
              <span aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/30 blur-xl" />
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#0B1D45]/80">EAST TEAM</p>
              <p className="mt-1 text-2xl font-extrabold">{eastCount}</p>
              <p className="text-[11px] text-[#0B1D45]/65">{countActive(viewRoot.east)} active</p>
              {isOwnTree && <p className="mt-1.5 text-xs font-bold">{rupees(me?.right_business)}</p>}
            </div>
          </div>

          {/* ===== Tree ===== */}
          <div className="rounded-2xl border border-[#D4A437]/35 bg-white/70 px-2 pb-3 pt-3 shadow-[0_1px_0_rgba(11,29,69,.04)]">
            {/* breadcrumb */}
            <div className="mb-1 flex items-center gap-2 px-1">
              {!isOwnTree && (
                <button type="button" onClick={() => jumpTo(stack.length - 2)} aria-label="Back" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B1D45] text-[#F5D06B] transition hover:bg-[#12296A]">
                  <FaArrowLeft className="h-3 w-3" />
                </button>
              )}
              <nav aria-label="Tree path" className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap text-xs">
                <FaSitemap className="h-3 w-3 shrink-0 text-[#D4A437]" />
                {stack.map((m, i) => (
                  <span key={m.id} className="flex items-center gap-1">
                    {i > 0 && <FaChevronRight className="h-2.5 w-2.5 text-[#0B1D45]/30" />}
                    {i === stack.length - 1 ? (
                      <span className="font-bold text-[#0B1D45]">{i === 0 ? "You" : firstName(m.name)}</span>
                    ) : (
                      <button type="button" onClick={() => jumpTo(i)} className="font-semibold text-[#A87A12] hover:underline">
                        {i === 0 ? "You" : firstName(m.name)}
                      </button>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            <div key={viewRoot.id} className="animate-[appFade_.4s_ease-out_both]">
              <BinaryTree root={viewRoot} selectedId={selected?.id} onSelect={setSelected} />
            </div>

            {/* legend */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-[#0B1D45]/5 pt-2.5 text-[10px] font-semibold text-[#0B1D45]/55">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#0B1D45]" /> West</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-[#D4A437] bg-white" /> East</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Active</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Inactive</span>
            </div>
          </div>

          {/* ===== Selected member ===== */}
          {selected && (
            <div key={selected.id} className="animate-[appFade_.35s_ease-out_both] rounded-2xl border border-[#D4A437]/40 bg-white p-4 shadow-[0_14px_30px_-18px_rgba(212,164,55,.7)]">
              <p className={labelCls}>MEMBER DETAILS</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="relative shrink-0">
                  <span className={`grid h-12 w-12 place-items-center rounded-full text-sm font-extrabold ${TONE[selSide]}`}>{initials(selected.name)}</span>
                  <StatusDot status={selected.status} className="absolute bottom-0 right-0 h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold text-[#0B1D45]">{selected.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="truncate font-mono text-xs tracking-wider text-[#0B1D45]/55">{selected.referal_code}</span>
                    <CopyButton value={selected.referal_code} label="Copy referral code" />
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${selected.status === 1 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {selected.status === 1 ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-[#FFF8E6] px-2 py-2">
                  <p className="text-[9px] font-extrabold tracking-[0.15em] text-[#A87A12]">SIDE</p>
                  <p className="mt-0.5 text-sm font-bold text-[#0B1D45]">{selected.team_position === 2 ? "East" : "West"}</p>
                </div>
                <div className="rounded-xl bg-[#FFF8E6] px-2 py-2">
                  <p className="text-[9px] font-extrabold tracking-[0.15em] text-[#A87A12]">WEST / EAST</p>
                  <p className="mt-0.5 text-sm font-bold text-[#0B1D45]">{countTeam(selected.west)} / {countTeam(selected.east)}</p>
                </div>
                <div className="rounded-xl bg-[#FFF8E6] px-2 py-2">
                  <p className="text-[9px] font-extrabold tracking-[0.15em] text-[#A87A12]">TEAM</p>
                  <p className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold text-[#0B1D45]"><FaUsers className="h-3 w-3 text-[#D4A437]" />{countTeam(selected) - 1}</p>
                </div>
              </div>

              <p className="mt-2.5 flex items-center gap-1.5 text-xs text-[#0B1D45]/55">
                <FaCalendarDays className="h-3 w-3 text-[#D4A437]" /> Joined {formatDate(selected.created_at)}
              </p>

              {canDrill && (
                <button type="button" onClick={() => drill(selected)} className={`${btnNavy} mt-3`}>
                  <FaSitemap className="h-3.5 w-3.5" /> View {firstName(selected.name)}&apos;s tree
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}