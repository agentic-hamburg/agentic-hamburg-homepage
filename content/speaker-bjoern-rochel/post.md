---
title: "Speaker Spotlight: Björn Rochel – You Don't Need a Bigger Model. You Need a Better AI Harness"
description: "Björn Rochel built a 77,000-line full-stack app without writing a single line of code – and shares the AI development harness that made it possible."
author: Agentic Hamburg Team
pubDatetime: 2026-02-25T18:00:00+01:00
tags:
  - conference
  - speaker
  - agentic-conf
featured: false
draft: true
socialMediaHashtags: "#AgenticConf #AgenticHamburg #AICoding #ClaudeCode"
---

We're excited to announce **Björn Rochel** as a speaker at [Agentic Conf Hamburg](https://lu.ma/45lfeyeh) on March 22nd!

## About Björn

Björn Rochel is a Senior Engineering Manager and Principal Engineer with a passion for building scalable systems, empowered teams, and lasting engineering culture. He's both a hands-on architect and an engineering leader – the kind of person who thinks in systems, whether that means code or organizations.

You can follow Björn on [LinkedIn](https://www.linkedin.com/in/bjoern-rochel-51958a58/).

## The Talk: You Don't Need a Bigger Model. You Need a Better AI Harness

Björn built Credfolio2 – a full-stack professional portfolio application with a Go backend, Next.js frontend, GraphQL API, background job queues, and LLM extraction pipelines – without writing a single line of code. All 77,000 lines were written by Claude Code, steered by him. Three weeks, 298 commits, one person.

The interesting part isn't the output. It's what made the output possible.

In this talk, Björn will walk through the AI development harness he built to get predictable, high-quality results from an agentic coding tool. It starts with containment – a sandboxed devcontainer that lets the agent operate autonomously while limiting what it can reach. But the real game is **context**: an AI agent is only as good as what it can see, and the biggest challenge is making sure the right context is available at the right time.

Expect to see:

- **A CLAUDE.md that acts as persistent architectural memory**
- **Session hooks** that prime the agent with the current task on startup
- **Specialized subagents** running in isolated contexts to keep the main conversation focused
- **Architecture Decision Records** that capture reasoning the AI can't carry across sessions
- **A markdown-based issue tracker** with checklists that double as executable specifications
- **Five enforcement hooks** that block broken commits and incomplete work

Every one of these is a context management strategy in disguise – reducing noise, surfacing what matters, and compensating for what the model forgets, never knew, or can't fit in its window.

None of this required a better model. It required better systems thinking. You're not pair programming – you're architecting the environment in which AI operates.

## See Björn Live

Catch this full talk and many more at **Agentic Conf Hamburg on March 22, 2026** at SAE Institute Hamburg.

👉 **[Get your tickets on Luma](https://lu.ma/45lfeyeh)**
