---
name: feedback-to-todos
description: Turn feedback delivered in any form – a screen-recording walkthrough video, meeting notes or docs, Slack/text messages, or a transcript – into one faithful, literal FEEDBACK.md to-do list, grounded in the actual source (real transcript, real frames, real quotes), not guesses. Use whenever someone hands you feedback to act on – "here's a Loom from my manager", "go through this walkthrough", "I have notes from the design review", "act on this Slack thread", "here's the meeting transcript" – especially when the feedback drives code or design changes and getting the details exactly right matters. Sources are easy to misread, and skimming the audio or trusting a single glance leads to confident, wrong summaries; this merges multiple sources into one grounded list. Prefer this over ad-hoc "just read it" approaches.
disable-model-invocation: true
model: sonnet
effort: medium
license: MIT
compatibility: "Video input requires ffmpeg/ffprobe, whisper.cpp (whisper-cli), and a ggml-large-v3-turbo model. Notes, messages, and transcripts have no external dependencies."
---

# Feedback to to-dos

Feedback is high-value and easy to get wrong, no matter how it arrives. In a video the speaker points at things on screen ("why is *this* here?", "move *that*") and mixes the app under review with other apps they hold up as the ideal. In notes and messages, a one-line aside is often a concrete request, and the same thing gets said two different ways across a thread. If you summarize from a single glance or the audio alone, you *will* hallucinate – attach the right words to the wrong UI, invent suggestions the source only floated, or drop a tiny aside that was actually a request.

The whole point of this skill is to **ground every item in the real source** – the real transcript and the real frame, the real heading and the real quote, the real thread and the real line – then write it down **literally**. When several sources arrive together (a video plus a Slack thread, notes plus a transcript), they merge into **one** list, with each item carrying every citation it came from.

## The deliverable

A single `FEEDBACK.md`: a **literal to-do list of what the sources said**, each item carrying the citations it came from. It is a grounding artifact the user (or a downstream agent) will pair with the code later – NOT an analysis essay.

The cardinal rules for that file:

- **Literal only.** Write what the source said, condensed for clarity but faithful. NO interpretation, NO inferred items, NO "their idea vs the problem" framing, NO positives section, NO your own thoughts, recommendations, or restructuring suggestions. If the source didn't say it, it does not go in the file.
- **One item per distinct instruction.** Every separable thing the source asks for is its own checkbox line. Do not merge two requests into one line, and do not split one request into several.
- **Every item is traceable.** Each line ends with the citation(s) it came from – the exact substrate for that input type (see "Citing each input type" below).
- **Merge, never duplicate.** When a video moment and a message describe the same thing, it is ONE item carrying both citations. When two sources conflict, make two items and note the conflict – don't silently pick one.
- **No words for the sake of words.** Short, plain, direct. No preamble, no summary paragraph, no closing thoughts.

Anything you infer or recommend belongs in your CHAT reply to the user, never in the file.

## The pipeline

### 1. Get the inputs

Find out everything the user is handing you and confirm it before starting. Feedback usually arrives as a mix:

- **Video** – a local file path (you can't pull a Loom URL directly; the user must download it first). Confirm the path.
- **Notes / docs** – meeting notes, a design-review doc, a PRD comment, a pasted summary. Confirm the file path or pasted text.
- **Messages** – Slack/text threads, either as screenshots or pasted text. Confirm you have all of them.
- **Transcript** – an already-produced transcript (e.g. from a call), with or without timestamps and speaker labels.

Confirm the full set before starting, so nothing is dropped and the merge is complete.

### 2. Process each source into a citable substrate

Each input type needs its own preparation so that every later item can point back to an exact location.

**Video** – run the processing script:

```bash
bash ${DESIGN_ENGINEER_PLUGIN_ROOT}/skills/feedback-to-todos/scripts/process_video.sh "<video-path>" ["<work-dir>"]
```

Substitute `${DESIGN_ENGINEER_PLUGIN_ROOT}` with the absolute path from the `DESIGN_ENGINEER_PLUGIN_ROOT: <absolute path>` context line injected by the plugin's UserPromptSubmit hook.

This probes the video, extracts **frames every 2s** at **near-native resolution and high JPEG quality** (granular and sharp by design – fine-grained, readable frames are what let you pair a sentence with the exact pixels, including tiny spreadsheet cells and dialog labels), transcribes with whisper, and builds `MAP.tsv` linking each transcript segment to its frame numbers. Work dir defaults to `~/Desktop/<name>-analysis/` (durable – never `/tmp`, macOS wipes it on reboot).

Working artifacts: `probe.txt`, `audio.wav`, `transcript.srt`, `transcript.json`, `MAP.tsv`, `frames/f_0001.jpg…`. `probe.txt`, `MAP.tsv`, and `transcript.json` are scaffolding you use during analysis and delete at the end (step 8).

If the script stops because a required tool is missing (ffmpeg, whisper-cli, or the ggml-large-v3-turbo model), it prints the exact install command and exits non-zero. **Stop and ask the user to install the missing tool** (the script tells you which one and how). Do NOT run the installer yourself, and do NOT proceed with a frames-only, ungrounded analysis – an unverified video analysis is exactly the failure this skill exists to prevent.

**Notes / docs** – read the document end to end first. The citable substrate is the **heading (or section) plus the exact quote**. You'll cite each item back to where it lives in the doc.

**Messages** – read every screenshot and message. The citable substrate is the **thread (or screenshot) plus the line**. Keep each substantive line addressable on its own.

**Transcript** – read it end to end. The citable substrate is the **`[MM:SS]` timestamp and the speaker**, if present; if the transcript has no timestamps, cite the speaker and a short quoted phrase.

### 3. Read each source end to end before writing anything

Read the whole of each source – the full `transcript.srt`, the full notes doc, the full message thread – to build the narrative arc. Don't start writing items yet. You need the shape of the whole before you can tell an aside from a request.

### 4. Ground every concrete moment in its source – THIS is the skill

This is where misreads come from when skipped. Grounding looks a little different per input type, but the discipline is identical: pair the exact words with the exact thing being pointed at, and never trust a one-line summary you didn't verify against the source.

**Video.** `MAP.tsv` maps segments to frames. **The on-screen file-time of frame `f_N` is `(N-1) × 2` seconds.** Use that to open the frame at any spoken timestamp. For every moment where the speaker points at, criticizes, or references something on screen, **actually open the frame(s) at that timestamp and look.** Hard-won rules (each one burned a real mistake this skill exists to prevent):

- **Never trust the on-screen recorder timer.** The little Loom/QuickTime widget shows the *recorder's* elapsed time, which can run a minute-plus ahead of the video file's time and drift. Always compute the frame from `MAP.tsv` / the `(N-1)×2` formula, not the visible timer.
- **Verify alignment once before trusting any frame.** Pick a moment with an unambiguous on-screen correlate (a dialog title, a specific value) and confirm the mapped frame shows it. If it doesn't, audio/video are offset – recompute before proceeding.
- **Don't trust a single glance / your vision over the transcript+frame pair.** If a summary "feels" right but you didn't open the frame, treat it as unverified.
- **Reference vs product.** The source often switches between the thing being changed and another app or site it holds up as the ideal – different URLs in the address bar, a competitor's screen, an old version. The on-screen UI is NOT necessarily the product being changed: the speaker may narrate a reference as the *desired model* (e.g. "port this animation from that site"), not as a problem with what's on screen. Check the URL/chrome in the frame and decide whether each item targets the product or merely cites a reference before writing it.

**Notes / docs, messages, transcripts.** The same reference-vs-product caution applies in text: a note that praises another tool's flow is a reference to emulate, not a defect in the current product. Quote the exact line, and where the text names a specific element, screen, field, or value, keep that exact name in the item. Don't paraphrase a named thing into a vaguer one.

### 5. Merge all sources into one list

Walk every source and treat each substantive line as a candidate to-do item, cited to its substrate.

- Where two sources describe the **same** thing (a video moment and a Slack line about the same button), it is **one** item carrying **both** citations.
- Where two sources **conflict**, make **two** items and note the conflict – don't silently pick one.
- A standalone message or note that isn't in the video is still its own item, cited to the message/note. (A real FEEDBACK.md had Slack notes hand-added alongside video items – that merge is the expected shape, not an exception.)

### 6. Completeness pass – DO NOT SKIP (this is the step that gets missed)

The recurring failure of this skill is **dropping or merging part of what a source said.** Before writing the file, force completeness across ALL sources:

1. **Walk each source unit by unit, top to bottom** – every transcript segment, every note paragraph, every message line. For EACH unit, decide: does it contain a request/instruction/observation? If yes, it must map to a to-do item.
2. **List every named entity the sources name** – every column, field, button, screen, or value named out loud or in writing (e.g. "period", "description", "model number", "location"). Each named entity must appear in some item. If a source names four columns, four columns appear – never collapse "period and description" into just "description."
3. **Check coverage both ways.** Every to-do item traces back to a source unit; every instruction-bearing unit traces forward to an item. No orphans either direction.
4. **Don't over-generalize.** Do not turn several distinct named things into one tidy "principle" item – keep each named thing the source actually said. A principle they state explicitly is its own item; it does not absorb the specifics.

Only after this pass do you write `FEEDBACK.md`.

### 7. Check "is it already done?" before treating an item as work

For each item, before it becomes a unit of work, confirm the current product actually behaves the way the source is reacting to. If the code already does what the item asks, mark it done and move on – don't change it. This check happens against the real code, per item, and the protocol block below carries it into the downstream loop.

### 8. Write `FEEDBACK.md` (literal to-do list)

The file MUST open with a **"How to work with this file"** protocol block, then the items. A stated fact with no usage protocol gets ignored by a downstream agent – the protocol is what makes the grounding (frames, transcript spans, quotes, threads) actually get used. Use this template verbatim (adapt only `<topic>` and the `Sources` line to the real sources):

```markdown
# Feedback — <topic>

Sources: <video filename / notes doc / message thread / transcript — list all that apply>

## How to work with this file (read before doing anything)

This is a literal record of feedback. It is the source of truth. Each item is something a
source actually said, nothing inferred. Work it **one item at a time**:

1. **Read the item** and its citations. Citations point back to the exact place the item came
   from: `[MM:SS]` = the time range in a video/transcript, `f_XXXX` = the frame(s) showing what
   was on screen, a heading + quote for notes, a thread/screenshot + line for messages.
2. **Open the cited source** – the frame(s) in `frames/` and the transcript span in
   `transcript.srt`, the quoted lines in the notes/thread – before touching code. Confirm you
   understand exactly what the source meant and what UI/data it was pointing at. Do not act on
   the one-line summary alone.
3. **Find the related code** for that item, and confirm the current behavior actually matches
   what the source is reacting to. If the code already does what they ask, mark it done and
   move on – don't change it.
4. **Agree the fix in prose first**, then implement only that item, reusing existing patterns.
   No adjacent changes, no scope creep, nothing the item didn't ask for.
5. **Verify**, then commit/PR only on explicit go-ahead. One item = one scoped change.

Rules: implement only what an item literally says. If an item is unclear, re-open its cited
source rather than guessing. Do not add items that aren't in this file. Any inference or
recommendation belongs in chat, never edited into this file.

---

Each item is what a source said. Citations point back to where: `[MM:SS]` = time in a
video/transcript, `f_XXXX` = frame, heading + quote = notes, thread + line = messages.

- [ ] **<the request, in the source's terms>** <one sentence of their own supporting reasoning
  if they gave it, no more>. `[MM:SS–MM:SS]` `f_XXXX, f_XXXX`
- [ ] **<a request that came from a message>** ... `Slack #design-review, line "<quote>"`
- [ ] **<a request that two sources agree on>** ... `[MM:SS]` `f_XXXX` + `notes: "Layout" — "<quote>"`
- [ ] ...
```

Re-read the cardinal rules under **The deliverable** before finalizing: literal, one item per instruction, every item traceable, merged not duplicated, no padding, no inference inside the file.

### 9. Present, then clean up

Present the result to the user as a **short** chat message: a plain list of the items. Keep it brief – the file is the artifact, your message is just a pointer. Any inference, code implication, or recommendation you have goes here in chat, clearly marked as yours, never in the file.

Then **delete the video scaffolding** (only relevant when a video was processed), keeping only what the user re-uses for grounding:

```bash
cd "<work-dir>" && rm -f probe.txt MAP.tsv transcript.json
# keep: audio.wav  transcript.srt  frames/  FEEDBACK.md
```

`FEEDBACK.md` is the source of truth. If the user later adds a real new feedback item, append it with a dated note marking it as added later. Don't pollute the file with ad-hoc items that aren't from a source.

## Handoff – acting on the items

The deliverable is the grounded, literal `FEEDBACK.md`. The protocol block above is what feeds it into work. When the user wants to act on items, ship each one as a **scoped change**, one item at a time – never batch unrelated items into one diff.

Feed items **one at a time into the scoped-edit loop**: for each item, re-ground it in the current code, pair it with its cited source (transcript span + frames, or quote + thread) and the related code, restate the exact element/file/property and agree the fix in prose first, hand it to `frontend-implementer` to **modify in place** (reuse existing patterns, no adjacent changes), verify in the browser with Playwright (via code, not screenshots), and open a **scoped PR** – one item, one scoped change – only on explicit say-so.

When several items form a coherent, **verifiable batch** (e.g. a set of changes with a clear done-state you can check with Playwright), you may **compose a `/goal`** whose completion condition is that batch's acceptance criteria, **suggest it ready-to-paste, and STOP** for the user to paste it or say "go". Never auto-invoke `/goal` – it is user-invoked only; the skill suggests and waits.
