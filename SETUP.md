# Ghana Tourism App Setup Guide

## 🚀 Getting Started

This guide will help you set up the Ghana Tourism app with authentication and database functionality.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Additional Dependencies

```bash
npm install prisma @prisma/client bcryptjs @types/bcryptjs next-auth @auth/prisma-adapter zod tsx
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database (SQLite - no additional config needed)
# DATABASE_URL="file:./dev.db" (this is set in prisma/schema.prisma)
```

**Important:** Replace `your-super-secret-key-here-change-in-production` with a strong, random string.

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates SQLite file)
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

## 🗄️ Database Schema

The app includes the following models:

- **User**: Authentication and user management
- **Destination**: Tourist attractions and locations
- **Hotel**: Accommodation options
- **Booking**: Hotel reservations
- **Review**: User ratings and comments

## 🔐 Authentication

The app uses NextAuth.js with:

- **Credentials Provider**: Email/password authentication
- **JWT Strategy**: Stateless authentication
- **Role-based Access**: User and Admin roles
- **Secure Password Hashing**: bcrypt with salt rounds

## 👥 Sample Users

After running the seed script, you'll have:

- **Admin User**: `admin@ghanatourism.com` / `admin123`
- **Regular User**: `user@example.com` / `admin123`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🔍 Database Management

### View Database
```bash
npm run db:studio
```

### Reset Database
```bash
# Delete the dev.db file
rm prisma/dev.db

# Recreate and seed
npm run db:push
npm run db:seed
```

## 🚨 Troubleshooting

### Common Issues

1. **Prisma Client not generated**
   ```bash
   npm run db:generate
   ```

2. **Database connection error**
   - Ensure `.env.local` exists
   - Run `npm run db:push`

3. **Authentication not working**
   - Check `NEXTAUTH_SECRET` in `.env.local`
   - Verify `NEXTAUTH_URL` matches your dev server

4. **TypeScript errors**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
travel-app/
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── auth/              # Auth pages (signin/signup)
│   └── ...
├── components/
│   ├── providers/         # Context providers
│   ├── ui/               # UI components
│   └── UserMenu.tsx      # User authentication menu
├── lib/
│   └── db.ts             # Database connection
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data
└── types/
    └── next-auth.d.ts    # NextAuth type extensions
```

## 🎯 Next Steps

After setup, you can:

1. **Customize the database schema** in `prisma/schema.prisma`
2. **Add more authentication providers** (Google, GitHub, etc.)
3. **Implement the booking system** using the existing models
4. **Add admin functionality** for managing content
5. **Integrate payment processing** for bookings

## 🤝 Support

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database is properly seeded
4. Check that all dependencies are installed

Happy coding! 🎉
