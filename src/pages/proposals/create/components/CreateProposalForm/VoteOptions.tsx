import { PlusIcon, XmarkIcon } from '@app/assets/icons'
import { Button } from '@app/components/ui/buttons'
import { TextInput } from '@app/components/ui/inputs'
import type {
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormClearErrors,
  UseFormRegister
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { ProposalFormData } from '../../schemas/proposal.schema'

type Props = {
  fields: {
    id: string
    value: string
  }[]
  append: UseFieldArrayAppend<ProposalFormData, 'voteOptions'>
  remove: UseFieldArrayRemove
  errors: FieldErrors<ProposalFormData>
  register: UseFormRegister<ProposalFormData>
  clearErrors: UseFormClearErrors<ProposalFormData>
}

export default function VoteOptions({
  fields,
  append,
  remove,
  errors,
  register,
  clearErrors
}: Props) {
  const { t } = useTranslation()

  return (
    <section className="grid place-items-center gap-16">
      <header className="space-y-4">
        <h2>{t('create_proposal_page.vote_options')}</h2>
        <p className="text-slate-500">{t('create_proposal_page.vote_options_description')}</p>
      </header>
      {fields.map((field, index) => (
        <TextInput
          key={field.id}
          placeholder={t('create_proposal_page.vote_option', { number: index + 1 })}
          onInput={() => clearErrors(`voteOptions.${index}.value`)}
          error={
            errors.voteOptions?.[index]?.value?.message &&
            t(errors.voteOptions[index].value.message)
          }
          endIcon={
            index > 1 && (
              <button type="button" aria-label="remove" onClick={() => remove(index)}>
                <XmarkIcon className="size-18 text-gray-60" />
              </button>
            )
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register(`voteOptions.${index}.value`)}
        />
      ))}

      <Button variant="text" size="sm" onClick={() => append({ value: '' })}>
        <PlusIcon className="size-24" />
        <span>{t('create_proposal_page.add_option')}</span>
      </Button>
    </section>
  )
}
