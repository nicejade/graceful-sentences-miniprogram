<template>
  <div class="wrapper">
    <Calendar />
  </div>
</template>

<script>
import Calendar from './../../components/Calendar'

export default {
  name: 'Index',

  data() {
    return {
      title: ''
    }
  },

  components: {
    Calendar,
  },

  beforeCreate() {},

  created() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="less">
.wrapper {
  width: 100%;
  height: 100%;
  background-color: red;
}
</style>
