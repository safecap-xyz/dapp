import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { AccountInfo } from './AccountInfo'
import { DonateCampaign } from './DonateCampaign'

// Import ABIs are commented out since we're using sample data for now
// In a production app, we would uncomment these to fetch real data
// import CampaignFactoryABIData from '../web3/abis/CampaignFactory.json'
// import CampaignABIData from '../web3/abis/Campaign.json'

// const CampaignFactoryABI = CampaignFactoryABIData.abi
// const CampaignABI = CampaignABIData.abi

// Sample factory address from the provided data
// const FACTORY_ADDRESS = '0x1419041ec7b627bbdc1cfcccc95936c11a8db703'

interface CampaignData {
  address: string
  name: string
  description: string
  goal: string
  raised: string
  progress: number
}

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const publicClient = usePublicClient()
  // We'll use the wallet hook in the future when we implement real blockchain interactions
  const [useEnhancedComponents] = useState(false) // Toggle for enhanced components

  // Function to fetch campaign data
  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)

      // For demo purposes, we'll use the sample campaign data you provided
      // In a real app, we would fetch from the blockchain
      
      // Sample data based on your example
      const sampleCampaigns: CampaignData[] = [
        {
          address: '0x974f4fd956093b584b66c59bce04d8392e841b47', // From your sample data
          name: 'Clean Energy Initiative',
          description: 'Funding solar panel installations for underserved communities.',
          goal: '5.0',
          raised: '2.7',
          progress: 54
        },
        {
          address: '0x9876543210987654321098765432109876543210', // Example address
          name: 'Web3 Education Platform',
          description: 'Building free educational resources for blockchain technology.',
          goal: '3.5',
          raised: '1.2',
          progress: 34
        },
        {
          address: '0x974f4fd956093b584b66c59bce04d8392e841b47', // From your sample data
          name: 'test',
          description: 'test',
          goal: '1.0',
          raised: '0.0',
          progress: 0
        }
      ]

      // In a production app, we would fetch real data from the blockchain:
      // 1. Get deployed campaigns from factory
      // 2. For each campaign address, fetch details from the campaign contract
      
      /*
      // Example of how we would fetch real data:
      if (publicClient && FACTORY_ADDRESS) {
        // Get deployed campaigns from factory
        const deployedCampaigns = await publicClient.readContract({
          address: FACTORY_ADDRESS as `0x${string}`,
          abi: CampaignFactoryABI,
          functionName: 'getDeployedCampaigns'
        }) as `0x${string}`[]

        // Fetch data for each campaign
        const campaignDataPromises = deployedCampaigns.map(async (campaignAddress) => {
          try {
            // Get campaign URI
            const campaignURI = await publicClient.readContract({
              address: campaignAddress,
              abi: CampaignABI,
              functionName: 'campaignURI'
            }) as string

            // Get goal amount
            const goalAmount = await publicClient.readContract({
              address: campaignAddress,
              abi: CampaignABI,
              functionName: 'goalAmount'
            }) as bigint

            // Get total raised
            const totalRaised = await publicClient.readContract({
              address: campaignAddress,
              abi: CampaignABI,
              functionName: 'totalRaised'
            }) as bigint

            // Parse campaign metadata from URI
            let metadata = { name: 'Unknown Campaign', description: 'No description available' }
            
            if (campaignURI.startsWith('data:application/json,')) {
              const jsonString = decodeURIComponent(campaignURI.substring('data:application/json,'.length))
              metadata = JSON.parse(jsonString)
            }

            // Calculate progress percentage
            const goalEth = formatEther(goalAmount)
            const raisedEth = formatEther(totalRaised)
            const progress = goalAmount > 0n ? Number((totalRaised * 100n) / goalAmount) : 0

            return {
              address: campaignAddress,
              name: metadata.name || 'Unknown Campaign',
              description: metadata.description || 'No description available',
              goal: goalEth,
              raised: raisedEth,
              progress
            }
          } catch (err) {
            console.error(`Error fetching data for campaign ${campaignAddress}:`, err)
            return null
          }
        })

        const campaignData = (await Promise.all(campaignDataPromises)).filter(Boolean) as CampaignData[]
        setCampaigns(campaignData)
      }
      */

      setCampaigns(sampleCampaigns)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching campaigns:', err)
      setError('Failed to load campaigns. Please try again later.')
      setLoading(false)
    }
  }

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns()
  }, [publicClient])

  // Enhanced version of DonateCampaign component (placeholder for future implementation)
  const EnhancedDonateCampaign = ({ campaignAddress }: { campaignAddress: string }) => {
    return (
      <div className="bg-secondary-main/10 p-4 rounded-lg">
        <DonateCampaign campaignAddress={campaignAddress} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-secondary glow-text">Donate to Campaigns</h1>
      <p className="mb-6 text-text-primary font-primary">Browse and support campaigns by donating ETH. Connect your wallet to get started.</p>
      
      <AccountInfo />
      
      {loading ? (
        <div className="flex justify-center items-center mt-8 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-main"></div>
        </div>
      ) : error ? (
        <div className="mt-8 p-6 bg-red-500/20 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchCampaigns}
            className="mt-4 px-4 py-2 bg-secondary-main text-secondary-contrast rounded-lg hover:bg-secondary-light"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {campaigns.map((campaign, index) => (
            <div key={`${campaign.address}-${index}`} className="glass-panel p-6 rounded-lg shadow-neon border border-secondary-main/30">
              <h2 className="text-xl font-secondary font-bold mb-2 text-text-primary">{campaign.name}</h2>
              <div className="cyber-line w-full my-3"></div>
              <p className="text-text-secondary mb-4 font-primary">{campaign.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-primary font-primary">Goal:</span>
                <span className="text-secondary-light font-mono">{campaign.goal} ETH</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-text-primary font-primary">Raised:</span>
                <span className="text-secondary-light font-mono">{campaign.raised} ETH</span>
              </div>
              <div className="w-full bg-primary-dark/50 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-secondary-main h-2.5 rounded-full" 
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
              <div className="mt-4">
                {useEnhancedComponents ? 
                  <EnhancedDonateCampaign campaignAddress={campaign.address} /> : 
                  <DonateCampaign campaignAddress={campaign.address} />
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CampaignList
