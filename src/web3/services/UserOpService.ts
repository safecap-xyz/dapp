import { useCallback, useState } from 'react'
import { type Address, encodeFunctionData } from 'viem'
import { usePublicClient } from 'wagmi'
import config from '../../config'

// Import ABIs
import CampaignFactoryABIData from '../abis/CampaignFactory.json'
import CampaignNFTABIData from '../abis/CampaignNFT.json'

// TypeScript cast to ensure type safety
const CampaignFactoryBytecode = CampaignFactoryABIData.bytecode
const CampaignNFTBytecode = CampaignNFTABIData.bytecode

export interface UserOpCall {
  to: string;
  value: string;
  data: string;
}

export interface UserOpResponse {
  userOpHash: string;
  transactionHash?: string;
}

export interface UserOpState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  userOpHash?: string;
  transactionHash?: string;
  error: Error | null;
}

export interface CampaignDetails {
  name: string;
  description: string;
  goal: string; // in ETH
  duration: string; // in days
}

const initialState: UserOpState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  userOpHash: undefined,
  transactionHash: undefined,
  error: null
}

/**
 * Hook for preparing UserOp data and sending it to the API
 */
export function useUserOp() {
  const [state, setState] = useState<UserOpState>(initialState)
  const publicClient = usePublicClient()

  /**
   * Creates call data for deploying a temporary factory contract
   */
  const createTempFactoryCallData = useCallback((nftAddress: Address, ownerAddress: Address): UserOpCall => {
    // Ensure bytecode has 0x prefix
    let bytecode = CampaignFactoryBytecode;
    if (!bytecode.startsWith('0x')) {
      bytecode = `0x${bytecode}`;
    }

    // Get only the constructor arguments encoded (without function selector)
    const encodedArgs = encodeFunctionData({
      abi: [{
        type: 'constructor',
        inputs: [
          { type: 'address', name: '_nftContract' },
          { type: 'address', name: 'initialOwner' }
        ]
      }],
      args: [nftAddress, ownerAddress]
    }).slice(10); // Remove '0x' + function selector (8 chars)

    // Combine bytecode and encoded arguments
    const data = `${bytecode}${encodedArgs}`;

    return {
      to: "0x0000000000000000000000000000000000000000", // For contract deployment, use zero address
      value: "0",
      data: data
    }
  }, [])

  /**
   * Creates call data for deploying an NFT contract
   */
  const createNFTCallData = useCallback((factoryAddress: Address, ownerAddress: Address): UserOpCall => {
    const baseURI = "ipfs://"

    // Ensure bytecode has 0x prefix
    let bytecode = CampaignNFTBytecode;
    if (!bytecode.startsWith('0x')) {
      bytecode = `0x${bytecode}`;
    }

    // Get only the constructor arguments encoded (without function selector)
    const encodedArgs = encodeFunctionData({
      abi: [{
        type: 'constructor',
        inputs: [
          { type: 'address', name: '_factoryAddress' },
          { type: 'string', name: '_baseURI' },
          { type: 'address', name: 'initialOwner' }
        ]
      }],
      args: [factoryAddress, baseURI, ownerAddress]
    }).slice(10); // Remove '0x' + function selector (8 chars)

    // Combine bytecode and encoded arguments
    const data = `${bytecode}${encodedArgs}`;

    return {
      to: "0x0000000000000000000000000000000000000000", // For contract deployment, use zero address
      value: "0",
      data: data
    }
  }, [])

  /**
   * Creates call data for deploying the final factory contract
   */
  const createFinalFactoryCallData = useCallback((nftAddress: Address, ownerAddress: Address): UserOpCall => {
    // Ensure bytecode has 0x prefix
    let bytecode = CampaignFactoryBytecode;
    if (!bytecode.startsWith('0x')) {
      bytecode = `0x${bytecode}`;
    }

    // Get only the constructor arguments encoded (without function selector)
    const encodedArgs = encodeFunctionData({
      abi: [{
        type: 'constructor',
        inputs: [
          { type: 'address', name: '_nftContract' },
          { type: 'address', name: 'initialOwner' }
        ]
      }],
      args: [nftAddress, ownerAddress]
    }).slice(10); // Remove '0x' + function selector (8 chars)

    // Combine bytecode and encoded arguments
    const data = `${bytecode}${encodedArgs}`;

    return {
      to: "0x0000000000000000000000000000000000000000", // For contract deployment, use zero address
      value: "0",
      data: data
    }
  }, [])

  /**
   * Creates call data for updating the NFT contract with the final factory address
   */
  const createUpdateNFTCallData = useCallback((nftAddress: Address, factoryAddress: Address): UserOpCall => {
    return {
      to: nftAddress,
      value: "0",
      data: encodeFunctionData({
        abi: CampaignNFTABIData.abi,
        functionName: 'updateFactoryAddress',
        args: [factoryAddress]
      })
    }
  }, [])

  /**
   * Creates call data for creating a campaign through the factory
   */
  const createCampaignCallData = useCallback((
    factoryAddress: Address,
    creatorAddress: Address,
    campaignDetails: CampaignDetails
  ): UserOpCall => {
    // Convert ETH to Wei (1 ETH = 10^18 Wei)
    const goalInEth = campaignDetails.goal || '0.1'
    const goalInWei = BigInt(Math.floor(parseFloat(goalInEth) * 1e18))

    const token = '0x0000000000000000000000000000000000000000' // Using ETH

    // Create a metadata object with all campaign details
    const metadata = {
      name: campaignDetails.name || 'Sample Campaign',
      description: campaignDetails.description || 'A sample fundraising campaign',
      duration: campaignDetails.duration || '30', // days
      createdAt: new Date().toISOString()
    }

    // Encode the metadata as a JSON string and use it as the campaign URI
    const campaignURI = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`

    return {
      to: factoryAddress,
      value: "0",
      data: encodeFunctionData({
        abi: CampaignFactoryABIData.abi,
        functionName: 'createCampaign',
        args: [creatorAddress, goalInWei, token, campaignURI]
      })
    }
  }, [])

  /**
   * Sends a UserOp to the API
   */
  const sendUserOp = useCallback(async (
    smartAccountAddress: Address,
    network: string,
    calls: UserOpCall[]
  ): Promise<UserOpResponse> => {
    setState({ ...initialState, isLoading: true })

    console.log('Preparing to send UserOp to:', smartAccountAddress);
    console.log('Network:', network);
    console.log('Calls:', JSON.stringify(calls, null, 2));

    try {
      // Ensure all data fields are properly prefixed with 0x
      const formattedCalls = calls.map(call => ({
        ...call,
        data: call.data.startsWith('0x') ? call.data : `0x${call.data}`
      }));

      console.log('Formatted calls:', JSON.stringify(formattedCalls, null, 2));

      const response = await fetch(`${config.apiBaseUrl}/api/send-user-operation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smartAccountAddress,
          network,
          calls: formattedCalls
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send user operation')
      }

      const data = await response.json()
      console.log('UserOp response:', data);

      const result = {
        userOpHash: data.userOpHash,
        transactionHash: data.transactionHash
      }

      setState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        userOpHash: result.userOpHash,
        transactionHash: result.transactionHash,
        error: null
      })

      return result
    } catch (error) {
      console.error('Error sending UserOp:', error);
      const errorMessage = error instanceof Error ? error : new Error(String(error))
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: errorMessage
      })

      throw errorMessage
    }
  }, [])

  /**
   * Helper function to deploy contracts via UserOp
   */
  const deployContractsViaUserOp = useCallback(async (
    smartAccountAddress: Address,
    ownerAddress: Address,
    network: string,
    campaignDetails: CampaignDetails
  ) => {
    setState({ ...initialState, isLoading: true })

    // We'll simulate a multi-step deployment by preparing all the call data
    // In a real implementation, we would need to perform these steps sequentially,
    // waiting for each transaction to complete before preparing the next call.

    // For this example, we'll just simulate one step of the process:
    // Deploying a single factory contract

    try {
      const zeroAddress = '0x0000000000000000000000000000000000000000' as Address

      // Prepare call data for deploying a factory contract
      const factoryCallData = createTempFactoryCallData(zeroAddress, ownerAddress)

      console.log('Smart account address:', smartAccountAddress);
      console.log('Network:', network);
      console.log('Factory call data:', factoryCallData);

      // Make sure data is properly formatted for deployment
      if (!factoryCallData.data || factoryCallData.data === '0x') {
        throw new Error('Contract bytecode is empty or malformed');
      }

      // Send the UserOp
      const result = await sendUserOp(smartAccountAddress, network, [factoryCallData])

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error : new Error(String(error))
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: errorMessage
      })

      throw errorMessage
    }
  }, [createTempFactoryCallData, sendUserOp])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  interface UserOpServiceReturn {
    createNFTCallData: (factoryAddress: Address, ownerAddress: Address) => UserOpCall
    createFinalFactoryCallData: (nftAddress: Address, ownerAddress: Address) => UserOpCall
    createUpdateNFTCallData: (nftAddress: Address, factoryAddress: Address) => UserOpCall
    createCampaignCallData: (factoryAddress: Address, creatorAddress: Address, campaignDetails: CampaignDetails) => UserOpCall
    sendUserOp: (smartAccountAddress: Address, network: string, calls: UserOpCall[]) => Promise<UserOpResponse>
    deployContractsViaUserOp: (smartAccountAddress: Address, ownerAddress: Address, network: string, campaignDetails: CampaignDetails) => Promise<UserOpResponse>
    reset: () => void
  }

  return {
    ...state,
    createNFTCallData,
    createFinalFactoryCallData,
    createUpdateNFTCallData,
    createCampaignCallData,
    sendUserOp,
    deployContractsViaUserOp,
    reset
  } as UserOpServiceReturn
}
