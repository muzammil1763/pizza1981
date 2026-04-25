# Database Setup Instructions

## Prerequisites

1. **Install MongoDB**: Make sure you have MongoDB installed and running on your system.
   - For Windows: Download from https://www.mongodb.com/try/download/community
   - For macOS: `brew install mongodb-community`
   - For Ubuntu: Follow MongoDB installation guide

2. **Start MongoDB**: Ensure MongoDB is running on the default port (27017)
   ```bash
   # Windows (if installed as service, it should start automatically)
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

## Setup Steps

1. **Update Environment Variables**: 
   Update the `DATABASE_URL` in your `.env` file if needed:
   ```
   DATABASE_URL="mongodb://localhost:27017/pizza1981"
   ```
   
   For MongoDB Atlas (cloud), use:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/pizza1981"
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Seed the Database**:
   ```bash
   npm run db:seed
   ```

4. **Verify Setup**:
   - Start your Next.js development server: `npm run dev`
   - Navigate to `/admin/dashboard` 
   - Login with admin credentials: `admin@pizza1981.com`
   - You should see the dynamic dashboard with real data

## What the Seed Script Creates

- **1 Admin User**: admin@pizza1981.com (role: ADMIN)
- **3 Regular Users**: Sample customers with different addresses
- **6 Menu Items**: Pizzas, sides, and drinks with realistic pricing
- **20 Sample Orders**: Distributed across the last 7 days with various statuses

## Troubleshooting

- **Connection Error**: Make sure MongoDB is running and accessible
- **Permission Error**: Ensure your user has write permissions to the database
- **Port Conflict**: Check if port 27017 is available or update the connection string

## Database Schema

The Prisma schema includes:
- **Users**: Customer and admin accounts with roles
- **MenuItems**: Pizza menu with categories and pricing
- **Orders**: Customer orders with status tracking
- **OrderItems**: Individual items within each order

All models use MongoDB ObjectId for primary keys and include proper relationships.