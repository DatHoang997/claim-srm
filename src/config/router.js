
import NotFound from '@/module/page/error/notfound'
import ClaimSRM from '@/module/page/claimSRM/index'

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
    path: '/claim-srm',
    page: ClaimSRM,
  },
  {
    page: NotFound
  }
]
