import { useMemo } from "react";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";

/**
 * Mirrors the backend `is_plan_active()` logic so the frontend gates
 * features identically to the API.
 *
 * A company is considered Pro when plan === "pro" AND:
 *   - status === "active", OR
 *   - status === "past_due" (dunning period — payment retry in progress), OR
 *   - status === "cancelled" AND subscription_ends_at is in the future
 */
export function usePlan() {
  const company = useCompanyAppSelector((state) => state.companyAuth.company);

  return useMemo(() => {
    const plan = company?.plan || "free";
    const subscriptionStatus = company?.ls_subscription_status || "none";
    const subscriptionEndsAt = company?.subscription_ends_at || null;
    const subscriptionRenewsAt = company?.subscription_renews_at || null;

    // Mirror backend is_plan_active()
    let isPlanActive = false;
    if (plan === "pro") {
      if (subscriptionStatus === "active" || subscriptionStatus === "past_due") {
        isPlanActive = true;
      } else if (subscriptionStatus === "cancelled" && subscriptionEndsAt) {
        try {
          isPlanActive = new Date(subscriptionEndsAt) > new Date();
        } catch {
          isPlanActive = false;
        }
      }
    }

    const isPro = isPlanActive;
    const isFree = !isPlanActive;
    const isCancelled = subscriptionStatus === "cancelled" && isPlanActive;

    return {
      plan,
      isPro,
      isFree,
      isCancelled,
      subscriptionStatus,
      subscriptionEndsAt,
      subscriptionRenewsAt,
    };
  }, [
    company?.plan,
    company?.ls_subscription_status,
    company?.subscription_ends_at,
    company?.subscription_renews_at,
  ]);
}
