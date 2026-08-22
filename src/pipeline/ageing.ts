export function computeRiskLevel(currentOutstanding: number | undefined): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | undefined {
    if (currentOutstanding === undefined) {
        return undefined;
    }
    if (currentOutstanding > 250000) return 'CRITICAL';
    if (currentOutstanding > 107000) return 'HIGH';
    if (currentOutstanding > 29000) return 'MEDIUM';
    return 'LOW';
}

// TEMPORARY TEST 
console.log(computeRiskLevel(5000));    // expect LOW
console.log(computeRiskLevel(50000));   // expect MEDIUM or HIGH depending on your cutoffs
console.log(computeRiskLevel(150000));  // expect HIGH or CRITICAL
console.log(computeRiskLevel(400000));  // expect CRITICAL
console.log(computeRiskLevel(undefined)); // expect undefined