---
name: advisor
description: "Strategic checkpoint primitive – invoke at high-leverage moments to consult the Opus 4.7 advisor agent for a short course correction. Use early in a task (before substantive work), before declaring done, when stuck, or when changing approach. Quotes Anthropic's advisor-tool docs verbatim for timing and treatment."
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
---

# Advisor Skill

This skill is the plugin-native implementation of [Anthropic's advisor strategy](https://claude.com/blog/the-advisor-strategy). The literal [`advisor_20260301` server tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool) is an Anthropic API beta; Claude Code plugins don't control request shape, so we ship the strategy via a dedicated Opus 4.7 sub-agent that other skills consult at known checkpoints.

## What it is

From the docs (verbatim):

> "The advisor tool lets a faster, lower-cost executor model consult a higher-intelligence advisor model mid-generation for strategic guidance. The advisor reads the full conversation, produces a plan or course correction (typically 400 to 700 text tokens, 1,400 to 1,800 tokens total including thinking), and the executor continues with the task."

In our plugin, the calling skill briefs the advisor agent (Opus 4.7 xhigh) with the relevant context, the agent returns a short numbered plan, the caller applies or reconciles.

## When to call advisor

From the docs' suggested coding-task system prompt (verbatim):

> "Call advisor BEFORE substantive work – before writing, before committing to an interpretation, before building on an assumption. If the task requires orientation first (finding files, fetching a source, seeing what's there), do that, then call advisor. Orientation is not substantive work. Writing, editing, and declaring an answer are.
>
> Also call advisor:
> - When you believe the task is complete. BEFORE this call, make your deliverable durable: write the file, save the result, commit the change. The advisor call takes time; if the session ends during it, a durable result persists and an unwritten one doesn't.
> - When stuck – errors recurring, approach not converging, results that don't fit.
> - When considering a change of approach.
>
> On tasks longer than a few steps, call advisor at least once before committing to an approach and once before declaring done."

## When NOT to call advisor

From the docs (verbatim):

> "On short reactive tasks where the next action is dictated by tool output you just read, you don't need to keep calling – the advisor adds most of its value on the first call, before the approach crystallizes."

Also from the docs' "When to use it" section, the advisor is "a weaker fit for single-turn Q&A (nothing to plan), pure pass-through model pickers where your users already choose their own cost and quality tradeoff, or workloads where every turn genuinely requires the advisor model's full capability."

Concretely for this plugin: skip the advisor on simple `/design-engineer:development` patches that are one-edit-and-done, on `/design-engineer:document` runs that just rewrite a single deliverable, and on routine status checks. Use it on multi-phase plans, before final hand-off, when the task has gotten weird.

## How to invoke

Use the `Agent` tool with `subagent_type: "advisor"`.

```
Agent({
  description: "Strategic checkpoint",
  subagent_type: "advisor",
  prompt: "<task summary> + <what's been done> + <key tool results> + <decision point>"
})
```

**Important fidelity gap**: the Anthropic API advisor tool sees the full transcript automatically – "the advisor sees the system prompt, all tool definitions, all prior turns, and all prior tool results." Claude Code sub-agents are isolated by design and don't inherit the parent transcript. So **the calling skill must brief the advisor explicitly**. A good brief includes:

- Task summary (1–3 sentences)
- What's been tried and the results (key tool outputs, file writes, test outcomes)
- The exact decision point ("I'm about to commit X," "I'm about to declare done," "I'm stuck after Y retries")
- Any evidence/uncertainty that's making you hesitate

Empty briefs get vague advice. Concrete briefs get concrete advice.

## How to handle the advice

From the docs' suggested treatment block (verbatim):

> "Give the advice serious weight. If you follow a step and it fails empirically, or you have primary-source evidence that contradicts a specific claim (the file says X, the paper states Y), adapt. A passing self-test is not evidence the advice is wrong – it's evidence your test doesn't check what the advice is checking."

Apply the advice unless empirical evidence contradicts it. Don't second-guess a passing self-test as a substitute for the check the advisor flagged.

## When advice conflicts with evidence – reconcile

From the docs (verbatim):

> "If you've already retrieved data pointing one way and the advisor points another: don't silently switch. Surface the conflict in one more advisor call – 'I found X, you suggest Y, which constraint breaks the tie?' The advisor saw your evidence but may have underweighted it; a reconcile call is cheaper than committing to the wrong branch."

The reconcile call is the third option between "blindly comply" and "silently override." Use it. The advisor will pick a side; that's its job.

## Cost / call-frequency guidance

From the docs:

> "On internal coding evaluations this pattern produced the highest intelligence at near-Sonnet cost."

The plugin's pipeline naturally clusters calls at transitions (between phases, before commit, before final hand-off) – this is the shape the docs measured. Avoid calling advisor every step or after every tool result; that erases the cost advantage and produces noisier advice.

## Where the plugin already wires this in (pre-installed checkpoints)

Per the v4.5.0 active-integration design, the following workflows already include advisor checkpoints – you don't need to remember to call it manually:

- **`CLAUDE.md` Plan Mode workflow** – before `ExitPlanMode` on non-trivial plans (early-task consult); before declaring a phase complete (pre-done consult).
- **`/design-engineer:launch`** – after environment detection, before committing to an interpretation of the project.
- **`/design-engineer:development`** – before presenting a phase's deliverable to the user.
- **`/design-engineer:discovery`** – before final design deliverable hand-off.
- **`/design-engineer:review`** – before producing the final review report.
- **`/design-engineer:document`** – before document finalize.
- **`skills/dev-github-workflow`** Mode 1 – before commit on plan-driven changes that diverged from plan.
- **`skills/meta-orchestrator`** – at major phase transitions and the user-approval checkpoint.

If you're writing a new skill or command and it has a "before substantive work" or "before declaring done" moment, add the advisor checkpoint there too – that's the docs' recommendation and it's how this plugin scales the strategy.

## Source

- https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool
- https://claude.com/blog/the-advisor-strategy

If you're calling the Anthropic API directly (not via Claude Code), you can also enable the literal `advisor_20260301` server tool with the `anthropic-beta: advisor-tool-2026-03-01` request header – see the first link above for the API surface. The plugin can't enable that header itself.
