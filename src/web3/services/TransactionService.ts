import {
  type Address,
  type Hash,
  type TransactionReceipt,
  type TransactionRequest
} from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useCallback, useState } from 'react'

export interface TransactionState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  hash: Hash | undefined
  receipt: TransactionReceipt | undefined
  error: Error | null
}

const initialState: TransactionState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  hash: undefined,
  receipt: undefined,
  error: null,
}

/**
 * Hook for managing blockchain transactions
 * @returns Transaction state and utility functions
 */
export function useTransaction() {
  const [txState, setTxState] = useState<TransactionState>(initialState)

  // Initialize contract writing
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract()

  // Wait for transaction receipt
  const {
    data: receipt,
    isLoading: isWaiting,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash
  })

  // Update state based on transaction progress
  useState(() => {
    if (hash && !txState.hash) {
      setTxState(prev => ({
        ...prev,
        isLoading: true,
        hash
      }))
    }

    if (isPending && !txState.isLoading) {
      setTxState(prev => ({
        ...prev,
        isLoading: true
      }))
    }

    if (receipt && !txState.receipt) {
      setTxState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: true,
        receipt
      }))
    }

    if ((writeError || receiptError) && !txState.error) {
      setTxState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: writeError || receiptError
      }))
    }
  })

  /**
   * Send a transaction to a contract
   * @param abi Contract ABI
   * @param address Contract address
   * @param functionName Function to call
   * @param args Function arguments
   */
  const sendContractTransaction = useCallback(
    async ({ abi, address, functionName, args, value }: {
      abi: any[]
      address: Address
      functionName: string
      args?: readonly any[]
      value?: bigint
    }) => {
      setTxState(initialState)

      try {
        writeContract({
          abi,
          address,
          functionName,
          args: args || [],
          value,
        })
      } catch (error) {
        setTxState(prev => ({
          ...prev,
          isError: true,
          error: error instanceof Error ? error : new Error(String(error))
        }))
      }
    },
    [writeContract]
  )

  /**
   * Send a raw transaction
   * @param tx Transaction request object
   */
  const sendTransaction = useCallback(
    async (tx: TransactionRequest) => {
      setTxState(initialState)

      try {
        writeContract(tx as any)
      } catch (error) {
        setTxState(prev => ({
          ...prev,
          isError: true,
          error: error instanceof Error ? error : new Error(String(error))
        }))
      }
    },
    [writeContract]
  )

  /**
   * Reset the transaction state
   */
  const reset = useCallback(() => {
    setTxState(initialState)
  }, [])

  // Combined loading state from both writing and waiting
  const isLoading = isPending || isWaiting || txState.isLoading

  return {
    ...txState,
    isLoading,
    sendContractTransaction,
    sendTransaction,
    reset,
  }
}