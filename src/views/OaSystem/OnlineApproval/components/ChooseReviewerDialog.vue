<template>
  <el-dialog
    title="添加流程节点"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="500px"
    modal-append-to-body
    :close-on-click-modal="false"
    @open="onOpen"
  >
    <div style="width: 50%;margin: 0 auto">
      <div style="margin-bottom: 20px;">请至少为节点添加一个审核人:</div>
      <el-cascader
        v-model="selectedReviewer"
        :options="deptList"
        placeholder="请输入名字搜索"
        :props="{multiple: true}"
        filterable
      />
    </div>
    <div style="text-align: right;margin-top: 20px;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'ChooseReviewerDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedReviewer: [],
      deptList: []
    }
  },
  methods: {
    onOpen() {
      if (this.deptList && this.deptList.length > 0) {
        return
      }
      this.getDeptList()
    },
    onClose() {
      this.selectedReviewer = []
      this.$emit('update:visible', false)
    },
    getDeptList() {
      this.$http
        .post('/jiangoaoffice/Office/work/GetDeptTeacherZwList.php', {
          param: rsaUtil.encryption()
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        })
        .then(res => {
          this.deptList = res.data.rows.map(row => {
            return {
              label: row.deptName,
              value: {
                deptId: row.deptId,
                deptName: row.deptName
              },
              children: row.deptArr.map(teacher => {
                return {
                  label: teacher.nodePosition,
                  value: {
                    nodeDeptId: teacher.nodeDeptId,
                    nodePosition: teacher.nodePosition,
                    teacherNo: teacher.teacherNo
                  },
                  children: teacher.childArr !== undefined ? teacher.childArr.map(child => {
                    return {
                      label: child.nodePosition,
                      value: {
                        nodeDeptId: child.nodeDeptId,
                        nodePosition: child.nodePosition,
                        teacherNo: child.teacherNo
                      }
                    }
                  }) : null
                }
              })
            }
          })
          console.log(this.deptList)
        })
    },
    confirm() {
      if (this.selectedReviewer.length === 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请选择流程节点审核人'
        })
        return
      }
      this.$emit('onChoose', this.selectedReviewer)
      this.onClose()
    }
  }
}
</script>

<style lang="scss">
.my-cascader-menu {
  .el-cascader-menu__wrap {
    height: 500px;
    width: 300px;
    overflow: scroll;
  }
}
</style>
