import { Skeleton } from '@app/components/ui'
import { Button, CopyTextButton } from '@app/components/ui/buttons'
import { QRCodeCanvas } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import { ModalStep } from './connect-wallet-modal.types'

type Props = Readonly<{
  wcUri: string | null
  loading: boolean
  onModalStepChange: (step: ModalStep) => void
}>

function QrCodeSkeleton() {
  return (
    <>
      <Skeleton className="size-[300px]" />
      <Skeleton className="h-20 w-82" />
    </>
  )
}

export default function ConnectWalletStep({ wcUri, loading, onModalStepChange }: Props) {
  const handleCancel = () => onModalStepChange(ModalStep.CONNECTION_METHOD_SELECT)
  const { t } = useTranslation()

  const renderContent = () => {
    if (loading && !wcUri) {
      return <QrCodeSkeleton />
    }

    if (!loading && !wcUri) {
      return (
        <p className="text-red-500">{t('connect_wallet_modal.wallet_connection_gen_url_error')}</p>
      )
    }

    if (wcUri) {
      return (
        <>
          <QRCodeCanvas value={wcUri} size={300} className="size-200 rounded" marginSize={1} />
          <div>
            <CopyTextButton text={wcUri} className="text-sm">
              {t('connect_wallet_modal.copy_uri')}
            </CopyTextButton>
          </div>
        </>
      )
    }

    return null
  }

  return (
    <div className="grid place-items-center gap-24">
      <p> {t('connect_wallet_modal.scan_qr')}</p>
      {renderContent()}
      <Button variant="outlined" onClick={handleCancel}>
        {t('global.cancel')}
      </Button>
    </div>
  )
}
