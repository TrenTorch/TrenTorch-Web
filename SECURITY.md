# Security Policy

TrenTorch-Web is a hosted SvelteKit application (Cloudflare Pages) with a real user base: GitHub/Google OAuth and magic-link sign-in via Supabase, and per-user data (progress, solved questions, profile) protected by Row Level Security policies. Unlike a purely local tool, this means real security issues can affect real users directly — an RLS policy that's too permissive, an auth flow that leaks a token, a Supabase function callable outside its intended trust boundary, or a client-side exposure of something that should stay server-side.

## Reporting a Vulnerability

**Please don't open a public GitHub issue for a security vulnerability.**

Instead, use GitHub's private reporting flow:

1. Go to the [Security tab](https://github.com/TrenTorch/TrenTorch-Web/security)
2. Click **"Report a vulnerability"**
3. Describe the issue: what's affected, how to reproduce it, and its impact

This opens a private advisory only the maintainer (and anyone you add) can see, so the issue isn't public until there's a fix.

## What's in scope

- The SvelteKit app itself (`platform/`, `processes/`) and how it talks to Supabase
- Supabase schema, RLS policies, and function grants (`supabase/migrations/`)
- Authentication and session handling (OAuth, magic link, cookies/tokens)
- This repository's own GitHub Actions workflows (`.github/workflows/`) and their permissions/secrets handling

## What's out of scope

- Student code executed inside the browser-side Pyodide sandbox — that's a designed, client-side trust boundary (a student's own in-progress code isn't privileged, and never touches the server), not a report-worthy finding on its own unless it demonstrates an actual sandbox escape
- The curriculum content itself being *pedagogically* naive or slow on purpose — that's the point of the course, not a bug

## Response

This is a solo/small-team-maintained project, not a company with a security team or an SLA. Reports will be acknowledged and looked at as soon as reasonably possible, but there's no guaranteed response time.

## Supported versions

There's no formal release/versioning cadence — security fixes land on `main`, which is always the version actually deployed.
