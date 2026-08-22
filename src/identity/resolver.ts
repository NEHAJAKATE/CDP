import type { BusinessEntity } from "../schema/businessEntity.js";

export type ResolutionResult =
    | { status: 'NOT_FOUND' }
    | { status: 'FOUND'; business: BusinessEntity; matchType: string }
    | { status: 'AMBIGUOUS'; candidates: BusinessEntity[]; matchType: string };

// Function 1 — the ledger-name-only checker (you already built and tested this correctly before)
export function findBusinessByLedgerName(
    description: string,
    allBusinesses: BusinessEntity[]
): ResolutionResult {
    const normalized = description.trim();
    const matches = allBusinesses.filter(b => b.ledgerName.trim() === normalized);

    if (matches.length === 0) {
        return { status: 'NOT_FOUND' };
    }
    if (matches.length === 1) {
        return { status: 'FOUND', business: matches[0]!, matchType: 'LEDGER_NAME' };
    }
    return { status: 'AMBIGUOUS', candidates: matches, matchType: 'LEDGER_NAME' };
}

// Function 2 — the bigger function: tries GSTIN first, falls back to Function 1
export function resolveBusiness(
    outstandingRow: { description: string; gstin?: string },
    allBusinesses: BusinessEntity[]
): ResolutionResult {

    if (outstandingRow.gstin) {
        const gstinMatches = allBusinesses.filter(b => b.taxId === outstandingRow.gstin);

        if (gstinMatches.length === 1) {
            return { status: 'FOUND', business: gstinMatches[0]!, matchType: 'CANONICAL_ID' };
        }
        if (gstinMatches.length > 1) {
            return { status: 'AMBIGUOUS', candidates: gstinMatches, matchType: 'CANONICAL_ID' };
        }
        // gstinMatches.length === 0 — deliberately no return here, we fall through below
    }

    // Fallback: no gstin at all, OR gstin matched nobody
    return findBusinessByLedgerName(outstandingRow.description, allBusinesses);
}
// TEMPORARY TEST — delete once confirmed working
const testBusinesses: BusinessEntity[] = [
    { id: 'gst:AAA', name: 'Aastha 1', ledgerName: 'AASTHA MEDICAL STORE          PRAYGRAJ', taxId: 'gst:AAA' },
    { id: 'gst:BBB', name: 'Aastha 2', ledgerName: 'AASTHA MEDICAL STORE          PRAYGRAJ', taxId: 'gst:BBB' },
    { id: 'party:krishna', name: 'Krishna Pharma', ledgerName: 'KRISHNA PHARMA', taxId: 'gst:SHARED' },
    { id: 'party:another', name: 'Another Business', ledgerName: 'ANOTHER BUSINESS', taxId: 'gst:SHARED' },
];

console.log('Test 1 — unique GSTIN match:',
    resolveBusiness({ description: 'anything, does not matter here', gstin: 'gst:AAA' }, testBusinesses)
);

console.log('Test 2 — GSTIN shared by two businesses:',
    resolveBusiness({ description: 'anything, does not matter here', gstin: 'gst:SHARED' }, testBusinesses)
);

console.log('Test 3 — no GSTIN at all, falls back to ledger name:',
    resolveBusiness({ description: 'KRISHNA PHARMA' }, testBusinesses)
);