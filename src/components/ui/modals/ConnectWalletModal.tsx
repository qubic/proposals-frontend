import { QubicConnectLogo, XmarkIcon } from '@app/assets/icons'
import { useQubicWallet } from '@app/hooks'
import { QubicVault } from '@qubic-lib/qubic-ts-vault-library'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import Button from '../buttons/Button'
import { TextInput } from '../inputs'
import Select from '../Select'
import Modal from './Modal'

interface Account {
  publicId: string
  alias: string
}

enum ConnectMode {
  NONE = 'none',
  PRIVATE_SEED = 'private-seed',
  VAULT_FILE = 'vault-file',
  ACCOUNT_SELECT = 'account-select'
}

export default function ConnectWalletModal() {
  const { showConnectModal, toggleConnectModal } = useQubicWallet()

  const [selectedMode, setSelectedMode] = useState<ConnectMode>(ConnectMode.NONE)
  const [privateSeed, setPrivateSeed] = useState<string>('')
  const [errorMsgPrivateSeed, setErrorMsgPrivateSeed] = useState<string>('')
  const [vault] = useState<QubicVault>(new QubicVault())
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState<string>('')
  const { connectWallet, disconnectWallet, isWalletConnected } = useQubicWallet()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<number>(0)

  console.log({ showConnectModal })
  const resetAndClose = () => {
    setSelectedMode(ConnectMode.NONE)
    setPrivateSeed('')
    toggleConnectModal()
  }

  const privateKeyConnect = () => {
    connectWallet(privateSeed)
    resetAndClose()
  }

  const handleValidatePrivateKey = (event: ChangeEvent<HTMLInputElement>) => {
    const pk = event.target.value.trim()
    if (pk.length !== 55) {
      setErrorMsgPrivateSeed('Seed must be 55 characters long')
    } else if (pk.match(/[^a-z]/)) {
      setErrorMsgPrivateSeed('Seed must contain only lowercase letters')
    } else {
      setErrorMsgPrivateSeed('')
    }
    setPrivateSeed(pk)
  }

  const vaultFileConnect = async () => {
    if (!selectedFile || !password) {
      alert('Please select a file and enter a password.')
      return
    }

    const fileReader = new FileReader()

    fileReader.onload = async () => {
      try {
        await vault.importAndUnlock(true, password, null, selectedFile, true)
        setAccounts(vault.getSeeds())
        setSelectedMode(ConnectMode.ACCOUNT_SELECT)
      } catch (error) {
        console.error('Error unlocking vault:', error)
        alert('Failed to unlock the vault. Please check your password and try again.')
      }
    }

    fileReader.onerror = (error) => {
      console.error('Error reading file:', error)
      alert('Failed to read the file. Please try again.')
    }

    fileReader.readAsArrayBuffer(selectedFile)
  }

  const selectAccount = () => {
    const pkSeed = vault.revealSeed(accounts[selectedAccount].publicId)
    connectWallet(pkSeed)
    resetAndClose()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  return (
    <Modal id="connect-wallet-modal" isOpen={showConnectModal} onClose={resetAndClose}>
      <div className="relative grid w-full max-w-480 gap-16 rounded-12 border border-primary-60 bg-primary-70 p-28">
        <header className="flex justify-between">
          <QubicConnectLogo />
          <button
            type="button"
            className="absolute top-14 ltr:right-14 rtl:left-14"
            onClick={resetAndClose}
            aria-label="close-button"
          >
            <XmarkIcon className="size-20 text-gray-50" />
          </button>
        </header>

        {selectedMode === 'none' && (
          <div className="flex flex-col gap-16">
            {isWalletConnected ? (
              <Button type="button" onClick={disconnectWallet}>
                Lock Wallet
              </Button>
            ) : (
              <>
                <Button
                  className="w-full"
                  onClick={() => setSelectedMode(ConnectMode.PRIVATE_SEED)}
                >
                  Private Seed
                </Button>
                <Button className="w-full" onClick={() => setSelectedMode(ConnectMode.VAULT_FILE)}>
                  Vault File
                </Button>
                <Button disabled className="w-full">
                  MetaMask (coming soon)
                </Button>
              </>
            )}
          </div>
        )}

        {selectedMode === ConnectMode.PRIVATE_SEED && (
          <div className="grid gap-16">
            <p>Your 55 character private key (seed):</p>
            <TextInput
              value={privateSeed}
              onChange={handleValidatePrivateKey}
              error={errorMsgPrivateSeed}
            />
            <div className="mt-4 grid grid-cols-2 gap-16">
              <Button variant="outlined" onClick={() => setSelectedMode(ConnectMode.NONE)}>
                Cancel
              </Button>

              <Button onClick={privateKeyConnect}>Unlock</Button>
            </div>
          </div>
        )}

        {selectedMode === ConnectMode.VAULT_FILE && (
          <div className="grid gap-16">
            <p>Load your Qubic vault file:</p>
            <TextInput type="file" onChange={handleFileChange} />
            <TextInput
              type="password"
              placeholder="Enter password"
              onChange={handlePasswordChange}
            />
            <div className="mt-4 grid grid-cols-2 gap-16">
              <Button variant="outlined" onClick={() => setSelectedMode(ConnectMode.NONE)}>
                Cancel
              </Button>
              <Button onClick={vaultFileConnect}>Unlock</Button>
            </div>
          </div>
        )}

        {selectedMode === ConnectMode.ACCOUNT_SELECT && (
          <div className="grid gap-16">
            <p>Select an account:</p>
            <Select
              label="Select Account"
              onSelect={({ value }) => setSelectedAccount(+value)}
              options={accounts.map((account, idx) => ({
                label: account.alias,
                value: idx
              }))}
            />
            <div className="mt-4 grid grid-cols-2 gap-16">
              <Button variant="outlined" onClick={disconnectWallet}>
                Lock Wallet
              </Button>
              <Button onClick={selectAccount}>Select Account</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
