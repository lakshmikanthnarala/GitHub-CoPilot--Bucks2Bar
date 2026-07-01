# Copilot Instructions for Project 1

This workspace is a simple static web project containing:
- `index.html`
- `styles.css`
- `script.js`

## Assistant behavior

- Prefer plain HTML, CSS, and JavaScript for fixes and enhancements.
- Keep changes minimal and self-contained to the existing files unless the user explicitly requests new files or a different architecture.
- Do not introduce build tools, frameworks, or package dependencies unless the user asks for them.
- Preserve the current file structure and avoid moving files unless necessary for the requested change.
- When updating UI behavior, ensure the HTML, CSS, and JavaScript remain consistent and maintain readability.
- Use concise, clear code and comments only when they improve maintainability.

## When the user is unclear

- Ask follow-up questions before making structural changes or adding new dependencies.
- Clarify whether the rule applies globally or only to specific file types if the request is ambiguous.

## Prompt examples

- "Fix the button layout in `index.html` and update `styles.css` accordingly."
- "Add a simple form validation script to `script.js` without introducing external libraries."
- "Keep the project static and browser-native unless I ask for a build setup."
