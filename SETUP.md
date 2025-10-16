# DealerFlow AI - Setup Guide

This guide will help you set up DealerFlow AI for development and production.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

## Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd dealer-flow-ai
   npm install
   ```

2. **Initialize Supabase**
   ```bash
   npm run supabase:init
   ```

3. **Configure environment variables**
   - Update `.env.local` with your Supabase credentials
   - Add your OpenAI API key

4. **Start development**
   ```bash
   npm run dev
   ```

## Detailed Setup

### 1. Supabase Setup

#### Option A: Local Development (Recommended)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase**
   ```bash
   npm run supabase:start
   ```

3. **Apply database schema**
   ```bash
   npm run db:reset
   ```

4. **Get local credentials**
   ```bash
   npm run supabase:status
   ```
   Copy the API URL and anon key to your `.env.local`

#### Option B: Production Setup

1. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Apply database schema**
   - Copy the contents of `db/schema.sql`
   - Run it in your Supabase SQL editor

3. **Deploy Edge Functions**
   ```bash
   supabase functions deploy llm-proxy
   supabase functions deploy web-scraper
   ```

### 2. Environment Configuration

Create `.env.local` with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# CRM Integration (Optional)
CDK_API_KEY=your_cdk_api_key
REYNOLDS_API_KEY=your_reynolds_api_key

# Email/SMS Notifications (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

#### Apply Schema and Migrations

1. **Run the initial schema**
   ```sql
   -- Copy and run the contents of db/schema.sql in your Supabase SQL editor
   ```

2. **Apply RLS policies**
   ```sql
   -- Copy and run the contents of migrations/001_enable_rls_policies.sql
   ```

3. **Seed with sample data**
   ```sql
   -- Copy and run the contents of db/seed.sql
   ```

#### Verify Setup

1. **Check tables exist**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Verify RLS is enabled**
   ```sql
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

### 4. Edge Functions Setup

#### Deploy Functions

1. **LLM Proxy Function**
   ```bash
   supabase functions deploy llm-proxy
   ```

2. **Web Scraper Function**
   ```bash
   supabase functions deploy web-scraper
   ```

#### Configure Function Secrets

Set the following secrets in your Supabase dashboard:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key
supabase secrets set ANTHROPIC_API_KEY=your_anthropic_api_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Authentication Setup

#### Enable Email Authentication

1. Go to Supabase Dashboard > Authentication > Settings
2. Enable "Enable email confirmations" if desired
3. Configure email templates if needed

#### Set up Redirect URLs

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your site URL: `http://localhost:3000` (development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`

### 6. Testing the Setup

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test authentication**
   - Go to `http://localhost:3000`
   - Click "Get Started" to sign up
   - Verify you can log in and access the dashboard

3. **Test API endpoints**
   ```bash
   # Test leads API
   curl http://localhost:3000/api/leads
   
   # Test vehicles API
   curl http://localhost:3000/api/vehicles
   ```

4. **Run tests**
   ```bash
   npm run test
   npm run test:e2e
   ```

## Production Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy

2. **Environment Variables for Production**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   OPENAI_API_KEY=your_openai_key
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

### Backend (Supabase)

1. **Update redirect URLs**
   - Add production URLs to Supabase Auth settings
   - Update CORS settings if needed

2. **Deploy Edge Functions**
   ```bash
   supabase functions deploy --project-ref your-project-ref
   ```

3. **Set production secrets**
   ```bash
   supabase secrets set --project-ref your-project-ref OPENAI_API_KEY=your_key
   ```

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your Supabase URL and API keys
   - Ensure you're using the correct environment

2. **Authentication not working**
   - Verify redirect URLs are configured
   - Check that RLS policies are applied
   - Ensure user profiles are created

3. **Edge Functions not working**
   - Check function logs in Supabase dashboard
   - Verify secrets are set correctly
   - Test functions individually

4. **Database connection issues**
   - Check your Supabase project status
   - Verify network connectivity
   - Check for IP restrictions

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Open an issue in the repository

## Development Workflow

1. **Make changes to the code**
2. **Test locally with `npm run dev`**
3. **Run tests with `npm run test`**
4. **Commit and push changes**
5. **Deploy to staging/production**

## Monitoring

- **Supabase Dashboard**: Monitor database, auth, and functions
- **Vercel Dashboard**: Monitor frontend performance
- **Application Logs**: Check browser console and server logs

---

For more detailed information, see the main [README.md](README.md) file.
