/**
 * 获取首页日历数据
 * @param {Object} calendar
 * @param {String} pathName
 */
import $utils from './../../helper/utils'


export function getData(pathName, calendar) {
  let sentenceList = getContent(pathName)
  const time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  const allDaysOfcurrentMonth = calendar.solarDays(year, month)
  let calendarAarry = new Array(allDaysOfcurrentMonth)
  for (let idx = 0; idx < calendarAarry.length; idx++) {
    if (date > allDaysOfcurrentMonth) {
      date = 1
      month += 1
      if (month > 12) {
        year += 1
        month = 1
      }
    }
    calendarAarry[idx] = {
      calendar: calendar.solar2lunar(year, month, date),
      data: sentenceList[idx]
    }
    date++
  }
  return calendarAarry
}

function getContent(pathName) {
  let data = require('./data').sentenceList
  let comment = require('./data').comment
  let userInfo = require('./data').userInfo
  for (let idx = 0; idx < data.length; idx++) {
    data[idx].image = `${pathName}/calendar${idx}.png`
    data[idx].cover = `${pathName}/calendar${idx}.png`
    data[idx].contributor = userInfo
    if (idx === 2) {
      data[idx].comment = {
        tags: [
          { type: 'hot', name: '最热' },
          { type: 'new', name: '最近' }
        ],
        count: 200,
        data: []
      }
    } else if (idx === 1) {
      data[idx].comment = {
        tags: [
          { type: 'hot', name: '最热' },
          { type: 'new', name: '最近' }
        ],
        count: 200
      }
    } else {
      data[idx].comment = comment
    }
  }
  return data
}

/**
 * 获取当天日期数据
 */
export function getToday(calendar) {
  const time = new Date()
  let year = time.getFullYear(),
    month = time.getMonth() + 1,
    date = time.getDate()
  return calendar.solar2lunar(year, month, date)
}

/**
 * 获取发现页数据
 */
export function getFindData(calendar) {
  const time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let findData = findInfo()
  let arr = new Array(7)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      calendar: calendar.solar2lunar(year, month, date),
      data: findData
    }
    date = date - 1
  }
  return arr
}

function findInfo() {
  let {
    comment,
    dictionaries,
    sentence,
    poetry,
    article,
    tag
  } = require('./data')
  let findData = [poetry[0], sentence[0], article[0], dictionaries[0], tag[0]]
  for (let i = 0; i < findData.length; i++) {
    findData[i].comment = comment
  }
  return findData
}

/**
 * 获取诗歌（诗词）、金句、词典、话题或文章列表
 */

export function getList(type, idx = 1, hasContributor = false) {
  let {
    comment,
    dictionaries,
    sentence,
    poetry,
    article,
    tag,
    userInfo
  } = require('./data')
  let data = {}
  switch (type) {
    case '诗词':
      data = poetry[idx]
      break
    case '诗歌':
      data = poetry[idx]
      break
    case '金句':
      data = sentence[idx]
      break

    case '词典':
      data = dictionaries[idx]
      break

    case '话题':
      data = tag[idx]
      break

    case '文章':
      data = article[idx]
      break

    default:
      break
  }
  data.comment = comment
  if (hasContributor) {
    data.contributor = userInfo
  }
  let obj = Object.assign({}, data)
  let arr = new Array(18)
  arr.fill(obj)
  return arr
}

/**
 * 推荐背景图片
 */
export function getRecommendItem() {
  let picsClassify = require('./data').picsClassify
  let tId = randomNum(0, picsClassify.length - 1)
  let max = picsClassify[tId].pics.length - 1
  let rId = randomNum(0, max)
  return picsClassify[tId].pics[rId]
}

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

/**
 * 绘制文字内容
 * @param {Object} ctx
 * @param {Object} info
 * @param {Number} w
 * @param {Number} h
 * @param {Number} fontSize
 * @param {String} color
 * @param {String} slogan
 * @param {Number} marginTop
 * @param {Boolean} showTitle
 * @param {Boolean} showAuthor
 * @param {String} fontFamily
 * @param {Number} lineHeight
 * @param {String} alignType
 */
export function drawContent(
  ctx,
  info,
  w,
  h,
  fontSize,
  color,
  slogan = '',
  marginTop = 0,
  showTitle = true,
  showAuthor = true,
  fontFamily = 'sans-serif', // 快应用不支持 new FontFace()
  lineHeight = 0,
  alignType = 'left'
) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, marginTop, w, h)
  ctx.fillStyle = '#ffffff'
  const minFontSize = $utils.minFontSize(w)
  const maxFontSize = $utils.maxFontSize(w)
  const lineWidth = $utils.lineWidthHandler(w) // 固定每行宽度
  const default_drawX = w * 0.06 // 固定一个左边距
  const content = info.content
  let title = info.title || ''
  let author = info.author || ''
  if (!showTitle) title = ''
  if (!showAuthor) author = ''
  const source = `${author} ${title}`
  if (fontSize < minFontSize) {
    fontSize = minFontSize
  }
  if (fontSize > maxFontSize) {
    fontSize = maxFontSize
  }

  ctx.fillStyle = color
  ctx.font = `${18}px normal ${fontFamily}`

  const minLineHeight = $utils.setLineHeight(fontSize)
  const maxLineHeight = $utils.maxLineHeight(fontSize)
  if (lineHeight < minLineHeight) {
    lineHeight = minLineHeight
  }
  if (lineHeight > maxLineHeight) {
    lineHeight = maxLineHeight
  }

  const lineNum = Math.ceil(lineWidth / fontSize)
  const lines = Math.ceil(content.length / lineNum)
  let drawX = default_drawX
  let sourceLeft = w - ctx.measureText(source).width - drawX

  if (alignType === 'right') {
    drawX = w - lineWidth - default_drawX
    sourceLeft = w - ctx.measureText(source).width - default_drawX
  }
  if (alignType === 'center') {
    drawX = (w - lineWidth) / 2
    sourceLeft = (w - ctx.measureText(source).width) / 2
  }
  if (w === h) {
    drawX = (w - lineWidth) / 2
  }
  let drawY = (h - lines * lineHeight) / 2 + marginTop

  if (!!title || !!author) {
    drawY = (h - lines * lineHeight + lineHeight) / 2 + marginTop - lineHeight
    let sourceTop = lines * lineHeight + drawY + lineHeight / 2
    ctx.fillText(source, sourceLeft, sourceTop)
  }
  textWrap(
    ctx,
    w,
    h,
    default_drawX,
    content,
    lineWidth,
    lineHeight,
    drawX,
    drawY,
    alignType
  )
  if (slogan !== '') {
    slogan = `分享自${slogan}快应用`
    const sloganSize = $utils.minFontSize(w)
    ctx.fillStyle = '#cccccc'
    ctx.globalAlpha = 0.6
    ctx.font = `${sloganSize}px normal ${fontFamily}`
    let sloganMarginLeft = (w - ctx.measureText(slogan).width) / 2
    let sloganMarginTop = h - 50 + marginTop
    ctx.fillText(slogan, sloganMarginLeft, sloganMarginTop)
    ctx.globalAlpha = 1
  }
  return lines
}

export function textWrap(
  ctx,
  w,
  h,
  default_drawX,
  content,
  lineWidth,
  lineHeight,
  drawX,
  drawY,
  alignType
) {
  const txtToatalWidth = ctx.measureText(content).width
  let drawTxt = '' // 当前绘制的内容
  let drawLine = 1 // 第几行开始绘制
  let drawIndex = 0 // 当前绘制内容的索引
  if (txtToatalWidth <= lineWidth) {
    ctx.fillText(content, drawX, drawY)
  } else {
    for (let i = 0; i < content.length; i++) {
      drawTxt += content[i]
      if (ctx.measureText(drawTxt).width >= lineWidth) {
        if (drawLine >= 10) {
          ctx.fillText(content.substring(drawIndex, i) + '..', drawX, drawY)
          break
        } else {
          ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY)
          drawIndex = i + 1
          drawLine += 1
          drawY += lineHeight
          drawTxt = ''
        }
      } else {
        //   内容绘制完毕，但是剩下的内容宽度不到rowWidth
        if (i === content.length - 1) {
          const lastConten = content.substring(drawIndex)
          if (alignType === 'right' && w !== h) {
            drawX = w - ctx.measureText(lastConten).width - default_drawX
          }
          ctx.fillText(lastConten, drawX, drawY)
        }
      }
    }
  }

  return drawY
}
