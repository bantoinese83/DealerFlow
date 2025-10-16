#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Initializing Supabase for DealerFlow AI...\n')

// Check if Supabase CLI is installed
try {
  execSync('supabase --version', { stdio: 'pipe' })
  console.log('✅ Supabase CLI is installed')
} catch (error) {
  console.error('❌ Supabase CLI is not installed. Please install it first:')
  console.error('   npm install -g supabase')
  process.exit(1)
}

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local from template...')
  const envExamplePath = path.join(process.cwd(), 'env.example')
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ Created .env.local - Please update with your Supabase credentials')
  } else {
    console.log('⚠️  env.example not found, creating basic .env.local...')
    const basicEnv = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`
    fs.writeFileSync(envPath, basicEnv)
    console.log('✅ Created basic .env.local - Please update with your credentials')
  }
} else {
  console.log('✅ .env.local already exists')
}

// Check if Supabase project is initialized
const supabaseConfigPath = path.join(process.cwd(), 'infra', 'supabase', 'config.toml')
if (fs.existsSync(supabaseConfigPath)) {
  console.log('✅ Supabase project is already initialized')
} else {
  console.log('🔧 Initializing Supabase project...')
  try {
    execSync('supabase init', { stdio: 'inherit' })
    console.log('✅ Supabase project initialized')
  } catch (error) {
    console.error('❌ Failed to initialize Supabase project:', error.message)
    process.exit(1)
  }
}

console.log('\n📋 Next steps:')
console.log('1. Update .env.local with your Supabase project credentials')
console.log('2. Run: supabase start (for local development)')
console.log('3. Run: supabase db reset (to apply schema and seed data)')
console.log('4. Run: npm run dev (to start the development server)')
console.log('\n🎉 Setup complete!')
