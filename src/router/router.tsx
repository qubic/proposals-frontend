import { createBrowserRouter } from 'react-router-dom'

import { PrivateRoutesGuard } from '@app/components/guards'
import { AppLayout } from '@app/components/ui/layouts'
import { CreateProposalPageLazy, Error404Page, HomePage } from '@app/pages'
import { PrivateRoutes, PublicRoutes } from './routes'

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: PublicRoutes.HOME,
    element: <AppLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        element: <PrivateRoutesGuard />,
        children: [
          {
            path: PrivateRoutes.PROPOSALS.CREATE,
            element: <CreateProposalPageLazy />
          }
        ]
      }
    ]
  },
  {
    path: PublicRoutes.NOT_FOUND,
    element: <Error404Page />
  }
])

export default router
