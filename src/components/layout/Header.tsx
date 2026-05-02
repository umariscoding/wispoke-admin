"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import { logoutCompanyComprehensive } from "@/store/company/slices/companyAuthSlice";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import type { HeaderProps } from "@/interfaces/Header.interface";

const LogoutButton: React.FC = () => {
  const dispatch = useCompanyAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutCompanyComprehensive());
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
        text-slate-500 dark:text-slate-400
        hover:text-slate-700 dark:hover:text-slate-200
        hover:bg-slate-100 dark:hover:bg-white/[0.04]
        transition-all duration-150 disabled:opacity-40
      "
    >
      {isLoggingOut ? (
        <IOSLoader size="sm" color="primary" />
      ) : (
        <>
          <Icons.Logout className="h-4 w-4" />
          <span>Sign out</span>
        </>
      )}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({
  className = "",
  onMenuToggle,
  showMobileMenuButton = true,
}) => {
  // Reading auth context to keep the hook in scope (used elsewhere; left for parity).
  useCompanyAppSelector((state) => state.companyAuth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className={`
        sticky top-0 z-20 h-14 flex items-center px-6
        bg-white/80 dark:bg-sidebar-bg/80 backdrop-blur-md
        border-b border-slate-200/60 dark:border-white/[0.06]
        ${className}
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        {showMobileMenuButton && (
          <button
            onClick={onMenuToggle}
            className="
              md:hidden p-2 -ml-1 rounded-full
              text-slate-500 dark:text-slate-400
              hover:text-slate-700 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-white/[0.04]
              transition-colors
            "
          >
            <Icons.Menu className="h-5 w-5" />
          </button>
        )}
        <span className="hidden sm:flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <span className="hidden md:block w-1 h-1 rounded-full bg-teal-400/70" />
          {today}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
