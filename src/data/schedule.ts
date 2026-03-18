export type Track =
  | "main"
  | "small"
  | "workshopA"
  | "workshopB"
  | "plenary"
  | "break";

export interface ScheduleSlot {
  time: string;
  duration: number;
  track: Track;
  type: string;
  title: string;
  speakers: string[];
  sessionSlug?: string;
}

export const trackMeta: Record<
  Track,
  { label: string; color: string; bg: string }
> = {
  main: { label: "Main Area", color: "#c0554c", bg: "rgba(232,136,127,0.12)" },
  small: { label: "The Space", color: "#2c6e5a", bg: "rgba(44,110,90,0.10)" },
  workshopA: {
    label: "St. Pauli",
    color: "#7c5bbf",
    bg: "rgba(124,91,191,0.10)",
  },
  workshopB: {
    label: "Altona",
    color: "#b56e00",
    bg: "rgba(247,127,0,0.10)",
  },
  plenary: {
    label: "Plenary",
    color: "#2c3e3a",
    bg: "rgba(44,62,58,0.08)",
  },
  break: { label: "", color: "#888", bg: "rgba(0,0,0,0.03)" },
};

export const schedule: ScheduleSlot[] = [
  // ── DOORS OPEN ──
  {
    time: "09:00",
    duration: 30,
    track: "break",
    type: "Doors Open",
    title: "Doors Open & Franzbrötchen",
    speakers: [],
  },

  // ── OPENING ──
  {
    time: "09:30",
    duration: 20,
    track: "plenary",
    type: "Opening",
    title: "Welcome & Opening",
    speakers: ["Organizers"],
  },

  // ── MORNING BLOCK 1 (10:00) ──
  {
    time: "10:00",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title: "Woop Coding!",
    speakers: ["Hendrik Mans"],
    sessionSlug: "woop-coding",
  },
  {
    time: "10:00",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title: '"This (web) is for everyone!" — Sir Tim Berners-Lee.',
    speakers: ["Daniel Moll"],
    sessionSlug: "this-web-is-for-everyone",
  },
  {
    time: "10:00",
    duration: 90,
    track: "workshopA",
    type: "Workshop",
    title:
      "Create Your Own Role-Playing Game with Agentic AI using Strands Agents",
    speakers: ["Arnaud Jean"],
    sessionSlug: "create-your-own-rpg-with-agentic-ai",
  },
  {
    time: "10:00",
    duration: 90,
    track: "workshopB",
    type: "Workshop",
    title:
      "What if building faster just means building the wrong thing faster?",
    speakers: ["Christoph Steinlehner"],
    sessionSlug: "building-faster-building-wrong-thing-faster",
  },

  // ── MORNING BLOCK 2 (10:30) ──
  {
    time: "10:30",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title: "From Runbooks to Models: AI-Native Operations",
    speakers: ["Paul Stack"],
    sessionSlug: "from-runbooks-to-models",
  },
  {
    time: "10:30",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title: "My agent went rogue: 5 failure modes and how to contain them",
    speakers: ["Luise Freese"],
    sessionSlug: "my-agent-went-rogue",
  },

  // ── BREAK ──
  {
    time: "10:55",
    duration: 15,
    track: "break",
    type: "Break",
    title: "Coffee Break",
    speakers: [],
  },

  // ── MORNING BLOCK 3 (11:10) ──
  {
    time: "11:10",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title: "You Don't Need a Bigger Model. You Need a Better AI Harness",
    speakers: ["Björn Rochel"],
    sessionSlug: "you-dont-need-a-bigger-model",
  },
  {
    time: "11:10",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title:
      "Onboarding Your Agent: How eventim integrates agentic engineering into enterprise workflows",
    speakers: ["Fabian Meyer"],
    sessionSlug: "onboarding-your-agent",
  },

  // ── OPEN SPACE (11:30) ──
  {
    time: "11:30",
    duration: 70,
    track: "workshopA",
    type: "Open Space",
    title: "Open Space",
    speakers: [],
  },
  {
    time: "11:30",
    duration: 70,
    track: "workshopB",
    type: "Open Space",
    title: "Open Space",
    speakers: [],
  },

  // ── MORNING BLOCK 4 (11:40) ──
  {
    time: "11:40",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title: "Stop Building Features. Build the Factory That Builds Them.",
    speakers: ["Benedikt Stemmildt", "Leo Peters"],
    sessionSlug: "stop-building-features-build-the-factory",
  },
  {
    time: "11:40",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title: "From Intentional Sprawl to a Deliberate Stack: Rolling Out Codex",
    speakers: ["Alexander Stolle"],
    sessionSlug: "from-intentional-sprawl-to-a-deliberate-stack",
  },

  // ── LIGHTNING BLOCK 1 + TALK (12:10) ──
  {
    time: "12:10",
    duration: 30,
    track: "main",
    type: "Lightning Block",
    title: "Lightning Talks — Block 1",
    speakers: [
      "Nele Lea Uhlemann",
      "Henning Thies",
      "Jannik Streek",
      "Aleksandr Lossenko",
    ],
  },
  {
    time: "12:10",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title:
      "We're Not Developers. We Built a 116K LoC Production System Anyway.",
    speakers: ["Daniel Schreiber", "Felix Behrendt"],
    sessionSlug: "were-not-developers",
  },

  // ── LUNCH ──
  {
    time: "12:40",
    duration: 80,
    track: "break",
    type: "Lunch",
    title: "Lunch Break",
    speakers: [],
  },

  // ── AFTERNOON BLOCK 5 (14:00) ──
  {
    time: "14:00",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title:
      "Humans still needed: Learnings from refactoring an ancient codebase",
    speakers: ["Benedikt Terhechte"],
    sessionSlug: "humans-still-needed",
  },
  {
    time: "14:00",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title: "AI Coding Assistants in Enterprises: threat or friend?",
    speakers: ["Anastasia Karavdina"],
    sessionSlug: "ai-coding-assistants-in-enterprises",
  },
  {
    time: "14:00",
    duration: 90,
    track: "workshopA",
    type: "Workshop",
    title: "Turn Your Agent Into Your Own Nemesis",
    speakers: ["Tereza Iofciu"],
    sessionSlug: "turn-your-agent-into-your-own-nemesis",
  },
  {
    time: "14:00",
    duration: 90,
    track: "workshopB",
    type: "Workshop",
    title: "Why, and how you need to sandbox AI-Generated Code?",
    speakers: ["Harshil Agrawal"],
    sessionSlug: "sandbox-ai-generated-code",
  },

  // ── AFTERNOON BLOCK 6 (14:30) ──
  {
    time: "14:30",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title:
      "Requirements-Driven Development: The Missing Layer in Agentic Coding",
    speakers: ["Xesca Alabart"],
    sessionSlug: "requirements-driven-development",
  },
  {
    time: "14:30",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title: "A tiny intelligent being lives inside a box under my desk",
    speakers: ["Luis Bezzenberger"],
    sessionSlug: "a-tiny-intelligent-being",
  },

  // ── AFTERNOON BLOCK 7 (15:00) ──
  {
    time: "15:00",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title:
      "Build the right AI product - The good, the bad and the ugly of product discovery in the AI era",
    speakers: ["Wolf Brüning"],
    sessionSlug: "build-the-right-ai-product",
  },
  {
    time: "15:00",
    duration: 25,
    track: "small",
    type: "Full Talk",
    title:
      "The MCP Playbook: How I Wired Cursor to My Entire Production Stack",
    speakers: ["Lutz Feldhege"],
    sessionSlug: "the-mcp-playbook",
  },

  // ── COFFEE BREAK (15:30) ──
  {
    time: "15:30",
    duration: 30,
    track: "break",
    type: "Break",
    title: "Coffee Break",
    speakers: [],
  },

  // ── AFTERNOON BLOCK 8 (16:00) ──
  {
    time: "16:00",
    duration: 25,
    track: "main",
    type: "Full Talk",
    title: "Driving AI: How MOIA Scales LLM Expertise",
    speakers: ["Waqas Ahmed", "Christoph Hübner"],
    sessionSlug: "driving-ai-how-moia-scales-llm-expertise",
  },
  {
    time: "16:00",
    duration: 75,
    track: "small",
    type: "Open Space",
    title: "Open Space",
    speakers: [],
  },
  {
    time: "16:00",
    duration: 75,
    track: "workshopA",
    type: "Open Space",
    title: "Open Space",
    speakers: [],
  },
  {
    time: "16:00",
    duration: 75,
    track: "workshopB",
    type: "Open Space",
    title: "Open Space",
    speakers: [],
  },

  // ── LIGHTNING BLOCK 2 (16:30) ──
  {
    time: "16:30",
    duration: 45,
    track: "main",
    type: "Lightning Block",
    title: "Lightning Talks — Block 2",
    speakers: ["Marvin Kruse", "Tilman Dietrich"],
  },

  // ── CLOSING ──
  {
    time: "17:15",
    duration: 15,
    track: "plenary",
    type: "Closing",
    title: "Closing Remarks & What's Next",
    speakers: ["Organizers"],
  },

  // ── AUSKLANG ──
  {
    time: "17:30",
    duration: 30,
    track: "break",
    type: "Ausklang",
    title: "Ausklang",
    speakers: [],
  },
];

// Lightning talk slugs for linking from lightning blocks
export const lightningBlock1Slugs = [
  "diy-or-delegate",
  "personal-ai-coding-agents-beyond-coding",
  "beyond-the-vibes",
  "hackathon-gave-non-engineers-access",
];

export const lightningBlock2Slugs = [
  "kiro-made-me-do-it",
  "automating-ai-research-delivery",
];

// Helper: look up schedule info for a session by slug
export function getScheduleForSession(slug: string) {
  // Direct match via sessionSlug
  const slot = schedule.find(s => s.sessionSlug === slug);
  if (slot) {
    return {
      time: slot.time,
      duration: slot.duration,
      track: slot.track,
      trackLabel: trackMeta[slot.track].label,
      trackColor: trackMeta[slot.track].color,
    };
  }

  // Lightning talk: check block arrays
  if (lightningBlock1Slugs.includes(slug)) {
    const block = schedule.find(s => s.title === "Lightning Talks — Block 1");
    if (block) {
      return {
        time: block.time,
        duration: block.duration,
        track: block.track,
        trackLabel: trackMeta[block.track].label,
        trackColor: trackMeta[block.track].color,
      };
    }
  }
  if (lightningBlock2Slugs.includes(slug)) {
    const block = schedule.find(s => s.title === "Lightning Talks — Block 2");
    if (block) {
      return {
        time: block.time,
        duration: block.duration,
        track: block.track,
        trackLabel: trackMeta[block.track].label,
        trackColor: trackMeta[block.track].color,
      };
    }
  }

  return null;
}
