<template>
  <div class="sentence-card">
    <canvas
      id="canvas"
      class="dk12ujdh6"
      style="width:{{width}}px;height:{{height}}px;background-color:#ffffff;"
    ></canvas>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: {}
    },
    width: 0,
    height: 0,
    fontSize: 0,
    lineHeight: 0,
    slogan: {
      type: String,
      default: ''
    },
    font: {
      type: String,
      default: 'sans-serif'
    },
    fontSize: {
      type: Number,
      default: 0
    },
    alignType: {
      type: String,
      default: 'left'
    },
    lineHeight: {
      type: Number,
      default: 0
    }
  },
  onReady() {
    let info = this.info
    this.drawCard(
      info,
      this.font,
      this.fontSize,
      this.lineHeight,
      this.alignType,
      '#ffffff',
      '#000000'
    )
  },
  drawCard(
    info,
    font,
    fontSize,
    lineHeight,
    alignType,
    bgcolor = '#ffffff',
    color = '#000000'
  ) {
    const canvas = this.$element('canvas') //获取 canvas 组件
    const ctx = canvas.getContext('2d') //获取 canvas 绘图上下文
    let w = this.width,
      h = this.height
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    // 标题
    let {
      lines,
      titleBarHeight,
      titleSize,
      sourceSize,
      cardTop,
      cardBottom,
      sourceTop,
      sourceBottom
    } = this.$parent().cardSizeHandler()
    const source = `${info.dynasty} • ${info.author}`
    const contentArr = info.content.split('/')
    ctx.globalAlpha = 1
    ctx.fillStyle = bgcolor
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = color
    // 标题
    ctx.font = `${titleSize}px bold sans-serif`
    let dx = (w - ctx.measureText(info.title).width) / 2
    let dy = cardTop
    ctx.fillText(info.title, dx, dy)
    // 来源（作者）
    ctx.font = `${sourceSize}px normal sans-serif`
    dx = (w - ctx.measureText(source).width) / 2
    dy = dy + sourceTop + titleSize
    ctx.fillText(source, dx, dy)
    // 内容
    dy = dy + sourceSize + sourceBottom
    this.drawContent(
      ctx,
      info,
      w,
      h,
      dy,
      contentArr,
      font,
      fontSize,
      lineHeight,
      alignType,
      color
    )
    // slogan
    const txt = `分享自${this.slogan}快应用`
    const sloganSize = $utils.minFontSize(w)
    ctx.fillStyle = color
    ctx.globalAlpha = 0.3
    ctx.font = `${sloganSize}px normal sans-serif`
    dx = (w - ctx.measureText(txt).width) / 2
    ctx.fillText(txt, dx, this.height - 50)
  },
  drawContent(
    ctx,
    info,
    w,
    h,
    dy,
    arr,
    font,
    fontSize,
    lineHeight,
    alignType,
    color
  ) {
    const lineWidth = $utils.lineWidthHandler(w) // 固定每行宽度
    const default_drawX = w * 0.06 // 固定一个左边距
    let drawX = default_drawX
    ctx.fillStyle = color
    ctx.globalAlpha = 1
    ctx.font = `${fontSize}px normal ${font}`
    if (info.dynasty !== '现代') {
      let lenArr = []
      arr.forEach(ele => lenArr.push(ele.length))
      let maxCount = Math.max(...lenArr)
      let temp = arr.filter(ele => ele.length === maxCount)
      drawX = (w - ctx.measureText(temp[0]).width) / 2
    }
    for (let i = 0; i < arr.length; i++) {
      dy += lineHeight
      if (arr[i].length * fontSize > lineWidth) {
        drawX = (this.width - lineWidth) / 2
        let obj = this.textWrap(
          ctx,
          arr[i],
          drawX,
          dy,
          lineWidth,
          lineHeight,
          fontSize
        )
        dy = obj.drawY
        drawX = obj.drawX
      } else {
        const element = arr[i]
        ctx.fillText(element, drawX, dy)
      }
    }
  },
  textWrap(ctx, content, drawX, drawY, lineWidth, lineHeight, fontSize) {
    let totalWidth = content.length * fontSize
    let lineIdx = 0
    let drawWidth = 0
    let lineNum = 0
    let lastWidth = 0
    if (totalWidth > lineWidth) {
      for (let i = 0; i < Math.floor(totalWidth / lineWidth); i++) {
        lineNum += Math.floor((lineWidth - drawWidth) / fontSize)
        ctx.fillText(content.substring(lineIdx, lineNum), drawX, drawY)
        drawY += lineHeight
        lineIdx += lineNum
      }
      ctx.fillText(content.substring(lineIdx), drawX, drawY)
      lastWidth = (content.length - lineIdx) * fontSize
    }
    if (lastWidth < lineWidth) {
      drawY = drawY - lineHeight
      drawX = drawX + lastWidth
    }
    return { drawX, drawY }
  },
  getCvs() {
    return this.$element(`canvas`)
  }
}
</script>

<style lang="scss">
@import './../../assets/styles/style.scss';
</style>
