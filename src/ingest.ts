import * as XLSX from 'xlsx';
import path from 'path';
import * as fs from 'fs';
import { mapPartyMasterRow } from './schema/mapper.js';
import { resolveBusiness } from './identity/resolver.js';
import { computeRiskLevel } from './pipeline/ageing.js';
import { saveBusiness } from './db/database.js';
import type { BusinessEntity } from './schema/businessEntity.js';

// STEP 1 — read party master, map every row into a BusinessEntity
const partyBuffer = fs.readFileSync(path.resolve(process.cwd(), 'data/party_master.xls'));
const partyWorkbook = XLSX.read(partyBuffer);
const partySheet = partyWorkbook.Sheets[partyWorkbook.SheetNames[0]!];
const rawPartyRows: any[] = XLSX.utils.sheet_to_json(partySheet!);
const allBusinesses: BusinessEntity[] = rawPartyRows.map(mapPartyMasterRow);

console.log(`Mapped ${allBusinesses.length} businesses from party master.`);

// STEP 2 — read outstanding ledger
const outBuffer = fs.readFileSync(path.resolve(process.cwd(), 'data/outstanding_legder.xls'));
const outWorkbook = XLSX.read(outBuffer);
const outSheet = outWorkbook.Sheets[outWorkbook.SheetNames[0]!];
const rawOutstandingRows: any[] = XLSX.utils.sheet_to_json(outSheet!);

console.log(`Read ${rawOutstandingRows.length} outstanding ledger rows.`);

// STEP 3 — resolve + ageing + save, one row at a time
let foundCount = 0, ambiguousCount = 0, notFoundCount = 0;

for (const row of rawOutstandingRows) {
    const description = String(row.Description || '').trim();
    if (!description || description === 'TOTAL') continue;

    const total = parseFloat(String(row.Total || '0').trim()) || 0;

    const result = resolveBusiness({ description }, allBusinesses);

    if (result.status === 'FOUND') {
        foundCount++;
        result.business.currentOutstanding = total;
        result.business.riskLevel = computeRiskLevel(total);
        saveBusiness(result.business);
    } else if (result.status === 'AMBIGUOUS') {
        ambiguousCount++;
    } else {
        notFoundCount++;
    }
}

console.log(`Done. FOUND=${foundCount} AMBIGUOUS=${ambiguousCount} NOT_FOUND=${notFoundCount}`);