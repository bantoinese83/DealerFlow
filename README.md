# DealerFlow AI

[![CI](https://github.com/bantoinese83/DealerFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/bantoinese83/DealerFlow/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%7C%20Auth%20%7C%20Realtime-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)
![Tests](https://img.shields.io/badge/tests-vitest%20%7C%20playwright-6E9F18)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![PRs](https://img.shields.io/badge/PRs-welcome-ff69b4)
\
[![Vercel Deploys](https://img.shields.io/badge/Vercel-Deploys-000000?logo=vercel)](https://vercel.com/) [![Supabase Functions](https://img.shields.io/badge/Supabase%20Functions-2%20ACTIVE-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/dashboard/project/blebzzgheqdyhnamrjpd/functions)

AI-Powered Business Development Center (BDC) automation system for automotive dealerships. Transform your lead follow-up processes with intelligent AI conversations, real-time vehicle data scraping, and seamless CRM integration.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Set up Supabase](#set-up-supabase)
  - [Run the development server](#run-the-development-server)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Edge Functions](#edge-functions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables for Production](#environment-variables-for-production)
- [Quick Links](#quick-links)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Roadmap](#roadmap)

## Features

- 🤖 **AI-Powered Conversations**: Intelligent AI agents that engage leads with personalized conversations
- 📊 **Real-time Analytics**: Comprehensive dashboards and reports for lead conversion and team performance
- 🚗 **Vehicle Data Scraping**: Automatically scrape and update vehicle inventory from multiple sources
- 🔗 **CRM Integration**: Seamless integration with CDK, Reynolds & Reynolds, and other major CRM systems
- 🔔 **Smart Alerts**: Instant notifications for qualified leads, sentiment changes, and critical events
- 🔒 **Secure & Compliant**: Enterprise-grade security with SOC 2 compliance and role-based access controls

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **UI Components**: Radix UI, Lucide React
- **State Management**: Zustand, TanStack React Query
- **Validation**: Zod
- **Testing**: Vitest, Playwright, React Testing Library
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/dealer-flow-ai.git
   cd dealer-flow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # AI Configuration
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   
   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Set up Supabase**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Start local Supabase (optional for development)
   supabase start
   
   # Apply database schema
   supabase db reset
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dealer-flow-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── ...
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   └── ...
│   ├── common/               # Shared utilities
│   │   ├── types/           # TypeScript types
│   │   ├── validation/      # Zod schemas
│   │   └── utils/           # Utility functions
│   ├── lib/                 # External library configurations
│   ├── services/            # Business logic services
│   └── tests/               # Test files
├── db/                      # Database files
│   ├── functions/          # Supabase Edge Functions
│   └── schema.sql          # Database schema
├── infra/                  # Infrastructure configuration
└── migrations/             # Database migrations
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **dealerships**: Dealership information and CRM configuration
- **profiles**: User profiles linked to Supabase Auth
- **leads**: Sales leads from various sources
- **vehicles**: Vehicle inventory data
- **conversations**: AI and human conversation history
- **ai_configs**: AI model configuration per dealership
- **alerts**: Real-time notifications and alerts

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Leads
- `GET /api/leads` - List leads with filters
- `POST /api/leads` - Create new lead
- `GET /api/leads/[id]` - Get lead details
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

### Vehicles
- `GET /api/vehicles` - List vehicles with filters
- `POST /api/vehicles` - Create new vehicle
- `POST /api/vehicles/scrape` - Trigger vehicle scraping
- `GET /api/vehicles/[id]` - Get vehicle details
- `PUT /api/vehicles/[id]` - Update vehicle

### Conversations
- `GET /api/conversations?leadId=[id]` - Get conversation history
- `POST /api/conversations` - Send message or trigger AI response

### AI Configuration
- `GET /api/ai-configs?dealershipId=[id]` - Get AI config
- `POST /api/ai-configs` - Create AI config
- `PUT /api/ai-configs` - Update AI config

### Alerts
- `GET /api/alerts` - List alerts with filters
- `PUT /api/alerts/[id]/read` - Mark alert as read

## Edge Functions

### LLM Proxy (`/functions/llm-proxy`)
Handles AI conversation generation using OpenAI or Anthropic APIs.

### Web Scraper (`/functions/web-scraper`)
Scrapes vehicle data from dealership websites and other sources.

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Supabase)
1. Create a new Supabase project
2. Run database migrations
3. Deploy Edge Functions
4. Configure RLS policies

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Quick Links

- Architecture Overview: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- OpenAPI Spec: [docs/openapi.yaml](docs/openapi.yaml)
- Supabase Config: [infra/supabase/config.toml](infra/supabase/config.toml)
- Edge Functions: [db/functions](db/functions)
- Setup Guide: [SETUP.md](SETUP.md)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@dealerflowai.com or join our Slack channel.

---

Maintained by the DealerFlow AI team. Built with Next.js, Supabase, and ❤️ for automotive dealerships.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Advanced AI model fine-tuning
- [ ] Integration with more CRM systems
- [ ] Voice call integration
- [ ] SMS automation
- [ ] Advanced lead scoring algorithms

---

Built with ❤️ for automotive dealerships