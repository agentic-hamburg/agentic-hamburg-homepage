export interface Session {
  slug: string;
  title: string;
  speakers: string[];
  format: "Full Talk" | "Workshop" | "Lightning Talk";
  level: string;
  language: string;
  description: string;
}

export const sessions: Session[] = [
  {
    slug: "you-dont-need-a-bigger-model",
    title: "You Don't Need a Bigger Model. You Need a Better AI Harness",
    speakers: ["Björn Rochel"],
    format: "Full Talk",
    level: "Advanced",
    language: "English",
    description: `I've been spending a lot time lately with building Credfolio2 — a full-stack professional work portfolio application with a Go backend, Next.js frontend, GraphQL API, background job queues, and LLM extraction pipelines — I didn't write a single line of code. All 77,000 lines so far were written by Claude Code, steered by me. Three weeks, 298 commits, one person (at the time of the submission).

The interesting part isn't the output. It's what made the output possible.

In this talk, I'll walk through the AI development harness I built to get predictable, high-quality results from an agentic coding tool and the process I used to improve it. It starts with containment — a sandboxed devcontainer that lets the agent operate autonomously while limiting what it can reach. But the real game is context. An AI agent is only as good as what it can see, and the biggest challenge in agentic development is making sure the right context is available at the right time. A CLAUDE.md that acts as persistent architectural memory. Session hooks that prime the agent with the current task on startup. Specialized subagents that run in isolated contexts so the main conversation window stays focused. Architecture Decision Records that capture the reasoning an AI can't carry across sessions. A markdown-based issue tracker with checklists that double as executable specifications. Five enforcement hooks that block broken commits and incomplete work.

Every one of these is a context management strategy in disguise — reducing noise, surfacing what matters, and compensating for what the model forgets, never knew, or can't fit in its window.

None of this required a better model. It required better systems thinking. You're not pair programming — you're architecting the environment in which AI operates.

Whether you're an engineering leader evaluating agentic development or a practitioner ready to go all-in, you'll leave with a concrete, replicable playbook — and the conviction that your engineering expertise is the multiplier, not the model.`,
  },
  {
    slug: "stop-building-features-build-the-factory",
    title: "Stop Building Features. Build the Factory That Builds Them.",
    speakers: ["Benedikt Stemmildt", "Leo Peters"],
    format: "Full Talk",
    level: "Expert",
    language: "English",
    description: `You've got your CLAUDE.md, your subagents, your custom skills. And it works. But every feature still starts with you: kicking off the agent, steering it, reviewing, course-correcting. You've optimized the tool. You haven't automated the process.

The real shift is indirection. Instead of using an agent to build a feature, build a production line that builds features for you. Scripts, validation steps, orchestration, from ticket to pull request with minimal intervention. And don't stop at code. The factory writes tests, generates documentation, handles requirements engineering. Run it in production and let agents react to monitoring data, user feedback, and KPIs. The factory is never done. It grows.

Two hard truths: you can't copy someone else's factory, because it's deeply coupled to your codebase and conventions. And when a new model drops, you rebuild it. That's the new developer skill: not maintaining one perfect system, but rapidly creating factories for any situation.

No slides. In this talk, I'll open a real factory from a real client project and walk through how it's built, how it runs, and why this is the path from AI-assisted to genuinely autonomous.`,
  },
  {
    slug: "build-the-right-ai-product",
    title:
      "Build the right AI product - The good, the bad and the ugly of product discovery in the AI era",
    speakers: ["Wolf Brüning"],
    format: "Full Talk",
    level: "Intermediate",
    language: "English",
    description: `In this talk I would like to talk about the changes AI can (or might) bring about in Product Discovery. What have we tried and learned so far? Where can AI take us further and which paths are dangerous to take. The talk will underline the importance of Product Discovery in modern product development, take a general optimistic stance on AI but also will encourage critical thinking.`,
  },
  {
    slug: "ai-coding-assistants-in-enterprises",
    title: "AI Coding Assistants in Enterprises: threat or friend?",
    speakers: ["Anastasia Karavdina"],
    format: "Full Talk",
    level: "Introductory and overview",
    language: "English",
    description: `Gemini 3 believes that 90% of Fortune 100 companies have integrated AI Coding Assistants in their daily workflows. Nobody knows whether this number is correct, but everyone who has ever worked in a large company will tell you: adopting such change is not easy. Policy, guidelines, security measures — just to name a few obstacles on the way between you, an enterprise developer, and vibe-coding. In this talk we will look into Agentic coding adoption in enterprises, what these tools are actually being used for, and whether it's worth it.`,
  },
  {
    slug: "from-runbooks-to-models",
    title: "From Runbooks to Models: AI-Native Operations",
    speakers: ["Paul Stack"],
    format: "Full Talk",
    level: "Introductory and overview",
    language: "English",
    description: `When development velocity increases 10x through AI-assisted coding, operations becomes the bottleneck — not because we're doing it wrong, but because our tools weren't designed for this pace.

Traditional Infrastructure as Code won't work with AI agents. It's dominated by taste and principles, with no architectural constraints for agents to follow. Teams that build software with AI have learned this the hard way: architecture leads to stability, vibes lead to chaos. The same pattern applies to operations.

We need automation designed for agents as the primary consumer: transparent type systems they can introspect, extensible primitives they can compose, schemas that match the domain (not custom abstractions), inline validation (not after-the-fact review), and coverage across the full operational lifecycle — not just provisioning.

In this talk, you'll see live demos of AI agents using swamp — an AI-native automation CLI — to build workflows from intent, discover production state through typed models, and compose operations through versioned data. Then we'll discuss what this means for the SRE role: the evolution from operator to architect, from reactive to proactive, from tribal knowledge to encoded knowledge.

You'll leave with a framework for evaluating AI-native tools and concrete steps to start encoding your operational knowledge into typed, composable, executable models. The people who figure this out will define what operations looks like for the next decade.`,
  },
  {
    slug: "requirements-driven-development",
    title:
      "Requirements-Driven Development: The Missing Layer in Agentic Coding",
    speakers: ["Xesca Alabart"],
    format: "Full Talk",
    level: "Advanced",
    language: "English",
    description: `For decades, the bottleneck in software development was coding. We threw everything at it — better languages, frameworks, DevOps, CI/CD, cloud infrastructure — all to make the engineering phase faster and more reliable. And it worked.

Now, with agentic coding tools and AI-assisted development, that bottleneck is dissolving faster than anyone expected. Code generation is becoming near-instantaneous. The engineering phase that once consumed months now takes days or hours. But this acceleration has exposed a deeper problem that was always there, just hidden behind slower delivery cycles: we're still terrible at defining what to build. Ambiguous requirements, lost context between business and engineering, specs that decay the moment they're written. When coding was slow, these gaps got patched along the way. When coding is instant, they become catastrophic. You can now build the wrong thing at unprecedented speed — and do it confidently.

This is the next evolution of the software process. The bottleneck has shifted upstream, from how we build to what we build and why.

In this talk, Xesca Alabart shares how Gluecharm is addressing this new reality with an AI-native requirements management platform built on 150+ specialized micro-agents and knowledge graphs.

She'll walk through why traditional requirements practices can't keep pace with AI-accelerated development, how "Application Maps" preserve business context across the full lifecycle, and what it takes to build the missing layer between business intent and working code.`,
  },
  {
    slug: "a-tiny-intelligent-being",
    title: "A tiny intelligent being lives inside a box under my desk",
    speakers: ["Luis Bezzenberger"],
    format: "Full Talk",
    level: "Intermediate",
    language: "English",
    description: `For the past few months, I've been running a small intelligent agent on my machine using OpenClaw and local models.

The agent can:

- read and update my CRM
- access Gmail and Calendar APIs
- coordinate tasks across tools
- message me via Signal or WhatsApp when it needs input

This talk shows what happens when agent infrastructure, local models, and APIs meet real personal and small-business workflows.

For freelancers and small teams, privacy isn't just a security feature, it's an enabler. When an agent runs locally and data stays under your control, you can automate workflows involving customer data, inboxes, documents, and internal knowledge without the legal and organizational friction that often blocks cloud-only solutions.

We'll explore:

- what local models can already do reliably
- where cloud models still clearly win
- hybrid agent patterns (local-first, cloud-augmented)
- practical SME use cases: CRM updates, inbox triage, scheduling, and workflow automation

Instead of building another AI interface, this is about running a small software entity that can safely operate inside your personal or company environment.`,
  },
  {
    slug: "this-web-is-for-everyone",
    title: '"This (web) is for everyone!" - Sir Tim Berners-Lee.',
    speakers: ["Daniel Moll"],
    format: "Full Talk",
    level: "Introductory and overview",
    language: "German",
    description: `Doch was, wenn "everyone" längst Bots, KI-Agenten und große Plattformen meint – und nicht mehr uns als Menschen? In meinem Impuls-Vortrag geht es darum, wie wir das Web mit Agentic Engineering wieder zurückerobern können: durch Datenschutz by Design, klare Schnittstellen zwischen Mensch und Maschine und neue, minimalistische Ansätze im Web-Stack. Danach können wir diskutieren, wie wir als Engineers dazu beitragen können, das Web wieder offener, nachhaltiger und menschlicher zu machen.`,
  },
  {
    slug: "from-intentional-sprawl-to-a-deliberate-stack",
    title: "From Intentional Sprawl to a Deliberate Stack: Rolling Out Codex",
    speakers: ["Alexander Stolle"],
    format: "Full Talk",
    level: "Advanced",
    language: "English",
    description: `Instead of prematurely committing to one AI coding tool, we treated the early phase as structured exploration. As CLI-based agents and workflow integrations matured, the question shifted from "which tools should we allow?" to "which stack should we commit to?"

This session details how we made the transition, from tool comparison and developer friction to governance and security considerations. It also addresses the harder question: how do you evaluate value when AI behaves more like Slack adoption than a feature with a simple ROI calculation?`,
  },
  {
    slug: "my-agent-went-rogue",
    title: "My agent went rogue: 5 failure modes and how to contain them",
    speakers: ["Luise Freese"],
    format: "Full Talk",
    level: "Intermediate",
    language: "English",
    description: `LLM demos are easy. Shipping agentic systems that don't break is not.

Once an agent is allowed to call tools, trigger workflows, or modify state, small probabilistic quirks turn into real engineering problems. In this talk, Luise walks through concrete failure modes she has encountered when integrating LLMs into real systems:

- structured output drifting just enough to crash downstream logic
- agents selecting the wrong tool or repeating calls
- reflection loops exploding token usage and latency
- prompt tweaks causing silent regressions
- context windows filling up with irrelevant history

For each failure mode, she will show code examples and the mitigation patterns that actually work: contract layers, validation and repair loops, tool scoping, iteration caps, cost guards, and lightweight evaluation harnesses.

This is a talk about what breaks when agents leave the playground and how to design systems that survive that transition.`,
  },
  {
    slug: "woop-coding",
    title: "Woop Coding!",
    speakers: ["Hendrik Mans"],
    format: "Full Talk",
    level: "Advanced",
    language: "English",
    description: `It's time to face the shaming, ditch the vibing, and do some real freaking development together with your robot friend as an extension of yourself, not a servant.

I call it Woop Coding: looks like Vibe Coding to the untrained eye, but with reliably great results, because you're smart, you're experienced, you're probably also beautiful, and you've learned how to use all this to turn your agent from a random result emitting automaton into your own personal power armor.

Now you're unbeatable. Now you're Woop Coding. Let's do this.`,
  },
  {
    slug: "were-not-developers",
    title:
      "We're Not Developers. We Built a 116K LoC Production System Anyway.",
    speakers: ["Daniel Schreiber", "Felix Behrendt"],
    format: "Full Talk",
    level: "Intermediate",
    language: "English",
    description: `Most AI coding talks follow the same script: developers using AI to work faster. Refactoring legacy apps. Scaffolding CRUD services. Impressive — but expected.

This is a different story.

Daniel built the AFC Group from 3 employees in 2001 to a 350-person corporation, acquired nobleglass — today Germany's leading automotive glass business — in 2019, and drove its transformation into a mobile service operation as COO from 2023 to the end of 2024. His background is chemical engineering, management consulting, and an MBA — not software. Felix is a Head of Product who spent a decade in aviation IT and led operations tools at Volocopter — a technical mind, but one who left full-time development behind years ago. Neither works as a software engineer. Both built this part-time — weekends, holidays, evenings.

Together, with Claude Code and Pi, they built far more than a route planner. 116,000 lines of code. 2,100+ commits. 85 technicians, 40 depots, 150–200 jobs per day across Germany. In full production since January 2026. Continuously shipping. Not a prototype — the system that runs the operation.

The bottleneck in AI coding was never the code. It was always the domain knowledge. AI can generate any pattern you ask for. But only you know that morning time windows in Munich mean something different than in Hamburg. Only you know which constraint the dispatcher will override and which is sacred. That knowledge — 25 years of it — turns AI output from plausible garbage into a production system.`,
  },
  {
    slug: "humans-still-needed",
    title:
      "Humans still needed: Learnings from refactoring an ancient codebase",
    speakers: ["Benedikt Terhechte"],
    format: "Full Talk",
    level: "Intermediate",
    language: "English",
    description: `AI agents have become fantastic at green field projects. However, getting them to work correctly on existing, complex codebases can be a challenge. I recently ported a 100k loc Obj-C/OpenGL iOS game from 2011 to modern iOS with the help of Opus 4.6.

This required much more than a simple prompt. The agent lacked the creativity to solve this task, it was often overwhelmed and some problems required a change of abstraction.

The talk will go through the initial setup, how I improved it during the project, what the agent struggled with, and how I was able to guide it.`,
  },
  {
    slug: "the-mcp-playbook",
    title: "The MCP Playbook: How I Wired Cursor to My Entire Production Stack",
    speakers: ["Lutz Feldhege"],
    format: "Full Talk",
    level: "Advanced",
    language: "English",
    description: `Your Cursor IDE knows about your current file. Maybe your project. But does it know about your running Docker containers, your database schemas, your deployment pipeline, and your seven microservices talking to each other over an internal Docker network?

Mine does. I built feldhege-stack-mcp — a custom Model Context Protocol server that connects Cursor to my entire production infrastructure: a Next.js frontend, seven FastAPI/Node.js microservices, three dedicated PostgreSQL databases, a Qdrant vector store, and an Ollama instance, all running in Docker on a VPS.

In this talk, I'll show you the MCP server architecture, walk through the key tools and resources I exposed, and demonstrate how this changes the development experience. When Cursor understands your infrastructure, it stops generating code in isolation and starts making architecture-aware suggestions. It can query your vector database schema before building a RAG pipeline. It knows which service runs on which port. It understands your nginx routing.

You'll leave with a mental model for designing your own production MCP server — and a clear list of what not to expose. I'll also show what went wrong: the context window limits that forced me to be selective about what to expose, the latency issues with remote MCP connections, and the security decisions I had to make.

Minimal slides — primarily live demo and terminal sessions.`,
  },
  {
    slug: "driving-ai-how-moia-scales-llm-expertise",
    title: "Driving AI: How MOIA Scales LLM Expertise",
    speakers: ["Waqas Ahmed", "Christoph Hübner"],
    format: "Full Talk",
    level: "Advanced",
    language: "English",
    description: `Discover how MOIA is moving beyond the hype to integrate Large Language Models into the daily fabric of engineering and operations. This talk dives into our journey of building a cross-functional community of practice where shared experience from prompt engineering to architectural guardrails drive real-world efficiency. Learn the specific strategies we use to turn individual LLM experiments into collective, high-impact tools that power the future of urban mobility.`,
  },
  {
    slug: "onboarding-your-agent",
    title:
      "Onboarding Your Agent: How eventim integrates agentic engineering into enterprise workflows",
    speakers: ["Fabian Meyer"],
    format: "Full Talk",
    level: "Advanced",
    language: "English",
    description: `Coding agents are impressive, but in enterprise environments code was never the main bottleneck. The friction lives in the process: turning tickets into specs, running pipelines, opening merge requests, deploying, and debugging failures.

At eventim, we onboarded our agent like a new engineer. We gave it access to GitLab and Jira, implemented our workflows as agent skills, and let it operate within our guardrails from ticket to verified result. Engineers review outcomes, not execute steps.

This talk introduces the four pillars that enable this: Specification, Implementation, Tools, and Verification — and why in agentic engineering, the best engineers write the best specs.`,
  },
  {
    slug: "create-your-own-rpg-with-agentic-ai",
    title:
      "Create Your Own Role-Playing Game with Agentic AI using Strands Agents",
    speakers: ["Arnaud Jean"],
    format: "Workshop",
    level: "Intermediate",
    language: "English",
    description: `Come discover how to code a Game Master that will orchestrate multiple AI agents, each specialized in a particular task.

We'll explore concepts like agent tools, the MCP (Model Context Protocol), A2A (Agent to Agent), and RAG (Retrieval-augmented generation) to create agents and/or MCP servers that roll dice, verify DnD rules, and generate the story as it unfolds.

Whether you're a role-playing game fan or not, there will be things to learn during this workshop :)`,
  },
  {
    slug: "building-faster-building-wrong-thing-faster",
    title:
      "What if building faster just means building the wrong thing faster?",
    speakers: ["Christoph Steinlehner"],
    format: "Workshop",
    level: "Intermediate",
    language: "English",
    description: `An interactive workshop on finding your real risks before burning tokens and time.

What happens when we build the perfect tool, but it solves the wrong problem?

With AI making execution faster, one skill becomes even more critical: Deciding what to build before burning tokens and time on it.

Creating more features than ever is now within reach of everyone. Knowing which ones will actually be helpful? That's the bottleneck.

When building products and services, we face four risks: Will people even care? Can they use it? Can we build it? And of course, should we build it? Speed only helps if you're running in the right direction.

This interactive workshop helps you identify and de-risk assumptions in your current project. We will discuss what to do without AI and with AI.

Because burning tokens on the wrong idea is just expensive guessing.`,
  },
  {
    slug: "sandbox-ai-generated-code",
    title: "Why, and how you need to sandbox AI-Generated Code?",
    speakers: ["Harshil Agrawal"],
    format: "Workshop",
    level: "Intermediate",
    language: "English",
    description: `We are using AI to write code. Moreover, we are using it to be more productive. However, giving AI access to our machine and let them run on their own is dangerous. Imagine, giving AI access to the server where you run your application! You want your users to interact with your application through a chat interface, and maybe build their own apps or customize the UI. If not supervised carefully, AI can break your application or worse leak private data.

So how do you run AI generated code within your application and allow users to build their own apps? In this talk, we'll go beyond the hype and dive into the practical architecture of sandboxing AI generated code. You'll learn how to integrate an LLM to generate code and, how to run that code in a secure isolated environment.`,
  },
  {
    slug: "turn-your-agent-into-your-own-nemesis",
    title: "Turn Your Agent Into Your Own Nemesis",
    speakers: ["Tereza Iofciu"],
    format: "Workshop",
    level: "Introductory and overview",
    language: "English",
    description: `Most agents are built to be generally helpful. That's not the same as being useful for you.

I've found that I work best when collaborating with people who are complementary in their strengths.

In this workshop, we apply that idea to agents.

We configure an existing agent (Claude Code or Gemini CLI) into a personal work companion: one that reflects how you actually work, strengthens the areas you don't naturally prioritize, and knows when to slow down and ask the right questions instead of just producing output.

We start with a short, focused self-assessment to map your working patterns. Then we translate that into a working configuration, step by step: default behavior, task-specific modes, and clear rules for how the agent should behave when things are unclear or misaligned.

You'll leave with a functioning Nemesis and a calibration process for your agent.

Laptop and access to a live agent required. No coding experience needed.`,
  },
  {
    slug: "personal-ai-coding-agents-beyond-coding",
    title: "Personal AI: Coding Agents Beyond Coding",
    speakers: ["Henning Thies"],
    format: "Lightning Talk",
    level: "Advanced",
    language: "English",
    description: `Claude Code can do more than write code.

In this lightning talk, I'll show my Personal AI System (PAI) — a business operating system powered by Claude Code.

What you'll see:
- How AI holds me accountable
- How AI documents strategic decisions
- How AI creates content (LinkedIn posts, market research)

PAI isn't a tool. It's my digital co-founder.

Coding agents can do more than code — if you let them.

I'll show you how.`,
  },
  {
    slug: "automating-ai-research-delivery",
    title:
      "Automating AI Research Delivery — From Papers to Spotify, Substack, Newsletter & YouTube",
    speakers: ["Tilman Dietrich"],
    format: "Lightning Talk",
    level: "Intermediate",
    language: "English",
    description: `Every week, hundreds of AI research papers are published. Keeping up is hard. In this talk, I present a fully automated pipeline that scrapes the top 10 papers from Hugging Face's Weekly rankings, generates a ~10-minute two-host podcast episode about the #1 paper, publishes a blog post to Substack, creates YouTube Shorts, and delivers everything as a weekly email newsletter. All of it completely hands-off without any human interference.

The system combines multiple AI APIs in a single pipeline: Claude Opus for generating accessible podcast transcripts and blog posts, Gemini TTS for multi-speaker audio synthesis, and Veo 3.1 for video generation. A key design goal is accessibility — the podcast explains technical jargon, avoids reading math notation aloud, and uses analogies to make cutting-edge research approachable for a broad audience.

I'll walk through the architecture, the Saturday-to-Monday cron-driven workflow, and the practical challenges I solved along the way — from chunking long transcripts for TTS, to automatically publishing a Spotify Podcast and YouTube Videos.`,
  },
  {
    slug: "beyond-the-vibes",
    title:
      "Beyond the Vibes: Lessons from Using Spec Driven Development Frameworks for Agentic Coding",
    speakers: ["Jannik Streek"],
    format: "Lightning Talk",
    level: "Intermediate",
    language: "English",
    description: `Spec Driven Development (SDD) promises a better approach to agentic programming in larger software projects by focusing on the what, not the how: defining requirements from which implementation can be derived. Instead of going prompt by prompt and nudging code changes, specifications clearly separate requirements from implementation and let you think in capabilities.

Historically, specs were among the lesser loved artifacts in the software lifecycle — serving mainly collaboration with other stakeholders (e.g. BDD), documentation, and compliance purposes. Now the tables might be turning, placing specs at the center of how we build software with AI agents.

In this talk, I'll compare different Spec Driven Development frameworks (such as OpenSpec, SpecKit, and others), share practical lessons from working on open source projects with them, discuss the challenges of adoption, and honestly explore when the overhead of writing specs actually pays off — and when it doesn't.`,
  },
  {
    slug: "diy-or-delegate",
    title: "DIY or Delegate: A Custom Learning Skill for AI Coding Agents",
    speakers: ["Nele Lea Uhlemann"],
    format: "Lightning Talk",
    level: "Intermediate",
    language: "English",
    description: `I stopped learning. Not because I quit coding. I was shipping more than ever. But AI agents were writing the interesting parts, and I was just reviewing diffs I half-understood. Especially painful when picking up a new framework or library: AI Agents would just figure it out for me, and I'd walk away having learned nothing.

So I built a custom Skill that forces the balance back. Before a project starts, you tell it what you want to learn. It then classifies every task: [DIY] tasks get broken down with specific learning goals and starting points, but you still do the research and write the code. [DELEGATE] tasks are implementation work outside that learning scope and get handed off to an agent. After each phase, it generates a quiz tied to your actual project code.

A demo of one custom skill and proof that AI can make you a better developer, not just a faster one.`,
  },
  {
    slug: "kiro-made-me-do-it",
    title:
      "Kiro made me do it: Falling back in love with coding (the hard way)",
    speakers: ["Marvin Kruse"],
    format: "Lightning Talk",
    level: "Intermediate",
    language: "English",
    description: `As Technical Lead, finding time for hands-on coding can be surprisingly hard — especially when balancing day-to-day responsibilities and life outside of work. In this talk, Marvin shares his personal journey of rediscovering the joy of building software with the help of Kiro by AWS.

Kiro's spec driven approach felt like a refreshing alternative to so called "vibe coding" to me: more structure, clearer intent, and faster progress from idea to running software. And everything in one single place: the Kiro IDE. But that structure comes at a price. Writing precise specifications turned out to be far more challenging than expected, and blindly trusting generated output quickly led to moments of unexpected results.

This talk takes an honest, experience driven look at where spec driven AI tools truly shine, where they introduce new kinds of complexity, and why solid software engineering fundamentals are still essential — even (and especially) when AI is doing most of the typing.`,
  },
  {
    slug: "lets-not-take-ai-as-it-is",
    title:
      "Let's not take AI as it is — let's shape how it should be",
    speakers: ["Thorsten Jonas"],
    format: "Full Talk",
    level: "Introductory and overview",
    language: "English",
    description: `This talk challenges the current assumption that AI is a fixed reality we have to adapt to. Today's mainstream AI is shaped — and limited — by the goals, values, and infrastructures of big tech, while hiding significant societal and environmental costs. When we design and build "for AI as it is," we unintentionally reinforce those power structures and impacts. This talk is not about declining AI. Instead it is an invitation to design, use and build the AI we want: systems that are fair, transparent, sustainable, and aligned with human sovereignty rather than corporate control. Sounds hard to achieve? It's not. We will explore how our decisions shape who holds power, how data is governed, and what futures become possible when we stop designing and building for AI as it is and move to an approach of actively shaping how it should be with our actions and decisions.`,
  },
  {
    slug: "hackathon-gave-non-engineers-access",
    title:
      "How a 3-Day Hackathon Gave Non-Engineers Access to the Codebase at Remote.com",
    speakers: ["Aleksandr Lossenko"],
    format: "Lightning Talk",
    level: "Intermediate",
    language: "English",
    description: `At Remote, the people who need codebase knowledge most — support agents, PMs, sales — are the ones least equipped to read code. We built Sherlock App in a 3-day hackathon: a Phoenix LiveView app powered by OpenCode that lets anyone ask questions about the codebase in plain English and get accurate, source-linked answers in seconds.

In this lightning talk, I'll cover how we went from idea to company-wide deployment: the architecture (GenServer-based SSE streaming, Ash Framework for instant Okta SSO, OpenCode as the AI engine), how MCP servers let Sherlock pull context from Notion and Linear alongside code, and what happened when non-engineers started getting answers without filing tickets or interrupting developers.`,
  },
];

export function getSessionBySlug(slug: string): Session | undefined {
  return sessions.find(s => s.slug === slug);
}

export function getSessionsBySpeaker(speakerName: string): Session[] {
  return sessions.filter(s => s.speakers.some(sp => sp === speakerName));
}
