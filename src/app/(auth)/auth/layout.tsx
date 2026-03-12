"use client";

import React from "react";
import { CompanyReduxProvider } from "@/lib/company-redux-provider";
import { CompanyAuthProvider } from "@/components/auth/company/CompanyAuthProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompanyReduxProvider>
      <CompanyAuthProvider>{children}</CompanyAuthProvider>
    </CompanyReduxProvider>
  );
}
