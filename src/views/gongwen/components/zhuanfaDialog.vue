<template>
  <div>
    <el-button type="text" size="mini" @click="handleClick">处理</el-button>
    <el-dialog :visible.sync="visible" title="处理公文" width="30%">
      <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="处理内容" prop="remark">
          <el-input v-model="form.remark" placeholder="处理内容" />
        </el-form-item>
        <el-form-item label="转发给">
          <el-cascader v-model="teacherList" :props="props" collapse-tags clearable style="width: 100%;" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirm">确认处理</el-button>
        <el-button type="danger" @click="visible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'ZhuanfaDialog',
  props: {
    gongwen: {
      type: Object,
      default: null
    },
    adminFlag: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        remark: ''
      },
      rules: {
        remark: [{ required: true, trigger: 'blur', message: '请输入处理内容' }]
      },
      teacherList: [],
      props: {
        multiple: true,
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node
          if (level === 0) {
            request({
              url: '/jiangoaoffice/Office/office/GetDeptList.php',
              method: 'post',
              baseURL: 'http://www.unifiedplatform.guolianrobot.com',
              data: {
                param: rsaUtil.encryption_school()
              }
            }).then((res) => {
              const nodes = []
              for (const item of res.rows) {
                nodes.push({
                  value: item.deptId,
                  label: item.deptName,
                  leaf: node.level >= 1
                })
              }
              resolve(nodes)
            })
          } else {
            request({
              url: '/jiangoaoffice/Office/office/GetTeacherList.php',
              method: 'post',
              baseURL: 'http://www.unifiedplatform.guolianrobot.com',
              data: {
                param: rsaUtil.encryption_school({
                  deptName: node.label
                })
              }
            }).then((res) => {
              const nodes = []
              for (const item of res.rows) {
                nodes.push({
                  value: item.teacherNo,
                  label: item.teacherName,
                  leaf: node.level >= 1
                })
              }
              resolve(nodes)
            })
          }
        }
      }
    }
  },
  methods: {
    handleClick() {
      this.visible = true
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const teacherNoArr = []
          for (const item of this.teacherList) {
            teacherNoArr.push(item[1])
          }
          request({
            url: '/jiangoaoffice/Office/office/CreateOfficeShareRecord.php',
            method: 'post',
            baseURL: 'http://www.unifiedplatform.guolianrobot.com',
            data: {
              param: rsaUtil.encryption_school(),
              teacherNoArr: JSON.stringify(teacherNoArr),
              fileId: this.gongwen.fileId,
              remark: this.form.remark,
              superId: this.gongwen.recordId,
              adminFlag: this.adminFlag
            }
          }).then(res => {
            if (res.code === 1) {
              this.$notify({
                title: '提示',
                dangerouslyUseHTMLString: true,
                message: '处理成功',
                type: 'success'
              })
              // 通知父组件处理成功了
              this.$emit('onHandleSuccess')
            }
            this.loading = false
            this.visible = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
