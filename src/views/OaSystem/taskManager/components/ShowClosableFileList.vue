<template>
  <div style="display: flex;flex-wrap: wrap;">
    <el-tag
      v-for="(file,index) in fileList"
      :key="index"
      closable
      :disable-transitions="false"
      type="success"
      style="margin-right: 10px;margin-top: 5px;"
      @close="delFile(index,file)"
    >
      {{ file.accessoryTitle }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'ShowClosableFileList',
  props: {
    fileList: {
      type: Array,
      default: function() {
        return []
      }
    },
    delFile: {
      type: Function,
      default: function() {}
    }
  }
}
</script>

<style scoped>

</style>
