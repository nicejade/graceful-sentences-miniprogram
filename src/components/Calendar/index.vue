<template>
  <div class="sentence-calendar" :style="sentenceStyleStr">
    <swiper
      class="calendar"
      :style="sentenceStyleStr"
      :indicator="false"
      :autoplay="false"
      :index="currentIdx"
      @change="changeSwiper">
      <block v-for="(item, index) in arrayData" :key="index">
        <swiper-item :item-id="index" class="calendar-item">
          <Card
            :idx="index"
            :id="'card' + index"
            :height="height"
            :width="width"
            :info="item"
            :global-alpha="globalAlpha"
            :font-size="fontSize"
            @detail="detailPage"
          ></Card>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
import Card from "../../components/Card"
import calendar from '../../assets/data/lunar-calendar.js'
import { getData } from '../../assets/data/utils.js'

export default {
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  data () {
    return {
      title: '今日美句',
      favor: '../`../assets/images/icon/normal-favor.png',
      favorActive: '../../assets/images/icon/favor-active.png',
      isFavor: false,
      arrayData: [],
      currentIdx: 0,
      width: 0,
      height: 0,
      titleBarHeight: 0,
      globalAlpha: 2,
      fontSize: 0
    }
  },

  components: {
    Card,
  },

  computed: {
    sentenceStyleStr () {
      return `width:${this.width}px;height:${this.height}px;background-color:#ffffff;`
    }
  },

  props: {},

  created() {
    console.log('Calendar created.')
    const res = wx.getSystemInfoSync()
    const screenWidth = res.screenWidth
    const screenHeight = res.screenHeight

    this.width = screenWidth
    this.height = screenHeight
    this.fontSize = 36
    const pathName = '../../assets/images/home_imgs'
    this.arrayData = getData(pathName, calendar)
    // $utils.setStorage('totalData', JSON.stringify(this.arrayData))
  },

  methods: {
    changeSwiper(e) {
      this.currentIdx = e.index
    },
    favorHandler() {
      this.isFavor = !this.isFavor
    },
    shareCardHandler() {
      this.$emit('share', {
        info: this.arrayData[this.currentIdx],
        idx: this.currentIdx
      })
    },
    detailPage(e) {
      let info = e.detail.data.data
      this.goDetailPage(info)
    },
    goDetailPage(info) {
    }
  }
}
</script>

<style lang="less">
@import './../../assets/less/variables.less';
@import './../../assets/less/mixins.less';

@size-factor: 10px;

.sentence-calendar {
  background-color: #f0f0f0;
  width: 100%;
  .calendar {
    width: 100%;
    .calendar-item {
      width: 100%;
      height: 100%;
    }
  }
  .btn {
    width: 90 * @size-factor;
    height: 16 * @size-factor;
    border-radius: 8 * @size-factor;
    background-color: @brand;
    color: #ffffff;
    font-size: 30px;
    margin-top: 16 * @size-factor;
  }
}
</style>
