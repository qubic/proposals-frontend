import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Badge } from '@app/components/ui'
import { Button } from '@app/components/ui/buttons'
import { ProposalType } from '@app/types/enums'
import { pasteText } from '@app/utils'

import { ProposalSchema, type ProposalFormData } from '../../schemas/proposal.schema'
import LabeledFormInput from './LabeledFormInput'
import ProposalTypeSelector from './ProposalTypeSelector'
import VoteOptions from './VoteOptions'

const defaultFormData: ProposalFormData = {
  proposalType: ProposalType.GENERAL_PROPOSAL,
  proposalTitle: '',
  proposalUrl: '',
  voteOptions: [{ value: '' }, { value: '' }]
}

export default function CreateProposalForm() {
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

  const onSubmit = useCallback(async (data: ProposalFormData) => {
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
  }, [])

  const handlePasteUrl = useCallback(async () => {
    try {
      const text = await pasteText()
      setValue('proposalUrl', text)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error pasting from clipboard:', error)
    }
  }, [setValue])

  const getSubmitButtonMessage = useCallback(() => {
    if (isSubmitting) {
      return t('create_proposal_page.submitting_proposal')
    }
    if (isSubmitSuccessful) {
      return t('create_proposal_page.proposal_submitted')
    }
    return t('create_proposal_page.submit_proposal')
  }, [isSubmitting, isSubmitSuccessful, t])

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
    <form className="grid max-w-[600px] gap-32" onSubmit={handleSubmit(onSubmit)}>
      <ProposalTypeSelector selectedProposalType={selectedProposalType} setValue={setValue} t={t} />

      <LabeledFormInput
        name="proposalTitle"
        label={t('create_proposal_page.proposal_title')}
        description={t('create_proposal_page.proposal_title_description')}
        placeholder={t('create_proposal_page.proposal_title')}
        register={register}
        clearErrors={clearErrors}
        error={errors.proposalTitle?.message && t(errors.proposalTitle.message)}
      />

      <LabeledFormInput
        name="proposalUrl"
        label={t('create_proposal_page.url')}
        description={t('create_proposal_page.url_description')}
        placeholder={t('create_proposal_page.url')}
        register={register}
        clearErrors={clearErrors}
        error={errors.proposalUrl?.message && t(errors.proposalUrl.message)}
        endIcon={
          <button type="button" aria-label="paste" onClick={handlePasteUrl}>
            <Badge size="sm">{t('paste')}</Badge>
          </button>
        }
      />

      <VoteOptions
        fields={fields}
        append={append}
        remove={remove}
        errors={errors}
        register={register}
        clearErrors={clearErrors}
      />

      <Button variant="filled" className="w-full" type="submit" disabled={!isValid || isSubmitting}>
        {getSubmitButtonMessage()}
      </Button>
    </form>
  )
}
