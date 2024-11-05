import type { SessionTypes, SignClientTypes } from '@walletconnect/types'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import type { EventListener, QubicAccount } from '@app/services/wallet-connect-client'
import { WalletConnectClient } from '@app/services/wallet-connect-client'
import { useGetEpochComputorsQuery, useGetLatestStatsQuery } from '@app/store/apis/qubic-rpc.api'

export interface IWalletConnectContext {
  walletClient: WalletConnectClient | null
  session: SessionTypes.Struct | null
  wcUri: string
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  loading: boolean
  accounts: QubicAccount[]
  selectedAccount: QubicAccount | null
  setSelectedAccount: (account: QubicAccount | null) => void
  isWalletConnected: boolean
  isComputor: boolean
}

export const WalletConnectContext = createContext<IWalletConnectContext | undefined>(undefined)

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionTypes.Struct | null>(null)
  const [wcUri, setWcUri] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<QubicAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<QubicAccount | null>(null)
  const [isComputor, setIsComputor] = useState<boolean>(false)

  const walletClient = useMemo(() => new WalletConnectClient(), [])
  const isWalletConnected = useMemo(() => !!session && accounts.length > 0, [session, accounts])

  const { data: latestStats } = useGetLatestStatsQuery(undefined, { skip: !isWalletConnected })
  const { data: computors } = useGetEpochComputorsQuery(latestStats?.epoch || 0, {
    skip: !isWalletConnected || !latestStats
  })

  const connect = useCallback(async () => {
    try {
      if (!walletClient) {
        throw new Error('Wallet client not found')
      }

      setLoading(true)
      const { uri } = await walletClient.genConnectUrl()

      setWcUri(uri)

      const newSession = await walletClient.makeAprove()

      setSession(newSession)

      const requestedAccounts = await walletClient.requestAccounts()

      setAccounts(requestedAccounts)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Connection Error:', error)
    } finally {
      setWcUri('')
      setLoading(false)
    }
  }, [walletClient])

  const disconnect = useCallback(async () => {
    try {
      if (!walletClient || !session) {
        throw new Error('Wallet client or session not found')
      }

      await walletClient.disconnectWallet()

      setSession(null)
      setAccounts([])
      setSelectedAccount(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while trying to disconnect:', error)
    }
  }, [walletClient, session])

  useEffect(() => {
    const initWalletClient = async () => {
      // TODO: Check and remove not needed listeners
      const eventListeners: EventListener<SignClientTypes.Event>[] = [
        {
          event: 'proposal_expire',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('proposal_expire', payload)
          }
        },
        {
          event: 'session_authenticate',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_authenticate', payload)
          }
        },
        {
          event: 'session_delete',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_delete', payload)
          }
        },
        {
          event: 'session_event',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_event', payload)
          }
        },
        {
          event: 'session_expire',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_expire', payload)
            walletClient.clearSession('Session expired', payload)
          }
        },
        {
          event: 'session_extend',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_extend', payload)
          }
        },
        {
          event: 'session_ping',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_ping', payload)
          }
        },
        {
          event: 'session_proposal',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_proposal', payload)
          }
        },
        {
          event: 'session_request',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_request', payload)
          }
        },
        {
          event: 'session_request_expire',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_request_expire', payload)
          }
        },
        {
          event: 'session_request_sent',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_request_sent', payload)
          }
        },
        {
          event: 'session_update',
          listener: (payload) => {
            // eslint-disable-next-line no-console
            console.log('session_update', payload)
          }
        }
      ]

      await walletClient.initClient(eventListeners)

      const restoredSession = await walletClient.restoreSession()

      if (restoredSession) {
        setSession(restoredSession)
        const requestedAccounts = await walletClient.requestAccounts()
        setAccounts(requestedAccounts)
      }
    }

    initWalletClient()

    return () => {
      walletClient.removeAllListeners('proposal_expire')
      walletClient.removeAllListeners('session_authenticate')
      walletClient.removeAllListeners('session_delete')
      walletClient.removeAllListeners('session_event')
      walletClient.removeAllListeners('session_expire')
      walletClient.removeAllListeners('session_extend')
      walletClient.removeAllListeners('session_ping')
      walletClient.removeAllListeners('session_proposal')
      walletClient.removeAllListeners('session_request')
      walletClient.removeAllListeners('session_request_expire')
      walletClient.removeAllListeners('session_request_sent')
      walletClient.removeAllListeners('session_update')
    }
  }, [walletClient])

  useEffect(() => {
    if (computors && selectedAccount) {
      const isUserComputor = computors.identities.includes(selectedAccount.address)
      setIsComputor(isUserComputor)
    } else {
      setIsComputor(false)
    }
  }, [computors, selectedAccount])

  const contextValue = useMemo(
    () => ({
      walletClient,
      session,
      wcUri,
      connect,
      disconnect,
      loading,
      accounts,
      selectedAccount,
      setSelectedAccount,
      isWalletConnected,
      isComputor
    }),
    [
      walletClient,
      session,
      wcUri,
      connect,
      disconnect,
      loading,
      accounts,
      selectedAccount,
      setSelectedAccount,
      isWalletConnected,
      isComputor
    ]
  )

  return (
    <WalletConnectContext.Provider value={contextValue}>{children}</WalletConnectContext.Provider>
  )
}
