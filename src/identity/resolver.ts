import type { BusinessEntity } from "../schema/businessEntity.js";
export type ResolutionResult =
    | { status: 'NOT_FOUND' }
    | { status: 'FOUND'; business: BusinessEntity }
    | { status: 'AMBIGUOUS'; candidates: BusinessEntity[] };

export function findBusinessByLedgerName(
    description: string,
    allBusinesses: BusinessEntity[]
): ResolutionResult {
    const normalized = description.trim();
    const matches = allBusinesses.filter(b => b.ledgerName.trim() === normalized);

    if (matches.length === 0) {
        return { status: 'NOT_FOUND' };
    }
    const firstMatch = matches[0];
    if (matches.length === 1 && firstMatch) {
        return { status: 'FOUND', business: firstMatch };
    }
    // matches.length is 2 or more
    return { status: 'AMBIGUOUS', candidates: matches };
}

// TEMPORARY TEST — delete once confirmed working
const testBusinesses: BusinessEntity[] = [
    { id: 'gst:AAA', name: 'Aastha 1', ledgerName: 'AASTHA MEDICAL STORE          PRAYGRAJ' },
    { id: 'gst:BBB', name: 'Aastha 2', ledgerName: 'AASTHA MEDICAL STORE          PRAYGRAJ' },
    { id: 'party:krishna', name: 'Krishna Pharma', ledgerName: 'KRISHNA PHARMA' },
];

console.log('Ambiguous:', findBusinessByLedgerName('AASTHA MEDICAL STORE          PRAYGRAJ', testBusinesses));
console.log('Found:', findBusinessByLedgerName('KRISHNA PHARMA', testBusinesses));
console.log('Not Found:', findBusinessByLedgerName('NON EXISTENT', testBusinesses));