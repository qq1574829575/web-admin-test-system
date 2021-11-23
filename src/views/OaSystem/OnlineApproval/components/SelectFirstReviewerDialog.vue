<template>
  <!--选择第一级审核人弹窗-->
  <el-dialog
    title="选择第一级审核人"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="300px"
    :close-on-click-modal="false"
    modal-append-to-body
    @open="onOpen"
  >
    <el-select
      v-model="value"
      placeholder="请选择第一级审核人"
      style="margin-top: -30px;"
      size="mini"
      value-key="teacherId"
      multiple
    >
      <el-option
        v-for="item in mainLeadList"
        :key="item.teacherId"
        :label="item.teacherName"
        :value="item"
      />
    </el-select>
    <div style="text-align: right;margin-top: 20px;">
      <el-button
        type="primary"
        size="mini"
        @click="confirm"
      >
        确认
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="onClose"
      >
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'SelectFirstReviewer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Number,
      default: 1 // 1-主要领导 3-副校长 4-主要领导及副校长
    }
  },
  data() {
    return {
      mainLeadList: [],
      value: []
    }
  },
  methods: {
    onOpen() {
      if (this.mainLeadList.length === 0) {
        this.getMainLeadList()
      }
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    getMainLeadList() {
      this.$http.post('/jiangoaoffice/Office/work/GetMainLeadList.php', {
        param: rsaUtil.encryption({
          flag: this.flag
        })
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.mainLeadList = res.data.rows
      })
    },
    confirm() {
      if (this.value.length === 0) {
        this.$notify({
          type: 'warning',
          title: '提示',
          message: '请选择第一级审核人'
        })
        return
      }
      this.$emit('onSelect', this.value)
      this.onClose()
    }
  }
}
</script>

<style scoped>

</style>
