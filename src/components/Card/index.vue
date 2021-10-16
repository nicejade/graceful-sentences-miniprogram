<template>
  <div class="sentence-normal-card">
    <canvas
      type="2d"
      :style="canvasStyleStr"
      :id="'canvas-' + idx"
      :data-info="info"
      :canvas-id="'canvas-' + idx"
      @click="clickHandler"
    ></canvas>
  </div>
</template>

<script>
import { drawContent } from '../../assets/data/utils.js'

export default {
  data () {
    return {
      lines: 0,
      alpha: 0,
      folderName: 'custom-folder'
    }
  },

  props: {
    idx: {
      type: Number,
      default: '-1'
    },
    id: {
      type: String,
      default: '-1'
    },
    info: {
      type: Object,
      default: {}
    },
    height: 0,
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
    hasTitle: {
      type: Boolean,
      default: true
    },
    hasAuthor: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: Number,
      default: 0
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

  computed: {
    canvasStyleStr () {
      return `width:${this.width}px;height:${this.height}px;background-color:#ffffff;`
    }
  },

  created() {
    this.alpha = this.globalAlpha / 10
    this.$watch('globalAlpha', 'watchGlobalAlpha')
  },

  mounted() {
    setTimeout(() => {
      this.drawCard(this.idx, this.info)
    }, 300)
  },

  methods: {
    watchGlobalAlpha(newV, oldV) {
      this.alpha = newV
      this.drawCard(this.idx, this.info)
    },

    clickHandler() {
      // this.$emit('detail', { data: this.info })
    },

    /**
     * @param {Number} idx
     * @param {Object} info
     * @param {Number} font
     * @param {Number} fontSize
     * @param {Boolean} hasTitle
     * @param {Boolean} hasAuthor
     * @param {Number} lineHeight
     * @param {String} alignType
     */
    drawCard(idx, info) {
      const res = wx.getSystemInfoSync()
      const screenWidth = res.screenWidth
      const dpr = res.pixelRatio

      const query = wx.createSelectorQuery()
      query.select(`#canvas-${idx}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, screenWidth, this.height)
          this.drawLunarDate(ctx, info.calendar, screenWidth, 100)
          const contentHeight = this.height - 50

          this.lines = drawContent(
            ctx,
            info.data,
            screenWidth,
            contentHeight,
            16,
            '#000000',
            this.slogan,
            100,
            // hasTitle,
            // hasAuthor,
            // font,
            // lineHeight,
            // alignType
          )
          this.drawNewDate(ctx, info.calendar, screenWidth, 200)
        })
    },

    drawNewDate(ctx, calendar, sw, sh) {
      const { currentDay, currentMonth, currentYear, ncWeek } = calendar
      const dateSize = sw / 3.5 // 当日 文字大小
      const YTDSize = sw / 28 // 年月及星期 文字大小
      // 阳历
      const date = currentDay > 9 ? currentDay : '0' + currentDay
      const month = currentMonth > 9 ? currentMonth : '0' + currentMonth
      const year = currentYear
      const day = ncWeek

      // 绘制日期信息
      let marginLeft = sw / 15
      let marginTop = sh + dateSize * 0.2
      ctx.font = `${dateSize}px bold sans-serif`
      ctx.fillStyle = 'black'

      // 当日 上白下黑
      // ****快应用的globalCompositeOperation有bug，无效****
      // ctx.fillText(`${date}`, marginLeft, marginTop)
      // ctx.fillStyle = "white";
      // ctx.fillRect(0, sh - dateSize / 2, sw, dateSize / 2);
      // ctx.fillStyle = "white"
      // ctx.globalCompositeOperation = "destination-in"

      // 当日 纯黑色
      ctx.fillText(`${date}`, marginLeft, marginTop)

      // 年月
      ctx.font = `${YTDSize}px normal sans-serif`
      const ytd = `${year}.${month}  ${day}`
      marginLeft = Math.ceil(sw - ctx.measureText(ytd).width) - marginLeft
      ctx.fillText(ytd, marginLeft, marginTop)
    },

    drawLunarDate(ctx, calendar, sw, sh) {
      // 获取日期信息
      const { Animal, IDayCn, IMonthCn, gzDay, gzMonth, gzYear } = calendar
      const YTDSize = sw / 28 // 年月及星期 文字大小
      // 阴历日期 图片蒙层
      ctx.font = `${YTDSize}px sans-serif`
      ctx.fillStyle = '#212121'
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 0.8
      const len = 10,
        oldx = sw - 80,
        oldy = 10
      let dx = oldx,
        dy = oldy

      dy = this.lunarDateHandler(ctx, IMonthCn, dx, dy)
      dy = this.lunarDateHandler(ctx, IDayCn, dx, dy)

      let tempMargin = this.lunarDateBorderLeft(ctx, oldy, dx, dy, -len)
      dx = tempMargin.dx
      dy = tempMargin.dy

      dy = this.lunarDateHandler(ctx, gzMonth, dx, dy, '月')
      dy = this.lunarDateHandler(ctx, gzDay, dx, dy, '日')

      tempMargin = this.lunarDateBorderLeft(ctx, oldy, dx, dy, -len)
      dx = tempMargin.dx
      dy = tempMargin.dy

      dy = this.lunarDateHandler(ctx, gzYear, dx, dy, Animal)
      ctx.fillText('年', dx, dy)
      this.lunarDateBorderLeft(ctx, oldy, dx, dy, len)
    },
    lunarDateHandler(ctx, arr, dx, dy, word = '') {
      // 决定字体纵向间距；
      const marginV = 15,
        marginH = 10
      arr.split('').forEach(ele => {
        ctx.fillText(ele, dx, dy)
        dy += marginV
      })
      if (word !== '') {
        ctx.fillText(word, dx, dy)
        dy += marginV
      }
      return dy
    },
    lunarDateBorderLeft(ctx, oldy, dx, dy, len) {
      const marginV = 30,
        marginH = 10
      ctx.moveTo(dx - marginH, oldy - marginV)
      ctx.lineTo(dx - marginH, dy + len)
      ctx.stroke()
      return { dy: oldy, dx: dx + 20 }
    },
    getCvs() {
      return this.$element(`canvas${this.idx}`)
    }
  }
}
</script>

<style lang="less">
.sentence-normal-card {
  width: 100%;
  height: 100%;
}
</style>
