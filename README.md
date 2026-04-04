# Wispoke Admin - Dashboard

A Next.js admin dashboard for the Wispoke multi-tenant chatbot platform. Companies manage their AI chatbots, knowledge bases, analytics, embed widgets, users, and billing from a single interface.

## Tech Stack

- **Next.js 13.5** with App Router and TypeScript
- **Redux Toolkit** with Redux Persist - State management
- **Tailwind CSS** - Styling
- **Axios** - API client with token refresh interceptor
- **Recharts** - Analytics charts
- **Headless UI** - Accessible component patterns
- **React Markdown** - Content rendering
- **Google OAuth** (`@react-oauth/google`) - SSO
- **Lucide React** - Icons

## Project Structure

```
src/
├── app/
│   ├── (auth)/                      # Auth routes
│   │   └── auth/                    # Login / Register (company)
│   ├── (dashboard)/                 # Protected routes
│   │   ├── dashboard/               # Analytics dashboard
│   │   ├── ai-studio/               # Knowledge base & model config
│   │   ├── users/                   # User management
│   │   ├── settings/                # Company & chatbot settings
│   │   ├── embed/                   # Widget customization
│   │   └── layout.tsx               # Sidebar + header layout
│   └── page.tsx                     # Landing page
├── components/
│   ├── ui/                          # Button, Toggle, Card, Modal, SkeletonLoader
│   ├── layout/                      # Sidebar, Header
│   ├── auth/company/                # AuthProvider, ProtectedRoute
│   ├── dashboard/analytics/         # ChatsChart, MessagesChart, StatsCard
│   ├── knowledge-base/              # FileUpload, TextUpload, DocumentList
│   ├── settings/                    # ProfileSection, ChatbotSection, PublishingSection, BillingSection
│   └── billing/                     # ProBadge, UpgradeNudge, UpgradePrompt
├── store/company/
│   └── slices/                      # companyAuth, company, knowledgeBase, analytics, billing, ui
├── hooks/                           # useSettings, usePlan, useEmbedSettings, useCompanyAuth
├── types/                           # auth, knowledgeBase, settings, billing
├── utils/company/                   # Axios API client
├── constants/                       # API config, app constants
├── interfaces/                      # Component prop interfaces
└── lib/                             # Redux provider
```

## Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run ts

# Format code
npm run prettier
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Features

### Dashboard
- Time-of-day greeting with live status indicator
- Chat and message volume charts (Recharts)
- Key stats cards with 7-day metrics

### AI Studio
- Upload PDF/DOCX documents and plain text to the knowledge base
- Track document embedding status (pending/failed/completed)
- Select AI model (Groq Llama, GPT-4o, GPT-4.1, etc.)
- Configure system prompt and tone
- Pro/Free plan feature gating

### Settings
- Company profile (name, email, slug)
- Chatbot title, description, model, system prompt
- Publish/unpublish chatbot and user portal
- Billing info and plan management

### Embed Widget
- Theme, position, colors, button icon, chat template
- Welcome messages and suggested prompts
- Auto-open delay and branding toggle
- Live preview component

### Users
- View all users (anonymous and named)
- Chat and message counts per user
- Search and pagination
- Pro plan feature

## Authentication

- JWT-based with access + refresh tokens
- Google OAuth SSO
- Automatic token refresh via Axios interceptor
- `CompanyProtectedRoute` HOC guards dashboard routes

## State Management

Redux Toolkit with 6 slices:

| Slice | Persisted | Purpose |
|-------|-----------|---------|
| `companyAuth` | Yes | Auth state, tokens, company profile |
| `company` | Yes | Company settings |
| `knowledgeBase` | No | Documents, upload progress |
| `analytics` | No | Dashboard metrics |
| `billing` | No | Subscription status |
| `ui` | No | Notifications, modals |

## API Integration

Key endpoints:

- `POST /auth/company/register` / `login` / `google` - Auth
- `PATCH /api/company/settings` - Batch settings update
- `POST /chat/upload-document` / `upload-text` - KB uploads
- `GET /chat/documents` - List documents
- `GET /api/company/analytics/dashboard` - Dashboard metrics
- `GET /api/company/analytics/users` - User list
- `POST /billing/checkout` / `cancel` / `resume` - Billing
