import type { BusinessEntity } from './businessEntity.js';

export function mapPartyMasterRow(raw: any): BusinessEntity {
  const gstin = String(raw.tin || '').trim();
  const pan = String(raw.panno || '').trim();
  const ledgerName = String(raw.ledger || '').trim();
  const name = String(raw.name || ledgerName).trim();

  // YOUR TASK: build the canonical id using this exact priority:
  // 1. if gstin exists and looks valid -> `gst:${gstin}`
  // 2. else if pan exists -> `pan:${pan}`
  // 3. else -> `party:` + ledgerName, lowercased, spaces replaced with underscores
  let id: string;

  // Indian GSTIN pattern: 15 alphanumeric characters (e.g. 27ABCDE1234F1Z5) or standard check
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
  // Indian PAN pattern: 5 uppercase letters, 4 digits, 1 uppercase letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

  if (gstin && (gstinRegex.test(gstin) || gstin.length === 15)) {
    id = `gst:${gstin}`;
  } else if (pan && (panRegex.test(pan) || pan.length === 10)) {
    id = `pan:${pan}`;
  } else {
    id = 'party:' + ledgerName.toLowerCase().replace(/ /g, '_');
  }

  return {
    id,
    name,
    ledgerName,
    taxId: gstin || undefined,
    // currentOutstanding and riskLevel are left unset for now —
    // they get filled in later, once we process the outstanding ledger
  };
}