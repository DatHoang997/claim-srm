const ReadWrite = require('./../build/' + process.env.NODE_ENV + '/contracts/ReadWrite.json')
const PocToken = require( './../build/' + process.env.NODE_ENV + '/contracts/POC_Token.json')
const PocPool = require( './../build/' + process.env.NODE_ENV + '/contracts/POC_Pool.json')
const Citizen = require( './../build/' + process.env.NODE_ENV + '/contracts/Citizen.json')

export const NetIds = {
  development: 66666,
  production: 66666
}

const NetId = NetIds[process.env.NODE_ENV]

export const USER_ROLE = {
  MEMBER: 'MEMBER',
  LEADER: 'LEADER',
  ADMIN: 'ADMIN',
  COUNCIL: 'COUNCIL'
}

export const CONTRACTS =
     {
       'ReadWrite':
         {
           'abi': ReadWrite.abi,
           'address': ReadWrite.networks[NetId].address
         },
       'PocToken':
         {
           'abi': PocToken.abi,
           'address': PocToken.networks[NetId].address
         },
       'PocPool':
         {
           'abi': PocPool.abi,
           'address': PocPool.networks[NetId].address
         },
       'Citizen':
         {
           'abi': Citizen.abi,
           'address': Citizen.networks[NetId].address
         }
     }

export const USER_LANGUAGE = {
  en: 'en'
}

export const TEAM_ROLE = {
  MEMBER: 'MEMBER',
  OWNER: 'OWNER'
}

export const TASK_CATEGORY = {
  DEVELOPER: 'DEVELOPER',
  SOCIAL: 'SOCIAL',
  LEADER: 'LEADER'
}

export const TASK_TYPE = {
  TASK: 'TASK',
  SUB_TASK: 'SUB_TASK',
  PROJECT: 'PROJECT',
  EVENT: 'EVENT'
}

export const TASK_STATUS = {
  PROPOSAL: 'PROPOSAL',
  CREATED: 'CREATED',
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED'
}

export const TASK_CANDIDATE_TYPE = {
  USER: 'USER',
  TEAM: 'TEAM'
}

export const TASK_CANDIDATE_STATUS = {
  // NOT_REQUIRED: 'NOT_REQUIRED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
}

export const COMMUNITY_TYPE = {
  COUNTRY: 'COUNTRY',
  STATE: 'STATE',
  CITY: 'CITY',
  REGION: 'REGION',
  SCHOOL: 'SCHOOL'
}

export const TRANS_STATUS = {
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
  SUCCESSFUL: 'SUCCESSFUL'
}

export const ISSUE_CATEGORY = {
  BUG: 'BUG',
  SECURITY: 'SECURITY',
  SUGGESTION: 'SUGGESTION',
  OTHER: 'OTHER'
}

export const CONTRIB_CATEGORY = {
  BLOG: 'BLOG',
  VIDEO: 'VIDEO',
  PODCAST: 'PODCAST',
  OTHER: 'OTHER'
}

export const DEFAULT_IMAGE = {
  TASK: '/assets/images/task_thumbs/12.jpg'
}
