import type { RiskLevel } from '../schema/businessEntity.js';

export function computeRiskLevel(currentOutstanding: number | undefined): RiskLevel | undefined {
    if (currentOutstanding === undefined) {
        return undefined;
    }
    if (currentOutstanding > 250000) return 'CRITICAL';
    if (currentOutstanding > 107000) return 'HIGH';
    if (currentOutstanding > 29000) return 'MEDIUM';
    return 'LOW';
}