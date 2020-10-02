
import NotFound from '@/module/page/error/notfound'
import ClaimZSRM from '@/module/page/claimZSRM/index'
import SwapSRM from '@/module/page/swapSRM/index'

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
    path: '/',
    page: ClaimZSRM,
  },
  {
    page: NotFound
  }
]
