# context7 query templates for stack-adaptive gallery scaffolding

The `dev-component-gallery` skill queries the bundled context7 MCP to learn each project's framework's idiomatic showcase pattern. Keeping the prompt templates here makes results reproducible across runs and visible to maintainers.

## Tool wiring

The bundled MCP exposes:
- `mcp__plugin_design-engineer_context7__resolve-library-id` – resolves a framework name to a context7 library id (e.g., `next` → `/vercel/next.js`).
- `mcp__plugin_design-engineer_context7__query-docs` – queries the resolved library's documentation with a free-form question.

Always resolve first, query second. If `resolve-library-id` returns no match for the framework, the skill must fall back to the advisor consult and then to the user – never invent the answer.

## Primary query template (single-page showcase)

After resolving the library id, send this query through `query-docs`:

```
What is the idiomatic, officially-supported pattern for a single-page
component preview/showcase in {{FRAMEWORK_NAME}} {{VERSION}}?

I need to know specifically:

1. File location convention – where in the project tree should this file live?
   What's the routable / discoverable path (URL, Xcode preview, Android Studio preview, etc.)?

2. File extension – what file format should I create?

3. How to import production components from elsewhere in the project – what
   import or include syntax does the framework expect?

4. How to render multiple variants of one component in the same file using
   only the component's public API (props / attributes / modifiers / etc.) –
   no style overrides, no copy-paste.

5. Comment syntax – what's the standard documentation-header comment style
   for a top-of-file contract block?

6. Access mechanism – how does a developer actually view the rendered output
   (URL when dev server runs, Xcode canvas, AS preview pane, etc.)?

Cite the official documentation paragraphs you base each answer on.
Do NOT extrapolate from older framework versions – if the docs for this
specific version don't cover a question, say so.
```

Replace `{{FRAMEWORK_NAME}}` and `{{VERSION}}` with what stack detection found.

## Fallback query (if primary returns nothing)

If the primary query returns generic or empty results, retry with a narrower question that doesn't assume the framework has a built-in showcase pattern:

```
In {{FRAMEWORK_NAME}} {{VERSION}}, what's the most common community pattern
for a developer to create a single page in their own project that:
- imports several of their own components
- renders each component in multiple states using the component's API
- is reachable via the project's normal dev workflow (dev server, preview canvas, etc.)

Cite where this pattern is documented or commonly demonstrated.
```

If even the fallback returns nothing useful, the skill consults the advisor with the framework name, the empty docs result, and a proposed path it would otherwise pick. If the advisor also can't decide, ask the user once via AskUserQuestion and persist the answer in `.design-engineer-plugin/config.yaml` under `gallery.path`.

## Anti-pattern queries (do NOT use)

- Don't query "how do I install Storybook in {{FRAMEWORK}}" – Storybook was explicitly rejected by the user. The plugin ships a native gallery, not a Storybook scaffold.
- Don't query for "best component documentation tools" – that returns a tool comparison, not an idiomatic in-project pattern.
- Don't query for live token editing or CSS variable manipulation – live editing was scoped out of v1; querying for it muddies the docs.

## Result interpretation guide

After the docs return:

1. **Pick the location**: official docs > common community pattern > advisor recommendation > user input. Never reverse this order.
2. **Pick the file format**: must match what the framework's runtime can render. If unclear, prefer the format used by the project's existing entry/index file.
3. **Pick the comment syntax**: from `gallery-contract.md`'s adaptation table. If the language isn't listed there, use the language's idiomatic block-comment style.
4. **Pick the access mechanism**: must be something the user already does (running their normal dev server, opening Xcode, etc.). Never propose a separate process unless context7 explicitly says that's the framework's convention.
5. **Document your reasoning** in the report you give back to the user when the gallery is scaffolded – quote the docs paragraphs you used.

## Source citation requirement

When the skill scaffolds a gallery, the report to the user must include the context7 doc citations that justified the location/format choices. This makes the scaffold auditable: the user (or a future reviewer) can verify the choice against the same docs. This matches the source-citation requirement applied to evaluation skills.
