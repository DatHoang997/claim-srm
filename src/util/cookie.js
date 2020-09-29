export function getAllCookie() {
  let cookiesArray = document.cookie.split('; ')
  let result = {}
  for (let i in (cookiesArray)) {
    let [key, value] = cookiesArray[i].split('=')
    result[key] = value
  }
  return result
}


export function getCookie(cookieName) {
  let cookies = getAllCookie()
  return cookies[cookieName]
}
