# Doctors Office — Session Context

> This file helps Claude resume work in new sessions without losing context.
> Read this file FIRST at the start of every new session.

## Current State

**Phase:** MVP Development (Week 1)
**Last Updated:** 2026-03-22
**Current Sprint Goal:** Ship demoable MVP with patient records, queue, prescriptions, billing

## What Has Been Built

### Completed
- [x] Project initialization (Next.js 15, TypeScript, Tailwind CSS 4)
- [x] Pearl Design System (globals.css — full color palette, typography, animations)
- [x] UI Components: Button, Input, Badge, Card, Avatar (with CVA variants)
- [x] Layout: Collapsible Sidebar, Header with notifications & user menu
- [x] Supabase config (browser client, server client, middleware)
- [x] Auth middleware with route protection
- [x] Root layout with fonts (Plus Jakarta Sans, DM Sans, JetBrains Mono)
- [x] Landing page (hero, features, CTA)
- [x] Login page (split layout, Google/WhatsApp social auth placeholders)
- [x] Dashboard (stats cards, live queue, quick actions)
- [x] Patients page (search, table with avatars & badges)
- [x] Appointments page (live queue with status workflow)
- [x] Prescriptions page (history list with PDF/WhatsApp actions)
- [x] Billing page (revenue summary, invoice table with GST)
- [x] Settings page (clinic profile, doctor profile forms)
- [x] TypeScript types for all domain entities
- [x] Utility functions (formatCurrency INR, formatDate, getInitials)
- [x] Drizzle ORM schema (src/db/schema.ts) — all 8 tables with enums
- [x] SQL migration (supabase/migrations/0001_initial_schema.sql) with RLS policies & realtime
- [x] DB connection utility (src/db/index.ts) with postgres-js driver
- [x] drizzle.config.ts for migration generation

### In Progress
- [ ] Functional forms (patient create, prescription create, invoice create)
- [ ] PDF generation for prescriptions & invoices
- [ ] WhatsApp share via wa.me deep links
- [ ] Real-time queue updates via Supabase Realtime

### Not Started
- [ ] Register page
- [ ] PWA manifest & service worker
- [ ] Deployment (Cloudflare Pages)
- [ ] PostHog analytics integration
- [ ] Sentry error tracking

## Repository

- **Repo:** github.com/jonesprabu/doctorsofficeapp
- **Branch strategy:** main (stable) → feature/* branches → PR merge
- **Commit convention:** Conventional Commits (feat:, fix:, chore:, docs:)

## Anti-Hallucination Checklist

Before making changes:
1. Read this CONTEXT.md
2. Run `git log --oneline -10` to verify current state
3. Check src/types/index.ts for type definitions
4. Check src/components/ui/ for available components
5. Check src/db/schema.ts for Drizzle schema, supabase/migrations/ for raw SQL
