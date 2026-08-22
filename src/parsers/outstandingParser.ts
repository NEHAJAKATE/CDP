import * as XLSX from 'xlsx';
import path from 'path';
import * as fs from 'fs';

const filePath = path.resolve(process.cwd(), 'data/outstanding_legder.xls');
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
if (!sheetName) {
  throw new Error('This file has no sheets — cannot continue.');
}
const sheet = workbook.Sheets[sheetName];
if (!sheet) {
  throw new Error(`Sheet "${sheetName}" not found — cannot continue.`);
}
const rows = XLSX.utils.sheet_to_json(sheet);

console.log('Total rows found:', rows.length);
console.log('First row looks like this:', rows[0]);
