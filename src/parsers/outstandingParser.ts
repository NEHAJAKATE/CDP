import * as XLSX from 'xlsx';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'data/outstanding_legder.xls');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log('Total rows found:', rows.length);
console.log('First row looks like this:', rows[0]);
