# TypeORM Structure - Best Practices

## Architecture Overview

The application follows a clean, layered architecture pattern with TypeORM:

```
src/
├── entities/              # TypeORM EntitySchema definitions
│   ├── User.js
│   ├── CanvasDesign.js
│   ├── Category.js
│   ├── Transaction.js
│   └── index.js
├── database/              # Database connection & initialization
│   ├── index.js          # Main export
│   ├── datasource.js     # DataSource configuration & initialization
│   └── migrations/       # TypeORM migrations
│       └── 1732800000000-CreateInitialSchema.js
├── services/              # Business logic layer (Service Pattern)
│   ├── CanvasDesignService.js
│   ├── CategoryService.js
│   ├── TransactionService.js
│   └── index.js
├── app/
│   ├── api/              # API Route Handlers
│   │   ├── save-canvas/route.js
│   │   ├── layout/route.js
│   │   ├── transactions/route.js
│   │   └── ...
│   └── ...
└── lib/
    ├── auth.js
    └── utils.js
```

## Layer Responsibilities

### 1. **Entities** (`src/entities/`)
- Define database schema using TypeORM's EntitySchema pattern
- Pure data models without business logic
- Handle relationships between entities

### 2. **Database** (`src/database/`)
- Initialize and manage TypeORM DataSource
- Handle database connection pooling
- Store migration files
- Lazy-load connections for serverless environment (Vercel)

### 3. **Services** (`src/services/`)
- Implement business logic
- Handle data validation
- Perform database operations using repositories
- Provide clean interface for API routes
- Single responsibility principle

### 4. **API Routes** (`src/app/api/`)
- HTTP request handlers
- Use services for data operations
- Handle request validation and response formatting
- Never directly access repositories

## Service Pattern Benefits

**Before (Anti-pattern):**
```javascript
// Direct repository access in route handlers
export async function POST(req) {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(CanvasDesign);
  const design = repository.create(data);
  return repository.save(design);
}
```

**After (Best Practice):**
```javascript
// Using service layer
export async function POST(req) {
  const design = await CanvasDesignService.create(data);
  return NextResponse.json(design);
}
```

### Advantages:
- ✅ Reusable logic across multiple endpoints
- ✅ Easy to test (mock services in tests)
- ✅ Centralized business logic
- ✅ Better maintainability
- ✅ Separation of concerns

## Service Layer Usage

### CanvasDesignService
```javascript
// Get all designs
const designs = await CanvasDesignService.findAll();

// Get by ID
const design = await CanvasDesignService.findById(id);

// Create
const newDesign = await CanvasDesignService.create({
  name, data, description, image_url, price
});

// Update
const updated = await CanvasDesignService.update(id, { name, price });

// Delete (soft delete)
await CanvasDesignService.delete(id);

// Get by category
const designs = await CanvasDesignService.findByCategory(categoryId);
```

### CategoryService
```javascript
const categories = await CategoryService.findAll();
const category = await CategoryService.findById(id);
const newCategory = await CategoryService.create(data);
const updated = await CategoryService.update(id, data);
await CategoryService.delete(id);
```

### TransactionService
```javascript
const transaction = await TransactionService.findById(id);
const transactions = await TransactionService.findByDesign(designId);
const newTx = await TransactionService.create(data);
const updated = await TransactionService.update(id, data);
await TransactionService.updateStatus(id, 'success');
const pending = await TransactionService.findByStatus('pending');
```

## Database Connection

### DataSource Initialization
```javascript
const { initializeDataSource, getDataSource } = require('@/database');

// Automatic initialization on first call
const dataSource = await getDataSource();
```

### Features
- ✅ Lazy initialization (only when needed)
- ✅ Connection pooling for serverless
- ✅ SSL support for production (Neon Postgres)
- ✅ Automatic migration running
- ✅ Development logging enabled
- ✅ Error handling and pool monitoring

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
NODE_ENV=production
```

## Running Migrations

```bash
# Run pending migrations
npm run db:migrate

# Revert last migration
npm run db:revert

# Generate migration from schema changes
npm run db:generate -- MigrationName
```

## Best Practices Applied

1. **Dependency Injection**: Services receive DataSource through methods
2. **Singleton Pattern**: Services are singleton instances
3. **Repository Pattern**: Services use repositories for data access
4. **Separation of Concerns**: Clear layer boundaries
5. **DRY Principle**: Reusable service methods
6. **Error Handling**: Proper error propagation
7. **Documentation**: JSDoc comments on public methods
8. **Naming Conventions**: Clear, descriptive names
9. **Soft Deletes**: Using `is_active` flag instead of hard deletes
10. **Timestamps**: Automatic `created_at`/`updatedAt` tracking

## Migration Guide

When updating existing code to use new services:

### Old way:
```javascript
const repository = dataSource.getRepository(CanvasDesign);
const designs = await repository.find({ where: { is_active: true } });
```

### New way:
```javascript
const designs = await CanvasDesignService.findAll();
```

All routes have been updated to use the new service layer. Existing endpoints work without changes.

## Adding New Entities

1. Create entity in `src/entities/NewEntity.js`
2. Add to `src/entities/index.js` exports
3. Create service in `src/services/NewEntityService.js`
4. Add to `src/services/index.js` exports
5. Create migration: `npm run db:generate -- AddNewEntity`
6. Use service in API routes

## Performance Tips

- Services cache repositories (no recreation per call)
- Use `relations` parameter to load related data efficiently
- Create indexes on frequently queried fields (done in migrations)
- Use QueryBuilder for complex queries (see `findByCategory` example)

## Deployment (Vercel)

The setup is optimized for Vercel serverless:
- DataSource lazy-initialized per request
- Connection pooling enabled
- SSL support for Neon Postgres
- Migrations run on deployment
- No TypeScript overhead (pure JavaScript)
