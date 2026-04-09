import type { Recording } from '@/store/useAppStore';

export const mockRecordings: Recording[] = [
  {
    id: 'rec-1',
    name: 'Team Standup — Sprint 42',
    date: new Date('2026-04-07T09:30:00').toISOString(),
    duration: 1847,
    status: 'summarized',
    transcript: `Good morning everyone. Let's do a quick round. Sarah, you want to start?\n\nSarah: Sure. Yesterday I finished the authentication refactor. The JWT rotation is now working with httpOnly cookies. Today I'm going to start on the password reset flow. No blockers.\n\nMike: I spent most of yesterday debugging the payment webhook. Turned out Stripe was sending duplicate events. I added idempotency checks. Today I'll write tests for edge cases. One blocker — I need the staging Stripe keys rotated.\n\nLisa: I wrapped up the dashboard redesign mockups. Got feedback from the design review — they want the chart colors to match our new brand palette. I'll update those today and hand off to dev tomorrow.\n\nGreat updates everyone. Mike, I'll get those keys rotated by noon. Let's sync again tomorrow. Meeting adjourned.`,
    summary: `## Team Standup — Sprint 42\n\n### Key Points\n- **Auth refactor complete** — JWT rotation with httpOnly cookies is working (Sarah)\n- **Payment webhook fix** — Added idempotency checks for duplicate Stripe events (Mike)\n- **Dashboard redesign** — Mockups done, updating chart colors to match new brand palette (Lisa)\n\n### Action Items\n- [ ] Rotate staging Stripe keys by noon (for Mike)\n- [ ] Sarah: Start password reset flow\n- [ ] Lisa: Update chart colors, hand off to dev tomorrow\n- [ ] Mike: Write tests for payment webhook edge cases\n\n### Blockers\n- Mike needs staging Stripe keys rotated`,
    notes: '',
  },
  {
    id: 'rec-2',
    name: 'Product Strategy Deep Dive',
    date: new Date('2026-04-06T14:00:00').toISOString(),
    duration: 5420,
    status: 'transcribed',
    transcript: `Welcome everyone to the quarterly product strategy session. Today we're going to cover three main areas: our competitive landscape, the Q3 roadmap priorities, and our approach to the enterprise market.\n\nLet's start with the competitive landscape. Our main competitors have been moving aggressively into AI features. Company X launched their AI assistant last month, and Company Y is beta testing automated workflows. We need to respond, but strategically — not reactively.\n\nOur differentiation has always been simplicity and reliability. Users choose us because we don't break, we don't confuse, and we don't lock them in. Any AI features we add need to maintain that brand promise.\n\nFor Q3, I'm proposing three priority tracks:\n\nTrack 1: Smart Suggestions — non-intrusive AI that helps users work faster without changing their workflow. Think autocomplete, not autopilot.\n\nTrack 2: Enterprise SSO and audit logs — our biggest enterprise prospects have been asking for this for six months. It's table stakes.\n\nTrack 3: Performance — we need to get our p95 latency below 200ms globally. This means investing in edge infrastructure.\n\nLet's discuss each track in detail...`,
    summary: null,
    notes: 'Need to follow up on enterprise pricing model discussion',
  },
  {
    id: 'rec-3',
    name: 'Recording 2026-04-08',
    date: new Date('2026-04-08T10:15:00').toISOString(),
    duration: 0,
    status: 'idle',
    transcript: null,
    summary: null,
    notes: '',
  },
];

export const WHISPER_MODELS = ['base', 'medium', 'large'] as const;
export const OLLAMA_MODELS = [
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
] as const;
export const SUMMARY_MODES = ['quick', 'deep'] as const;

export type WhisperModel = (typeof WHISPER_MODELS)[number];
export type OllamaModel = (typeof OLLAMA_MODELS)[number];
export type SummaryMode = (typeof SUMMARY_MODES)[number];
