/* eslint-disable react/jsx-props-no-spreading -- disabling rule for register impl from reach-hook-form */
import {
  BitcoinIcon,
  CoinsIcon,
  JsonIcon,
  PlusIcon,
  PresentIcon,
  XmarkIcon
} from '@app/assets/icons'
import { Badge } from '@app/components/ui'
import { BackButton, Button } from '@app/components/ui/buttons'
import { TextInput } from '@app/components/ui/inputs'
import { ProposalType } from '@app/types/enums'
import { clsxTwMerge, pasteText } from '@app/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const ProposalTypes = {
  [ProposalType.GENERAL_PROPOSAL]: {
    icon: BitcoinIcon,
    i18nKey: 'general_proposal',
    value: ProposalType.GENERAL_PROPOSAL
  },
  [ProposalType.COMPUTOR_DONATION]: {
    icon: PresentIcon,
    i18nKey: 'computor_donation',
    value: ProposalType.COMPUTOR_DONATION
  },
  [ProposalType.CCF_FUNDING_REQUEST]: {
    icon: CoinsIcon,
    i18nKey: 'ccf_funding_proposal',
    value: ProposalType.CCF_FUNDING_REQUEST
  },
  [ProposalType.SHAREHOLDER_PROPOSAL]: {
    icon: JsonIcon,
    i18nKey: 'shareholder_proposal',
    value: ProposalType.SHAREHOLDER_PROPOSAL
  }
}

const ProposalSchema = z.object({
  proposalType: z.nativeEnum(ProposalType),
  proposalTitle: z
    .string()
    .trim()
    .min(1, 'create_proposal_page.validation.proposal_title.required')
    .min(5, 'create_proposal_page.validation.proposal_title.min_length'),
  proposalUrl: z
    .string()
    .trim()
    .min(1, 'create_proposal_page.validation.url.required')
    .url('create_proposal_page.validation.url.invalid')
    .regex(/https:\/\/github\.com\/.+/, 'create_proposal_page.validation.url.github_url')
    .transform((val) => val.trim()),
  voteOptions: z
    .array(
      z.object({
        value: z
          .string()
          .trim()
          .min(1, 'create_proposal_page.validation.vote_options.min_title_length')
          .transform((val) => val.trim())
      })
    )
    .min(2, 'create_proposal_page.validation.vote_options.min_length')
})

type ProposalFormData = z.infer<typeof ProposalSchema>

const defaultFormData: ProposalFormData = {
  proposalType: ProposalType.GENERAL_PROPOSAL,
  proposalTitle: '',
  proposalUrl: '',
  voteOptions: [{ value: '' }, { value: '' }]
}

export default function CreateProposalPage() {
  const { t } = useTranslation()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful, isSubmitted },
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm<ProposalFormData>({
    resolver: zodResolver(ProposalSchema),
    mode: 'onBlur',
    defaultValues: defaultFormData
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'voteOptions'
  })

  const selectedProposalType = watch('proposalType')

  const onSubmit = async (data: ProposalFormData) => {
    console.log('Validated Data:', data)
    try {
      await new Promise<true>((resolve) => {
        setTimeout(() => resolve(true), 5000)
      })
    } catch (error) {
      console.error(error)
    } finally {
      // setIsSubmitting(false)
    }
  }

  const handlePasteUrl = async () => {
    try {
      const text = await pasteText()
      setValue('proposalUrl', text)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error pasting from clipboard:', error)
    }
  }

  const getSubmitButtonMessage = () => {
    if (isSubmitting) {
      return t('create_proposal_page.submitting_proposal')
    }
    if (isSubmitSuccessful) {
      return t('create_proposal_page.proposal_submitted')
    }
    return t('create_proposal_page.submit_proposal')
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      setTimeout(() => {
        // maybe add a redirect or something
        reset()
      }, 5000)
    }
  }, [isSubmitSuccessful, reset])

  console.log({ isSubmitting, isSubmitSuccessful, isSubmitted })

  return (
    <form
      className="mx-auto grid max-w-[600px] place-content-center gap-32 py-40"
      onSubmit={handleSubmit(onSubmit)}
    >
      <header className="flex gap-16">
        <BackButton />
        <h1 className="text-2xl lg:text-32">{t('create_proposal_page.title')}</h1>
      </header>

      <section>
        <ul className="grid gap-16 lg:grid-flow-col">
          {Object.values(ProposalTypes).map((proposalType) => {
            const isSelected = selectedProposalType === proposalType.value

            return (
              <li
                key={proposalType.value}
                className={clsxTwMerge(
                  'rounded-12 border bg-primary-70',
                  isSelected ? 'border-primary-30' : 'border-primary-60'
                )}
              >
                <button
                  type="button"
                  onClick={() => setValue('proposalType', proposalType.value)}
                  className="flex size-full items-center gap-16 px-20 py-24 lg:grid lg:size-[138px] lg:grid-flow-row lg:place-items-center lg:gap-8 lg:px-8 lg:py-16"
                >
                  <proposalType.icon
                    className={clsxTwMerge(
                      'size-24 shrink-0 lg:size-32',
                      isSelected ? 'text-primary-30' : 'text-slate-500'
                    )}
                  />
                  <span className={isSelected ? 'text-primary-30' : 'text-white'}>
                    {t(`create_proposal_page.${proposalType.i18nKey}`)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="grid gap-16">
        <header className="space-y-4">
          <h2>{t('create_proposal_page.proposal_title')}</h2>
          <p className="text-slate-500">{t('create_proposal_page.proposal_title_description')}</p>
        </header>
        <TextInput
          {...register('proposalTitle')}
          placeholder={t('create_proposal_page.proposal_title')}
          onInput={() => clearErrors('proposalTitle')}
          error={errors.proposalTitle?.message && t(errors.proposalTitle.message)}
        />
      </section>

      <section className="grid gap-16">
        <header className="space-y-4">
          <h2>{t('create_proposal_page.url')}</h2>
          <p className="text-slate-500">{t('create_proposal_page.url_description')}</p>
        </header>
        <TextInput
          placeholder={t('create_proposal_page.url')}
          {...register('proposalUrl')}
          endIcon={
            <button type="button" aria-label="paste" onClick={handlePasteUrl}>
              <Badge variant="filled" color="primary" size="sm">
                Paste
              </Badge>
            </button>
          }
          onInput={() => clearErrors('proposalUrl')}
          error={errors.proposalUrl?.message && t(errors.proposalUrl.message)}
        />
      </section>

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
            {...register(`voteOptions.${index}.value`)}
          />
        ))}

        <Button variant="text" size="sm" onClick={() => append({ value: '' })}>
          <PlusIcon className="size-24" />
          <span>{t('create_proposal_page.add_option')}</span>
        </Button>
      </section>

      <footer>
        <Button
          variant="filled"
          className="w-full"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {getSubmitButtonMessage()}
        </Button>
      </footer>
    </form>
  )
}
