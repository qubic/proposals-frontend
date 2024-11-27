export enum FeatureFlag {
  CREATE_PROPOSALS = 'CREATE_PROPOSALS',
  VOTING = 'VOTING'
}

const FEATURE_FLAGS: Record<FeatureFlag, boolean> = {
  [FeatureFlag.CREATE_PROPOSALS]: false,
  [FeatureFlag.VOTING]: false
}

export const isFeatureEnabled = (flag: FeatureFlag): boolean => FEATURE_FLAGS[flag] || false

export const isCreateProposalsEnabled = isFeatureEnabled(FeatureFlag.CREATE_PROPOSALS)

export const isVotingEnabled = isFeatureEnabled(FeatureFlag.VOTING)

export const isConnectWalletEnabled = isCreateProposalsEnabled || isVotingEnabled
