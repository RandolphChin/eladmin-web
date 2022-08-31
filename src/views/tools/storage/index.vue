<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="本地存储" name="first">
      <Local ref="local" />
    </el-tab-pane>
    <el-tab-pane label="其他存储" name="second">
      <QiNiu ref="qiNiu" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Local from './local/index'
import QiNiu from './qiniu/index'
export default {
  name: 'Storage',
  components: { Local, QiNiu },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'first') {
        this.$refs.local.crud.toQuery()
      } else {
        // this.$refs.qiNiu.crud.toQuery()
      }
    }
  }
}
</script>

<style scoped>
</style>
