# Self-hosted fonts

These fonts are served from this repo instead of a third-party CDN so the page
makes **no runtime request to a font host** (no visitor IP handed to a third
party) — keeping it consistent with the catalog's self-contained / CORS-open /
zero-auth stance. Each file is the Google Fonts **latin** subset of the family's
variable font (full weight axis in one file); the page's `@font-face` rules in
`../styles.css` declare only the weights actually used.

All three are licensed under the **SIL Open Font License, Version 1.1** — see
[`OFL.txt`](./OFL.txt) for the full terms. Copyright notices:

- **Inter** — Copyright © 2016 The Inter Project Authors — https://github.com/rsms/inter
- **JetBrains Mono** — Copyright © 2020 The JetBrains Mono Project Authors — https://github.com/JetBrains/JetBrainsMono
- **Plus Jakarta Sans** — Copyright © 2020 The Plus Jakarta Sans Project Authors — https://github.com/tokotype/PlusJakartaSans

Files:

| File | Family | Weights used |
|---|---|---|
| `inter-latin.woff2` | Inter | 400 / 500 / 600 / 700 |
| `plus-jakarta-sans-latin.woff2` | Plus Jakarta Sans | 600 / 700 / 800 |
| `jetbrains-mono-latin.woff2` | JetBrains Mono | 400 / 500 |
