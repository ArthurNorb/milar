"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 font-['Spartan'] text-[10px] uppercase tracking-widest text-[#e3d9ce]/70 hover:text-[#87381e] transition-colors"
    >
      <LogOut className="h-3 w-3" />
      Sair
    </button>
  );
}