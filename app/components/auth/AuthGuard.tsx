"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaSpinner } from "react-icons/fa6";
import { isLoggedIn } from "@/app/lib/auth/token";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            setAllowed(true);
        } else {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
    }, [router, pathname]);

    if (!allowed) {
        return (
            <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="Checking your session">
                <FaSpinner className="h-6 w-6 animate-spin text-[#D4A437]" />
            </div>
        );
    }

    return <>{children}</>;
}