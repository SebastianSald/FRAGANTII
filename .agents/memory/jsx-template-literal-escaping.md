---
name: Escaped backticks in JSX from design subagents
description: Design subagents sometimes escape backticks inside JSX template literals, causing Babel parse errors
---

Design subagents occasionally write `\`` (escaped backtick) inside JSX template literal expressions, producing files with literal backslash-backtick byte sequences that Vite/Babel rejects with:
```
Error: Expecting Unicode escape sequence \uXXXX
```

**Why:** The subagent is escaping backticks as if writing a shell script or markdown, but inside JSX these must be literal unescaped backtick characters.

**How to apply:** After a design subagent finishes, grep/check for this pattern and fix with Node.js:
```js
const fs = require('fs');
let c = fs.readFileSync('file.tsx', 'utf8');
// Find and replace specific problematic patterns
// Use Node.js string replacement, not sed (sed has backtick interpolation issues in bash)
fs.writeFileSync('file.tsx', c, 'utf8');
```

Alternatively, avoid nested template literals in JSX entirely — use string concatenation (`"opacity-0 " + variable`) instead of `` `opacity-0 ${variable}` `` when inside another template literal expression.
