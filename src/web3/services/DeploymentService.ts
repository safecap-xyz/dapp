import { useCallback, useState } from 'react'
import { type Address, type Hash } from 'viem'
import { useWalletClient, usePublicClient } from 'wagmi'

// Import ABIs directly from JSON
// Note: Make sure these files have been properly copied over
// Use dynamic import for JSON files (works with Vite)
import CampaignFactoryABIData from '../abis/CampaignFactory.json'
import CampaignNFTABIData from '../abis/CampaignNFT.json'

// TypeScript cast to ensure type safety
const CampaignFactoryABI = CampaignFactoryABIData.abi
const CampaignFactoryBytecode = CampaignFactoryABIData.bytecode
const CampaignNFTABI = CampaignNFTABIData.abi
const CampaignNFTBytecode = CampaignNFTABIData.bytecode

export interface DeploymentState {
  isDeploying: boolean
  isSuccess: boolean
  isError: boolean
  factoryAddress?: Address
  nftAddress?: Address
  campaignAddress?: Address
  error: Error | null
  txHashes: Hash[]
  step: DeploymentStep
}

export enum DeploymentStep {
  NotStarted = 'NOT_STARTED',
  DeployingTempFactory = 'DEPLOYING_TEMP_FACTORY',
  DeployingNFT = 'DEPLOYING_NFT',
  DeployingFinalFactory = 'DEPLOYING_FINAL_FACTORY',
  UpdatingNFT = 'UPDATING_NFT',
  CreatingCampaign = 'CREATING_CAMPAIGN',
  Completed = 'COMPLETED'
}

const initialState: DeploymentState = {
  isDeploying: false,
  isSuccess: false,
  isError: false,
  factoryAddress: undefined,
  nftAddress: undefined,
  campaignAddress: undefined,
  error: null,
  txHashes: [],
  step: DeploymentStep.NotStarted
}

export interface CampaignDetails {
  name: string;
  description: string;
  goal: string; // in ETH
  duration: string; // in days
}

/**
 * Hook for handling contract deployment
 */
export function useContractDeployment() {
  const [deployState, setDeployState] = useState<DeploymentState>(initialState)
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const deployContracts = useCallback(async (campaignDetails?: CampaignDetails) => {
    if (!walletClient || !publicClient) {
      setDeployState({
        ...initialState,
        isError: true,
        error: new Error('Wallet not connected')
      })
      return
    }

    try {
      // Reset state
      setDeployState({
        ...initialState,
        isDeploying: true,
        step: DeploymentStep.DeployingTempFactory
      })

      const account = walletClient.account.address

      // Deploy temporary factory first (with zero address as NFT)
      setDeployState(prev => ({
        ...prev,
        step: DeploymentStep.DeployingTempFactory
      }))

      const tempFactoryTxHash = await walletClient.deployContract({
        abi: CampaignFactoryABI,
        bytecode: CampaignFactoryBytecode as `0x${string}`,
        args: ['0x0000000000000000000000000000000000000000', account]
      })

      // Wait for transaction receipt
      const tempFactoryReceipt = await publicClient.waitForTransactionReceipt({ 
        hash: tempFactoryTxHash 
      })

      // Get the contract address from the receipt
      if (!tempFactoryReceipt.contractAddress) {
        throw new Error('Failed to deploy temporary factory contract')
      }
      
      const tempFactoryAddress = tempFactoryReceipt.contractAddress

      // Deploy NFT contract
      setDeployState(prev => ({
        ...prev,
        txHashes: [...prev.txHashes, tempFactoryTxHash],
        step: DeploymentStep.DeployingNFT
      }))

      const baseURI = "ipfs://"
      const nftTxHash = await walletClient.deployContract({
        abi: CampaignNFTABI,
        bytecode: CampaignNFTBytecode as `0x${string}`,
        args: [tempFactoryAddress, baseURI, account]
      })

      // Wait for transaction receipt
      const nftReceipt = await publicClient.waitForTransactionReceipt({
        hash: nftTxHash
      })

      // Get the NFT contract address
      if (!nftReceipt.contractAddress) {
        throw new Error('Failed to deploy NFT contract')
      }
      
      const nftAddress = nftReceipt.contractAddress

      // Deploy final factory with NFT address
      setDeployState(prev => ({
        ...prev,
        nftAddress,
        txHashes: [...prev.txHashes, nftTxHash],
        step: DeploymentStep.DeployingFinalFactory
      }))

      const finalFactoryTxHash = await walletClient.deployContract({
        abi: CampaignFactoryABI,
        bytecode: CampaignFactoryBytecode as `0x${string}`,
        args: [nftAddress, account]
      })

      // Wait for transaction receipt
      const finalFactoryReceipt = await publicClient.waitForTransactionReceipt({
        hash: finalFactoryTxHash
      })

      // Get the final factory address
      if (!finalFactoryReceipt.contractAddress) {
        throw new Error('Failed to deploy final factory contract')
      }
      
      const finalFactoryAddress = finalFactoryReceipt.contractAddress

      // Update NFT to point to the final factory
      setDeployState(prev => ({
        ...prev,
        factoryAddress: finalFactoryAddress,
        txHashes: [...prev.txHashes, finalFactoryTxHash],
        step: DeploymentStep.UpdatingNFT
      }))

      // Call updateFactoryAddress on the NFT contract
      const updateTxHash = await walletClient.writeContract({
        address: nftAddress,
        abi: CampaignNFTABI,
        functionName: 'updateFactoryAddress',
        args: [finalFactoryAddress]
      })

      await publicClient.waitForTransactionReceipt({
        hash: updateTxHash
      })

      // Create the campaign with user-provided details
      setDeployState(prev => ({
        ...prev,
        txHashes: [...prev.txHashes, updateTxHash],
        step: DeploymentStep.CreatingCampaign
      }))

      // Convert ETH to Wei (1 ETH = 10^18 Wei)
      const goalInEth = campaignDetails?.goal || '0.1';
      const goalInWei = BigInt(Math.floor(parseFloat(goalInEth) * 1e18));
      
      const token = '0x0000000000000000000000000000000000000000' // Using ETH
      
      // Create a metadata object with all campaign details
      const metadata = {
        name: campaignDetails?.name || 'Sample Campaign',
        description: campaignDetails?.description || 'A sample fundraising campaign',
        duration: campaignDetails?.duration || '30', // days
        createdAt: new Date().toISOString()
      };
      
      // Encode the metadata as a JSON string and use it as the campaign URI
      // In a production app, you'd likely store this in IPFS
      const campaignURI = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`

      console.log("Creating a campaign with params:", {
        creator: account,
        goal: goalInWei.toString(),
        token,
        campaignURI,
        metadata
      });

      const createCampaignTxHash = await walletClient.writeContract({
        address: finalFactoryAddress,
        abi: CampaignFactoryABI,
        functionName: 'createCampaign',
        args: [account, goalInWei, token, campaignURI]
      })

      console.log("Campaign creation transaction sent:", createCampaignTxHash);

      // Wait for transaction receipt
      console.log("Waiting for transaction receipt...");
      const createCampaignReceipt = await publicClient.waitForTransactionReceipt({
        hash: createCampaignTxHash
      })

      console.log("Transaction completed with status:", createCampaignReceipt.status);

      // Get the campaign address from the logs
      console.log("Searching for campaign address in transaction logs...");
      console.log("Total logs found:", createCampaignReceipt.logs.length);
      
      // Directly extract all the data from the log
      let campaignAddress: Address | undefined;
      
      if (createCampaignReceipt.logs && createCampaignReceipt.logs.length > 0) {
        // Get the raw log data
        const log = createCampaignReceipt.logs[0];
        console.log("Raw log data:", log);
        
        // FIRST: Try to extract from topics - this is the most reliable method based on the logs
        // CampaignCreated event: third topic is typically the new campaign address
        if (log.topics && log.topics.length >= 3) {
          const thirdTopic = log.topics[2] as string;
          // Extract the address - need to take the last 40 chars to get just the address part
          const extractedAddr = `0x${thirdTopic.slice(-40)}` as Address;
          
          // Verify this looks like a valid address (not zero address)
          if (extractedAddr !== '0x0000000000000000000000000000000000000000') {
            campaignAddress = extractedAddr;
            console.log("Extracted campaign address from third topic:", campaignAddress);
          }
        }
        
        // SECOND: If that failed, try other topics
        if (!campaignAddress && log.topics && log.topics.length > 0) {
          console.log("Looking for addresses in other topics");
          for (const topic of log.topics) {
            // Extract the last 40 characters which could be an address
            const potentialAddress = '0x' + topic.substring(topic.length - 40);
            if (potentialAddress !== '0x0000000000000000000000000000000000000000' &&
                potentialAddress !== '0x0000000000000000000000000000000000000001') {
              console.log("Found potential address in topic:", potentialAddress);
              campaignAddress = potentialAddress as Address;
              break;
            }
          }
        }
        
        // LAST RESORT: If we still don't have an address, try the data field
        if (!campaignAddress && log.data && log.data.length > 66) {
          console.log("Looking for addresses in log data");
          const data = log.data;
          
          // Find all 20-byte sequences that could be addresses
          for (let i = 2; i <= data.length - 40; i += 2) {
            const potentialAddress = '0x' + data.substring(i, i + 40);
            if (potentialAddress !== '0x0000000000000000000000000000000000000000' &&
                potentialAddress !== '0x0000000000000000000000000000000000000001') {
              console.log("Found potential address in data:", potentialAddress);
              campaignAddress = potentialAddress as Address;
              break;
            }
          }
        }
      }
      
      // Extra validation for the found address
      if (campaignAddress) {
        // Make sure it's not the factory or NFT address (that would be wrong)
        if (campaignAddress === finalFactoryAddress || campaignAddress === nftAddress) {
          console.log("Warning: Found address matches factory or NFT, likely incorrect");
          campaignAddress = undefined;
        }
        
        // Warn about suspicious addresses
        if (campaignAddress === '0x0000000000000000000000000000000000000001') {
          console.log("Warning: Found suspicious address 0x01, likely invalid");
          campaignAddress = undefined;
        }
      }

      // Update state with success
      setDeployState(prev => ({
        ...prev,
        isDeploying: false,
        isSuccess: true,
        campaignAddress,
        txHashes: [...prev.txHashes, createCampaignTxHash],
        step: DeploymentStep.Completed
      }))

      return {
        factoryAddress: finalFactoryAddress,
        nftAddress,
        campaignAddress
      }
    } catch (error) {
      console.error('Deployment error:', error)
      setDeployState(prev => ({
        ...prev,
        isDeploying: false,
        isError: true,
        error: error instanceof Error ? error : new Error(String(error))
      }))
    }
  }, [walletClient, publicClient])

  const reset = useCallback(() => {
    setDeployState(initialState)
  }, [])

  return {
    ...deployState,
    deployContracts,
    reset
  }
}
