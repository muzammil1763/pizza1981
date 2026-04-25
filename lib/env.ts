// Environment configuration helper
export const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/pizza1981',
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
}

// Validate required environment variables
export function validateEnv() {
  const required = ['DATABASE_URL']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}