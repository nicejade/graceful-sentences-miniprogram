<template>
  <div class="sentence-square-card">
    <canvas
      class="card dk12ujdh6"
      id="canvas"
      style="width:{{width}}px;height:{{width}}px"
    >
    </canvas>
  </div>
</template>

<script>
import { drawContent } from '../../assets/data/utils.js'
export default {
  onReady() {
    this.drawCard(this.info)
  },
  data: {
    alpha: 0
  },
  props: {
    info: {
      type: Object,
      default: {}
    },
    width: 0,
    slogan: {
      type: String,
      default: ''
    },
    globalAlpha: {
      type: Number,
      default: 0
    },
    font: {
      type: String,
      default: 'sans-serif'
    },
    fontSize: {
      type: Number,
      default: 0
    },
    hasTitle: {
      type: Boolean,
      default: true
    },
    hasAuthor: {
      type: Boolean,
      default: true
    },
    lineHeight: {
      type: Number,
      default: 0
    },
    alignType: {
      type: String,
      default: 'left'
    }
  },
  onInit() {
    this.$watch('globalAlpha', 'watchGlobalAlpha')
  },
  watchGlobalAlpha(newV, oldV) {
    this.alpha = newV
    this.drawCard(this.info)
  },
  drawCard(
    info,
    font = this.font,
    fontSize = this.fontSize,
    hasTitle = this.hasTitle,
    hasAuthor = this.hasAuthor,
    lineHeight = this.lineHeight,
    alignType = this.alignType
  ) {
    const cvs = this.$element('canvas')
    const ctx = cvs.getContext('2d')
    const img = new Image()
    const h = this.width,
      w = this.width
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    img.src = info.image
    img.onload = () => {
      let dw = 0,
        dh = 0
      dw = w
      dh = dw / (img.width / img.height)
      if (dh < h) {
        dh = h
        dw = dh * (img.width / img.height)
      }
      ctx.drawImage(
        img,
        0,
        -(dh - h) / 2,
        img.width,
        img.height,
        0,
        -(dh - h),
        dw,
        dh
      )
      // 明暗度
      ctx.globalAlpha = this.alpha
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1 // 还原默认透明度 1
      const fontSize = $utils.setFontSize(w)
      // 内容
      drawContent(
        ctx,
        info,
        w,
        h,
        fontSize,
        '#ffffff',
        this.slogan,
        0,
        hasTitle,
        hasAuthor,
        font,
        lineHeight,
        alignType
      )
    }
  },
  getCvs() {
    return this.$element('canvas')
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/style.scss';
.sentence-square-card {
  flex: 1;
  flex-direction: column;
  .card {
    width: 100%;
    height: 100%;
  }
}
</style>
