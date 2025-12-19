# FindIT 🎮

**Professional Scrim Management Platform**

![React](https://img.shields.io/badge/React-19.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)
![pnpm](https://img.shields.io/badge/pnpm-10.18-orange)

A modern web platform designed for Counter-Strike players to organize and manage their scrims (training matches). The platform enables teams to schedule matches, track FACEIT statistics, manage team members, and coordinate training sessions efficiently.

## Overview

FindIT is a comprehensive scrim management platform that enables Counter-Strike teams and players to organize training sessions, manage team rosters, track performance statistics, and coordinate matches. The platform provides an intuitive interface for scheduling scrims, viewing upcoming matches, managing team members, and accessing detailed FACEIT statistics.

## Key Features

**Multi-Team Management**: Create and manage multiple teams with detailed member information

**Scrim Scheduling**: Schedule and track upcoming scrims with map selection, time slots, and team matchups

**Team Discovery**: Search and filter teams by name and region with advanced filtering options

**FACEIT Integration**: Comprehensive FACEIT statistics including ELO, win rate, K/D ratio, and favorite maps

**Real-Time Notifications**: Get notified about new team members, upcoming scrims, and team changes

**Performance Analytics**: Detailed statistics dashboard with team and individual player metrics

**Modern UI**: Intuitive React-based interface with responsive design and dark theme

## Architecture

FindIT is built as a modern, scalable monorepo structure:

### Technology Stack

**Frontend:**

- React 19.1+ with JavaScript
- Vite 7.1 for fast development and building
- React Router DOM 7.9 for client-side routing
- CSS Modules for component-scoped styling

**Backend:**

- JSON Server for REST API simulation (development)
- Node.js for development server
- Backend API (to be implemented)

**Infrastructure:**

- pnpm workspaces for monorepo management
- ESLint for code quality
- Vite for build tooling

## Project Structure

```
Find-It/
├── apps/
│   ├── frontend/           # React frontend application
│   │   ├── src/
│   │   │   ├── assets/      # Images, icons, and static assets
│   │   │   ├── components/ # Reusable React components
│   │   │   │   ├── Navbar/         # Navigation sidebar
│   │   │   │   ├── CardScrims/     # Scrims display component
│   │   │   │   ├── TeamSearch/     # Team search and filtering
│   │   │   │   ├── CardLong/       # Long card component
│   │   │   │   ├── Bubble/         # Icon bubble component
│   │   │   │   └── ...
│   │   │   ├── pages/      # Page components
│   │   │   │   ├── dashboard/      # Main dashboard
│   │   │   │   ├── team/           # Team management
│   │   │   │   ├── other-teams/    # Team search page
│   │   │   │   ├── matchs/         # Matches history
│   │   │   │   ├── scrims/         # Scrims management
│   │   │   │   ├── notifications/  # Notifications center
│   │   │   │   ├── profil/         # User profile
│   │   │   │   └── auth/           # Authentication pages
│   │   │   ├── utils/      # Utility functions
│   │   │   └── main.jsx    # Application entry point
│   │   ├── public/         # Static files
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   └── backend/            # Backend API (to be implemented)
│       └── package.json
├── db.json                 # JSON database (json-server)
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── package.json            # Root workspace configuration
└── pnpm-lock.yaml
```

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **pnpm** 10.18.1 or higher (recommended) or npm

### Installation

**1. Clone the repository**

```bash
git clone <repository-url>
cd Find-It
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and set your PostgreSQL credentials:

- `POSTGRES_DB`: Database name (default: Find-It)
- `POSTGRES_USER`: Database user (default: keno68)
- `POSTGRES_PASSWORD`: **Set a secure password** (required)

**4. Start PostgreSQL with Docker Compose**

```bash
docker compose up -d
```

This will start PostgreSQL and Adminer (database management UI):

- PostgreSQL: `localhost:5432`
- Adminer: `http://localhost:8080`

**5. Start JSON Server** (in a separate terminal)

```bash
pnpm json-server
```

The API server will be accessible at `http://localhost:3000`

**6. Start development server** (in another terminal)

```bash
pnpm dev
```

**7. Access the application**

- Frontend: http://localhost:5173
- API: http://localhost:3000

## 🛠️ Development

### Available Scripts

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `pnpm dev`         | Start Vite development server     |
| `pnpm build`       | Build application for production  |
| `pnpm preview`     | Preview production build          |
| `pnpm lint`        | Run ESLint for code quality       |
| `pnpm json-server` | Start JSON Server API (port 3000) |

### Workspace Structure

This project uses **pnpm workspaces** for monorepo management:

- `apps/frontend` - React frontend application
- `apps/backend` - Backend API (to be implemented)

All scripts are run from the root directory and automatically target the correct workspace.

## Core Features

### Dashboard

- Overview of upcoming scrims
- Personal and team statistics
- Team members list
- Favorite statistics (preferred map, side, etc.)

### Team Management

- **My Team**: Manage your current team, view members and their statistics
- **Team Search**: Search and filter teams by name and region
- Display average FACEIT ranks
- Team member management

### Scrims

- Visualize upcoming scrims with details (map, time, teams)
- Create and manage scrim announcements
- Match history with scores

### Statistics

- Integrated FACEIT statistics (ELO, win rate, K/D, etc.)
- Statistics by favorite map
- Recent results history

### Notifications

- Real-time notifications for new members
- Alerts for upcoming scrims
- Member departure notifications

### Profile

- User profile management
- Game statistics display
- Steam and Discord integration

## Configuration

### JSON Server

The `db.json` file at the root contains all application data:

- Users
- Teams
- Scrims
- Maps
- Matches
- FACEIT Statistics
- Notifications

To modify data, edit `db.json` directly. Changes will be automatically reflected thanks to the `--watch` option.

### Environment Variables

Currently, the application uses hardcoded API endpoints. For production, consider:

- API base URL configuration
- Environment-specific settings
- API authentication tokens

## Deployment

### Production Build

Build the application:

```bash
pnpm build
```

The optimized files will be generated in the `apps/frontend/dist/` folder.

### Preview Build

Preview the production build:

```bash
pnpm preview
```

### Production Deployment

For production deployment:

1. Build the application: `pnpm build`
2. Serve the `apps/frontend/dist/` folder with a static file server (Nginx, Apache, etc.)
3. Configure API endpoints to point to your production backend
4. Set up environment variables if needed

## Design

The application features a modern design with:

- Dark theme with pink/blue gradients
- Responsive interface
- Collapsible sidebar navigation
- Smooth animations and transitions
- Professional gaming aesthetic

## Author

**kenant68**

- GitHub: [@kenant68](https://github.com/kenant68)

**Note**: This application is under active development. Some features may be in progress.
