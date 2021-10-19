import JsEncrypt from 'jsencrypt/bin/jsencrypt'
import uuidUtil from './onlyidUtil'
import { getCurrentTime } from '@/utils/time'
import store from '@/store'

export default {
  encryption(object) {
    // 学校统一门户公钥
    const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZzK5VGA68wQcymv9/RTB8gs0iLuHS2L4hSo22pIbZy5Dc4npkEGmx1SAdMODA6JrWyMJSEJZ9lOKw4JetULzjDSjD67Q9lsGFOilZRSkDNF0m4TDFs9t21Ii4kVX9uNnDlDcuZYsUXOg3K3o+TgRB7tmn1ZX+0kqIWfD7PuqOWp1WfvCKE28gg1oaBhz43nV8FJtxq8u6JqyKXoJm/q7QQ5bpB1D1ZJsKrxshtAICk3tHTC7yyIp2TSAK7mNN0sgt2U+6LCiVMk79Uswa0INL/zW9Pg/rNvzlONOlNJlMKtnxDlwhKFoawWlsRalAtHtDaCp+fv8hpcPVQLjMpzNQIDAQAB`
    object = {
      Codetime: getCurrentTime(),
      Onlyid: uuidUtil.uuid(22, 10),
      Rootcardid: store.getters.userinfo.Rootcardid,
      Rootname: store.getters.userinfo.Rootname,
      Token: store.getters.userinfo.Token,
      studentID: store.getters.userinfo.studentID,
      ...object
    }
    console.log(object)
    const jse = new JsEncrypt()
    jse.setPublicKey(publicKey) // 加入rsa public key
    const await1 = JSON.stringify(object)
    const ciphertext = jse.encryptLong(await1) // 将文本加密
    return encodeURIComponent(ciphertext)
  },
  encryption_xxcy(object) {
    // 中专统一门户公钥
    const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArEvT+FgEn7iVHh8xLTvhRdoX
    bGkkUrLFHedUa8xjZP7Mx91jhMWL180FZ+nKu0ZxPTPLcbcMfrXODso3M8Mbno58mq+xkdBnO/D/+KMdSby8dGS
    T7+RbKQvsFZMBYyqRf5ZjGJPubb0EL+eyqwRJKVC7mqIbS9+J7Aa9DYl04e6muHeKnwc61nqUSh24+G4CasHEmL
    p20iY3XEqWbe1dJHgd24y1guiBqgxFZCtzCeEED/k2VUZsfKnIjz1iJ/lKkr/IKTt1Bcvt13YP3Y6xhW8HmhoHP
    RHBYdPTqOJjL5vr0yWm/brdkWOHyOdT41j2WFq+T3eJSAXu/PgCJEEbUQIDAQAB`
    object = {
      Codetime: getCurrentTime(),
      Onlyid: uuidUtil.uuid(22, 10),
      Rootcardid: store.getters.userinfo.Rootcardid,
      Rootname: store.getters.userinfo.Rootname,
      token: store.getters.userinfo.Token,
      studentID: store.getters.userinfo.studentID,
      ...object
    }
    console.log(object)
    const jse = new JsEncrypt()
    jse.setPublicKey(publicKey) // 加入rsa public key
    const await1 = JSON.stringify(object)
    const ciphertext = jse.encrypt(await1) // 将文本加密
    return encodeURIComponent(ciphertext)
  },
  encryption_xxcy_long(encryptData) {
    // 中专统一门户公钥
    const publicKey_xxcy = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArEvT+FgEn7iVHh8xLTvhRdoX
    bGkkUrLFHedUa8xjZP7Mx91jhMWL180FZ+nKu0ZxPTPLcbcMfrXODso3M8Mbno58mq+xkdBnO/D/+KMdSby8dGS
    T7+RbKQvsFZMBYyqRf5ZjGJPubb0EL+eyqwRJKVC7mqIbS9+J7Aa9DYl04e6muHeKnwc61nqUSh24+G4CasHEmL
    p20iY3XEqWbe1dJHgd24y1guiBqgxFZCtzCeEED/k2VUZsfKnIjz1iJ/lKkr/IKTt1Bcvt13YP3Y6xhW8HmhoHP
    RHBYdPTqOJjL5vr0yWm/brdkWOHyOdT41j2WFq+T3eJSAXu/PgCJEEbUQIDAQAB`
    encryptData = {
      Codetime: getCurrentTime(),
      Onlyid: uuidUtil.uuid(22, 10),
      Rootcardid: store.getters.userinfo.Rootcardid,
      Rootname: store.getters.userinfo.Rootname,
      token: store.getters.userinfo.Token,
      studentID: store.getters.userinfo.studentID,
      ...encryptData
    }
    console.log(encryptData)
    console.log('佳新是大坏蛋')
    const jse = new JsEncrypt()
    jse.setPublicKey(publicKey_xxcy)
    const encryptData_json_str = JSON.stringify(encryptData)
    const encryptedData = jse.encryptLong(encryptData_json_str) // 将文本加密
    return encodeURIComponent(encryptedData)
  },
  encryption_school(object) {
    // 学校统一门户公钥
    const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZzK5VGA68wQcymv9/RTB8gs0iLuHS2L4hSo22pIbZy5Dc4npkEGmx1SAdMODA6JrWyMJSEJZ9lOKw4JetULzjDSjD67Q9lsGFOilZRSkDNF0m4TDFs9t21Ii4kVX9uNnDlDcuZYsUXOg3K3o+TgRB7tmn1ZX+0kqIWfD7PuqOWp1WfvCKE28gg1oaBhz43nV8FJtxq8u6JqyKXoJm/q7QQ5bpB1D1ZJsKrxshtAICk3tHTC7yyIp2TSAK7mNN0sgt2U+6LCiVMk79Uswa0INL/zW9Pg/rNvzlONOlNJlMKtnxDlwhKFoawWlsRalAtHtDaCp+fv8hpcPVQLjMpzNQIDAQAB`
    object = {
      Codetime: getCurrentTime(),
      Onlyid: uuidUtil.uuid(22, 10),
      Rootcardid: store.getters.userinfo.Rootcardid,
      Rootname: store.getters.userinfo.Rootname,
      Token: store.getters.userinfo.Token,
      studentID: store.getters.userinfo.studentID,
      ...object
    }
    console.log(object)
    const jse = new JsEncrypt()
    jse.setPublicKey(publicKey) // 加入rsa public key
    const await1 = JSON.stringify(object)
    const ciphertext = jse.encrypt(await1) // 将文本加密
    return encodeURIComponent(ciphertext)
  },
  encryption_school_long(encryptData) {
    // 学校统一门户公钥
    const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZzK5VGA68wQcymv9/RTB8gs0iLuHS2L4hSo22pIbZy5Dc4npkEGmx1SAdMODA6JrWyMJSEJZ9lOKw4JetULzjDSjD67Q9lsGFOilZRSkDNF0m4TDFs9t21Ii4kVX9uNnDlDcuZYsUXOg3K3o+TgRB7tmn1ZX+0kqIWfD7PuqOWp1WfvCKE28gg1oaBhz43nV8FJtxq8u6JqyKXoJm/q7QQ5bpB1D1ZJsKrxshtAICk3tHTC7yyIp2TSAK7mNN0sgt2U+6LCiVMk79Uswa0INL/zW9Pg/rNvzlONOlNJlMKtnxDlwhKFoawWlsRalAtHtDaCp+fv8hpcPVQLjMpzNQIDAQAB`
    encryptData = {
      Codetime: getCurrentTime(),
      Onlyid: uuidUtil.uuid(22, 10),
      Rootcardid: store.getters.userinfo.Rootcardid,
      Rootname: store.getters.userinfo.Rootname,
      Token: store.getters.userinfo.Token,
      studentID: store.getters.userinfo.studentID,
      ...encryptData
    }
    console.log(encryptData)
    const jse = new JsEncrypt()
    jse.setPublicKey(publicKey)
    const encryptData_json_str = JSON.stringify(encryptData)
    const encryptedData = jse.encryptLong(encryptData_json_str) // 将文本加密
    return encodeURIComponent(encryptedData)
  },
  encryption_pdf(object) {
    // pdf服务器公钥
    const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxemk3U53wOLDKQ2W7ZgwzvduYlRCcw3ylR+Vvyu4vGUaAfza3mBhtKl0insLwLDPqoamnASMVvvX2t+sPKw05qOVMpYcN/yxruFOUCW6l6PPqmh9eDNDRVh+ykaHOXAg74+Va8FbmOuhO30m7NaLxLjhFbfIzbcEG6g3kfySr6YKk1NiEFK7lb8rO3QrqgIake/zPP+5CkRSqrQNn6eQIgXYTlRoqqchYH4fSmENQxwQ2AbCEHX4+U5H9VKVZzjOBUdXhRSuJ/HX3NOCLXUfuZACkZL8fQ85up1R5XNPPjCX1ZBX3c/ljnBR7LAwPWQ2YZkzjtAb2OgmvGyBPxV5AwIDAQAB`
    object = {
      Onlyid: uuidUtil.uuid(22, 10),
      Rootcardid: store.getters.userinfo.Rootcardid,
      Rootname: store.getters.userinfo.Rootname,
      ...object
    }
    console.log(object)
    const jse = new JsEncrypt()
    jse.setPublicKey(publicKey) // 加入rsa public key
    const await1 = JSON.stringify(object)
    const ciphertext = jse.encrypt(await1) // 将文本加密
    return encodeURIComponent(ciphertext)
  },
  encryption_oa_test(object) {
    // oa系统本地测试公钥
    const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjMO5eDKsp42oR+D1ID81
ZwYtrY7oshUJO4mF+qEIWqge5ZXvaFNhdR41lTRjCHLvOL/z2y/3XpfMJu1chche
dfqIxHo6cpEVZK28UwbQf/CT+SYWfxQytXt7WnpMrZwngpn9SifYQVeU4foMqbJq
Ds6xa9+ahCSYwyyH5GPNhyXinrYg1837CY4JEVJLganGER+KHOCqFkhTC7PWV+DN
UCMFB3+6liSr2l9JTWSm8RQJqTwCf1n4wld7nOwDoXAaZVNVKMLoirx0PJzYuC3o
1pG3pzIOo1D15jTaOwUIY+QNcutgD2MAB9dFP1j8ox4Xa1BRANbsXqkKYYilNXdN
wwIDAQAB`
    object = {
      Codetime: getCurrentTime(),
      Onlyid: uuidUtil.uuid(22, 10),
      Rootcardid: store.getters.userinfo.Rootcardid,
      Rootname: store.getters.userinfo.Rootname,
      Token: store.getters.userinfo.Token,
      studentID: store.getters.userinfo.studentID,
      ...object
    }
    console.log(object)
    const jse = new JsEncrypt()
    jse.setPublicKey(publicKey) // 加入rsa public key
    const await1 = JSON.stringify(object)
    const ciphertext = jse.encrypt(await1) // 将文本加密
    return encodeURIComponent(ciphertext)
  }
}

/**
 * 长文本加密
 * @param {string} string 待加密长文本
 * @returns {string} 加密后的base64编码
 * */
JsEncrypt.prototype.encryptLong = function(string) {
  const k = this.getKey()
  try {
    let ct = ''
    // RSA每次加密117bytes，需要辅助方法判断字符串截取位置
    // 1.获取字符串截取点
    const bytes = []
    bytes.push(0)
    let byteNo = 0; let temp = 0; let c

    for (let i = 0; i < string.length; i++) {
      c = string.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10ffff) {
        // 特殊字符，如Ř，Ţ
        byteNo += 4
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        // 中文以及标点符号
        byteNo += 3
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        // 特殊字符，如È，Ò
        byteNo += 2
      } else {
        // 英文以及标点符号
        byteNo += 1
      }
      if (byteNo % 117 >= 114 || byteNo % 117 === 0) {
        if (byteNo - temp >= 114) {
          bytes.push(i)
          temp = byteNo
        }
      }
    }
    // 2.截取字符串并分段加密
    if (bytes.length > 1) {
      for (let i = 0; i < bytes.length - 1; i++) {
        let str
        // eslint-disable-next-line eqeqeq
        if (i === 0) {
          str = string.substring(0, bytes[i + 1] + 1)
        } else {
          str = string.substring(bytes[i] + 1, bytes[i + 1] + 1)
        }
        const t1 = k.encrypt(str)
        ct += t1
      }
      if (bytes[bytes.length - 1] !== string.length - 1) {
        const lastStr = string.substring(bytes[bytes.length - 1] + 1)
        ct += k.encrypt(lastStr)
      }
      return hex2b64(ct)
    }
    const t = k.encrypt(string)
    return hex2b64(t)
  } catch (ex) {
    return false
  }
}
const b64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const b64pad = '='
function hex2b64(d) {
  let b
  let e
  let a = ''
  for (b = 0; b + 3 <= d.length; b += 3) {
    e = parseInt(d.substring(b, b + 3), 16)
    a += b64map.charAt(e >> 6) + b64map.charAt(e & 63)
  }
  if (b + 1 === d.length) {
    e = parseInt(d.substring(b, b + 1), 16)
    a += b64map.charAt(e << 2)
  } else {
    if (b + 2 === d.length) {
      e = parseInt(d.substring(b, b + 2), 16)
      a += b64map.charAt(e >> 2) + b64map.charAt((e & 3) << 4)
    }
  }
  while ((a.length & 3) > 0) {
    a += b64pad
  }
  // console.log("hex2b64:",a,"原参数:"+d);
  return a
}
