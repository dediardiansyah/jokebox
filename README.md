# Jokebox Service

A modern Next.js application with TypeORM database integration, optimized for Neon Postgres and Vercel deployment.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone and install**

   ```bash
   git clone <repository>
   cd jokebox-service
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Neon database URL:

   ```
   DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-1.neon.tech/dbname?sslmode=require
   ```

3. **Initialize database**

   ```bash
   npm run typeorm:run
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```