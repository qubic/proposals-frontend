import { theme } from '@app/theme'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Breakpoints = keyof typeof theme.breakpoints

type Output = {
  activeBreakpoint: Breakpoints
  isMobile: boolean
}

const getMediaQueryLists = Object.entries(theme.breakpoints).reduce(
  (acc, [key, value]) => {
    const updatedAcc = { ...acc }
    if (typeof value === 'string') {
      updatedAcc[key] = window.matchMedia(`(min-width: ${value})`)
    } else if (value.raw) {
      updatedAcc[key] = window.matchMedia(value.raw)
    }
    return updatedAcc
  },
  {} as Record<string, MediaQueryList>
)

export default function useTailwindBreakpoint(): Output {
  const getCurrentBreakpoint = useCallback(
    (): Breakpoints =>
      (Object.entries(getMediaQueryLists)
        .filter((mqlEntry) => mqlEntry[1].matches)
        .map(([key]) => key)
        .pop() as Breakpoints) || 'xxs',
    []
  )
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoints>(() =>
    getCurrentBreakpoint()
  )

  const isMobile = useMemo(
    () => !activeBreakpoint || activeBreakpoint === 'xxs' || activeBreakpoint === 'xs',
    [activeBreakpoint]
  )

  const handleResize = useCallback(() => {
    setActiveBreakpoint((getCurrentBreakpoint() as Breakpoints) || null)
  }, [getCurrentBreakpoint])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return { activeBreakpoint, isMobile }
}
