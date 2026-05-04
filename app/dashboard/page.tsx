"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    const role = (session.user as any).role;
    if (role === "SPECIALIST") {
      router.replace("/dashboard/specialist");
    } else if (role === "SECRETARY") {
      router.replace("/dashboard/secretary");
    } else {
      router.replace("/dashboard/admin");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <p className="font-bold text-slate-400 animate-pulse">Redirigiendo a tu panel...</p>
    </div>
  );
}