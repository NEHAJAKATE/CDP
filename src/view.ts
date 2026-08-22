import { findBusinessById } from './db/database.js';
import Database from 'better-sqlite3';

const db = new Database('data/cdp.db');

// Get the search term from the command line (e.g. `node view.ts "Krishna Pharma"`)
const searchTerm = process.argv[2];

if (!searchTerm) {
    console.log('Usage: npx tsx src/view.ts "business name"');
    process.exit(1);
}

// Search by name or ledgerName, case-insensitive, partial match
const stmt = db.prepare(`
  SELECT * FROM businesses
  WHERE name LIKE ? OR ledgerName LIKE ?
`);
const searchPattern = `%${searchTerm}%`;
const results = stmt.all(searchPattern, searchPattern);

if (results.length === 0) {
    console.log(`No business found matching "${searchTerm}"`);
} else {
    console.log(`Found ${results.length} matching business(es):\n`);
    for (const business of results) {
        console.log(business);
        console.log('---');
    }
}