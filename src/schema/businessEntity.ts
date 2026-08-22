export interface BusinessEntity {
  id: string;
  name: string;
  ledgerName: string;
  taxId?: string | undefined;
  currentOutstanding?: number | undefined;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | undefined;
}
