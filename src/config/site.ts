export const siteConfig = {
  name: 'DealerFlow AI',
  description: 'AI-powered Business Development Center automation for automotive dealerships',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/dealerflowai',
    github: 'https://github.com/dealerflow/dealerflow-ai',
    docs: 'https://docs.dealerflow.ai',
    support: 'https://support.dealerflow.ai',
  },
  features: {
    ai: {
      enabled: true,
      models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      defaultModel: 'gpt-4-turbo',
      maxTokens: 4000,
      temperature: 0.7,
    },
    crm: {
      supportedTypes: ['cdk', 'reynolds', 'dealertrack', 'custom'],
      syncFrequency: {
        min: 5, // minutes
        max: 1440, // 24 hours
        default: 60, // 1 hour
      },
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      inApp: true,
    },
    analytics: {
      enabled: true,
      providers: ['google-analytics', 'mixpanel', 'posthog'],
    },
    integrations: {
      emailMarketing: ['mailchimp', 'constant-contact', 'sendgrid'],
      sms: ['twilio', 'sendgrid'],
      calendar: ['google-calendar', 'outlook'],
      socialMedia: ['facebook', 'instagram', 'twitter'],
    },
  },
  limits: {
    leads: {
      maxPerDealership: 10000,
      maxPerUser: 1000,
    },
    vehicles: {
      maxPerDealership: 50000,
      maxScrapesPerDay: 1000,
    },
    conversations: {
      maxPerLead: 1000,
      maxMessageLength: 4000,
    },
    alerts: {
      maxPerDealership: 1000,
      maxPerUser: 100,
    },
  },
  ui: {
    theme: {
      default: 'light',
      options: ['light', 'dark', 'system'],
    },
    sidebar: {
      defaultCollapsed: false,
      collapsible: true,
    },
    dashboard: {
      defaultView: 'grid',
      views: ['grid', 'list', 'table'],
    },
    pagination: {
      defaultPageSize: 10,
      pageSizes: [10, 25, 50, 100],
    },
  },
  api: {
    rateLimits: {
      leads: {
        create: 100, // per hour
        read: 1000, // per hour
        update: 200, // per hour
        delete: 50, // per hour
      },
      vehicles: {
        scrape: 100, // per hour
        read: 1000, // per hour
        update: 200, // per hour
      },
      conversations: {
        create: 500, // per hour
        read: 1000, // per hour
      },
      ai: {
        generate: 200, // per hour
        test: 50, // per hour
      },
    },
    timeouts: {
      default: 30000, // 30 seconds
      ai: 60000, // 1 minute
      scraping: 120000, // 2 minutes
      crm: 45000, // 45 seconds
    },
  },
  security: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    session: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      refreshThreshold: 24 * 60 * 60 * 1000, // 1 day
    },
    api: {
      requireAuth: true,
      requireCors: true,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
    },
  },
  monitoring: {
    enabled: true,
    providers: ['sentry', 'vercel-analytics'],
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    performance: {
      enabled: true,
      thresholds: {
        pageLoad: 3000, // 3 seconds
        apiResponse: 5000, // 5 seconds
        aiResponse: 10000, // 10 seconds
      },
    },
  },
  deployment: {
    environment: process.env.NODE_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
  },
} as const

export type SiteConfig = typeof siteConfig
