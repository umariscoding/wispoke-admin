"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { ROUTES } from "@/constants/APP_CONSTANTS";
import IOSLoader from "@/components/ui/IOSLoader";

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
  if (companyAuth.loading || isInitialLoad) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <IOSLoader size="xl" color="primary" className="mx-auto mb-4" />
        </div>
      </div>
    );
  }

  // Check authentication
  if (!companyAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <IOSLoader size="xl" color="primary" className="mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
