---
author: onTree Team
pubDatetime: 2025-10-02T10:21:36+02:00
title: "Custom Slash Commands, Part 2: From Convenience to 100% Repeatability"
postSlug: custom-slash-commands-part-2-from-convenience-to-100-repeatability
featured: false
draft: false
description: "![Custom Slash Commands, Part 2: From Convenience to 100% Repeatability](./banner.png)"
tags:
  - Claude Code
  - Automation
  - Custom Commands
  - Developer Tools
  - Repeatability
---

![Custom Slash Commands, Part 2: From Convenience to 100% Repeatability](./banner.png)

A few weeks ago, I showed you [custom slash commands](https://www.stefanmunz.com/posts/2025/custom-slash-commands-a-field-trip-with-claude-code/custom-slash-commands-a-field-trip-with-claude-code) for storing prompts you need repeatedly. But I ran into a problem: sometimes Claude followed my instructions perfectly, sometimes not. I found the fix.

My first attempts were useful, but inconsistent. Sometimes the agent followed the orders exactly, sometimes it improvised. Still, it improved the structure and findability of these saved prompts, as before my codebases were cluttered with small READMEs.

### The Breakthrough: Scripts + Prompts = 100% Repeatability

Custom slash commands aren't just for storing prompts in a markdown file. You can also put scripts in the same folder and instruct the coding agent to use that script. This was my breakthrough on repeatability.

Consider [this cleanup script](https://gist.github.com/stefanmunz/0a076d567c591deec34723866198c755). Here's what happens when I run it:

- The prompt explains what the script will do and asks for my confirmation.
- I type yes
- Claude executes the script and monitors its output, warning me about unexpected behavior.

This saves a lot of time, every day. It's the best UI to run scripts I need regularly. I can verify I selected the right script before execution because I often selected the wrong one in a hurry. And I get automatic monitoring that catches problems.

### The Bigger Vision: Slash Commands as Installers

Here's how I'll handle the installer routine for TreeOS. Instead of asking people to read a README and follow five to seven steps, they'll run a custom slash command. I'd love to see this pattern in many tools.

Example: A few days ago I found [Mergiraf](https://codeberg.org/mergiraf/mergiraf), a clever tool that makes git conflicts less scary. Hosted on [Codeberg](https://codeberg.org) 🇪🇺! The installation guide is concise, but you need to map it to your platform. And then you still need to [configure it as a git merge driver](https://mergiraf.org/usage.html#registration-as-a-git-merge-driver).

How cool would it be if they shipped a custom slash command that detects your system, recommends the best installation method, and walks you through configuration? And they could also include a script to remove the tool, if it doesn't work for me. This would dramatically reduce the cognitive overhead of trying a new tool like Mergiraf.

With the explosion of tools we're seeing right now, lengthy setup routines are a real barrier. Slash commands with embedded scripts could change that.
