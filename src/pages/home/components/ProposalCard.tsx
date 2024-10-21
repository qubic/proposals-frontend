import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Select } from '@app/components/ui'
import { Button } from '@app/components/ui/buttons'
import { useWalletConnect } from '@app/hooks'

type Props = {
  title: string
  details: { label: string; value: string | number }[]
  submitText?: string
}

export default function ProposalCard({ title, details, submitText = 'Submit' }: Props) {
  const { isWalletConnected } = useWalletConnect()
  const { t } = useTranslation()

  return (
    <article className="max-w-[652px] space-y-24 rounded-12 border border-primary-60 bg-primary-70 p-24">
      <header className="flex flex-col justify-between gap-24 lg:flex-row lg:items-center">
        <h1>{title}</h1>
        <Button
          variant="link"
          color="primary"
          as={Link}
          to="/something-to-test"
          size="sm"
          className="w-fit"
        >
          {t('global.learn_more')}
        </Button>
      </header>
      <dl className="grid grid-cols-2 gap-16 lg:grid-cols-3">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs text-gray-50">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {isWalletConnected && (
        <>
          <Select
            label="Select"
            className="!w-full"
            options={[
              { label: 'Mock Option 1', value: 'option-1' },
              { label: 'Mock Option 2', value: 'option-2' },
              { label: 'Mock Option 3', value: 'option-3' },
              { label: 'Mock Option 4', value: 'option-4' }
            ]}
            onSelect={(option) => {
              console.log('Selected', option)
            }}
          />
          <Button>{submitText}</Button>
        </>
      )}
    </article>
  )
}
