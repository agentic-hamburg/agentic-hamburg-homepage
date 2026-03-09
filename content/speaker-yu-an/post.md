---
title: "Speaker Spotlight: Yu An – Building Production SRE Agentic Tools: Automated Root Cause Analysis with Claude Code Skills"
description: "Yu An shares how Red Hat built an automated Root Cause Analysis pipeline combining deterministic scripts with Claude's reasoning via MCP."
author: Agentic Hamburg Team
pubDatetime: 2026-03-09T18:00:00+01:00
tags:
  - conference
  - speaker
  - agentic-conf
featured: false
draft: true
socialMediaHashtags: "#AgenticConf #AgenticHamburg #AICoding"
---

We're excited to announce **Yu An** as a speaker at [Agentic Conf Hamburg](https://lu.ma/45lfeyeh) on March 22nd!

## About Yu An

Yu An, Ph.D. is a Senior AI Engineer on Red Hat's Emerging Technologies team with expertise in AI and data science. With more than six years of industry experience and a strong academic record, she currently focuses on building accessible open source AI agents through agentic frameworks and tool invocation. Her work connects academic research with real-world practice to advance future AI innovations.

## The Talk: Building Production SRE Agentic Tools: Automated Root Cause Analysis with Claude Code Skills

When infrastructure jobs fail, SRE teams manually correlate logs from multiple systems — job events, pod logs, configuration YAMLs. This process is tedious, error-prone, and slow. Yu An's team uses Claude Skills to automate the process.

In this talk, she shares their journey of building an automated Root Cause Analysis (RCA) pipeline, detailing the architectural balance between deterministic Python scripts and LLM-driven correlation:

- **Deterministic vs. Generative Logic:** How they combine Python scripts for data retrieval with Claude's reasoning for complex correlation
- **Tool Integration via MCP:** How they bridge Claude with internal resources and GitHub for real-time context fetching
- **Production Case Studies:** Real-world failures diagnosed by the agent, including credential leaks, timeout cascades, and configuration conflicts
- **Operational Hardening:** Lessons learned on evaluating non-deterministic behavior across model versions and structuring outputs for automated verification

You'll leave with a technical blueprint for combining traditional SRE automation with AI reasoning, specific patterns for building modular Claude Skills, and a framework for deciding when to use an LLM versus a hard-coded script.

## See Yu An Live

Catch this talk and many more at **Agentic Conf Hamburg on March 22, 2026** at SAE Institute Hamburg.

👉 **[Get your tickets on Luma](https://lu.ma/45lfeyeh)**
