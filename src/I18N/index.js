import en from './en'
import vn from './vn'
import kr from './kr'
import cn from './cn'

import _ from 'lodash'

const all = _.extend({}, {
  en,
  vn,
  kr,
  cn
})

let browserLang = navigator.language.split('-')[0]
let lang
if (localStorage.getItem('lang')) {
  lang = _.includes(['en','vn', 'kr', 'cn'], localStorage.getItem('lang')) ? localStorage.getItem('lang') :  'en'
} else {
  lang = _.includes(['en','vn', 'kr', 'cn'], browserLang) ? browserLang :  'en'
}

export default {
  setLang (str) {
    localStorage.setItem('lang', str)
    if (_.includes(['en','vn', 'kr', 'cn'], str)) {
      lang = str
    } else {
      throw new Error('invalid lang : ' + str)
    }
  },
  getLang () {
    return lang
  },

  get (key) {
    return _.get(all[lang], key, _.get(all['vn'], key, key))
  }
}
