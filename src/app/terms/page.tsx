import type { Metadata } from "next";
import Link from "next/link";
import { APP_CONFIG } from "@/constants/APP_CONSTANTS";

export const metadata: Metadata = {
  title: `Terms of Service — ${APP_CONFIG.NAME}`,
  description: `Terms of Service for ${APP_CONFIG.NAME}, including SMS messaging, voice agent, and A2P 10DLC disclosures.`,
};

const SECTIONS = [
  { id: "acceptance", title: "Acceptance of Terms", num: 1 },
  { id: "service", title: "Description of Service", num: 2 },
  { id: "accounts", title: "Accounts", num: 3 },
  { id: "acceptable-use", title: "Acceptable Use", num: 4 },
  { id: "customer-compliance", title: "Customer Compliance Obligations", num: 5 },
  { id: "voice-agent", title: "Voice Agent & Call Recording", num: 6 },
  { id: "call-logs", title: "Call Logs & Retention", num: 7 },
  { id: "calendar", title: "Calendar Integration", num: 8 },
  { id: "sms", title: "SMS Messaging Terms (A2P 10DLC)", num: 9 },
  { id: "billing", title: "Billing and Subscriptions", num: 10 },
  { id: "ip", title: "Intellectual Property", num: 11 },
  { id: "data", title: "Data and Privacy", num: 12 },
  { id: "availability", title: "Service Availability", num: 13 },
  { id: "liability", title: "Limitation of Liability", num: 14 },
  { id: "indemnification", title: "Indemnification", num: 15 },
  { id: "termination", title: "Termination", num: 16 },
  { id: "changes", title: "Changes to Terms", num: 17 },
  { id: "contact", title: "Contact", num: 18 },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100 px-6 sticky top-0 bg-white/85 backdrop-blur-xl z-30">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-neutral-900"
          >
            {APP_CONFIG.NAME}
          </Link>
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        <header className="mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 mb-3 flex items-center gap-2">
            <span className="block w-3 h-px bg-primary-500" />
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-neutral-500">
            Effective date: April 5, 2026 · Last updated: May 7, 2026
          </p>
        </header>

        <div className="grid lg:grid-cols-[230px_1fr] gap-10 lg:gap-14">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 mb-4 flex items-center gap-2">
                <span className="block w-3 h-px bg-primary-500" />
                On this page
              </p>
              <ul className="space-y-1 text-[13px]">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-neutral-600 hover:text-neutral-900 transition-colors py-1 leading-snug flex items-baseline gap-2 group"
                    >
                      <span className="text-[10px] font-semibold text-neutral-400 group-hover:text-primary-600 transition-colors w-4 shrink-0 tabular-nums">
                        {s.num}.
                      </span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Body */}
          <article className="prose prose-neutral prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:border-l-[3px] [&_h2]:border-primary-500 [&_h2]:pl-4 [&_h2]:tracking-tight [&_h3]:text-[0.95rem] [&_h3]:font-semibold [&_h3]:text-neutral-800 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-600 [&_p]:leading-relaxed [&_ul]:text-neutral-600 [&_li]:leading-relaxed [&_strong]:text-neutral-900">
            <p className="!text-neutral-700 !text-base">
              These Terms of Service (&quot;Terms&quot;) govern your access to
              and use of {APP_CONFIG.NAME} (&quot;Service&quot;). By creating an
              account, embedding our chat widget, or connecting a phone number
              to our voice agent, you agree to these Terms.
            </p>

            <h2 id="acceptance">Acceptance of Terms</h2>
            <p>
              By accessing or using {APP_CONFIG.NAME}, you agree to be bound by
              these Terms. If you do not agree, do not use the Service. If you
              are using the Service on behalf of a business, you represent that
              you have authority to bind that business to these Terms.
            </p>

            <h2 id="service">Description of Service</h2>
            <p>
              {APP_CONFIG.NAME} is a customer-support automation platform that
              provides:
            </p>
            <ul>
              <li>
                <strong>AI Chat</strong> — an embeddable chat widget trained on
                your knowledge base, deployable on any website with a single
                script tag.
              </li>
              <li>
                <strong>AI Voice Agent</strong> — an AI receptionist that
                answers inbound phone calls on a Twilio number you connect,
                books appointments, and captures caller information.
              </li>
              <li>
                <strong>Dashboard & Analytics</strong> — conversation logs,
                call transcripts, appointment management, calendar
                integrations, and reporting.
              </li>
            </ul>

            <h2 id="accounts">Accounts</h2>
            <p>
              You must provide accurate information when creating an account.
              You are responsible for maintaining the security of your account
              credentials and for all activity that occurs under your account.
              You must notify us immediately at{" "}
              <a
                href="mailto:security@wispoke.com"
                className="text-primary-600 underline"
              >
                security@wispoke.com
              </a>{" "}
              of any unauthorized use.
            </p>

            <h2 id="acceptable-use">Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>Upload malicious content or malware as knowledge base material</li>
              <li>
                Attempt to gain unauthorized access to other accounts or systems
              </li>
              <li>
                Use the chatbot or voice agent to collect sensitive personal
                data (financial, health, government IDs) without proper consent
                and lawful basis
              </li>
              <li>
                Use the voice agent or any messaging functionality for spam,
                fraud, scams, phishing, or any communications prohibited by
                applicable law (including the TCPA, CAN-SPAM, or carrier rules)
              </li>
              <li>Resell or redistribute the Service without authorization</li>
            </ul>

            <h2 id="customer-compliance">Customer Compliance Obligations</h2>
            <p>
              You — not {APP_CONFIG.NAME} — are the sender of communications
              that originate from your connected phone numbers, your embedded
              chat widget, and your business identity. You are solely
              responsible for:
            </p>
            <ul>
              <li>
                Obtaining all required consents from your end-users before
                placing or recording calls, sending SMS, or processing personal
                data
              </li>
              <li>
                Complying with the Telephone Consumer Protection Act (TCPA),
                state-level call-recording laws (including
                two-party-consent states), CAN-SPAM, GDPR, CCPA/CPRA, and any
                other applicable privacy and telecommunications laws
              </li>
              <li>
                Completing carrier registration (including A2P 10DLC brand and
                campaign registration) for any SMS programs you operate using
                third-party providers such as Twilio
              </li>
              <li>
                Publishing your own privacy policy and terms that disclose how
                your end-users&apos; data is collected, used, and shared
              </li>
            </ul>

            <h2 id="voice-agent">Voice Agent & Call Recording</h2>
            <p>
              When you enable the AI Voice Agent, inbound calls to your
              connected phone number are answered, transcribed, and recorded so
              that you can review conversations and capture appointment details.
              By enabling the voice agent, you acknowledge that:
            </p>
            <ul>
              <li>
                Calls are processed by third-party voice, transcription, and AI
                model providers (e.g., Twilio, Deepgram, Groq) under their
                respective terms
              </li>
              <li>
                You are responsible for displaying a recording-consent
                disclosure to callers where required by law (e.g., &quot;This
                call may be recorded&quot;)
              </li>
              <li>
                Recordings, transcripts, and caller details (name, phone
                number, custom appointment fields you define) are stored in
                your dashboard and are accessible only to your authorized users
              </li>
              <li>
                {APP_CONFIG.NAME} does not sell call recordings or caller
                personal information
              </li>
            </ul>

            <h2 id="call-logs">Call Logs & Retention</h2>
            <p>
              Every call answered by the voice agent generates a call log
              containing metadata (Caller ID, start time, duration, outcome,
              and any linked appointment), a transcript, and an audio
              recording. Call logs are visible only to authorized users in
              your dashboard.
            </p>
            <p>
              By default, recordings, transcripts, and call-log metadata are
              retained for the period configured in your account settings. You
              may shorten the retention period or delete individual calls and
              recordings at any time from the Calls page. Upon deletion,
              primary copies are removed within 24 hours and backup copies are
              purged on our standard 30-day backup rotation.
            </p>
            <p>
              Some jurisdictions require retention of certain telephony
              records (e.g., for tax, healthcare, or financial-services
              compliance). You acknowledge that you are responsible for
              configuring retention to meet your own legal obligations and
              for exporting records before deletion.
            </p>

            <h2 id="calendar">Calendar Integration</h2>
            <p>
              The Service may integrate with third-party calendar providers
              such as Google Calendar, Microsoft Outlook, and any
              iCal-compatible calendar so that the voice agent can check
              availability and place appointments directly on your calendar.
            </p>
            <p>When you connect a calendar, you authorize {APP_CONFIG.NAME} to:</p>
            <ul>
              <li>
                Read free/busy data from the calendar you select to determine
                availability
              </li>
              <li>
                Create, update, or cancel events on that calendar that
                originate from appointments booked through the Service
              </li>
              <li>
                Store an OAuth refresh token (encrypted at rest) so future
                syncs run without re-prompting you
              </li>
            </ul>
            <p>
              We do not access calendar data unrelated to appointments managed
              through the Service. You may revoke this authorization at any
              time from your dashboard settings or directly with your calendar
              provider — once revoked, future syncs stop and stored tokens are
              deleted. Your use of any third-party calendar service is subject
              to that provider&apos;s terms.
            </p>

            <h2 id="sms">SMS Messaging Terms (A2P 10DLC)</h2>
            <p>
              <strong>
                {APP_CONFIG.NAME} does not send SMS to platform account
                holders.
              </strong>{" "}
              Account communications — verification, security alerts,
              billing, and product updates — are delivered exclusively by
              email and in-app messaging. The signup checkbox covers our
              Terms, Privacy Policy, and transactional email only.
            </p>
            <p>
              SMS is offered solely as an optional capability of the AI
              Voice Agent. When the feature is enabled, the voice agent may
              send a follow-up text — most commonly a booking confirmation
              or reminder — to the inbound caller, originated from the
              phone number you connect to the Service. The terms in this
              section apply to those caller-directed messages.
            </p>

            <h3>Program description</h3>
            <p>
              The voice-agent SMS program sends transactional, event-driven
              messages to inbound callers who affirmatively request them
              during a phone call (e.g., appointment confirmations,
              reminders, and rescheduling/cancellation notices). Each
              message includes the appointment details, contact information
              for your business, and the standard disclosure: &quot;Reply
              STOP to opt out, HELP for help. Msg & data rates may
              apply.&quot; We do not send marketing or promotional SMS
              under this program.
            </p>

            <h3>How callers opt in</h3>
            <p>
              <strong>Caller consent is captured during the phone call.</strong>{" "}
              Before sending any SMS, the voice agent asks the caller
              whether they would like to receive a text (for example,
              &quot;Would you like a text confirmation of your
              appointment?&quot;). The voice agent will only send an SMS if
              the caller verbally agrees. The caller&apos;s spoken consent,
              the phone number, and the timestamp are recorded as part of
              the call recording and transcript stored in your dashboard,
              and serve as our record of opt-in for compliance purposes.
            </p>

            <h3>Message frequency</h3>
            <p>
              Message frequency is event-driven and tied to the caller&apos;s
              own appointment. A typical booking generates one to three
              messages (confirmation, optional reminder, and any cancel or
              reschedule notice).
            </p>

            <h3>Message and data rates</h3>
            <p>
              <strong>Message and data rates may apply</strong>, depending
              on the recipient&apos;s wireless plan and carrier.{" "}
              {APP_CONFIG.NAME} does not charge recipients separately for
              SMS.
            </p>

            <h3>How recipients opt out (STOP)</h3>
            <p>
              Recipients may reply <strong>STOP</strong> to any message at
              any time to immediately opt out of further SMS from the
              originating number. STOP replies are logged on the call /
              caller record, and the voice agent will not send further SMS
              to that number unless the caller affirmatively re-opts-in on
              a subsequent call.
            </p>

            <h3>Help (HELP)</h3>
            <p>
              Recipients may reply <strong>HELP</strong> to receive support
              contact information for the originating business. Recipients
              may also email{" "}
              <a
                href="mailto:support@wispoke.com"
                className="text-primary-600 underline"
              >
                support@wispoke.com
              </a>{" "}
              for platform-level support.
            </p>

            <h3>Supported carriers</h3>
            <p>
              Supported carriers include AT&T, Verizon Wireless, T-Mobile,
              Sprint, U.S. Cellular, Boost Mobile, MetroPCS, Cricket, Virgin
              Mobile, and most other major and minor U.S. carriers.{" "}
              <strong>
                Carriers are not liable for delayed or undelivered messages.
              </strong>{" "}
              Service availability and message delivery are not guaranteed.
            </p>

            <h3>Privacy</h3>
            <p>
              Your privacy is important to us. See our{" "}
              <Link href="/privacy" className="text-primary-600 underline">
                Privacy Policy
              </Link>{" "}
              for details on how we collect, use, and protect mobile
              information.{" "}
              <strong>
                No mobile information will be shared with third parties or
                affiliates for marketing or promotional purposes.
              </strong>
            </p>

            <h2 id="billing">Billing and Subscriptions</h2>
            <p>
              Free accounts have usage limits as described on our pricing page.
              Pro subscriptions are billed monthly at the current rate stated
              at checkout. You can cancel at any time — access continues until
              the end of the billing period. Refunds are available within 30
              days of initial purchase.
            </p>

            <h2 id="ip">Intellectual Property</h2>
            <p>
              You retain all rights to your content, documents, knowledge base
              data, and call recordings. {APP_CONFIG.NAME} retains rights to
              the platform, software, and Service infrastructure. The chatbot
              widget and embed code are licensed for use on your websites for
              as long as your account is active.
            </p>

            <h2 id="data">Data and Privacy</h2>
            <p>
              Your use of {APP_CONFIG.NAME} is also governed by our{" "}
              <Link href="/privacy" className="text-primary-600 underline">
                Privacy Policy
              </Link>
              . We process data as described therein. Each company&apos;s data
              is logically isolated and is never shared across accounts.
            </p>

            <h2 id="availability">Service Availability</h2>
            <p>
              We strive for 99.9% uptime but do not guarantee uninterrupted
              service. We may perform maintenance with reasonable notice. We
              are not liable for downtime caused by third-party providers
              (including Twilio, AI model providers, calendar providers, or
              carriers) or force majeure events.
            </p>

            <h2 id="liability">Limitation of Liability</h2>
            <p>
              {APP_CONFIG.NAME} is provided &quot;as is&quot; and &quot;as
              available.&quot; To the maximum extent permitted by law, we are
              not liable for any indirect, incidental, consequential, special,
              or punitive damages arising from your use of the Service. Our
              total aggregate liability is limited to the amount you paid us in
              the 12 months prior to the claim.
            </p>

            <h2 id="indemnification">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless {APP_CONFIG.NAME}, its
              officers, employees, and agents from any claims, damages, losses,
              or expenses (including reasonable attorney fees) arising from:
              (a) your violation of these Terms; (b) your violation of any law
              or regulation, including the TCPA, CAN-SPAM, or carrier
              requirements; or (c) communications you originate using the
              Service, including SMS or calls placed to your end-users.
            </p>

            <h2 id="termination">Termination</h2>
            <p>
              Either party may terminate at any time. Upon termination, your
              data will be available for export for 30 days, after which it
              will be permanently deleted. We may suspend or terminate accounts
              that violate these Terms or that pose a risk to the Service or
              other users.
            </p>

            <h2 id="changes">Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes
              will be communicated via email and reflected in the &quot;Last
              updated&quot; date above. Continued use after changes constitutes
              acceptance.
            </p>

            <h2 id="contact">Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a
                href="mailto:legal@wispoke.com"
                className="text-primary-600 underline"
              >
                legal@wispoke.com
              </a>
              . For SMS-related questions, email{" "}
              <a
                href="mailto:support@wispoke.com"
                className="text-primary-600 underline"
              >
                support@wispoke.com
              </a>
              .
            </p>
          </article>
        </div>
      </main>

      <footer className="border-t border-neutral-100 mt-16 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
