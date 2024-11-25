import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { XmarkIcon } from '@app/assets/icons'
import { PortalModalWrapper } from '@app/components/ui/modals'
import { useAppDispatch, useTailwindBreakpoint } from '@app/hooks'
import type { Vote } from '@app/store/apis/qli'
import { hideModal } from '@app/store/modalSlice'
import { formatString } from '@app/utils'
import { ExplorerAddressLink } from '../ui'

export type VotesListModalProps = Readonly<{
  votes: Vote[]
}>

export default function VotesListModal({ votes }: VotesListModalProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { isMobile } = useTailwindBreakpoint()

  const handleCloseModal = useCallback(() => {
    dispatch(hideModal())
  }, [dispatch])

  const renderTableRows = useCallback(() => {
    if (votes.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="px-8 py-16 text-center text-gray-50">
            {t('home_page.no_votes')}
          </td>
        </tr>
      )
    }

    return votes.map((vote) => (
      <tr key={vote.computorId} className="border-b border-primary-60 text-sm">
        <td className="px-8 py-16 text-center font-space sm:p-16">{formatString(vote.voteTick)}</td>
        <td className="px-8 py-16 sm:p-16">
          <ExplorerAddressLink address={vote.computorId} ellipsis={isMobile} />
        </td>
        <td className="px-8 py-16 text-right font-space text-xs xs:text-sm sm:p-16">{vote.vote}</td>
      </tr>
    ))
  }, [votes, isMobile, t])

  return (
    <PortalModalWrapper id="votes-list-modal" isOpen onClose={handleCloseModal} closeOnOutsideClick>
      <div className="relative mx-16 flex h-full max-h-[80vh] max-w-[95vw] flex-col gap-16 rounded-12 border border-primary-60 bg-primary-70 p-28 sm:mx-0 md:min-w-[790px]">
        <header className="flex justify-between">
          <h2>{t('home_page.votes_list')}</h2>
          <button
            type="button"
            className="absolute top-14 ltr:right-14 rtl:left-14"
            onClick={handleCloseModal}
            aria-label="close-button"
          >
            <XmarkIcon className="size-20 text-gray-50" />
          </button>
        </header>
        <div className="relative max-h-[65vh] w-full overflow-x-scroll">
          <table className="h-full w-full">
            <thead className="sticky top-0 border-b-1 border-primary-60 bg-primary-70 text-left font-space text-sm text-gray-50">
              <tr>
                <th className="p-16 text-center font-400">
                  <span className="text-gray-50">{t('global.tick')}</span>
                </th>
                <th className="p-16 font-400">
                  <span className="text-gray-50">{t('global.addressId')}</span>
                </th>
                <th className="p-16 text-right font-400">
                  <span className="text-gray-50">{t('global.option')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="max-h-[65vh] w-full overflow-y-auto">{renderTableRows()}</tbody>
          </table>
        </div>
      </div>
    </PortalModalWrapper>
  )
}
