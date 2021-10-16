<template>
  <div class="sentence-poetry-card">
    <block for="{{info}}">
      <text class="item-type">{{ $item.type }}</text>
      <stack>
        <canvas
          style="width:{{cvsWidth}}px;height:{{cvsHeight}}px;"
          id="canvas{{$idx}}"
          data-info="{{$item}}"
          @appear="appear($idx)"
          class="dk12ujdh6"
        ></canvas>
        <div
          @click="clickHandler($item)"
          if="{{$item.type === '诗歌' || $item.type === '诗词'}}"
        >
          <div
            class="card-poetry"
            style="width:{{width}}px;height:{{height}}px;margin-left:{{shadowRange}}px"
          >
            <div class="content">
              <richtext type="html">{{ $item.html.abstract }}</richtext>
            </div>
            <text class="border"></text>
            <div class="footer">
              <text class="title">{{ $item.title }}</text>
              <text class="author">{{ $item.author }}</text>
            </div>
          </div>
        </div>
        <div @click="clickHandler($item)" if="{{$item.type === '文章'}}">
          <div
            class="card-article"
            style="width:{{width}}px;height:{{height}}px;margin-left:{{shadowRange}}px"
          >
            <text class="title">{{ $item.title }}</text>
            <div class="author">
              <image src="../../assets/images/icon/author.png"></image>
              <text>{{ $item.author }}</text>
            </div>
            <text class="abstract">{{ $item.abstract }}</text>
          </div>
        </div>
        <div @click="clickHandler($item)" if="{{$item.type === '话题'}}">
          <div
            class="card-tag"
            style="width:{{width}}px;height:{{height}}px;margin-left:{{shadowRange}}px"
          >
            <text class="title">{{ $item.title }}</text>
            <text class="abstract">{{ $item.abstract }}</text>
            <div class="tag-detail">
              <div class="right">
                <block for="{{(index,ele) in $item.userportrait}}">
                  <image class="img_{{index}}" src="{{ele}}"></image>
                </block>
              </div>
              <div class="left">
                <div class="icon"></div>
                <text>正在讨论</text>
              </div>
            </div>
          </div>
        </div>
        <div @click="clickHandler($item)" if="{{$item.type === '词典'}}">
          <div
            class="card-word"
            style="width:{{width}}px;height:{{height}}px;margin-left:{{shadowRange}}px"
          >
            <div class="word">
              <block for="{{(index,ele) in $item.content}}">
                <div class="word-item word_{{index}}">
                  <text>{{ ele.spell }}</text>
                  <text class="font">{{ ele.word }}</text>
                </div>
              </block>
            </div>
            <div class="line"></div>
            <div class="paraphrase">
              <text class="name">释义</text>
              <text class="content">{{ $item.paraphrase }}</text>
            </div>
          </div>
        </div>
        <div @click="clickHandler($item)" if="{{$item.type === '金句'}}">
          <div
            class="card-title"
            style="width:{{width}}px;height:{{height}}px;margin-left:{{shadowRange}}px"
          >
            <text class="content">{{ $item.content }}</text>
            <div class="line"></div>
            <div class="footer">
              <div class="left">
                <text class="title">{{ $item.title }}</text>
                <text class="author">{{ $item.author }}</text>
              </div>
              <image src="{{$item.cover}}" class="right"></image>
            </div>
          </div>
        </div>
      </stack>
      <div class="item-footer" @click="loadMore($item.type)">
        <text>更多{{ $item.type }}</text>
        <image src="../../assets/images/icon/more.png"></image>
      </div>
    </block>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 690
    },
    height: {
      type: Number,
      default: 790
    },
    info: {
      type: Array,
      default: []
    }
  },
  data: {
    shadowRange: 20,
    cvsWidth: 0,
    cvsHeight: 0
  },
  onInit() {
    this.cvsWidth = this.shadowRange * 2 + this.width
    this.cvsHeight = this.shadowRange * 2 + this.height
  },
  appear(idx) {
    this.draw(idx)
  },
  draw(idx) {
    const cvs = this.$element(`canvas${idx}`)
    const ctx = cvs.getContext('2d')
    const info = cvs.dataset.info
    const r = this.shadowRange
    let h = this.height
    const w = this.width
    const p = Math.PI
    ctx.shadowBlur = this.shadowRange
    ctx.shadowColor = '#eeeeee'
    ctx.fillStyle = '#ffffff'
    const linGrad = ctx.createLinearGradient(r, 0, w, h)
    if (info.type === '词典') {
      ctx.fillStyle = info.bgcolor
    }
    if (info.type === '金句') {
      linGrad.addColorStop(0, info.bgcolor[0])
      linGrad.addColorStop(1, info.bgcolor[1])
      ctx.fillStyle = linGrad
    }
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.beginPath()
    ctx.moveTo(r * 2, r)
    ctx.arc(r * 2, r * 2, r, -p / 2, -p, true)
    ctx.lineTo(r, h)
    ctx.arc(r * 2, h, r, p, p / 2, true)
    ctx.lineTo(w, h + r)
    ctx.arc(w, h, r, p / 2, 0, true)
    ctx.lineTo(w + r, r * 2)
    ctx.arc(w, r * 2, r, 0, -p / 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(r * 2, r)
    ctx.arc(r * 2, r * 2, r, -p / 2, -p, true)
    let img = new Image()
    if (info.type === '话题' || info.type === '文章') {
      img.src = info.image
      h = info.type === '话题' ? h * 0.5 : h * 0.6
      img.onload = () => {
        ctx.drawImage(img, r, 0, w, h)
        ctx.beginPath()
        ctx.moveTo(r, 0)
        ctx.arc(r * 2, r, r, -p / 2, -p, true)
        ctx.closePath()
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(w + r, 0)
        ctx.arc(w, r, r, 0, -p / 2, true)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }
    }
    if (info.type === '词典') {
      ctx.beginPath()
      ctx.moveTo(r * 4, r * 3)
      ctx.arc(r * 4, r * 4, r, -p / 2, -p, true)
      ctx.lineTo(r * 3, h - 2 * r)
      ctx.arc(r * 4, h - r * 2, r, p, p / 2, true)
      ctx.lineTo(w - 2 * r, h - r)
      ctx.arc(w - 2 * r, h - 2 * r, r, p / 2, 0, true)
      ctx.lineTo(w - r, r * 4)
      ctx.arc(w - 2 * r, r * 4, r, 0, -p / 2, true)
      ctx.closePath()
      ctx.strokeStyle = '#ffffff'
      ctx.stroke()
    }
    ctx.shadowColor = '#ffffff'
    ctx.shadowBlur = 0
  },
  clickHandler(data) {
    this.$emit('detail', { data })
  },
  loadMore(type) {
    this.$emit('loadMore', { type })
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/style.scss';
.sentence-poetry-card {
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .item-type {
    width: 100%;
    align-self: flex-start;
    color: #000000;
    font-weight: bold;
    font-size: 7 * $size-factor;
    padding: 10 * $size-factor 0 6 * $size-factor 6 * $size-factor;
  }
}
.card-poetry {
  align-self: center;
  flex-direction: column;
  padding: 30px;
  justify-content: center;
  .content {
    width: 100%;
    height: 100%;
    align-items: center;
    flex: 1;
    justify-content: center;
    .abstract {
      font-size: 45px;
      font-weight: bold;
      color: #000000;
    }
  }
  .footer {
    height: 150px;
    width: 100%;
    padding-top: 30px;
    flex-direction: column;
    .title {
      font-size: 36px;
      font-weight: bold;
      color: #000000;
    }
    .author {
      font-weight: bold;
      margin-top: 10px;
    }
  }
  .border {
    height: 5px;
    background-color: #cccccc;
    width: 100px;
  }
}
.card-article {
  width: 100%;
  flex-direction: column;
  align-self: center;
  justify-content: flex-end;
  padding: 30px;
  .image {
    width: 100%;
    height: 65%;
  }
  .title {
    font-size: 50px;
    color: #000000;
  }
  .author {
    margin-top: 20px;
    text {
      margin-left: 5px;
    }
  }
  .abstract {
    margin: 20px 0;
    font-size: 36px;
    color: #616161;
  }
}
.card-tag {
  width: 100%;
  flex-direction: column;
  align-self: center;
  justify-content: flex-end;
  padding: 30px;
  image {
    width: 50px;
    height: 50px;
    border: 1px solid #fefefe;
    border-radius: 25px;
  }
  .tag-detail {
    background-color: #f2f2f2;
    height: 80px;
    align-items: center;
    border-radius: 40px;
    padding: 0 20px;
    margin: 20px 0;
    .right {
      flex: 1;
      align-items: center;
      align-content: flex-start;
      .img_1 {
        left: -10px;
      }
      .img_2 {
        left: -20px;
      }
    }
    .left {
      align-items: center;
      justify-content: flex-end;
      flex: 1;
      .icon {
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background-color: #5fd7a7;
      }
      text {
        padding: 0 20px;
      }
    }
  }
  .title {
    font-size: 45px;
    color: #000000;
  }
  .abstract {
    font-size: 34px;
    padding: 30px 0;
  }
}
.card-word {
  width: 100%;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  padding: 80px;
  .line {
    height: 2px;
    width: 100%;
    background-color: #fff;
  }
  .word {
    width: 100%;
    flex: 1;
    .word-item {
      flex-direction: column;
      flex: 1;
      align-items: center;
      align-self: flex-end;
      justify-content: center;
      padding-bottom: 30px;
      text {
        color: #ffffff;
      }
      .font {
        font-size: 50px;
        font-weight: bold;
      }
    }
  }
  .paraphrase {
    width: 100%;
    flex: 1;
    align-items: flex-start;
    justify-content: center;
    padding-top: 30px;
    text {
      color: #ffffff;
      line-height: 60px;
    }
    .name {
      width: 15%;
      padding: 0 20px;
      text-align: center;
      align-items: center;
      justify-content: center;
    }
    .content {
      width: 85%;
      padding-left: 20px;
      border-left: 1px solid #ffffff;
    }
  }
}
.card-title {
  width: 100%;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  padding: 30px;
  text {
    color: #ffffff;
    line-height: 60px;
    font-size: 32px;
  }
  .content {
    flex: 1;
    width: 100%;
  }
  .line {
    height: 1px;
    width: 80px;
    background-color: #fff;
  }
  .footer {
    width: 100%;
    justify-content: space-between;
    height: 20%;
    align-items: center;
    .left {
      flex-direction: column;
      justify-content: center;
      .author {
        font-size: 28px;
      }
    }
    image {
      height: 80%;
    }
  }
}
.item-footer {
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text {
    color: #44a4f5;
    padding-right: 5px;
    font-weight: bold;
  }
  image {
    width: 35px;
    height: 35px;
  }
}
</style>
