import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const { Pool } = pkg;

// Load environment variables
dotenv.config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/messaging_system',
});

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'Messaging System/backend/src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();

