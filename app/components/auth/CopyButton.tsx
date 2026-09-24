"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa6";

/** navigator.clipboard sirf https / localhost pe — baaki jagah fallback */
export async function copyText(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {}
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}

export default function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(t);
    }, [copied]);

    return (
        <button
            type="button"
            onClick={async () => { if (await copyText(value)) setCopied(true); }}
            aria-label={copied ? "Copied" : label}
            title={copied ? "Copied" : label}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#A87A12] transition hover:bg-[#D4A437]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4A437]"
        >
            {copied ? <FaCheck className="h-4 w-4 text-emerald-600" /> : <FaRegCopy className="h-4 w-4" />}
        </button>
    );
}