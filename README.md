# Qyrova website

The public marketing website for [Qyrova](https://qyrova.spandan305.workers.dev/).

## Local development

Use Node.js 22.12 or newer:

```sh
npm ci
npm run dev
```

The development URL includes `/Qyrova-website/`, matching the GitHub Pages project path.

## Publishing

`.github/workflows/deploy.yml` builds and deploys automatically when `main` changes. GitHub repository Settings → Pages → Source must be **GitHub Actions**.

Published URL: https://spandragon98.github.io/Qyrova-website/

This is a static React/Vite marketing site. It contains no application credentials or customer records. Product previews use demonstration data and do not connect to the application's database. The original feature tour, theme/accent controls, FAQ and app links are retained.

The source was extracted from the Qyrova-specific folder in the existing local project. Other projects, Firebase configuration, personal photographs and CV files were intentionally not copied. That original project is unchanged.

## Design and fonts

Tall condensed Anton headlines follow the user's supplied typography reference, with self-hosted DM Sans for reading text. Cobalt-and-white surfaces replace the original pink glass treatment. Font packages include their licenses; no remote Google Fonts dependency is needed.

The app is independently hosted on Cloudflare. Deploying this marketing site does not alter the app, its authentication or data storage.
