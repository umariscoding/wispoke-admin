"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { ROUTES } from "@/constants/APP_CONSTANTS";
import { IOSContentLoader } from "@/components/ui";

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
  fallbackRoute?: string;
}

export const CompanyProtectedRoute: React.FC<CompanyProtectedRouteProps> = ({
  children,
  fallbackRoute = ROUTES.COMPANY_LOGIN,
}) => {
  const router = useRouter();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize before making routing decisions
    if (!companyAuth.loading) {
      setIsInitialLoad(false);

      if (!companyAuth.isAuthenticated) {
        router.push(fallbackRoute);
        return;
      }
    }
  }, [companyAuth.isAuthenticated, companyAuth.loading, fallbackRoute, router]);

  // Show loading during initial auth check or while auth is loading
  if (companyAuth.loading || isInitialLoad || !companyAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-sidebar-bg">
        <IOSContentLoader isLoading={true} message="Loading..." />
      </div>
    );
  }

  return <>{children}</>;
};
