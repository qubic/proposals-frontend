import { useWalletConnect } from '@app/hooks'
import { PublicRoutes } from '@app/router'
import type { ReactElement } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

type Props = Readonly<{
  redirectTo?: string
}>

export default function PrivateRoutesGuard({
  redirectTo = PublicRoutes.HOME
}: Props): ReactElement {
  const { isWalletConnected } = useWalletConnect()
  const location = useLocation()

  if (!isWalletConnected && location.pathname !== redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
