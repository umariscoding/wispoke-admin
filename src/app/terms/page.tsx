import type { Metadata } from "next";
import Link from "next/link";
import { APP_CONFIG } from "@/constants/APP_CONSTANTS";

export const metadata: Metadata = {
  title: `Terms of Service — ${APP_CONFIG.NAME}`,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <nav className="border-b border-neutral-100 dark:border-neutral-800 px-6">
        <div className="max-w-3xl mx-auto h-16 flex items-center">
          <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {APP_CONFIG.NAME}
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">Terms of Service</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-12">Last updated: April 5, 2026</p>

        <div className="prose prose-neutral prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-neutral-600 [&_p]:leading-relaxed [&_ul]:text-neutral-600 [&_li]:leading-relaxed">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using {APP_CONFIG.NAME}, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>

          <h2>2. Description of Service</h2>
          <p>{APP_CONFIG.NAME} is a chatbot-as-a-service platform that allows businesses to deploy AI-powered customer support chatbots trained on their own knowledge base. The service includes a dashboard, analytics, widget customization, and embedding tools.</p>

          <h2>3. Accounts</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorized use.</p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for any unlawful purpose</li>
            <li>Upload malicious content or malware as knowledge base documents</li>
            <li>Attempt to gain unauthorized access to other accounts or systems</li>
            <li>Use the chatbot to collect sensitive personal data without proper consent</li>
            <li>Resell or redistribute the service without authorization</li>
          </ul>

          <h2>5. Billing and Subscriptions</h2>
          <p>Free accounts have usage limits as described on our pricing page. Pro subscriptions are billed monthly at the current rate. You can cancel at any time — access continues until the end of the billing period. Refunds are available within 30 days of initial purchase.</p>

          <h2>6. Intellectual Property</h2>
          <p>You retain all rights to your content, documents, and knowledge base data. {APP_CONFIG.NAME} retains rights to the platform, software, and service infrastructure. The chatbot widget and embed code are licensed for use on your websites as long as your account is active.</p>

          <h2>7. Data and Privacy</h2>
          <p>Your use of {APP_CONFIG.NAME} is also governed by our <Link href="/privacy" className="text-primary-600 dark:text-primary-400 underline">Privacy Policy</Link>. We process data as described therein. Each company&apos;s data is isolated and never shared across accounts.</p>

          <h2>8. Service Availability</h2>
          <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance with reasonable notice. We are not liable for downtime caused by third-party providers or force majeure events.</p>

          <h2>9. Limitation of Liability</h2>
          <p>{APP_CONFIG.NAME} is provided &quot;as is.&quot; We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you paid in the 12 months prior to the claim.</p>

          <h2>10. Termination</h2>
          <p>Either party may terminate at any time. Upon termination, your data will be available for export for 30 days, after which it will be permanently deleted. We may suspend accounts that violate these terms.</p>

          <h2>11. Changes to Terms</h2>
          <p>We may update these terms from time to time. Material changes will be communicated via email. Continued use after changes constitutes acceptance.</p>

          <h2>12. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:legal@wispoke.com" className="text-primary-600 dark:text-primary-400 underline">legal@wispoke.com</a>.</p>
        </div>
      </main>
    </div>
  );
}
