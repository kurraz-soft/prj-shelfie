# Shelfie

A simple bookshelf manager built with Nuxt 3.

## Setup

Make sure to install dependencies:
## Deployment

This project is configured for deployment to **GitHub Pages** via GitHub Actions.

Every push to the `main` branch will automatically trigger a build and deploy.

### GitHub Pages Settings
To finish the setup in your GitHub repository:
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to `GitHub Actions`.

The site will be available at `https://<your-username>.github.io/prj-shelfie/`.

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
