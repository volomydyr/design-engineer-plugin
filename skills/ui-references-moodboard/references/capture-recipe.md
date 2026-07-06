# Playwright capture recipe

Sectional screenshot capture for reference URLs, using the Playwright MCP. Sections beat full-page captures because (a) the model can read each one in detail, (b) the file size is reasonable, (c) we can wait per-section for animation settle.

Playwright tool ids carry a server prefix – `mcp__plugin_design-engineer_playwright__<tool>` for the plugin's bundled server, or `mcp__playwright__<tool>` if the project has its own Playwright MCP; use whichever appears in your tool list. The steps below name tools by their `browser_<tool>` suffix.

Run this for every chosen URL (curated picks + user-added URLs).

## Per-URL steps

1. **Resize the viewport** to match the product type:
   - Web/Desktop: `browser_resize { width: 1440, height: 900 }`
   - Mobile (iOS/Android): `browser_resize { width: 414, height: 896 }`

2. **Navigate**: `browser_navigate { url: "<chosen-url>" }`

3. **Wait for load + animation settle**: `browser_wait_for { time: 3 }` (3 seconds. If a more specific signal exists, e.g. a known visible word, also wait for `text: "<known word>"`).

3a. **Bot-block check**: take a quick `browser_snapshot` and inspect the result. If the page is a Cloudflare challenge ("Just a moment…"), a captcha, "Verify you are human", an Access Denied page, or otherwise clearly NOT the requested reference UI, **stop and ask the user via AskUserQuestion**:
   - question: `"Hit a bot-block on <URL>. Want to help me get past it?"`
   - options: `"I'll open it in my browser and screenshot it for you"`, `"I'll turn off the blocker and you retry"`, `"Skip this reference"`

   Apply the choice. Never silently fall back to a low-quality WebFetch read or skip the reference quietly. References are the whole point of this skill, and the user can almost always unblock the site in 10 seconds.

4. **Scroll to top**: `browser_evaluate { function: "() => window.scrollTo(0, 0)" }`

5. **Capture viewport-sized hero** (NOT fullPage): `browser_take_screenshot { fullPage: false, filename: ".design-engineer-plugin/design/exploration/references/captures/<reference-slug>/01-hero.png" }`. Ensure the parent dir exists first: `mkdir -p .design-engineer-plugin/design/exploration/references/captures/<reference-slug>`.

6. **Loop sections** until bottom or up to 5 sections:
   - `browser_evaluate { function: "() => window.scrollBy(0, 700)" }`
   - `browser_wait_for { time: 1 }`
   - `browser_take_screenshot { fullPage: false, filename: ".design-engineer-plugin/design/exploration/references/captures/<reference-slug>/02-section.png" }` (incrementing the prefix per section: 02, 03, 04, 05).
   - Stop when the page bottom is reached: detect via `() => window.innerHeight + window.scrollY >= document.body.scrollHeight - 50`.

7. **Save manifest** at `.design-engineer-plugin/design/exploration/references/captures/<reference-slug>/manifest.md`:

   ```markdown
   # <Reference name>
   - URL: <url>
   - Viewport: <width>×<height>
   - Captured: <ISO timestamp>
   - Sections: 01-hero.png, 02-section.png, ...
   - Watch for: <"watch for" note from curated-references.md>
   ```

## Quality note on DPR

Playwright MCP captures at the OS viewport resolution. To get hi-DPR images, the resize command at step 1 should use a doubled width (e.g. `2880×1800` for desktop or `828×1792` for mobile). The captured PNG will be at native pixel density. If the captures still look low-resolution after this, document the limitation in the manifest. The sectional + waited approach is still strictly better than a full-page approach.

## After capture

When all references are captured, present a brief summary to the user (count of references captured, total sections) before moving to analysis.
