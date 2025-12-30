# Shelfie

A simple bookshelf manager built with Nuxt 4, featuring Firebase integration for authentication and cloud sync.

## Features

- **Google Authentication**: Sign in to keep your library synced across devices.
- **Cloud Firestore**: Your books and comments are stored securely in the cloud.
- **Offline First**: Works with local storage when not signed in, with automatic migration to the cloud upon your first login.
- **Book Management**: Track what you're reading, what you've finished, or what you want to read next.

## Configuration

This project requires Firebase to function for cloud sync. You need to set up a Firebase project and enable Google Auth and Firestore.

### Environment Variables

1. **Local Development**: Copy `.env.example` to `.env` and fill in your Firebase configuration keys:
   ```bash
   cp .env.example .env
   ```
2. **Production/GitHub Pages**: Add these same keys as **Secrets** in your GitHub repository (**Settings > Secrets and variables > Actions**).

The required variables are:
- `NUXT_PUBLIC_FIREBASE_API_KEY`
- `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NUXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NUXT_PUBLIC_FIREBASE_APP_ID`

## Setup

Make sure to install dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
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

## Deployment

This project is configured for deployment to **GitHub Pages** via GitHub Actions.

### GitHub Pages Settings
To finish the setup in your GitHub repository:
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to `GitHub Actions`.

### CI/CD Environment Variables
Make sure to add your Firebase keys as **Actions Secrets** in your GitHub repository so they can be injected during the build process.

The site will be available at `https://<your-username>.github.io/prj-shelfie/`.

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
