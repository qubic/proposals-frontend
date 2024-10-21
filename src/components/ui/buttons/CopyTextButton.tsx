import { useCallback, useState } from 'react'

import { CheckIcon, CopyTextIcon } from '@app/assets/icons'
import { clsxTwMerge, copyText } from '@app/utils'
import Tooltip from '../Tooltip'

type Props = {
  text: string
  children?: React.ReactNode
  className?: string
}

export default function CopyTextButton({ text, children, className }: Props) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(() => {
    copyText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1000)
  }, [text])

  return (
    <Tooltip content={isCopied ? 'Copied' : 'Copy to clipboard'}>
      <button
        type="button"
        aria-live="polite"
        className={clsxTwMerge(
          'flex items-center justify-center gap-8 rounded-8 text-gray-50',
          isCopied ? 'hover:cursor-default' : 'hover:text-white',
          className
        )}
        onClick={handleCopy}
      >
        {isCopied ? (
          <>
            <span className="text-xs">Copied</span>
            <CheckIcon className="size-14 text-success-40" />
          </>
        ) : (
          <>
            {children && <span>{children}</span>}
            <CopyTextIcon className="size-14" />
          </>
        )}
      </button>
    </Tooltip>
  )
}
