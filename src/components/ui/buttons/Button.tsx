import { clsxTwMerge } from '@app/utils'

type Variant = 'filled' | 'outlined' | 'text' | 'link'
type Color = 'primary'
type Size = 'xs' | 'sm' | 'md' | 'lg'

export type ButtonProps<T extends React.ElementType = 'button'> = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  color?: Color
  className?: string
  as?: T
} & React.ComponentPropsWithoutRef<T>

const sizeClasses = {
  xs: 'px-12 py-8 text-xs',
  sm: 'px-16 py-8 text-sm',
  md: 'px-24 py-12 text-base',
  lg: 'px-28 py-14 text-lg'
} as const

const colorVariantClasses = {
  primary: {
    filled: 'text-primary-80 bg-primary-30 hover:bg-primary-40 disabled:hover:bg-primary-30',
    outlined:
      'text-primary-30 border border-primary-30 hover:bg-primary-60 disabled:hover:bg-transparent',
    text: 'text-primary-30 hover:bg-primary-60 disabled:hover:bg-transparent',
    link: 'text-primary-30 hover:text-primary-40 p-0 hover:underline disabled:hover:text-primary-30'
  }
} as const

export default function Button<T extends React.ElementType = 'button'>({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  className,
  as,
  ...restProps
}: ButtonProps<T>) {
  const Component: React.ElementType = as || 'button'

  return (
    <Component
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
      className={clsxTwMerge(
        'flex w-full items-center justify-center gap-8 rounded-12 font-space font-medium transition duration-300 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-30',
        sizeClasses[size],
        colorVariantClasses[color][variant],
        className
      )}
    >
      {children}
    </Component>
  )
}
