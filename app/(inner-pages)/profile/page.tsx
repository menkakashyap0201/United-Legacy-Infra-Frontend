"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowRightFromBracket, FaCalendarDays, FaCircleExclamation, FaEnvelope,
  FaGift, FaRotateRight, FaSitemap, FaUserGroup,
} from "react-icons/fa6";
import { boxCls, btnOutline, goldGrad, goldText, labelCls } from "@/app/components/auth/ui";
import { serif } from "@/app/components/auth/fonts";
import PageTitle from "@/app/components/InnerPages/layout/PageTitle";
import CopyButton from "@/app/components/auth/CopyButton";
import { getMyAccounts } from "@/app/lib/api/account";
import { logout } from "@/app/lib/api/auth";
import { ApiError } from "@/app/lib/api/client";
import { getUser } from "@/app/lib/auth/token";
import { Account, MyAccountsResponse } from "@/app/types/account.types";
import { AuthUser } from "@/app/types/auth.types";

/* ================= Helpers ================= */
const positionLabel = (p: number) => (p === 1 ? "West" : p === 2 ? "East" : "—");

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "U";

function StatusBadge({ status }: { status: number }) {
  const active = status === 1;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-amber-500"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* ================= Read-only box (same look as <Field>) ================= */
function InfoBox({ label, icon: I, children }: { label: string; icon: typeof FaSitemap; children: React.ReactNode }) {
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className={`${boxCls} border-[#0B1D45]/12`}>
        <I className="h-4 w-4 shrink-0 text-[#D4A437]" />
        <div className="flex min-w-0 flex-1 items-center gap-1 py-3 text-sm font-semibold text-[#0B1D45]">{children}</div>
      </div>
    </div>
  );
}

/* ================= Skeleton ================= */
function ProfileSkeleton() {
  return (
    <div className="grid animate-pulse gap-3" aria-hidden>
      <div className="mx-auto h-20 w-20 rounded-full bg-[#D4A437]/25" />
      <div className="mx-auto h-5 w-40 rounded bg-[#0B1D45]/10" />
      <div className="mx-auto h-3 w-52 rounded bg-[#0B1D45]/10" />
      <div className="mt-2 h-12 rounded-xl bg-white" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 rounded-xl bg-white" />
        <div className="h-12 rounded-xl bg-white" />
      </div>
      <div className="h-16 rounded-xl bg-white" />
    </div>
  );
}

/* ================= Account row ================= */
function AccountRow({ account }: { account: Account }) {
  return (
    <li className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 ${account.is_current ? "border-[#D4A437] shadow-[0_0_0_4px_rgba(212,164,55,.12)]" : "border-[#0B1D45]/12"}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0B1D45] text-sm font-bold text-[#D4A437]">
        {initials(account.name)}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="flex items-center gap-2 text-sm font-bold text-[#0B1D45]">
          <span className="truncate">{account.name}</span>
          {account.is_current && <span className={`${goldGrad} shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-[#0B1D45]`}>Current</span>}
        </p>
        <p className="mt-0.5 truncate font-mono text-xs tracking-wider text-[#0B1D45]/55">
          {account.referal_code} · {positionLabel(account.team_position)}
        </p>
      </div>
      <StatusBadge status={account.status} />
    </li>
  );
}

/* ================= Page ================= */
function ProfileContent() {
  const router = useRouter();
  const [data, setData] = useState<MyAccountsResponse | null>(null);
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getMyAccounts());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login?next=/profile"); // token expire
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load your accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setLocalUser(getUser()); // email yahin se — my-accounts me email nahi aata
    load();
  }, [load]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const current = data?.accounts.find((a) => a.is_current) ?? data?.accounts.find((a) => a.referal_code === data?.current);
  const name = current?.name ?? localUser?.name ?? "";
  const code = current?.referal_code ?? data?.current ?? localUser?.referal_code ?? "";

  return (
    <>
      <PageTitle title={<>My <span className={goldText}>profile</span></>} sub="Your account details and linked IDs." />

      {loading && <ProfileSkeleton />}

      {!loading && error && (
        <div role="alert" className="grid gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-5 text-center">
          <FaCircleExclamation className="mx-auto h-5 w-5 text-rose-500" />
          <p className="text-sm text-rose-700">{error}</p>
          <button type="button" onClick={load} className={btnOutline}>
            <FaRotateRight className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <div className="flex flex-1 flex-col">
          {/* ===== Avatar + name ===== */}
          <div className="flex flex-col items-center text-center">
            <span className={`${goldGrad} grid h-20 w-20 place-items-center rounded-full text-2xl font-extrabold text-[#0B1D45] shadow-[0_0_40px_rgba(212,164,55,.45)]`}>
              {initials(name)}
            </span>
            <h2 className={`${serif.className} mt-3 text-2xl font-bold text-[#0B1D45]`}>{name || "—"}</h2>
            {localUser?.email && (
              <p className="mt-1 flex max-w-full items-center gap-1.5 text-sm text-[#0B1D45]/60">
                <FaEnvelope className="h-3 w-3 shrink-0" />
                <span className="truncate">{localUser.email}</span>
              </p>
            )}
            {current && <div className="mt-2"><StatusBadge status={current.status} /></div>}
          </div>

          {/* ===== Details ===== */}
          <div className="mt-5 grid gap-3">
            {code && (
              <InfoBox label="REFERRAL CODE" icon={FaGift}>
                <span className="min-w-0 flex-1 truncate font-mono tracking-wider">{code}</span>
                <CopyButton value={code} label="Copy referral code" />
              </InfoBox>
            )}

            {current && (
              <div className="grid grid-cols-2 gap-3">
                <InfoBox label="PLC" icon={FaSitemap}>{positionLabel(current.team_position)}</InfoBox>
                <InfoBox label="JOINED" icon={FaCalendarDays}>{formatDate(current.created_at)}</InfoBox>
              </div>
            )}

            {/* ===== My accounts ===== */}
            <div>
              <p className={`${labelCls} flex items-center justify-between`}>
                <span className="flex items-center gap-1.5"><FaUserGroup className="h-3 w-3" /> MY ACCOUNTS</span>
                <span>{data.accounts.length}</span>
              </p>
              {data.accounts.length ? (
                <ul className="grid gap-2">
                  {data.accounts.map((a) => <AccountRow key={a.id} account={a} />)}
                </ul>
              ) : (
                <p className="rounded-xl border border-dashed border-[#0B1D45]/15 bg-white/60 px-4 py-5 text-center text-sm text-[#0B1D45]/60">
                  No linked accounts yet.
                </p>
              )}
            </div>
          </div>

          {/* ===== Actions ===== */}
          <div className="mt-auto grid gap-3 pt-6">
            <button type="button" onClick={handleLogout} className={btnOutline}>
              <FaArrowRightFromBracket className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}