
import NotFound from '@/module/page/error/notfound'
import ClaimASRM from '@/module/page/claimASRM/index'
import SwapSRM from '@/module/page/swapSRM/index'
import Home from '@/module/page/home/index'

export default [
  // {
  //   path: '/category',
  //   page: Category,
  //   auth: true
  // },
  {
    path: '/404',
    page: NotFound
  },
  {
    path: '/swap',
    page: SwapSRM,
  },
  {
    path: '/claim',
    page: ClaimASRM,
  },
  {
    path: '/',
    page: Home,
  },
  {
    page: NotFound
  },
]
