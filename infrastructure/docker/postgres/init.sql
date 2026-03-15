-- Trishul PostgreSQL initialization
-- This runs once when the container is first created

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Set timezone
SET timezone = 'Asia/Kolkata';
