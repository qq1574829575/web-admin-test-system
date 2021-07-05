
export function getCurrentTime() {
  let tmp = Date.parse(new Date()).toString()
  tmp = tmp.substr(0, 10)
  return tmp
}
