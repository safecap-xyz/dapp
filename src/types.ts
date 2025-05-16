import { Address } from 'viem'

export interface CampaignDetails {
  name: string
  goal: string
  description: string
  duration: number
}

export interface UserOpResponse {
  userOpHash: string
  transactionHash: Address
}

export interface UserOpServiceState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  userOpHash: string
  transactionHash: Address
  error: Error | null
}

export interface UserOpServiceReturn extends UserOpServiceState {
  createTempFactoryCallData: (nftAddress: Address, ownerAddress: Address) => UserOpCall
  createNFTCallData: (factoryAddress: Address, ownerAddress: Address) => UserOpCall
  createFinalFactoryCallData: (nftAddress: Address, ownerAddress: Address) => UserOpCall
  createUpdateNFTCallData: (nftAddress: Address, factoryAddress: Address) => UserOpCall
  createCampaignCallData: (factoryAddress: Address, ownerAddress: Address, campaignDetails: CampaignDetails) => UserOpCall
  sendUserOp: (smartAccountAddress: Address, network: string, calls: UserOpCall[]) => Promise<UserOpResponse>
  deployContractsViaUserOp: (smartAccountAddress: Address, ownerAddress: Address, network: string, campaignDetails: CampaignDetails) => Promise<UserOpResponse>
  reset: () => void
}

export interface UserOpCall {
  data: string
  to: Address
}
