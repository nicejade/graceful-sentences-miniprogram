/**
 * 拼接 url 和参数
 */
function queryString(url, query) {
  let str = []
  for (let key in query) {
    str.push(key + '=' + query[key])
  }
  let paramStr = str.join('&')
  return paramStr ? `${url}?${paramStr}` : url
}

function showToast(message = '', duration = 0) {
  if (!message) return
  prompt.showToast({
    message: message,
    duration
  })
}
/**
 * 读取存储内容
 * @param {String} key
 */
function getStorage(key) {
  return new Promise((resolve, reject) => {
    storage.get({
      key,
      default: 'key is not exist',
      success: data => {
        resolve(data)
      },
      fail: err => {
        resolve(err)
      }
    })
  })
}
/**
 * 修改存储内容
 * @param {String} key
 * @param {String} value
 */
function setStorage(key, value) {
  return new Promise((resolve, reject) => {
    storage.set({
      key,
      value,
      success: res => {
        resolve('set success')
      },
      fail: err => {
        resolve('set failed')
      }
    })
  })
}
/**
 * 删除存储内容
 * @param {String} key
 */
function deleteStorage(key) {
  return new Promise((resolve, reject) => {
    storage.delete({
      key,
      success: data => {
        resolve('handling success')
      },
      fail: (data, code) => {
        resolve(`handling fail, code = ${code}`)
      }
    })
  })
}
/**
 * 将画布生成为图片并保存到相册
 */
function canvasToTempFilePath(
  ele,
  width,
  height,
  fileName,
  idx = 0,
  folderName = 'custom-folder'
) {
  // 生成图片
  ele.toTempFilePath({
    x: 0,
    y: 0,
    width,
    height,
    fileType: 'png',
    success: data => {
      // const imageUrl = data.tempFilePath
    },
    fail: (err, code) => {
      prompt.showToast({
        message: `错误原因：${err}, 错误代码：${code}`
      })
    }
  })
}
/**
 * 分享图片
 */
function shareMethod(data) { }

/**
 * 获取设备信息
 */
function deviceGetInfo() {
  return new Promise((resolve, reject) => { })
}

/**
 * 卡片 - 固定每行宽度
 */
function lineWidthHandler(width) {
  const RATE = 0.8
  return width * RATE
}
/**
 * 设置字体大小 默认大小为卡片宽度/21
 */
function setFontSize(width, rate = 21) {
  return width / rate
}
/**
 * 最大字体
 */
function maxFontSize(width) {
  const rate = 17
  return setFontSize(width, rate)
}
/**
 * 最小字体
 */
function minFontSize(width) {
  const rate = 24
  return setFontSize(width, rate)
}
/**
 * 默认行高 默认为字体大小+20
 */
function setLineHeight(fontSize, padding = 20) {
  return fontSize + padding
}
/**
 * 最大行高
 */
function maxLineHeight(fontSize) {
  const padding = 60
  return setLineHeight(fontSize + padding)
}

export default {
  showToast,
  queryString,
  getStorage,
  setStorage,
  deleteStorage,
  canvasToTempFilePath,
  shareMethod,
  deviceGetInfo,
  lineWidthHandler,
  setFontSize,
  maxFontSize,
  minFontSize,
  setLineHeight,
  maxLineHeight
}
