import type { SessionTypes } from '@walletconnect/types'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { WalletConnectClient, type QubicAccount } from '@app/services/wallet-connect-client'

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
}

export const WalletConnectContext = createContext<IWalletConnectContext | undefined>(undefined)

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionTypes.Struct | null>(null)
  const [wcUri, setWcUri] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<QubicAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<QubicAccount | null>(null)

  const walletClient = useMemo(() => new WalletConnectClient(), [])
  const isWalletConnected = useMemo(() => !!session && accounts.length > 0, [session, accounts])
  // TODO: Remove the console.log
  console.log({ selectedAccount, isWalletConnected })

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
      await walletClient.initClient()

      const restoredSession = await walletClient.restoreSession()

      if (restoredSession) {
        setSession(restoredSession)
        const requestedAccounts = await walletClient.requestAccounts()
        // TODO: Remove the console.log
        console.log({ requestedAccounts })
        setAccounts(requestedAccounts)
      }
      // TODO: Check and remove the not needed listeners
      walletClient.on('proposal_expire', (payload) => {
        // eslint-disable-next-line no-console
        console.log('proposal_expire', payload)
      })
      walletClient.on('session_authenticate', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_authenticate', payload)
      })
      walletClient.on('session_delete', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_delete', payload)
      })
      walletClient.on('session_event', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_event', payload)
      })
      walletClient.on('session_expire', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_expire', payload)
        walletClient.clearSession('Session expired', payload)
      })
      walletClient.on('session_extend', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_extend', payload)
      })
      walletClient.on('session_ping', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_ping', payload)
      })
      walletClient.on('session_proposal', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_proposal', payload)
      })
      walletClient.on('session_request', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_request', payload)
      })
      walletClient.on('session_request_expire', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_request_expire', payload)
      })
      walletClient.on('session_request_sent', (payload) => {
        // eslint-disable-next-line no-console
        console.log('session_request_sent', payload)
      })
      walletClient.on('session_update', (payload) => {
        // eslint-disable-next-line no-console
        console.log('Ssession_update', payload)
      })
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
      isWalletConnected
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
      isWalletConnected
    ]
  )

  return (
    <WalletConnectContext.Provider value={contextValue}>{children}</WalletConnectContext.Provider>
  )
}
