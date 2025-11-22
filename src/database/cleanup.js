const pool = require('../config/database');

async function cleanup() {
  try {
    console.log('Starting database cleanup...');
    console.log('');

    // Check both tables
    console.log('Checking tables:');

    try {
      const usersLowerResult = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`  - "users" (lowercase): ${usersLowerResult.rows[0].count} records`);
    } catch (err) {
      console.log(`  - "users" (lowercase): does not exist`);
    }

    try {
      const usersUpperResult = await pool.query('SELECT COUNT(*) FROM "Users"');
      console.log(`  - "Users" (uppercase): ${usersUpperResult.rows[0].count} records`);
    } catch (err) {
      console.log(`  - "Users" (uppercase): does not exist`);
    }

    console.log('');
    console.log('Dropping old "users" table (if exists)...');

    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✅ Table "users" dropped successfully');

    console.log('');
    console.log('Verifying remaining tables:');
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('Tables in database:');
    result.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('');
    console.log('✅ Cleanup completed successfully!');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

cleanup();
