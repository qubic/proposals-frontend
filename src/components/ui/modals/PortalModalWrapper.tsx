import { clsxTwMerge } from '@app/utils'
import type { TouchEvent } from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = Readonly<{
  id: string
  isOpen: boolean
  children: React.ReactNode
  className?: string
  closeOnOutsideClick?: boolean
  onClose?: () => void
}>

function ModalOverlayWrapper({
  id,
  children,
  className,
  closeOnOutsideClick,
  onClose
}: Readonly<Omit<ModalProps, 'isOpen'>>) {
  const modalWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalWrapperRef.current && !modalWrapperRef.current.contains(event.target as Node)) {
        if (onClose) {
          onClose()
        }
      }
    }

    if (closeOnOutsideClick) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      if (closeOnOutsideClick) {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [closeOnOutsideClick, onClose])

  const stopTouchPropagation = (touchEvent: TouchEvent<HTMLDivElement>) => {
    touchEvent.stopPropagation()
  }

  return (
    <>
      <div
        id={id}
        role="dialog"
        className={clsxTwMerge('fixed inset-0 z-99 flex items-center justify-center', className)}
        aria-labelledby={`${id}-title`}
        aria-modal="true"
        ref={modalWrapperRef}
        onTouchMove={stopTouchPropagation}
      >
        {children}
      </div>
      <div className="fixed inset-0 z-50 bg-primary-80 bg-opacity-60" />
    </>
  )
}

export default function PortalModalWrapper({
  id,
  isOpen,
  children,
  className,
  closeOnOutsideClick,
  onClose
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body (desktop)
      document.body.classList.add('overflow-hidden')
    }

    return () => {
      // Enable scrolling on body (desktop)
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  const modalRoot = document.getElementById('modal-root')

  if (!modalRoot) {
    throw new Error('Modal root element not found')
  }

  return isOpen
    ? createPortal(
        <ModalOverlayWrapper
          id={id}
          className={className}
          closeOnOutsideClick={closeOnOutsideClick}
          onClose={onClose}
        >
          {children}
        </ModalOverlayWrapper>,
        modalRoot
      )
    : null
}
