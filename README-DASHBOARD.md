# Dynamic Admin Dashboard with Prisma & MongoDB

This project now includes a fully dynamic admin dashboard powered by Prisma ORM and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB
Make sure MongoDB is running on your system:
- **Local MongoDB**: Default connection `mongodb://localhost:27017/pizza1981`
- **MongoDB Atlas**: Update `.env` with your cloud connection string

### 3. Configure Environment
Update `.env` file:
```env
DATABASE_URL="mongodb://localhost:27017/pizza1981"
```

### 4. Generate Prisma Client & Seed Database
```bash
# Generate Prisma client
npx prisma generate

# Seed the database with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Access Admin Dashboard
- Navigate to: `http://localhost:3000/admin/dashboard`
- Login with: `admin@pizza1981.com` (created by seed script)

## 📊 Dashboard Features

### Real-time Analytics
- **Total Orders**: Live count from database
- **Total Revenue**: Calculated from all orders
- **Total Users**: Registered user count
- **Average Order Value**: Dynamic calculation
- **Menu Items**: Available products count

### Interactive Charts
- **7-Day Order Analytics**: Bar chart showing daily orders and revenue
- **Order Status Distribution**: Pie chart showing order status breakdown
- **Recent Orders**: Live list of latest orders with customer details

### Management Links
- Quick access to Orders, Users, and Menu management
- Refresh button to update dashboard data
- Real-time status indicators

## 🗄️ Database Schema

### Models
- **User**: Customer accounts with roles (USER/ADMIN)
- **MenuItem**: Pizza menu with categories and pricing
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within orders

### Key Features
- MongoDB ObjectId primary keys
- Proper relationships between models
- Enum types for roles and order status
- Timestamps for created/updated tracking

## 🔧 API Endpoints

### `/api/admin/dashboard` (GET)
Returns comprehensive dashboard data:
```json
{
  "stats": {
    "totalOrders": 20,
    "totalUsers": 4,
    "totalMenuItems": 6,
    "totalRevenue": 45000,
    "avgOrderValue": 2250
  },
  "chartData": [...],
  "ordersByStatus": [...],
  "recentOrders": [...]
}
```

## 🎯 Sample Data

The seed script creates:
- 1 Admin user (`admin@pizza1981.com`)
- 3 Sample customers
- 6 Menu items (pizzas, sides, drinks)
- 20 Sample orders (last 7 days)

## 🔒 Security Notes

- Admin access is currently checked by email
- In production, implement proper authentication
- Use environment variables for sensitive data
- Consider rate limiting for API endpoints

## 🛠️ Development Commands

```bash
# Generate Prisma client
npx prisma generate

# Seed database
npm run db:seed

# View database in Prisma Studio
npx prisma studio

# Reset database (careful!)
npx prisma db push --force-reset
```

## 📱 Responsive Design

The dashboard is fully responsive and includes:
- Mobile-friendly navigation
- Responsive grid layouts
- Touch-friendly interactions
- Loading states and error handling

## 🔄 Real-time Updates

- Dashboard data refreshes on page load
- Manual refresh button available
- Error handling with retry functionality
- Loading states for better UX

The dashboard now provides real insights into your pizza business with live data from MongoDB!