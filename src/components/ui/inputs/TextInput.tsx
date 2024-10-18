import { clsxTwMerge } from '@app/utils'
import type React from 'react'
import { forwardRef } from 'react'

type Variant = 'filled'
type Color = 'primary' | 'error'
type Size = 'xs' | 'sm' | 'md' | 'lg'
type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search'

type Props<T extends React.ElementType = 'input'> = {
  type?: InputType
  placeholder?: string
  size?: Size
  color?: Color
  variant?: Variant
  className?: string
  endIcon?: React.ReactNode
  error?: string
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, 'size' | 'type'>

const sizeClasses = {
  xs: 'px-12 py-10 text-xs',
  sm: 'px-12 py-10 text-sm',
  md: 'px-16 py-14 text-base',
  lg: 'px-20 py-16 text-lg'
} as const

const colorVariantClasses = {
  primary: {
    filled:
      'bg-primary-70 text-white border border-primary-60 focus:border-primary-40 focus:ring-0 focus:outline-none placeholder:text-gray-60'
  },
  error: {
    filled:
      'bg-primary-70 text-white border border-red-500 focus:border-red-500 focus:ring-0 focus:outline-none placeholder:text-gray-60'
  }
} as const

const TextInput = forwardRef(
  <T extends React.ElementType = 'input'>(
    {
      type = 'text',
      placeholder = '',
      size = 'md',
      color = 'primary',
      variant = 'filled',
      className,
      endIcon,
      error,
      as,
      ...restProps
    }: Props<T>,
    ref: React.Ref<unknown>
  ) => {
    const Component: React.ElementType = as || 'input'

    return (
      <div className="relative flex w-full flex-col items-start">
        <div className="relative flex w-full items-center">
          <Component
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
            type={type}
            ref={ref} // Attach ref here
            placeholder={placeholder}
            className={clsxTwMerge(
              'w-full rounded-12 transition duration-300',
              sizeClasses[size],
              colorVariantClasses[error ? 'error' : color][variant],
              className
            )}
          />
          {endIcon && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-12">{endIcon}</span>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-500">* {error}</p>}
      </div>
    )
  }
)

export default TextInput
