import { TextInput } from '@app/components/ui/inputs'
import type { UseFormClearErrors, UseFormRegister } from 'react-hook-form'
import type { ProposalFormData } from '../../schemas/proposal.schema'

type Props = {
  name: keyof ProposalFormData
  label: string
  description: string
  placeholder: string
  register: UseFormRegister<ProposalFormData>
  clearErrors: UseFormClearErrors<ProposalFormData>
  error?: string
  endIcon?: React.ReactNode
}
export default function LabeledFormInput({
  label,
  description,
  error,
  register,
  clearErrors,
  placeholder,
  name,
  endIcon
}: Props) {
  return (
    <section className="grid gap-16">
      <header className="space-y-4">
        <h2>{label}</h2>
        <p className="text-slate-500">{description}</p>
      </header>
      <TextInput
        placeholder={placeholder}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register(name)}
        onInput={() => clearErrors(name)}
        endIcon={endIcon}
        error={error}
      />
    </section>
  )
}
