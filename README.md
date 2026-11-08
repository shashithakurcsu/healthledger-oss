# HealthLedger

An open-source web application for tracking HSA/FSA medical expenses, managing deductibles, and maximizing tax savings.

> **Disclaimer:** HealthLedger is a record-keeping tool. It does not provide tax, legal, or medical advice. Verify HSA/FSA eligibility with IRS Publication 502 / 969 or a qualified tax professional.

## Features

- **Expense Tracking**: Log medical expenses with provider, date, amounts, and categories
- **Receipt Storage**: Upload and store receipt images (paid plans)
- **Deductible Tracking**: Monitor progress toward individual and family deductibles
- **HSA/FSA Eligibility**: Track which expenses qualify for tax-advantaged accounts
- **Insurance Plans**: Manage multiple insurance plans with OOP max tracking
- **Family Management**: Track expenses for family members separately (Family plan)
- **Reports**: View annual summaries and tax-ready expense reports
- **Subscription Tiers**: Free, Personal ($4.99/mo), and Family ($9.99/mo) plans

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PERSONAL_MONTHLY=price_...
STRIPE_PRICE_FAMILY_MONTHLY=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. Create a new Supabase project
2. Run the migration SQL in `supabase/migrations/` to create tables
3. Enable Row Level Security (RLS) policies

### Stripe Setup

1. Create products and prices in Stripe Dashboard:
   - Personal Plan: $4.99/month
   - Family Plan: $9.99/month
2. Copy the price IDs to your environment variables
3. Set up a webhook endpoint pointing to `/api/webhooks/stripe`
4. Configure webhook to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
# Type check and build
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # Public marketing pages
│   ├── api/                # API routes
│   └── dashboard/          # Protected dashboard pages
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── billing/            # Billing components
│   ├── subscription/       # Subscription components
│   └── ui/                 # shadcn/ui components
├── features/               # Feature-based modules
│   ├── expenses/           # Expense management
│   ├── insurance/          # Insurance plan management
│   ├── family/             # Family member management
│   └── settings/           # User settings
├── lib/                    # Utility libraries
│   ├── supabase/           # Supabase client
│   ├── stripe/             # Stripe utilities
│   ├── subscription/       # Subscription/feature gating
│   └── calculations/       # Business logic calculations
├── constants/              # App constants
└── types/                  # TypeScript types
```

## Subscription Tiers

| Feature | Free | Personal | Family |
|---------|------|----------|--------|
| Expenses/month | 25 | Unlimited | Unlimited |
| Receipt storage | No | Yes (1GB) | Yes (5GB) |
| Insurance plans | 1 | 5 | 10 |
| Family members | 0 | 0 | 6 |
| Export reports | No | Yes | Yes |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

## Self-Hosting Notes

If you deploy your own instance, replace the HealthLedger-specific content before going live:

- `app/(marketing)/privacy/page.tsx` and `app/(marketing)/terms/page.tsx` are the policies for the hosted HealthLedger service. They are not legal advice and do not apply to your deployment. Write your own.
- The support address (`support@healthledger.app`) appears in the marketing layout and legal pages. Change it to your own.
- Email templates in `emails/` use Supabase's `{{ .SiteURL }}` variable, so links follow your Supabase Auth "Site URL" setting.
- Set `NEXT_PUBLIC_APP_URL` to your own domain. It drives metadata, the sitemap, and `robots.txt`.

## Contributing

Issues and pull requests are welcome. Run `npm run lint` and `npm run type-check` before opening a PR. Never commit `.env*` files or real user data.

## Security

See [SECURITY.md](SECURITY.md) for how to report vulnerabilities.

## License

[MIT](LICENSE)
