import type { Metadata } from "next";
import Link from "next/link";
import { APP_CONFIG } from "@/constants/APP_CONSTANTS";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_CONFIG.NAME}`,
  description: `Privacy Policy for ${APP_CONFIG.NAME}, including SMS, voice, and mobile information handling for A2P 10DLC compliance.`,
};

const SECTIONS = [
  { id: "overview", title: "Overview", num: null },
  { id: "collect", title: "Information We Collect", num: 1 },
  { id: "use", title: "How We Use Your Information", num: 2 },
  { id: "sms", title: "SMS Consent & Mobile Information", num: 3 },
  { id: "voice", title: "AI Voice Agent — Calls & Recordings", num: 4 },
  { id: "call-logs", title: "Call Logs & Metadata", num: 5 },
  { id: "calendar", title: "Calendar Integration & Appointments", num: 6 },
  { id: "sharing", title: "How We Share Information", num: 7 },
  { id: "third-parties", title: "Third-Party Services", num: 8 },
  { id: "security", title: "Data Storage and Security", num: 9 },
  { id: "control", title: "Your Data, Your Control", num: 10 },
  { id: "rights", title: "Your Rights (GDPR / CCPA)", num: 11 },
  { id: "cookies", title: "Cookies", num: 12 },
  { id: "retention", title: "Data Retention", num: 13 },
  { id: "children", title: "Children's Privacy", num: 14 },
  { id: "changes", title: "Changes to this Policy", num: 15 },
  { id: "contact", title: "Contact", num: 16 },
];

export default function PrivacyPage() {
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
            Privacy Policy
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
                        {s.num !== null ? `${s.num}.` : "·"}
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
            <h2 id="overview" className="!mt-0">
              Overview
            </h2>
            <p>
              This Privacy Policy explains what information {APP_CONFIG.NAME}{" "}
              (&quot;we&quot;, &quot;us&quot;) collects when you use our
              chatbot, voice agent, and dashboard, how we use it, and the
              choices you have. We are committed to protecting your privacy and
              the privacy of your end-users.
            </p>
            <div className="not-prose my-6 rounded-xl border border-primary-200 bg-primary-50/60 px-5 py-4">
              <p className="text-sm font-semibold text-neutral-900 mb-1">
                Mobile information disclosure
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                No mobile information will be shared with third parties or
                affiliates for marketing or promotional purposes. All the
                categories below exclude text-messaging originator opt-in data
                and consent — this information will not be shared with any
                third parties.
              </p>
            </div>

            <h2 id="collect">Information We Collect</h2>
            <p>
              <strong>Account information.</strong> When you create an
              account, we collect your name, email address, and company
              name. We do not collect a mobile phone number for the account
              holder; account communications are delivered by email only.
            </p>
            <p>
              <strong>End-user chat data.</strong> When your customers use your
              embedded chatbot, we collect chat messages, session data, and
              basic analytics (page views, device type, language).
            </p>
            <p>
              <strong>Voice agent call data.</strong> When you connect a phone
              number, we collect inbound caller phone numbers, audio
              recordings, transcripts, appointment details, and any custom
              fields you configure.
            </p>
            <p>
              <strong>Billing data.</strong> Payment is processed by our
              payment provider; we receive transaction metadata (amount, date,
              last four digits of card) but never store full card numbers.
            </p>
            <p>
              <strong>Technical data.</strong> Server logs, IP addresses, and
              browser metadata used for security, debugging, and rate limiting.
            </p>
            <p>
              We do not knowingly collect sensitive personal information such
              as financial account numbers, health records, or government
              identifiers.
            </p>

            <h2 id="use">How We Use Your Information</h2>
            <p>We use information to:</p>
            <ul>
              <li>Provide, maintain, and improve the {APP_CONFIG.NAME} platform</li>
              <li>
                Process chatbot conversations and voice agent calls and deliver
                AI responses
              </li>
              <li>Generate analytics and insights for your dashboard</li>
              <li>
                Send transactional emails: account verification, security
                alerts, billing notifications, and product updates
              </li>
              <li>Detect, investigate, and prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your data, and we do not use your
              documents, conversations, recordings, or knowledge base to train
              AI models for other customers.
            </p>

            <h2 id="sms">SMS Consent & Mobile Information</h2>
            <p>
              <strong>
                {APP_CONFIG.NAME} does not send SMS to platform account
                holders.
              </strong>{" "}
              Account communications (verification, security alerts,
              billing, product updates) are delivered only by email and
              in-app messaging. The signup checkbox covers our Terms,
              Privacy Policy, and transactional email only.
            </p>
            <p>
              SMS, when used, is a feature of the AI Voice Agent. With your
              voice-agent feature enabled, the agent may send a follow-up
              text — typically a booking confirmation or reminder — to an
              inbound caller, originated from the phone number you have
              connected to the Service. <strong>
                The recipient is the caller, not you (the account
                holder).
              </strong>
            </p>
            <p>
              <strong>Caller consent is captured during the phone call.</strong>{" "}
              Before any SMS is sent, the voice agent asks the caller
              whether they would like to receive a text (for example,
              &quot;Would you like a text confirmation?&quot;). The voice
              agent only sends a message if the caller verbally agrees. The
              spoken consent, phone number, and timestamp are recorded as
              part of the call recording and transcript stored in your
              dashboard, and serve as the opt-in record. Recipients can
              reply <strong>STOP</strong> at any time to opt out, or{" "}
              <strong>HELP</strong> for support information; details are in
              our{" "}
              <Link href="/terms#sms" className="text-primary-600 underline">
                SMS Messaging Terms
              </Link>
              .
            </p>
            <p>
              <strong>
                No mobile information will be shared with third parties or
                affiliates for marketing or promotional purposes.
              </strong>{" "}
              SMS opt-in data and consent are not shared with any third party.
              Caller phone numbers and consent records are used only to
              deliver the message the caller requested and to comply with
              carrier and regulatory requirements. Message and data rates
              may apply, depending on the recipient&apos;s wireless plan
              and carrier.
            </p>

            <h2 id="voice">AI Voice Agent — Calls & Recordings</h2>
            <p>
              The {APP_CONFIG.NAME} voice agent answers inbound calls on phone
              numbers you connect. As part of operating the voice agent, we
              process:
            </p>
            <ul>
              <li>Caller phone numbers (Caller ID)</li>
              <li>Audio of the call (streamed and stored as a recording)</li>
              <li>Real-time and final transcripts of the conversation</li>
              <li>
                Appointment fields you configure (e.g., name, callback number,
                notes)
              </li>
            </ul>
            <p>
              Call audio and transcripts are processed by speech and AI model
              providers (such as Twilio, Deepgram, and Groq) under their
              respective terms. These providers act as data processors and do
              not use your data to train their models for other customers.
            </p>
            <p>
              You — as the operator of the connected phone number — are
              responsible for posting any recording-consent disclosure required
              by applicable law (e.g., &quot;This call may be recorded&quot;
              announcements in two-party-consent jurisdictions).
            </p>

            <h2 id="call-logs">Call Logs & Metadata</h2>
            <p>
              For every call your voice agent answers, we record metadata in
              your dashboard so you can audit usage, review conversations, and
              meet your own retention obligations. Call logs include:
            </p>
            <ul>
              <li>Caller phone number (Caller ID) and approximate region</li>
              <li>Start time, end time, and total duration</li>
              <li>
                Outcome (e.g., booked, no-show, voicemail, dropped, transferred)
              </li>
              <li>
                AI model used, voice used, and per-call usage metrics for
                billing transparency
              </li>
              <li>
                Linked appointment record (if the call resulted in a booking)
              </li>
              <li>Tags or notes added by your team during review</li>
            </ul>
            <p>
              Call logs are accessible only to authorized users in your
              dashboard. <strong>
                We do not enrich, sell, or share caller phone numbers with data
                brokers, marketers, or third-party affiliates.
              </strong>{" "}
              Caller information is used only to operate the voice agent on
              your behalf, return your callbacks, and assemble your appointment
              records.
            </p>
            <p>
              You can delete individual calls or bulk-purge call logs at any
              time from the Calls page in your dashboard. Deleted recordings
              are removed from primary storage within 24 hours; backup copies
              are purged on our standard 30-day backup rotation.
            </p>

            <h2 id="calendar">Calendar Integration & Appointments</h2>
            <p>
              When the voice agent books an appointment, the appointment record
              — date, time, configured fields (e.g., name, phone, service
              requested), and any free-form notes — is stored in your{" "}
              {APP_CONFIG.NAME} dashboard and linked to the originating call.
            </p>
            <p>
              If you connect an external calendar provider (such as Google
              Calendar, Microsoft Outlook, or any iCal-compatible calendar),
              we:
            </p>
            <ul>
              <li>
                Request only the minimum OAuth scopes required to read your
                availability and write events to the specific calendar you
                select
              </li>
              <li>
                Use those credentials solely to keep appointments booked
                through {APP_CONFIG.NAME} in sync with your chosen calendar
              </li>
              <li>
                Store an OAuth refresh token, encrypted at rest, so future
                syncs can run on your behalf without prompting you again
              </li>
              <li>
                Disconnect immediately when you revoke access from your
                {APP_CONFIG.NAME} dashboard or directly with your calendar
                provider
              </li>
            </ul>
            <p>
              <strong>
                We do not read calendar events, contacts, mailbox content, or
                any other Google Workspace or Microsoft 365 data unrelated to
                the appointments scheduled through {APP_CONFIG.NAME}.
              </strong>{" "}
              Our use of information received from Google APIs adheres to the
              Google API Services User Data Policy, including the Limited Use
              requirements.
            </p>
            <p>
              You can revoke calendar access at any time from your dashboard
              settings or directly via your calendar provider&apos;s account
              security page.
            </p>

            <h2 id="sharing">How We Share Information</h2>
            <p>We share information only in these limited cases:</p>
            <ul>
              <li>
                <strong>With service providers</strong> who help us operate the
                Service (hosting, AI inference, payments, telephony) — under
                contracts requiring confidentiality and limited-purpose use
              </li>
              <li>
                <strong>To comply with law</strong> — in response to lawful
                requests from public authorities, including to meet national
                security or law enforcement requirements
              </li>
              <li>
                <strong>To protect rights and safety</strong> — to prevent
                fraud, security incidents, or harm to users or the public
              </li>
              <li>
                <strong>With your consent</strong> — for any other purpose
                disclosed at the time you give consent
              </li>
            </ul>
            <p>
              We do not sell personal information, and we do not share mobile
              information with third parties or affiliates for marketing or
              promotional purposes.
            </p>

            <h2 id="third-parties">Third-Party Services</h2>
            <p>We use the following sub-processors:</p>
            <ul>
              <li>
                <strong>Supabase</strong> — database, authentication, file
                storage
              </li>
              <li>
                <strong>Twilio</strong> — telephony for the voice agent
                (inbound call routing, audio streaming, optional SMS)
              </li>
              <li>
                <strong>Deepgram, Groq, and other AI providers</strong> —
                speech-to-text, language model inference (your data is not used
                to train their models for others)
              </li>
              <li>
                <strong>Google Calendar / Microsoft Graph</strong> — optional
                calendar sync for appointments you book through the voice
                agent
              </li>
              <li>
                <strong>Resend</strong> — transactional email delivery
              </li>
              <li>
                <strong>LemonSqueezy</strong> — payment processing and billing
              </li>
            </ul>

            <h2 id="security">Data Storage and Security</h2>
            <p>
              All data is encrypted in transit (TLS 1.2+) and at rest
              (AES-256). Your data is stored in secure cloud data centers. Each
              company&apos;s data is logically isolated in our multi-tenant
              architecture — no cross-company data access is possible.
            </p>
            <p>
              We restrict access to your data to authorized personnel who need
              it to operate or support the Service, and we maintain reasonable
              administrative, technical, and physical safeguards.
            </p>

            <h2 id="control">Your Data, Your Control</h2>
            <p>
              You own your data. You can export or delete documents,
              conversations, transcripts, recordings, call logs, and
              appointments from your dashboard at any time. We never use your
              content to train AI models for other customers.
            </p>

            <h2 id="rights">Your Rights (GDPR / CCPA)</h2>
            <p>
              Depending on where you live, you may have rights to: access the
              personal information we hold about you; correct inaccurate
              information; delete your information; restrict or object to
              processing; receive your data in a portable format; and withdraw
              consent at any time.
            </p>
            <p>
              California residents may also request a list of categories of
              personal information disclosed for business purposes. We do not
              sell personal information.
            </p>
            <p>
              To exercise any of these rights, email{" "}
              <a
                href="mailto:privacy@wispoke.com"
                className="text-primary-600 underline"
              >
                privacy@wispoke.com
              </a>
              . We will verify your request and respond within the timeframes
              required by applicable law.
            </p>

            <h2 id="cookies">Cookies</h2>
            <p>
              We use essential cookies only for authentication and session
              management. The embedded chat widget does not set any
              third-party cookies on your visitors&apos; browsers. We do not
              use tracking or advertising cookies.
            </p>

            <h2 id="retention">Data Retention</h2>
            <p>
              We retain account data for as long as your account is active.
              Chat conversations, call transcripts, call recordings, call
              logs, and appointments are retained per your configured
              settings. When you delete your account, all associated data is
              permanently removed within 30 days, except where we are required
              by law to retain it longer.
            </p>

            <h2 id="children">Children&apos;s Privacy</h2>
            <p>
              {APP_CONFIG.NAME} is not directed to children under 13 (or under
              16 in the EEA), and we do not knowingly collect personal
              information from children. If you believe a child has provided
              personal information to us, contact{" "}
              <a
                href="mailto:privacy@wispoke.com"
                className="text-primary-600 underline"
              >
                privacy@wispoke.com
              </a>
              .
            </p>

            <h2 id="changes">Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be communicated via email and reflected in the
              &quot;Last updated&quot; date above.
            </p>

            <h2 id="contact">Contact</h2>
            <p>
              For privacy questions or to exercise your rights, contact us at{" "}
              <a
                href="mailto:privacy@wispoke.com"
                className="text-primary-600 underline"
              >
                privacy@wispoke.com
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
