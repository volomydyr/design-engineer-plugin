# Design System Compliance Checklist

## Overview

This checklist is used to audit code for design system compliance. Every item must pass for the design system to be considered fully compliant. The target is 10/10 compliance across all audited files.

---

## 1. Color Compliance

- [ ] Zero hardcoded color values (no RGB values like `Color(red: 0.86, green: 0.15, blue: 0.15)`)
- [ ] Zero hardcoded hex color values (no `Color(hex: "#007AFF")` or equivalent)
- [ ] Zero system color references used directly (no `Color.blue`, `Color.red` without semantic mapping)
- [ ] All colors reference semantic aliases (e.g., `Color.onboardingTextPrimary`, `Color.primaryAction`)
- [ ] Semantic color aliases map to base tokens in DesignTokens, not to raw values
- [ ] Dark mode / theme variants handled through semantic aliases, not conditional logic in views

---

## 2. Typography Compliance

- [ ] Zero hardcoded font sizes (no `.font(.system(size: 16))` or equivalent)
- [ ] Zero hardcoded font weights (no `.fontWeight(.bold)` without semantic reference)
- [ ] All typography uses semantic aliases (e.g., `Font.onboardingTitle`, `Font.bodySmall`)
- [ ] Line heights defined in typography tokens, not inline
- [ ] Letter spacing defined in typography tokens where applicable
- [ ] Font family references centralized (no scattered font name strings)

---

## 3. Spacing Compliance

- [ ] Zero magic numbers for padding (no `.padding(16)` without semantic reference)
- [ ] Zero magic numbers for margins or offsets
- [ ] Zero magic numbers for gap/spacing between elements
- [ ] All spacing uses semantic constants (e.g., `Semantics.screenHorizontalPadding`)
- [ ] Spacing values reference base tokens (spacing10, spacing40, spacing56, spacing64)
- [ ] Consistent spacing system applied across all screens

---

## 4. Sizing Compliance

- [ ] Zero hardcoded width or height values for standard components
- [ ] Icon sizes reference token constants (iconSizeSmall at 16, iconSizeMedium at 20, iconSize at 24)
- [ ] Minimum tap target size of 56 points enforced for all interactive elements
- [ ] Component sizes use semantic constants, not inline numbers

---

## 5. Component Architecture

- [ ] All views follow single responsibility principle
- [ ] No view body exceeds 50 lines – extract subviews for complex layouts
- [ ] No duplicated styling logic across files
- [ ] Repeated UI patterns extracted into reusable components
- [ ] Components consume semantic aliases, never raw token values
- [ ] Proper data flow patterns maintained (state management follows framework conventions)

---

## 6. Icon Standardization

- [ ] All icons use a centralized icon system (asset catalog or icon library)
- [ ] Icon references use constants, not hardcoded strings
- [ ] No duplicate icon assets
- [ ] Consistent icon sizing through design tokens

---

## 7. Animation Compliance

- [ ] Animation durations use token constants (microAnimationDuration, quickAnimationDuration, slowTransition)
- [ ] Animation curves defined in centralized configuration
- [ ] No hardcoded animation timing values in views
- [ ] Animations respect system "reduce motion" preference

---

## 8. Naming Conventions

- [ ] Semantic aliases follow consistent naming pattern (context + purpose format)
- [ ] Component names describe their function, not appearance
- [ ] Token names are descriptive and self-documenting
- [ ] Naming is consistent across all design system files

---

## 9. Design System Structure

- [ ] DesignTokens file contains all base values
- [ ] Semantic aliases files organized by app context (onboarding, main app, shared)
- [ ] Component files contain only UI components that consume semantic aliases
- [ ] Clear layer separation maintained: tokens -> aliases -> components
- [ ] No circular dependencies between design system files

---

## 10. Anti-Pattern Detection

- [ ] No inline styles that should be view modifiers or components
- [ ] No new components created when existing ones should be reused
- [ ] No components with naming conventions that differ from established patterns
- [ ] No monolithic views that should be broken into smaller subviews
- [ ] No duplicated logic across multiple views
- [ ] No style definitions that bypass the semantic alias layer

---

## Audit Process

### How to Run the Audit

1. **Read and analyze** all implemented frontend code
2. **Identify violations** – hardcoded values, monolithic views, duplicated logic, inconsistent patterns
3. **Check existing design system** for available styles and components
4. **Implement fixes** by replacing violations with proper design system usage
5. **Create missing design system elements** when needed (modifiers, extensions, constants)
6. **Document changes** and ensure consistency across all modified files

### Completion Criteria

The audit is complete when:
- All hardcoded styles are eliminated and replaced with design system references
- All monolithic views are broken down into logical, reusable components
- All icons use the centralized icon system
- No duplicated logic exists across the codebase
- Code follows established architecture patterns
- Design system is consistently applied following the DesignTokens -> SemanticAliases pattern

### Audit Report Format

For each violation found, document:
- **File** – path to the file containing the violation
- **Line** – specific line or range
- **Violation type** – which checklist category (color, typography, spacing, etc.)
- **Current code** – the offending code
- **Correct code** – the compliant replacement
- **Status** – fixed or pending
