#!/usr/bin/env bash
# Design-engineer Figma intake hook.
# Injects design-intake guidance for the main model as additionalContext –
# no evaluator model, no blocking. Mode selected by $1:
#   design-context – PostToolUse on get_design_context: remind the model to ask
#     the user clarifying questions about what static designs cannot show.
#   screenshot – PreToolUse on get_screenshot: remind the model that screenshots
#     are supplementary and get_design_context is the primary source. Whether
#     get_design_context already ran is state only the main model knows, so this
#     guides instead of denying.
# Only active in projects that have run /design-engineer:launch (config.yaml
# present). Always exits 0.

set -u

[ -f ".design-engineer-plugin/config.yaml" ] || exit 0

case "${1:-}" in
  design-context)
    cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Figma design data received. Before implementing or reviewing, ask the user clarifying questions via AskUserQuestion about what static designs cannot show (interactions, animations, state changes, responsive behavior, edge/error/loading states, component reuse). Ask context-based questions from the specific design; skip if the change is trivial."}}
EOF
    ;;
  screenshot)
    cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"Screenshots are supplementary. If you have not called get_design_context for this design yet, do that first – structured design data is required for implementation and design-to-code review; a screenshot alone is not a valid primary source."}}
EOF
    ;;
esac

exit 0
