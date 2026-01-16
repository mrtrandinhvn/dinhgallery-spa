# DinhGallery SPA

A personal file gallery and sharing system built with React and TypeScript. This repository contains the frontend application that connects to the [DinhGallery API](https://github.com/mrtrandinhvn/dinhgallery-api).

## Features

- Gallery view with folder organization
- Pagination with load more functionality
- Media file viewing and management
- File upload capabilities
- Azure AD authentication
- Folder management (create, rename, delete)
- Share and copy file links
- Responsive Material UI design

## Tech Stack

- **React** 19.2.3 with TypeScript
- **Vite** - Build tool and dev server
- **Material UI** v7 - UI component library
- **Azure MSAL** - Authentication
- **React Router** v6 - Client-side routing
- **OpenAPI TypeScript** - Auto-generated API client

## Prerequisites

- Node.js v20 or higher
- npm or yarn package manager

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

The app will open at [http://localhost:5173](http://localhost:5173) (Vite default port).

### Building

Build the app for production:

```bash
npm run build
```

The optimized build will be output to the `dist` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run serve
```

### API Client Generation

Regenerate the API client from OpenAPI specification:

```bash
npm run generate-api
```

## Project Structure

```
src/
├── apis/           # API integration layer
├── client/         # Auto-generated OpenAPI client
├── components/     # Reusable React components
├── constants/      # Application constants
├── pages/          # Page components
├── utils.tsx       # Utility functions
└── authConfig.ts   # Azure AD authentication config
```

## Configuration

Authentication is configured through Azure MSAL. Update `src/authConfig.ts` with your Azure AD application settings.

## Related Repositories

- Backend API: [dinhgallery-api](https://github.com/mrtrandinhvn/dinhgallery-api)
