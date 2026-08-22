export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface BusinessEntity {
  id: string;
  name: string;
  ledgerName: string;
  taxId?: string | undefined;
  currentOutstanding?: number | undefined;
  riskLevel?: RiskLevel | undefined;
}
