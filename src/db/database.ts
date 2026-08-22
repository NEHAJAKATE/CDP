import Database from 'better-sqlite3';

const db = new Database('data/cdp.db');

// Create the table, only if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ledgerName TEXT NOT NULL,
    taxId TEXT,
    currentOutstanding REAL,
    riskLevel TEXT
  )
`);

console.log('Database ready at data/cdp.db');
import type { BusinessEntity } from '../schema/businessEntity.js';

export function saveBusiness(business: BusinessEntity) {
  const stmt = db.prepare(`
    INSERT INTO businesses (id, name, ledgerName, taxId, currentOutstanding, riskLevel)
    VALUES (@id, @name, @ledgerName, @taxId, @currentOutstanding, @riskLevel)
    ON CONFLICT(id) DO UPDATE SET
      name = @name,
      ledgerName = @ledgerName,
      taxId = @taxId,
      currentOutstanding = @currentOutstanding,
      riskLevel = @riskLevel
  `);
  stmt.run(business);
}

export function findBusinessById(id: string): BusinessEntity | undefined {
  const stmt = db.prepare('SELECT * FROM businesses WHERE id = ?');
  return stmt.get(id) as BusinessEntity | undefined;
}