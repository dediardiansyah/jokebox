// Load .env for CLI commands (typeorm CLI doesn't auto-load Next.js env)
require('dotenv').config()

const { DataSource } = require("typeorm");
const path = require("path");

// Import entity schemas
const User = require("../entities/User");
const CanvasDesign = require("../entities/CanvasDesign");
const Category = require("../entities/Category");
const Transaction = require("../entities/Transaction");

/**
 * TypeORM DataSource for CLI commands and application
 * Used by both Next.js application and TypeORM CLI
 */
const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "",
  entities: [User, CanvasDesign, Category, Transaction],
  synchronize:  process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  migrations: [path.join(__dirname, "/migrations/**/*{.js,.ts}")],
  migrationsTableName: "typeorm_migrations",
  maxQueryExecutionTime: 5000,
  poolErrorHandler: (err) => {
    console.error("Pool error:", err);
  },
});

/**
 * Initialize TypeORM DataSource
 * @returns {Promise<DataSource>}
 */
async function initializeDataSource() {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  try {
    await AppDataSource.initialize();
    console.log("✓ Database connection initialized");
  } catch (error) {
    console.error("✗ Error initializing database connection:", error);
    throw error;
  }

  return AppDataSource;
}

/**
 * Get initialized DataSource instance
 * @returns {Promise<DataSource>}
 */
async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    return initializeDataSource();
  }
  return AppDataSource;
}

// Export for TypeORM CLI
module.exports = AppDataSource;

// Also export functions for application use
module.exports.initializeDataSource = initializeDataSource;
module.exports.getDataSource = getDataSource;
