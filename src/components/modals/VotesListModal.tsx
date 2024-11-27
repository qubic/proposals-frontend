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
        <td className="w-88 px-8 py-16 text-center font-space sm:p-16">
          {formatString(vote.voteTick)}
        </td>
        <td className="px-8 py-16 sm:p-16">
          <ExplorerAddressLink address={vote.computorId} ellipsis={isMobile} />
        </td>
        <td className="px-8 py-16 text-right font-space text-xs xs:text-sm sm:p-16">{vote.vote}</td>
      </tr>
    ))
  }, [votes, isMobile, t])

  return (
    <PortalModalWrapper id="votes-list-modal" isOpen onClose={handleCloseModal} closeOnOutsideClick>
      <div className="relative mx-16 flex h-full max-h-[80vh] max-w-[95vw] flex-col gap-16 rounded-12 border border-primary-60 bg-primary-70 p-28 md:min-w-[790px]">
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
        <div className="relative max-h-[75vh] w-full overflow-hidden">
          {/* Table header */}
          <div className="overflow-hidden">
            <table className="w-full table-auto border-collapse">
              <thead className="sticky top-0 bg-primary-70 font-space text-sm text-gray-50">
                <tr>
                  <th className="w-88 px-8 py-16 text-center font-400 sm:w-112">
                    <span>{t('global.tick')}</span>
                  </th>
                  <th className="w-128 px-8 py-16 text-left font-400 md:w-max">
                    <span>{t('global.addressId')}</span>
                  </th>
                  <th className="px-8 py-16 text-right font-400">
                    <span>{t('global.option')}</span>
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Table body with scrolling */}
          <div className="max-h-[65vh] overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <tbody className="w-full">{renderTableRows()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalModalWrapper>
  )
}
