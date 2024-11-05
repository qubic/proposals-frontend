import type Client from '@walletconnect/sign-client'
import { SignClient } from '@walletconnect/sign-client'
import type { SessionTypes } from '@walletconnect/types'
import { z } from 'zod'

import { envConfig } from '@app/configs'

enum WcLocalStorageKeys {
  SESSION_TOPIC = 'sessionTopic',
  WC_ACCOUNTS = 'wc_accounts',
  WC_SELECTED_ACCOUNT = 'wc_selectedAccount'
}

enum QubicNsMethods {
  WALLET_REQUEST_ACCOUNTS = 'qubic_requestAccounts',
  QUBIC_SEND_QUBIC = 'qubic_sendQubic',
  QUBIC_SIGN_TRANSACTION = 'qubic_signTransaction',
  QUBIC_SIGN = 'qubic_sign'
}

enum WalletEvents {
  AMOUNT_CHANGED = 'amountChanged',
  TOKEN_AMOUNT_CHANGED = 'tokenAmountChanged',
  ACCOUNTS_CHANGED = 'accountsChanged'
}

const QubicAccountSchema = z.object({
  address: z.string(),
  name: z.string(),
  amount: z.number()
})

export type QubicAccount = z.infer<typeof QubicAccountSchema>

const QubicAccountArraySchema = z.array(QubicAccountSchema)

export class WalletConnectClient extends SignClient {
  private signClient: Client | null = null

  private approval: (() => Promise<SessionTypes.Struct>) | undefined

  public qubicChainId = envConfig.QUBIC_CHAIN_ID

  public connectionURL = ''

  public sessionTopic = ''

  // eslint-disable-next-line class-methods-use-this
  private log(message: string, payload?: unknown): void {
    // eslint-disable-next-line no-console
    console.log('[ WalletConnectClient ] - ', message, payload || '')
  }

  // eslint-disable-next-line class-methods-use-this
  private handleError(message: string, error: unknown): Promise<never> {
    // eslint-disable-next-line no-console
    console.error('[ WalletConnectClient ] - ', message, error)
    return Promise.reject(error)
  }

  private handleSessionConnected(sessionInfo: SessionTypes.Struct): void {
    this.sessionTopic = sessionInfo.topic
    localStorage.setItem(WcLocalStorageKeys.SESSION_TOPIC, this.sessionTopic)
    this.log('Session connected', sessionInfo)
  }

  private isSessionActive(): boolean {
    if (!this.signClient) {
      this.log('WalletConnect Client not initialized')
      return false
    }

    if (!this.sessionTopic) {
      this.log('No session topic is set')
      return false
    }

    const session = this.signClient.session.get(this.sessionTopic)
    if (session && session.expiry * 1000 > Date.now()) {
      this.log('Session is still valid')
      return true
    }

    this.clearSession('Session expired')
    return false
  }

  private async makeRequest(method: QubicNsMethods, params: object): Promise<unknown> {
    try {
      if (!this.signClient) {
        throw new Error('WalletConnect Client not initialized')
      }

      if (!this.isSessionActive()) {
        throw new Error('No active session to make a request')
      }

      const result = await this.signClient.request({
        topic: this.sessionTopic,
        chainId: this.qubicChainId,
        request: { method, params }
      })

      this.log(`Request ${method} result:`, result)
      return result
    } catch (error) {
      return this.handleError(`Failed to execute ${method}`, error)
    }
  }

  public async initClient(): Promise<Client> {
    this.log('Initializing Client...')
    try {
      this.signClient = await SignClient.init({
        projectId: envConfig.WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: envConfig.APP_TITLE,
          description: envConfig.APP_DESCRIPTION,
          url: envConfig.APP_URL,
          icons: ['src/assets/icon/logo/logo.svg']
        }
      })

      if (!this.signClient) {
        throw new Error('Failed to initialize WalletConnect Client')
      }

      this.log('Client Initialized!')

      return this.signClient
    } catch (error) {
      return this.handleError('Error initializing WalletConnect Client', error)
    }
  }

  public async restoreSession(): Promise<SessionTypes.Struct | null> {
    try {
      if (!this.signClient) {
        throw new Error('WalletConnect Client not initialized')
      }

      const storedSessionTopic = localStorage.getItem(WcLocalStorageKeys.SESSION_TOPIC)
      const sessions = this.signClient.session.getAll() || []

      if (storedSessionTopic) {
        const session = sessions.find((s) => s.topic === storedSessionTopic)
        if (session) {
          this.handleSessionConnected(session)
          return session
        }
        localStorage.removeItem(WcLocalStorageKeys.SESSION_TOPIC)
      }
      return null
    } catch (error) {
      return this.handleError('Error restoring session', error)
    }
  }

  public async genConnectUrl(): Promise<{
    uri: string
    approval: (() => Promise<SessionTypes.Struct>) | undefined
  }> {
    try {
      if (!this.signClient) {
        throw new Error('WalletConnect Client not initialized')
      }

      const { uri, approval } =
        (await this.signClient.connect({
          requiredNamespaces: {
            qubic: {
              methods: Object.values(QubicNsMethods),
              chains: [this.qubicChainId],
              events: Object.values(WalletEvents)
            }
          }
        })) || {}

      if (!uri) {
        throw new Error('Failed to generate connection URL')
      }

      this.connectionURL = uri
      this.approval = approval

      return { uri, approval }
    } catch (error) {
      return this.handleError('Error generating URL', error)
    }
  }

  public async makeAprove(): Promise<SessionTypes.Struct> {
    try {
      if (!this.signClient) {
        throw new Error('WalletConnect Client not initialized')
      }

      if (!this.approval) {
        this.log('No pending approval found')
        throw new Error('No pending approval found')
      }
      const session = await this.approval()
      this.handleSessionConnected(session)
      return session
    } catch (error) {
      return this.handleError('Approval rejected', error)
    }
  }

  public async requestAccounts(): Promise<QubicAccount[]> {
    try {
      const result = await this.makeRequest(QubicNsMethods.WALLET_REQUEST_ACCOUNTS, {})

      const validation = QubicAccountArraySchema.safeParse(result)

      if (!validation.success) {
        throw new Error('Schema validation error. Invalid account data format')
      }

      return validation.data
    } catch (error) {
      return this.handleError('Error requesting accounts', error)
    }
  }

  public clearSession(message: string, payload?: unknown): void {
    this.log(message, payload)
    this.sessionTopic = ''
    localStorage.removeItem(WcLocalStorageKeys.SESSION_TOPIC)
  }

  public async disconnectWallet(): Promise<void> {
    try {
      if (!this.signClient) {
        throw new Error('WalletConnect Client not initialized')
      }

      if (!this.sessionTopic) {
        throw new Error('No active session to disconnect')
      }

      await this.signClient.disconnect({
        topic: this.sessionTopic,
        reason: { code: 6000, message: 'User disconnected' }
      })

      this.clearSession('Session disconnected')
    } catch (error) {
      this.handleError('Error disconnecting', error)
    }
  }
}

export default WalletConnectClient
