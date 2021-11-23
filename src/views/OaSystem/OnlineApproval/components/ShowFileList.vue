<template>
  <div>
    <div v-if="fileList && fileList.length > 0" style="display: flex;flex-wrap: wrap;">
      <el-link
        v-for="(file, index) in fileList"
        :key="index"
        type="primary"
        :href="file.accessoryAddr"
        style="margin-right: 20px"
      >
        {{ file.accessoryTitle }}
        <i
          class="el-icon-download el-icon--right"
          style="font-size: 15px;"
        />
      </el-link>
    </div>
    <div v-else>无</div>
  </div>
</template>

<script>
export default {
  name: 'ShowFileList',
  props: {
    fileList: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
