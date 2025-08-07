# Database Setup Guide for Cursor IDE

This guide will help you set up and connect to the PostgreSQL database for the Rudri Dave website backend.

## Prerequisites

1. **PostgreSQL** - Make sure PostgreSQL is installed on your system
2. **Node.js** - Version 14 or higher
3. **Cursor IDE** - For optimal development experience

## Setup Instructions

### 1. Install PostgreSQL

If you don't have PostgreSQL installed, follow these steps:

#### Windows:
- Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Remember the password you set for the `postgres` user during installation
- Add PostgreSQL bin directory to your PATH

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Configure Database

You can use our automated setup script:

```bash
npm run setup-db
```

This script will:
1. Check if PostgreSQL is installed
2. Prompt you for database connection details
3. Create the database if it doesn't exist
4. Update the `.env` file with your configuration

### 3. Initialize Database Schema

After configuring the database connection, initialize the schema:

```bash
npm run init-db
```

This will:
1. Create all necessary tables
2. Create an admin user
3. Set up initial data

### 4. Verify Connection

To verify that your database is properly connected:

```bash
npm run db-status
```

You can also check the database status through the API:

```
http://localhost:4000/api/db-status
```

## Database Structure

The database includes the following tables:

1. `users` - User accounts and authentication
2. `sessions` - User sessions and tokens
3. `blogs` - Blog posts
4. `papers` - Research papers
5. `settings` - Site configuration
6. `audit_logs` - Activity logging

## Connecting with Cursor IDE

Cursor IDE can connect directly to your PostgreSQL database:

1. Open Cursor IDE
2. Go to Database Explorer panel
3. Click "Add Connection"
4. Select PostgreSQL
5. Enter your connection details:
   - Host: localhost (or your DB host)
   - Port: 5432 (default)
   - Username: postgres (or your DB user)
   - Password: [your password]
   - Database: rudri_db (or your DB name)

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   sc query postgresql

   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql
   ```

2. Check your `.env` file for correct credentials

3. Make sure your firewall allows connections to port 5432

### Schema Issues

If you encounter schema-related errors:

1. Drop and recreate the database:
   ```bash
   psql -U postgres
   DROP DATABASE rudri_db;
   CREATE DATABASE rudri_db;
   \q
   ```

2. Run the initialization script again:
   ```bash
   npm run init-db
   ```

## Database Utilities

The backend includes several database utility functions:

- `db.query(text, params)` - Execute a SQL query
- `db.transaction(callback)` - Execute multiple queries in a transaction
- `db.executeFile(filePath)` - Execute a SQL file
- `db.checkConnection()` - Check database connection

For higher-level operations, use the `dbUtils.js` module:

- `getById(table, id)` - Get a record by ID
- `getAll(table, filters, limit, offset)` - Get filtered records with pagination
- `create(table, data)` - Insert a new record
- `update(table, id, data)` - Update a record
- `remove(table, id)` - Delete a record
- `count(table, filters)` - Count records
- `exists(table, filters)` - Check if records exist

## Database Migrations

The backend includes a migration system to manage database schema changes:

```bash
# Run all pending migrations
npm run migrate:up

# Check migration status
npm run migrate:status

# Create a new migration
npm run migrate:create add_new_feature
```

Migrations are stored in the `migrations` directory as SQL files. Each migration is applied only once and in order.

### How to Create a Migration

1. Run `npm run migrate:create your_migration_name`
2. Edit the generated SQL file in the `migrations` directory
3. Run `npm run migrate:up` to apply the migration

### Migration Best Practices

1. Each migration should be atomic (do one thing)
2. Migrations should be idempotent (can be run multiple times without error)
3. Use `IF NOT EXISTS` for creating tables and indexes
4. Use `DROP ... IF EXISTS` for dropping objects
5. Always test migrations in a development environment first