import { useCallback, useState } from 'react'
import { Address, Abi, encodeFunctionData, createPublicClient, http, type TransactionReceipt } from 'viem'
import config from '../../config'
import CampaignFactoryABIData from '../abis/CampaignFactory.json'
import CampaignNFTABIData from '../abis/CampaignNFT.json'
import type { CampaignDetails, UserOpCall, UserOpResponse, UserOpServiceState, UserOpServiceReturn } from '../../types'

export function useUserOp(): UserOpServiceReturn {
  const [state, setState] = useState<UserOpServiceState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    userOpHash: '',
    transactionHash: '0x0000000000000000000000000000000000000000' as Address,
    error: null
  })

  const publicClient = createPublicClient({
    chain: {
      id: 11297108109,
      name: 'Base Sepolia',
      network: 'base-sepolia',
      nativeCurrency: {
        decimals: 18,
        name: 'Base Sepolia ETH',
        symbol: 'ETH'
      },
      rpcUrls: {
        default: {
          http: [config.apiBaseUrl]
        }
      }
    },
    transport: http(config.apiBaseUrl)
  })

  /**
   * Creates call data for deploying a temporary factory contract
   */
  const createTempFactoryCallData = useCallback((nftAddress: Address, ownerAddress: Address): UserOpCall => {
    return {
      to: '0x0000000000000000000000000000000000000000' as Address,
      data: encodeFunctionData({
        abi: CampaignFactoryABIData.abi as Abi,
        functionName: 'deploy',
        args: [nftAddress, ownerAddress]
      })
    }
  }, [])

  /**
   * Creates call data for deploying an NFT contract
   */
  const createNFTCallData = useCallback((factoryAddress: Address, ownerAddress: Address): UserOpCall => {
    return {
      to: '0x0000000000000000000000000000000000000000' as Address,
      data: encodeFunctionData({
        abi: CampaignNFTABIData.abi as Abi,
        functionName: 'deploy',
        args: [factoryAddress, ownerAddress]
      })
    }
  }, [])

  /**
   * Creates call data for deploying the final factory contract
   */
  const createFinalFactoryCallData = useCallback((nftAddress: Address, ownerAddress: Address): UserOpCall => {
    return {
      to: '0x0000000000000000000000000000000000000000' as Address,
      data: encodeFunctionData({
        abi: CampaignFactoryABIData.abi as Abi,
        functionName: 'deploy',
        args: [nftAddress, ownerAddress]
      })
    }
  }, [])

  /**
   * Creates call data for updating the NFT contract
   */
  const createUpdateNFTCallData = useCallback((nftAddress: Address, factoryAddress: Address): UserOpCall => {
    return {
      to: nftAddress as Address,
      data: encodeFunctionData({
        abi: CampaignNFTABIData.abi as Abi,
        functionName: 'setFactory',
        args: [factoryAddress]
      })
    }
  }, [])

  /**
   * Creates call data for creating a campaign
   */
  const createCampaignCallData = useCallback((factoryAddress: Address, ownerAddress: Address, campaignDetails: CampaignDetails): UserOpCall => {
    const { name, goal, description, duration } = campaignDetails
    return {
      to: factoryAddress as Address,
      data: encodeFunctionData({
        abi: CampaignFactoryABIData.abi as Abi,
        functionName: 'createCampaign',
        args: [ownerAddress, name, goal, description, duration]
      })
    }
  }, [])

  /**
   * Sends a UserOp to the API
   */
  const sendUserOp = useCallback(async (smartAccountAddress: Address, network: string, calls: UserOpCall[]): Promise<UserOpResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`${config.apiBaseUrl}/user-ops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smartAccountAddress,
          network,
          calls
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send UserOp')
      }

      const data = await response.json()
      setState(prev => ({ ...prev, isSuccess: true, userOpHash: data.userOpHash, transactionHash: data.transactionHash }))
      return {
        userOpHash: data.userOpHash as string,
        transactionHash: data.transactionHash as Address
      }
    } catch (err) {
      setState(prev => ({ ...prev, isError: true, error: err instanceof Error ? err : new Error('Unknown error') }))
      throw err
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  /**
   * Deploys contracts via UserOp
   */
  const deployContractsViaUserOp = useCallback(async (smartAccountAddress: Address, ownerAddress: Address, network: string, campaignDetails: CampaignDetails): Promise<UserOpResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // First, deploy the NFT contract
      const nftCall = createNFTCallData(smartAccountAddress, ownerAddress)

      // Send UserOp for NFT deployment
      const nftResponse = await sendUserOp(smartAccountAddress, network, [nftCall])

      // Wait for the transaction to confirm
      if (!nftResponse.transactionHash) {
        throw new Error('NFT deployment transaction hash not available')
      }

      // Wait for the transaction to be mined
      const nftReceipt = await publicClient.waitForTransactionReceipt({
        hash: nftResponse.transactionHash as Address
      }) as TransactionReceipt

      // Get the NFT contract address from the receipt
      const nftAddress = nftReceipt.contractAddress as Address
      if (!nftAddress) {
        throw new Error('NFT contract address not found in receipt')
      }

      // Deploy the final factory contract
      const factoryCall = createFinalFactoryCallData(nftAddress, ownerAddress)

      // Send UserOp for factory deployment
      const factoryResponse = await sendUserOp(smartAccountAddress, network, [factoryCall])

      // Wait for the transaction to confirm
      if (!factoryResponse.transactionHash) {
        throw new Error('Factory deployment transaction hash not available')
      }

      // Wait for the transaction to be mined
      const factoryReceipt = await publicClient.waitForTransactionReceipt({
        hash: factoryResponse.transactionHash as Address
      }) as TransactionReceipt

      // Get the factory contract address from the receipt
      const factoryAddress = factoryReceipt.contractAddress as Address
      if (!factoryAddress) {
        throw new Error('Factory contract address not found in receipt')
      }

      // Update the NFT contract with the factory address
      const updateCall = createUpdateNFTCallData(nftAddress, factoryAddress)

      // Send UserOp for NFT update
      const updateResponse = await sendUserOp(smartAccountAddress, network, [updateCall])

      // Wait for the transaction to confirm
      if (!updateResponse.transactionHash) {
        throw new Error('NFT update transaction hash not available')
      }

      // Create the campaign
      const campaignCall = createCampaignCallData(factoryAddress, ownerAddress, campaignDetails)

      // Send UserOp for campaign creation
      const campaignResponse = await sendUserOp(smartAccountAddress, network, [campaignCall])

      setState(prev => ({ ...prev, isSuccess: true, userOpHash: campaignResponse.userOpHash, transactionHash: campaignResponse.transactionHash }))
      return campaignResponse
    } catch (err) {
      setState(prev => ({ ...prev, isError: true, error: err instanceof Error ? err : new Error('Unknown error') }))
      throw err
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [createNFTCallData, createFinalFactoryCallData, createUpdateNFTCallData, createCampaignCallData, sendUserOp, publicClient])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      userOpHash: '',
      transactionHash: '0x0000000000000000000000000000000000000000' as Address,
      error: null
    })
  }, [])

  return {
    createTempFactoryCallData,
    createNFTCallData,
    createFinalFactoryCallData,
    createUpdateNFTCallData,
    createCampaignCallData,
    sendUserOp,
    deployContractsViaUserOp,
    reset,
    ...state
  }
}
