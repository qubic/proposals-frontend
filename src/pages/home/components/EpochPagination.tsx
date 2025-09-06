import type React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@app/components/ui/buttons'
import { TextInput } from '@app/components/ui/inputs'

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
      setInputError('Please enter a valid epoch number')
      return
    }

    if (epoch < 0) {
      setInputError('Epoch cannot be negative')
      return
    }

    if (epoch > latestEpoch) {
      setInputError(`Epoch cannot be greater than ${latestEpoch}`)
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
    if (currentEpoch < latestEpoch) {
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
          ← Previous
        </Button>

        <div className="flex items-center gap-8">
          <div className="w-32">
            <TextInput
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              size="sm"
              error={inputError}
              disabled={isLoading}
              className="text-center"
              placeholder="Epoch"
            />
          </div>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleInputSubmit}
            disabled={isLoading}
            className="w-auto"
          >
            Go
          </Button>
        </div>

        <Button
          variant="outlined"
          size="sm"
          onClick={handleNext}
          disabled={currentEpoch >= latestEpoch || isLoading}
          className="w-auto"
        >
          Next →
        </Button>
      </div>

      <div className="text-sm text-gray-50">
        Showing epoch {currentEpoch} of {latestEpoch}
      </div>
    </div>
  )
}
