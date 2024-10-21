import { clsxTwMerge } from '@app/utils'

type Props = {
  className?: string
}

export default function Skeleton({ className }: Props) {
  return (
    <div className={clsxTwMerge('h-10 w-full animate-pulse rounded bg-gray-60/30', className)} />
  )
}
