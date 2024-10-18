import { useQubicWallet } from '@app/hooks'
import { PublicRoutes } from '@app/router'
import type { ReactElement } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface PrivateRouteProps {
  redirectTo?: string
}

export default function PrivateRoutesGuard({
  redirectTo = PublicRoutes.HOME
}: PrivateRouteProps): ReactElement {
  const { isWalletConnected } = useQubicWallet()
  const location = useLocation()

  if (!isWalletConnected && location.pathname !== redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
