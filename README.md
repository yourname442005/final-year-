# suiiiiii

> **AI-Native Research Intelligence Platform**

suiiiiii is a research intelligence platform designed to make academic research faster, more organized, and more personalized.

Instead of treating research as a collection of disconnected searches, papers, bookmarks, and social interactions, suiiiiii brings **research discovery, semantic search, researcher networking, saved research, collections, workspaces, publishing, and AI-assisted intelligence** into one unified platform.

The application is built as a modern multipage web platform with a strong editorial/research-oriented visual system. The interface is intentionally clean, warm, minimal, and information-focused so that large amounts of research content can be presented without making the application feel like a traditional academic database.

---

## Overview

The core idea behind suiiiiii is simple:

```text
Discover
   ↓
Search
   ↓
Understand
   ↓
Save
   ↓
Organize
   ↓
Connect
   ↓
Work
   ↓
Publish
```

The platform is designed around the complete research workflow rather than a single feature.

A researcher can:

* Discover academic papers and preprints
* Search research semantically
* Receive personalized research suggestions
* Inspect AI-generated research intelligence
* Save papers
* Organize saved research into collections
* Discover and follow other researchers
* View researcher profiles
* Maintain a research workspace
* Manage collections
* Track notifications
* Explore trending research
* Prepare and publish research content
* Manage their profile and platform settings

---

# Core Features

## 1. Public Landing Page

The platform begins with a public landing page introducing the product and its research-focused capabilities.

The landing page contains:

* Product branding
* Hero section
* Research-focused messaging
* Platform capabilities
* Semantic search explanation
* Research intelligence
* Research workspace
* Research network
* Workflow explanation
* Calls to action
* Footer and supporting information

The landing page is intentionally separate from the authenticated research platform.

Users can enter the application through the existing authentication CTAs.

---

# 2. Authentication

Authentication is handled through **Clerk**.

The intended authentication flow is:

```text
Landing Page
     │
     ├── Get Started
     │       ↓
     │    Sign Up
     │
     └── Sign In
             ↓
          Sign In
             │
             ↓
       Authentication
             │
             ↓
        Research Feed
```

Authenticated users are directed into the main research platform.

Authentication should not alter the existing application's visual identity.

The existing landing page, header, navigation, research feed, search experience, paper discovery, and collections UI are designed independently of Clerk's default visual components.

### Environment variables

Create a local `.env.local` file.

Never commit this file.

Required authentication variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

The secret key must remain server-side and must never be exposed in client-side code.

---

# 3. Research Feed

The Research Feed is the main social/research discovery surface of the authenticated platform.

It allows researchers to discover research-related posts and interact with other researchers.

The feed includes:

* Research posts
* Researcher identity
* Profile avatars
* Social interactions
* Research content
* Suggested researchers
* Follow actions
* Navigation to researcher profiles

The platform uses a dedicated `/feed` route for the authenticated Research Feed.

The landing page lives separately at `/`.

This separation prevents the Research Feed navigation from accidentally returning users to the marketing/landing page.

---

# 4. Suggested Researchers

The Research Feed contains a **Suggested for you** experience.

The purpose is to use available space in the Research Feed to help users discover researchers they may want to follow.

The section can contain:

* Current user profile information
* Suggested for you heading
* See all action
* Suggested researcher accounts
* Profile avatars
* Researcher names
* Research fields/institutions
* Follow buttons

Interactions include:

```text
Click researcher
      ↓
Researcher profile

Click Follow
      ↓
Follow researcher

Click See all
      ↓
Suggested researcher directory
```

The feature is inspired by social discovery patterns but is integrated into the research platform's own visual language.

---

# 5. Research Network

The platform includes a researcher network where users can discover other researchers and inspect researcher profiles.

The network functionality supports concepts such as:

* Researcher discovery
* Researcher profiles
* Follow relationships
* Suggested researchers
* Research interests
* Research fields
* Research metrics

The standalone **Networks navigation button was removed from the primary sidebar** so that researcher discovery can be surfaced more naturally through the Research Feed and related experiences.

The underlying researcher/network functionality remains available where required.

---

# 6. Semantic Search

Semantic Search is one of the core features of the platform.

Instead of requiring users to rely entirely on exact keywords, the search experience is designed around research intent and meaning.

The Semantic Search experience can provide:

* Research query input
* Relevant research results
* Paper discovery
* AI-assisted research interpretation
* Search history
* Dynamic research suggestions
* Related research directions

The objective is to help researchers move from:

```text
"I know exactly what paper I want"
```

toward:

```text
"I know the research problem I am interested in"
```

and still find useful literature.

---

# 7. Dynamic Research Suggestions

Semantic Search includes a personalized research suggestion system.

This is intentionally different from a static list of popular tags.

The system is designed to use available research/user signals such as:

* Recent searches
* Search frequency
* Search recency
* Research interests
* Research field
* Saved paper metadata
* Existing research categories
* Related paper topics

The suggestions can change as the user's research behavior changes.

For example:

```text
User searches:

Transformer reasoning
        ↓
Long-context models
        ↓
Inference optimization
```

The platform can subsequently suggest related research directions such as:

```text
Inference-time compute
Test-time adaptation
Efficient reasoning architectures
```

Another researcher with a different research history should receive different suggestions.

The system also supports fallback suggestions for users with insufficient search history.

The goal is:

> **Help researchers discover what they should search for next.**

---

# 8. Paper Discovery

Paper Discovery provides a broader literature exploration experience.

It contains:

* Indexed paper listings
* Research paper cards
* Sorting
* Open Access filtering
* Grid/List view
* Paper metadata
* Authors
* Publication information
* Citation counts
* AI-generated research intelligence
* Paper actions

The previous large static discipline/tag section was intentionally removed.

The Paper Discovery experience is now focused on actually discovering and evaluating papers rather than displaying a large collection of static research chips.

---

# 9. AI Research Intelligence

Research papers can expose AI-generated intelligence to help users understand the relevance and content of research.

Depending on the paper and available data, the interface can surface:

* AI reasoning matches
* Research relevance
* Key research information
* Research summaries
* Intelligence breakdowns
* Related research context

The project includes Gemini integration through the Google GenAI package.

The Gemini API key should be stored locally:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never hardcode API keys into the source code.

---

# 10. Unified Collections

Saved Papers and Collections were intentionally merged.

There is no longer a conceptual reason for users to think about:

```text
Saved Papers
```

and:

```text
Collections
```

as two separate research libraries.

The new mental model is:

```text
Find paper
    ↓
Save
    ↓
Collections
    ↓
Organize saved research
```

**Collections is the unified research library.**

---

# 11. Saving Papers

The Save action remains available where users discover papers.

For example:

```text
Semantic Search
      ↓
Paper
      ↓
Save
```

Once saved, the paper becomes part of the user's research library.

Inside Collections, the paper is already saved.

Therefore, the redundant **Save button is not displayed on paper cards inside Collections**.

Collections instead focuses on managing research that has already been saved.

---

# 12. Automatic Research Organization

Saved papers can be organized according to meaningful research categories.

The intended relationship is:

```text
Paper
  ↓
Saved
  ↓
Research classification
  ↓
Collection
```

For example:

```text
Adaptive Compute
├── Paper A
├── Paper B
└── Paper C

Neuromorphic Computing
├── Paper D
└── Paper E
```

The system should use existing paper metadata and research classification rather than creating a new collection for every individual tag.

The objective is meaningful organization, not excessive fragmentation.

---

# 13. All Saved

Collections includes an **All Saved** concept.

This acts as the complete saved-paper view.

It answers:

> "Show me every paper I have saved."

Regardless of which research collection a paper belongs to, it should remain discoverable through All Saved.

Conceptually:

```text
Collections

├── All Saved
├── Adaptive Compute
├── Neuromorphic Computing
├── Single-Cell Genomics
└── Other Collections
```

---

# 14. Collection Management

Existing collection functionality is preserved.

Depending on the implementation, researchers can organize their saved research into meaningful groups.

Collections can represent:

* Research areas
* Thesis topics
* Projects
* Reading lists
* Important papers
* Research themes
* Personal categories

The purpose is to make the research library usable over time rather than becoming an unstructured list of bookmarks.

---

# 15. Research Workspace

The platform includes a dedicated Workspace area for deeper research workflows.

The Workspace is intended to move beyond simple paper discovery and provide an environment for organizing active research work.

Potential workspace concepts include:

* Research projects
* Working material
* Manuscripts
* Research notes
* Paper references
* Project organization

The Workspace is part of the larger research workflow and is separate from simple paper saving.

---

# 16. Publishing

The platform includes publishing-related functionality for researchers.

Publishing functionality can include:

* Research manuscripts
* New manuscript creation
* Publishing workflow
* Research posts
* Pre-review functionality
* AI-assisted review
* Research publishing controls

The repository includes reusable components for manuscript and post creation.

---

# 17. Trending Research

The platform includes a Trending research experience.

This area is intended to surface research that is currently receiving attention or has meaningful activity within the platform.

It is separate from personalized Semantic Search suggestions.

The distinction is:

```text
Trending
    ↓
What is broadly receiving attention

Semantic Search Suggestions
    ↓
What may be useful to YOU
```

---

# 18. Notifications

The platform includes a notifications area for user activity and platform events.

This provides a dedicated location for relevant researcher interactions and application updates.

---

# 19. User Settings

The application includes a dedicated settings area for managing user/application preferences.

Settings are separate from the main research workflow while remaining accessible from the authenticated platform.

---

# Application Routes

The project follows a Next.js App Router structure.

Major application routes include:

```text
/
├── api/
├── collections/
├── discover/
├── network/
├── notifications/
├── publish/
├── saved/
├── search/
├── settings/
├── trending/
├── workspace/
└── feed/
```

The root route `/` represents the public landing experience.

The authenticated Research Feed uses `/feed`.

Some legacy/internal routes may remain in the codebase for compatibility while the user-facing navigation has been consolidated.

---

# Project Structure

The main project structure is organized around the Next.js App Router, reusable components, hooks, and application utilities. The repository currently contains dedicated application routes for collections, discovery, network, notifications, publishing, search, settings, trending, and workspace functionality.

A simplified structure is:

```text
final-year-/
│
├── app/
│   ├── api/
│   ├── collections/
│   ├── discover/
│   ├── network/
│   ├── notifications/
│   ├── publish/
│   ├── saved/
│   ├── search/
│   ├── settings/
│   ├── trending/
│   ├── workspace/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── views/
│   │   ├── CollectionsView.tsx
│   │   ├── DiscoverView.tsx
│   │   ├── FeedView.tsx
│   │   ├── NetworkView.tsx
│   │   ├── NotificationsView.tsx
│   │   ├── PublishView.tsx
│   │   ├── SavedPapersView.tsx
│   │   ├── SearchView.tsx
│   │   ├── SettingsView.tsx
│   │   ├── TrendingView.tsx
│   │   └── WorkspaceView.tsx
│   │
│   ├── AIPreReviewPanel.tsx
│   ├── AddToCollectionModal.tsx
│   ├── CiteModal.tsx
│   ├── ClientShell.tsx
│   ├── Navbar.tsx
│   ├── NewManuscriptModal.tsx
│   ├── NewPostModal.tsx
│   ├── NewProjectModal.tsx
│   ├── PaperCard.tsx
│   ├── PaperDetailModal.tsx
│   ├── Sidebar.tsx
│   └── VerificationModal.tsx
│
├── hooks/
│
├── lib/
│   ├── gemini.ts
│   ├── mock-data.ts
│   ├── platform-store.ts
│   └── utils.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind configuration
├── tsconfig.json
└── README.md
```

The repository currently uses dedicated reusable components for paper cards, collection modals, citation functionality, navigation, AI pre-review, project/manuscript creation, and application views.

The shared application utilities currently include Gemini integration, mock research data, platform state management, and utility functions.

---

# Technology Stack

## Frontend

* **Next.js 15**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Motion**
* **Lucide React**
* **React Markdown**
* **Recharts**

The repository currently defines Next.js 15, React 19, Motion, Lucide React, Recharts, React Markdown, Tailwind CSS, TypeScript, and Google GenAI dependencies.

## AI

* Google Gemini
* `@google/genai`

AI functionality is used for research-oriented intelligence and analysis workflows.

## Authentication

* Clerk

Clerk provides:

* Sign up
* Sign in
* Sign out
* Authenticated user state
* Protected application routes
* User identity

## Styling

The application uses a research/editorial visual language built around:

* Warm off-white backgrounds
* Dark typography
* Serif headings
* Sans-serif interface text
* Coral/orange accent colors
* Thin borders
* Rounded cards
* Subtle motion
* Minimal visual noise

---

# Design Philosophy

The interface is intentionally not designed like a traditional academic database.

The design combines:

```text
Editorial UI
+
Research tooling
+
AI assistance
+
Social discovery
```

The goal is to make the application feel closer to a modern research workspace than a collection of forms and tables.

Important principles:

### Minimal visual noise

Research interfaces can become overwhelming quickly.

The application avoids unnecessary controls and static information wherever possible.

### Information hierarchy

Important research information should be immediately visible.

Secondary information should remain available without dominating the interface.

### Contextual personalization

The platform should increasingly adapt to the user's research behavior.

### Consistent interactions

Search, saving, collections, researcher profiles, and AI intelligence should feel like parts of the same platform.

---

# Local Development

## Prerequisites

Install:

* Node.js
* npm

The repository's current setup uses standard Next.js development commands.

---

## Clone the repository

```bash
git clone https://github.com/yourname442005/final-year-.git
cd final-year-
```

---

## Install dependencies

```bash
npm install
```

---

## Environment variables

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env.local`.

The existing repository also contains `.env.example` for environment configuration.

---

## Start development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Available Scripts

The project currently defines the following npm scripts:

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production build

```bash
npm run build
```

Creates a production build.

### Production server

```bash
npm run start
```

Starts the production build.

### Lint

```bash
npm run lint
```

Runs ESLint.

### Clean

```bash
npm run clean
```

Runs the project's Next.js cleanup command.

---

# Production Build

Before deploying:

```bash
npm install
npm run lint
npm run build
npm run start
```

Verify:

* Authentication works
* Protected routes work
* Search works
* Paper discovery works
* Collections work
* Saving works
* Research Feed works
* Suggested researchers work
* Dynamic research suggestions work
* AI functionality works
* No runtime errors appear in the browser console

---

# Environment and Security

Never commit credentials.

The following files should remain local:

```text
.env
.env.local
.env.production.local
.env.development.local
```

Never place secrets directly inside:

* React components
* TypeScript files
* GitHub commits
* README files
* client-side environment variables unless they are explicitly designed to be public

In particular:

```text
CLERK_SECRET_KEY
GEMINI_API_KEY
```

must never be exposed publicly.

The Clerk publishable key is intended for client configuration, while the Clerk secret key is server-side.

If a secret is accidentally exposed, rotate it immediately.

---

# State and Data

The project currently contains a platform store and mock research data layer.

Relevant shared logic includes:

```text
lib/platform-store.ts
lib/mock-data.ts
lib/gemini.ts
lib/utils.ts
```

The platform store is used to coordinate application-level researcher and research state.

Mock data provides development/demo content where a full production backend is not yet connected.

This architecture allows the frontend and product experience to be developed independently while backend services can be connected progressively.

---

# Researcher Interaction Model

A researcher is treated as more than an authentication identity.

The platform can associate a user with:

* Profile
* Research field
* Institution
* Research interests
* Search behavior
* Saved papers
* Collections
* Follow relationships
* Research activity
* Workspace content

This enables the application to gradually move from generic research tooling toward personalized research intelligence.

---

# Research Discovery Model

The platform has multiple discovery mechanisms, each with a different purpose.

```text
Paper Discovery
    ↓
Discover papers broadly

Semantic Search
    ↓
Search based on research intent

Dynamic Suggestions
    ↓
Discover what to search next

Research Feed
    ↓
Discover research activity and researchers

Trending
    ↓
Discover broadly active research

Collections
    ↓
Return to saved research
```

These should not be treated as duplicate features.

Each exists for a different stage of the research workflow.

---

# Collections Model

The unified research library follows:

```text
Research Paper
      │
      ↓
    Save
      │
      ↓
Collections
      │
      ├── All Saved
      │
      ├── Research Category
      │
      ├── Research Category
      │
      └── User Collection
```

This eliminates the unnecessary separation between:

```text
Saved Papers
```

and:

```text
Collections
```

The user saves once and manages the saved research through Collections.

---

# Navigation Model

The platform separates public and authenticated navigation.

## Public

```text
/
```

Landing page.

## Authenticated

```text
/feed
/search
/discover
/collections
/network
/notifications
/publish
/settings
/trending
/workspace
```

Navigation should always respect the distinction between the public landing experience and the authenticated research platform.

The Research Feed should route to:

```text
/feed
```

rather than `/`.

---

# UI/UX Changes Implemented

The current platform includes several deliberate product refinements.

## Research Feed

* Removed the Networks navigation item from the sidebar.
* Added Suggested for you functionality.
* Added researcher profile navigation.
* Added direct Follow actions.
* Added See all researcher discovery.
* Preserved the existing Research Feed design.

## Paper Discovery

* Removed the large static Discipline/Tag section.
* Preserved paper discovery.
* Preserved sorting.
* Preserved Open Access filtering.
* Preserved Grid/List views.

## Semantic Search

* Added dynamic research suggestions.
* Suggestions use available research/user signals.
* Suggestions can adapt to search behavior.
* Suggestions can be clicked to execute a search.
* Static generic tag lists are avoided.

## Collections

* Merged Saved Papers and Collections.
* Removed Saved Papers as a separate primary navigation concept.
* Preserved Save functionality where papers are discovered.
* Removed redundant Save buttons from papers already inside Collections.
* Added All Saved as the unified saved-paper view.
* Preserved research collection organization.
* Refined the Collections page layout and bottom-page composition.

## Authentication

* Integrated Clerk authentication.
* Connected landing-page authentication entry points.
* Connected authenticated application routing.
* Preserved the existing visual UI rather than replacing it with default authentication UI.

---

# Development Principles

When extending this project, follow these rules.

### Reuse existing components

Before creating a new component, check whether an existing component already solves the problem.

### Avoid unnecessary dependencies

Do not install a library for functionality that can be implemented using the current stack.

### Preserve the visual system

New functionality should look like it belongs to suiiiiii.

### Do not redesign working pages unnecessarily

If a feature can be added without changing an existing page's structure, prefer that approach.

### Protect existing state

Do not introduce duplicate sources of truth for:

* Users
* Papers
* Saves
* Collections
* Search history
* Follow relationships

### Prefer data-driven behavior

Avoid hardcoded fake personalization where real user/research data can be used.

### Keep components focused

Separate reusable UI components from page-level composition and data logic.

---

# Current Product Architecture

At a high level:

```text
                    suiiiiii
                       │
          ┌────────────┴────────────┐
          │                         │
     Public Layer             Authenticated Layer
          │                         │
     Landing Page             Research Platform
                                    │
        ┌───────────────┬───────────┼───────────────┐
        │               │           │               │
     Discovery       Search       Social         Library
        │               │           │               │
     Discover        Semantic     Feed            Collections
     Papers          Search       Network         Saved Research
        │               │           │               │
        └───────────────┴───────────┴───────────────┘
                                    │
                              AI Intelligence
                                    │
                               Gemini / AI
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                 Research       Discovery       Analysis
                 Assistance     Suggestions      Intelligence
```

---

# Future Backend Integration

The current application is structured so that backend services can be introduced progressively.

Potential production backend capabilities include:

* Persistent user profiles
* Persistent search history
* Paper indexing
* Semantic vector search
* Persistent saved papers
* Collection persistence
* Follow relationships
* Researcher recommendations
* Notification persistence
* AI processing pipelines
* Research analytics
* Manuscript storage
* Publication workflows

A future backend should preserve the existing frontend contracts rather than forcing a complete frontend rewrite.

---

# Future Improvements

Potential future improvements include:

* Production paper indexing pipeline
* Real semantic/vector search
* Personalized recommendation engine
* Persistent user research history
* Research knowledge graph
* Advanced researcher matching
* AI-powered paper comparison
* Citation graph exploration
* Research trend forecasting
* Collaborative research workspaces
* Team-based collections
* Research project collaboration
* Advanced manuscript assistance
* AI-assisted literature reviews
* Research alerts
* Browser extension for saving papers
* Citation manager integrations
* External academic database integrations

---

# Deployment

The application is a Next.js application and can be deployed using a platform that supports Next.js.

Before deployment:

1. Configure production environment variables.
2. Configure Clerk production credentials.
3. Configure Gemini production credentials.
4. Verify authentication redirect URLs.
5. Run the production build.
6. Verify protected routes.
7. Verify client/server environment separation.
8. Verify no secrets are committed.
9. Test the application in production mode.

Example:

```bash
npm run build
npm run start
```

---

# Troubleshooting

## `npm install` fails

Try:

```bash
rm -rf node_modules
npm install
```

If the lockfile is corrupted or dependencies are inconsistent, inspect the package manager and lockfile before deleting lockfiles.

Do not blindly delete `package-lock.json` or `bun.lock` unless you understand which package manager the project is using.

---

## Environment variable errors

Verify:

```text
.env.local
```

contains the required values.

Restart the development server after changing environment variables:

```bash
npm run dev
```

Environment variables are loaded when the application starts.

---

## Clerk authentication errors

Check:

* Clerk publishable key
* Clerk secret key
* Authentication redirect URLs
* Middleware/proxy configuration
* Sign-in route
* Sign-up route
* Protected route configuration

Never expose the secret key in browser code.

---

## Gemini errors

Verify:

```env
GEMINI_API_KEY=your_key
```

Then restart the development server.

Also verify that the relevant Gemini functionality is being called from the appropriate server/client boundary.

---

## Research Feed opens the landing page

The authenticated Research Feed should use:

```text
/feed
```

Check:

* Sidebar navigation
* Mobile navigation
* Brand/logo navigation
* Route configuration

The landing page is:

```text
/
```

These should remain separate.

---

## Collections and saved state problems

Check:

* Platform store
* Saved state
* Collection membership
* Paper IDs
* Existing saved-paper compatibility
* Collection filtering

Do not create a second saved-paper state system without first inspecting the existing store.

---

# Contributing

When making changes:

1. Pull the latest `main`.
2. Create a feature branch.
3. Make focused changes.
4. Run lint/build checks.
5. Test the affected routes.
6. Check responsive behavior.
7. Verify no environment files are staged.
8. Commit with a meaningful message.
9. Push the branch.
10. Open a pull request when collaboration is required.

For personal development where the repository owner intentionally wants `main` replaced, force-pushing should only be done when the consequences are understood.

---

# Git Quick Reference

Clone:

```bash
git clone https://github.com/yourname442005/final-year-.git
cd final-year-
```

Check status:

```bash
git status
```

Check branch:

```bash
git branch
```

Check remote:

```bash
git remote -v
```

Pull latest changes:

```bash
git pull origin main
```

Create a feature branch:

```bash
git checkout -b feature/my-feature
```

Stage changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Describe the change"
```

Push:

```bash
git push origin feature/my-feature
```

---

# Project Status

The project has evolved from a static UI prototype into a structured multipage research platform.

Current major areas include:

* Public landing page
* Clerk authentication
* Research Feed
* Researcher discovery
* Suggested researchers
* Semantic Search
* Dynamic research suggestions
* Paper Discovery
* AI research intelligence
* Unified Collections
* Saved research
* Research Network
* Workspace
* Publishing
* Notifications
* Trending research
* Settings

The architecture is designed to continue evolving toward a production-grade AI-native research platform.

---

# Philosophy

suiiiiii is built around one central idea:

> **Research should feel like exploration, not administration.**

The platform should help a researcher move naturally from:

```text
"What am I looking for?"
```

to:

```text
"What should I search for?"
```

to:

```text
"What does this paper actually tell me?"
```

to:

```text
"How does this connect to my research?"
```

to:

```text
"Who else is working on this?"
```

to:

```text
"Where should I keep this?"
```

to:

```text
"What should I work on next?"
```

The long-term goal is to turn those disconnected steps into one continuous research workflow.

---

## License

Add the project's intended license here before public distribution.

If this is currently a private academic/project repository, the repository owner retains control over how the source code is used and distributed.

---

## Repository

**GitHub:**
https://github.com/yourname442005/final-year-

**Main branch:** `main`

**Application:** suiiiiii

**Category:** AI-Native Research Intelligence Platform
