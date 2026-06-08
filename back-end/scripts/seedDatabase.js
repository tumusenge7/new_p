const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function seed() {
  const seedPath = path.join(__dirname, '..', 'schema.sql');

  if (!fs.existsSync(seedPath)) {
    console.error('schema.sql not found at:', seedPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(seedPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('Seeding PMS database from seed.sql...');
    await connection.query(sql);
    console.log('Seed completed successfully.');
    console.log('Login: admin / password123');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
