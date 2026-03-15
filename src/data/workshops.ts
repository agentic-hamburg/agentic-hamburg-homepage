export interface Workshop {
  slug: string;
  title: string;
  speakers: string[];
  description: string;
  level: string;
  time: string;
  lumaEventId: string;
  lumaUrl: string;
}

export const workshops: Workshop[] = [
  {
    slug: "create-your-own-rpg-with-agentic-ai",
    title:
      "Create Your Own Role-Playing Game with Agentic AI using Strands Agents",
    speakers: ["Arnaud Jean"],
    description:
      "Code a Game Master that orchestrates multiple AI agents. Explore agent tools, MCP, A2A, and RAG to create agents that roll dice, verify DnD rules, and generate the story as it unfolds.",
    level: "Intermediate",
    time: "10:00 – 11:30",
    lumaEventId: "evt-SMVQuaeXooPzGJ1",
    lumaUrl: "https://luma.com/110uhq2i",
  },
  {
    slug: "building-faster-building-wrong-thing-faster",
    title:
      "What if building faster just means building the wrong thing faster?",
    speakers: ["Christoph Steinlehner"],
    description:
      "An interactive workshop on finding your real risks before burning tokens and time. Identify and de-risk assumptions in your current project — because burning tokens on the wrong idea is just expensive guessing.",
    level: "Intermediate",
    time: "10:00 – 11:30",
    lumaEventId: "evt-gS2aAAP4qLSAOrD",
    lumaUrl: "https://luma.com/0plg8o36",
  },
  {
    slug: "sandbox-ai-generated-code",
    title: "Why, and how you need to sandbox AI-Generated Code?",
    speakers: ["Harshil Agrawal"],
    description:
      "Go beyond the hype and dive into the practical architecture of sandboxing AI-generated code. Learn how to integrate an LLM to generate code and run it in a secure, isolated environment.",
    level: "Intermediate",
    time: "14:00 – 15:30",
    lumaEventId: "evt-tHqoP7jcmDFYUY1",
    lumaUrl: "https://luma.com/15ntjibp",
  },
  {
    slug: "turn-your-agent-into-your-own-nemesis",
    title: "Turn Your Agent Into Your Own Nemesis",
    speakers: ["Tereza Iofciu"],
    description:
      "Configure an AI agent into a personal work companion that reflects how you actually work, strengthens your weak spots, and asks the right questions. Leave with a functioning Nemesis. No coding experience needed.",
    level: "Introductory",
    time: "14:00 – 15:30",
    lumaEventId: "evt-lFfWNDw6hgu5AIC",
    lumaUrl: "https://luma.com/2uxjdzfa",
  },
];
