export interface CheckoutResponse {
  checkout_url: string;
}

export interface SubscriptionStatus {
  plan: string;
  ls_subscription_status: string;
  subscription_ends_at: string | null;
  subscription_renews_at: string | null;
  manage_url: string | null;
}
