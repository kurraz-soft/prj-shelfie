# Shelfie - Your Personal Online Bookshelf

Shelfie is a modern Single Page Application (SPA) designed for book lovers to manage their personal library, track reading progress, and maintain notes on their literary journey.

## Core Purpose
The application serves as a centralized hub for users to catalog books they are currently reading, have finished, or plan to read. It emphasizes ease of use, beautiful design, and seamless data synchronization across devices.

## Key Features
- **Book Cataloging**: Search for books using the Open Library API or add them manually with custom titles, authors, and covers.
- **Reading Statuses**: Track progress with statuses like *Reading*, *Will Read*, *Finished*, and *Dropped*.
- **Personalized Ratings**: Assign 1-5 star ratings to reflect your experience.
- **Notes & Comments**: Add detailed notes or comments to any book in your collection.
- **Tag Management**: Organize your library with custom tags for easy filtering and categorization.
- **Firebase Integration**: 
  - **Authentication**: Secure Google-based login.
  - **Cloud Sync**: Real-time synchronization with Cloud Firestore.
  - **Local-to-Cloud Migration**: Automatically syncs guest bookshelf data to your account upon first login.

## Technical Stack
- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **UI Components**: [shadcn-vue](https://www.shadcn-vue.com/)
- **Styling**: Tailwind CSS
- **State Management**: [Pinia](https://pinia.vuejs.org/) with [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- **Backend Services**: Firebase (Auth & Firestore)
- **Icons**: Lucide Vue Next

## Folder Structure Breakdown

```text
prj-shelfie/
├── app/                    # Main application directory (Nuxt 4 structure)
│   ├── components/         # Reusable Vue components
│   │   ├── ui/             # shadcn-vue base components
│   │   ├── AddBookDialog.vue # Logic for searching & adding books
│   │   ├── AppHeader.vue   # Top navigation & user profile
│   │   ├── BookCard.vue    # Individual book display card
│   │   ├── BookList.vue    # Grid/List layout for books
│   │   └── ...             # Other functional components
│   ├── composables/        # Shared logic and stateful helpers
│   │   └── useAuth.ts      # Authentication wrapper
│   ├── constants/          # Application constants (e.g., BOOK_STATUSES)
│   ├── lib/                # Third-party service initializations
│   │   ├── utils/          # Helper functions (e.g., image processing)
│   │   └── firebase.ts     # Firebase App/Firestore/Auth setup
│   ├── pages/              # Application routes
│   │   └── index.vue       # Main library view
│   ├── stores/             # Pinia state management
│   │   ├── auth.ts         # User session & auth state
│   │   └── books.ts        # Main data store with Firestore sync
│   └── types/              # TypeScript interfaces and definitions
├── public/                 # Static assets (favicons, manifest)
├── .github/                # CI/CD workflows (GitHub Pages deployment)
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js      # Tailwind customization
├── .env.example            # Template for required secrets
└── README.md               # Setup & deployment guide
```

## Data Lifecycle
1. **Unauthenticated**: Data is stored locally using `localStorage` through Pinia's persistence plugin.
2. **On Login**: The `useAuth` composable handles the Google popup. Upon success, the `books` store detects the user and migrates any local books to Firestore.
3. **Authenticated**: All actions (Add, Update, Delete) are performed directly against Firestore, with real-time listeners keeping the local state updated instantly across all tabs/devices.