import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

import { BackButton } from '@app/components/ui/buttons'
import { isCreateProposalsEnabled } from '@app/configs'
import { PublicRoutes } from '@app/router'
import { CreateProposalForm } from './components'

export default function CreateProposalPage() {
  const { t } = useTranslation()

  if (isCreateProposalsEnabled) {
    return <Navigate to={PublicRoutes.HOME} replace />
  }

  return (
    <div className="mx-auto grid max-w-[600px] gap-32 py-40">
      <header className="flex gap-16">
        <BackButton />
        <h1 className="text-2xl lg:text-32">{t('create_proposal_page.title')}</h1>
      </header>

      <CreateProposalForm />
    </div>
  )
}
