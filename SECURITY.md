# Security Policy

HealthLedger stores medical expense records and receipts, so security reports are taken seriously.

## Reporting a Vulnerability

Please do **not** open a public issue for security problems. Use GitHub's private vulnerability reporting instead: go to the repository's **Security** tab and choose **Report a vulnerability**.

Include a description of the issue, steps to reproduce, and the impact you expect. You should receive an acknowledgement within 7 days.

## Scope

In scope: code in this repository, including the Supabase schema and Row Level Security policies in `supabase/migrations/`, the Stripe webhook handler, and authentication flows.

Out of scope: third-party services (Supabase, Stripe, Vercel) and self-hosted deployments run by others.

## Handling Secrets

Never commit `.env*` files, API keys, or real user data. If you believe a secret has been committed, report it privately so it can be rotated.
