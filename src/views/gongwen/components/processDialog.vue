<template>
  <div>
    <el-button type="text" size="mini" @click="handleClick">查看处理进度</el-button>
    <el-dialog :visible.sync="visible" title="公文处理进度">
      <el-form ref="form" v-loading="loading" :model="gongwen" label-width="100px" label-position="left">
        <el-form-item label="处理进度">
          <el-scrollbar v-if="data !== null && data.length > 0" style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
            <el-tree
              :data="data"
              accordion
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>发给:{{ data.teacherName }}</span>
                <span>
                  <el-tag v-if="data.isRead === '1'" size="mini" type="success">已查阅</el-tag>
                  <el-tag v-else size="mini" type="danger">未查阅</el-tag>
                  <el-tag v-if="data.isTransmit === '1'" style="margin-left: 2px" size="mini" type="success">已处理</el-tag>
                  <el-tag v-else size="mini" style="margin-left: 2px" type="danger">未处理</el-tag>
                  <el-tag style="margin-left: 2px" size="mini">处理内容：{{ data.remarkContent }}</el-tag>
                </span>
              </span></el-tree>
          </el-scrollbar>
          <div v-else>您暂未处理此公文，无法查看处理进度</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'ProcessDialog',
  props: {
    gongwen: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      data: [],
      defaultProps: {
        children: 'child',
        label: 'teacherNo'
      }
    }
  },
  methods: {
    handleClick() {
      this.visible = true
      this.getRecordHandleList()
    },
    getRecordHandleList() {
      request({
        url: '/jiangoaoffice/Office/office/GetRecordHandleList.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school({
            teacherNo: 'FB0051', // 此处应更改为当前登录系统的教职工号
            recordId: this.gongwen.recordId === undefined ? '0' : this.gongwen.recordId,
            fileId: this.gongwen.recordId === undefined ? this.gongwen.fileId : ''
          })
        }
      }).then((res) => {
        this.data = res.rows
      })
    },
    handlePreviewGongwen() {
      window.open(this.gongwen.fileAddr)
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
