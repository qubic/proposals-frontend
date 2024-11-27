import { ProposalType } from '@app/types/enums'
import { z } from 'zod'

export const ProposalSchema = z.object({
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

export type ProposalFormData = z.infer<typeof ProposalSchema>
