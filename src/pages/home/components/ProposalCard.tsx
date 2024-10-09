import { Button } from '@app/components/ui/buttons'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  details: { label: string; value: string | number }[]
}

export default function ProposalCard({ title, details }: Props) {
  return (
    <article className="max-w-[652px] space-y-24 rounded-12 border border-primary-60 bg-primary-70 p-24">
      <header className="flex flex-col justify-between gap-24 lg:flex-row lg:items-center">
        <h1>{title}</h1>
        <Button variant="link" color="primary" as={Link} to="/something-to-test">
          Learn more
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
    </article>
  )
}
