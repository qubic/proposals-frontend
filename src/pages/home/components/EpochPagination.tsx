import { Button } from '@app/components/ui/buttons'
import { TextInput } from '@app/components/ui/inputs'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface EpochPaginationProps {
  currentEpoch: number
  latestEpoch: number
  onEpochChange: (epoch: number) => void
  isLoading?: boolean
}

export default function EpochPagination({
  currentEpoch,
  latestEpoch,
  onEpochChange,
  isLoading = false
}: EpochPaginationProps) {
  const [inputValue, setInputValue] = useState(currentEpoch.toString())
  const { t } = useTranslation()

  useEffect(() => {
    setInputValue(currentEpoch.toString())
  }, [currentEpoch])
  const [inputError, setInputError] = useState<string>()

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInputValue(value)
    setInputError(undefined)
  }, [])

  const handleInputSubmit = useCallback(() => {
    const epoch = parseInt(inputValue, 10)

    if (Number.isNaN(epoch)) {
      setInputError(t('epoch_pagination.error_invalid_epoch'))
      return
    }

    if (epoch < 0) {
      setInputError(t('epoch_pagination.error_negative_epoch'))
      return
    }

    if (epoch > latestEpoch - 1) {
      setInputError(t('epoch_pagination.error_epoch_too_high', { max: latestEpoch - 1 }))
      return
    }

    setInputError(undefined)
    onEpochChange(epoch)
  }, [inputValue, latestEpoch, onEpochChange])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleInputSubmit()
      }
    },
    [handleInputSubmit]
  )

  const handlePrevious = useCallback(() => {
    if (currentEpoch > 0) {
      onEpochChange(currentEpoch - 1)
    }
  }, [currentEpoch, onEpochChange])

  const handleNext = useCallback(() => {
    if (currentEpoch < latestEpoch - 1) {
      onEpochChange(currentEpoch + 1)
    }
  }, [currentEpoch, latestEpoch, onEpochChange])

  return (
    <div className="flex flex-col gap-16 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-12">
        <Button
          variant="outlined"
          size="sm"
          onClick={handlePrevious}
          disabled={currentEpoch <= 0 || isLoading}
          className="w-auto"
        >
          {t('epoch_pagination.previous')}
        </Button>

        <div className="flex items-center gap-8">
          <div className="min-w-[70px] max-w-[90px]">
            <TextInput
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              size="xs"
              error={inputError}
              disabled={isLoading}
              className="text-center"
              placeholder={t('epoch_pagination.placeholder_epoch')}
            />
          </div>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleInputSubmit}
            disabled={isLoading}
            className="w-auto"
          >
            {t('epoch_pagination.go')}
          </Button>
        </div>

        <Button
          variant="outlined"
          size="sm"
          onClick={handleNext}
          disabled={currentEpoch >= latestEpoch - 1 || isLoading}
          className="w-auto"
        >
          {t('epoch_pagination.next')}
        </Button>
      </div>

      <div className="text-sm text-gray-50">
        {t('epoch_pagination.showing_epoch', {
          current: currentEpoch,
          latest: latestEpoch
        })}
      </div>
    </div>
  )
}
