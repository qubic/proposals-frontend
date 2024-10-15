import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@app/components/ui/layouts'
import { CreateProposalPageLazy, Error404Page, HomePage } from '@app/pages'
import { Routes } from './routes'

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: Routes.PROPOSALS.CREATE,
        element: <CreateProposalPageLazy />
      }
    ]
  },
  {
    path: Routes.NOT_FOUND,
    element: <Error404Page />
  }
])

export default router
