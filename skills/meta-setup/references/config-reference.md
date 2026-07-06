# Config reference – keys and folder tiers

Every key the plugin writes to `.design-engineer-plugin/config.yaml`, and the folder layout `init-project-structure.sh` scaffolds. Detection greps are ^-anchored, so `project_type:` and `status:` must stay top-level and unquoted.

## Top-level keys

| Key | Values | Written by | Read by |
|---|---|---|---|
| `project_type` | `new` \| `existing` | launch.md onboarding (Step 2/4b) | `detect-state.sh`, `hooks/de-start-state.sh`, launch/discovery/development routing |
| `status` | `complete` | development.md at the end of the from-scratch pipeline (`project_type: new` only) | Step 0 routing – sends the project to the iterate flow (`returning_complete`) |
| `goal` | front-door label plus any free-form text | launch.md Step 4 | launch.md returning acknowledgment |
| `resume:` | block with `task`, `files`, `next_action`, `saved_at` | `/design-engineer:stop` | meta-setup Path A and launch.md paused-task pick-up |

## Nested sections

| Key | Values | Written by | Read by |
|---|---|---|---|
| `environment.plugins.{context7, figma, playwright}` | `true` \| `false` | meta-setup Step 4, from `detect-environment.sh` | skills that branch on tool availability |
| `dependencies.tracking_file` | `".design-engineer-plugin/dependencies.yaml"` | meta-setup Step 4 | dependency tracking |
| `dependencies.auto_suggest` | `true` \| `false` | meta-setup Step 4 | dependency tracking |
| `project.context.{existing_design_system, existing_brand_docs, existing_specs, shipped_ui, off_repo_references}` | `true` \| `false` \| path/location; `off_repo_references` is a list | launch.md Step 4b.5 (existing projects only) | iterate-flow dispatch and `ux-*` skip-checks |

## Folder tiers (scaffolded by init-project-structure.sh)

```
.design-engineer-plugin/
├── config.yaml          # This file
├── dependencies.yaml    # Dependency graph, from the default template
├── memory/              # project-map.md + debug-solutions.md
├── plans/
│   └── archive/         # Implementation plans + completed-plans archive
├── prototype/           # HTML prototypes
└── temporary/           # Gitignored – purged at completion milestones
    ├── scratch/
    ├── playwright/
    └── intermediate/
```

Deliverable subdirs under `.design-engineer-plugin/design/` (`foundation`, `research`, `planning`, `exploration`, `psychology`, `reviews`, `dev`, `features`) are lazy – each is created by the skill that writes its first deliverable there.
