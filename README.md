# Requisio handbook — Docusaurus version (for comparison)

> **This is a copy of [requisio-ux-demo](https://github.com/saanchi365/requisio-ux-demo), made only to compare website builders.**
> This copy builds the handbook with **Docusaurus**: https://saanchi365.github.io/requisio-ux-demo-docusaurus/
> The same design is built with **Hugo** in [requisio-ux-demo-hugo](https://github.com/saanchi365/requisio-ux-demo-hugo).

**Don't add issues, flowcharts or wireframes here.** Everything comes from the main project
(issues, board, flowcharts, wireframes, user documents). On every update it publishes
`handbook-data.json`, and this website is built from that file.

| What | Where |
|---|---|
| The pages (how each tab looks and reacts) | `docusaurus/src/components/HandbookPage.jsx` — React components |
| Which pages exist | `docusaurus/plugins/handbook/index.js` — one page per feature and tab, made from the data |
| Look | `docusaurus/src/css/custom.css` (the same look as the Hugo version) |
| Getting the data | `scripts/prepare_data.py` (the same file as the Hugo version) |
| Sample wireframes (only in the copies, because the main project has none yet) | `sample-wireframes/` |

The website rebuilds every hour, on every change here, and with **Actions → Build handbook (Docusaurus) → Run workflow**.
