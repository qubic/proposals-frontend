export enum SmartContractsIndexes {
  ComputorControlledFund = 8
}

export const SMART_CONTRACTS: Record<
  SmartContractsIndexes,
  { name: string; label: string; address: string }
> = {
  [SmartContractsIndexes.ComputorControlledFund]: {
    name: 'Computor Controller Fund',
    label: 'CCF',
    address: 'IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABXSH'
  }
} as const
