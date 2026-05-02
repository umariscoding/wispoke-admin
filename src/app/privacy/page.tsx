import type { Metadata } from "next";
import Link from "next/link";
import { APP_CONFIG } from "@/constants/APP_CONSTANTS";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_CONFIG.NAME}`,
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">Privacy Policy</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-12">Last updated: April 5, 2026</p>

        <div className="prose prose-neutral prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-neutral-600 [&_p]:leading-relaxed [&_ul]:text-neutral-600 [&_li]:leading-relaxed">
          <h2>1. Information We Collect</h2>
          <p>When you create an account, we collect your name, email address, and company name. When your customers use your chatbot, we collect chat messages, session data, and basic analytics (page views, device type).</p>
          <p>We do not collect sensitive personal information such as financial data, health records, or government identifiers.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the {APP_CONFIG.NAME} platform</li>
            <li>Process your chatbot conversations and deliver AI responses</li>
            <li>Generate analytics and insights for your dashboard</li>
            <li>Send important service updates and billing notifications</li>
            <li>Improve our AI models and platform features</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your data is stored in secure, SOC 2-compliant data centers. Each company&apos;s data is fully isolated in our multi-tenant architecture — no cross-company data access is possible.</p>

          <h2>4. Your Data, Your Control</h2>
          <p>You own your data. We never use your documents, conversations, or knowledge base content to train AI models for other customers. You can export or delete all your data at any time from your dashboard settings.</p>

          <h2>5. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Supabase</strong> — Database and authentication</li>
            <li><strong>LemonSqueezy</strong> — Payment processing and billing</li>
            <li><strong>AI Providers</strong> — Language model inference (your data is not used for training)</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>We use essential cookies only for authentication and session management. The embedded chat widget does not set any third-party cookies on your visitors&apos; browsers. We do not use tracking or advertising cookies.</p>

          <h2>7. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. Chat conversations are retained per your configured settings. When you delete your account, all associated data is permanently removed within 30 days.</p>

          <h2>8. Contact</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:privacy@wispoke.com" className="text-primary-600 dark:text-primary-400 underline">privacy@wispoke.com</a>.</p>
        </div>
      </main>
    </div>
  );
}
