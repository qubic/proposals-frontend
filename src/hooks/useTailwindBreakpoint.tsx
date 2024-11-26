import { theme } from '@app/theme'
import debounce from 'debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Breakpoints = keyof typeof theme.breakpoints

type Output = {
  activeBreakpoint: Breakpoints
  isMobile: boolean
}

// Helper function to create MediaQueryLists
const createMediaQueryLists = (): Record<string, MediaQueryList> => {
  return Object.entries(theme.breakpoints).reduce(
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
}

export default function useTailwindBreakpoint(): Output {
  const [mediaQueryLists, setMediaQueryLists] =
    useState<Record<string, MediaQueryList>>(createMediaQueryLists())

  const getCurrentBreakpoint = useCallback((): Breakpoints => {
    return (
      (Object.entries(mediaQueryLists)
        .filter(([, mql]) => mql.matches)
        .map(([key]) => key)
        .pop() as Breakpoints) || 'xxs'
    )
  }, [mediaQueryLists])

  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoints>(() =>
    getCurrentBreakpoint()
  )

  const isMobile = useMemo(
    () => !activeBreakpoint || activeBreakpoint === 'xxs' || activeBreakpoint === 'xs',
    [activeBreakpoint]
  )

  const handleResize = useMemo(
    () =>
      debounce(() => {
        setActiveBreakpoint(getCurrentBreakpoint())
      }, 100),
    [getCurrentBreakpoint]
  )

  useEffect(() => {
    const updateMediaQueryLists = () => {
      setMediaQueryLists(createMediaQueryLists())
    }

    // Update MediaQueryLists on component mount and on orientation changes
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', updateMediaQueryLists)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', updateMediaQueryLists)
    }
  }, [handleResize])

  return { activeBreakpoint, isMobile }
}
