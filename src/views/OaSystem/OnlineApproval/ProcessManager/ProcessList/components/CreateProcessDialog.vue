<template>
  <el-dialog
    title="创建流程"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="600px"
    :close-on-click-modal="false"
    modal-append-to-body
    @open="onOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="教师" prop="teacher">
        <el-cascader
          v-model="form.teacher"
          :options="teacherList"
          placeholder="搜索教师"
          filterable
        />
      </el-form-item>
      <el-form-item label="分管部门" prop="dept">
        <el-select v-model="form.dept" filterable placeholder="请选择分管部门">
          <el-option
            v-for="(item,index) in deptList"
            :key="index"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: right;margin-top: 20px;">
      <el-button type="primary" @click="confirm">确认添加</el-button>
      <el-button @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'CreateDeptPassDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      teacherList: [],
      deptList: [],
      form: {
        teacher: [],
        dept: ''
      },
      rules: {
        teacher: [{ required: true, trigger: 'change', message: '请选择教师' }],
        dept: [{ required: true, trigger: 'change', message: '请选择分管部门' }]
      }
    }
  },
  mounted() {
    this.getTeacherList()
    this.getDeptList()
  },
  methods: {
    onOpen() {
    },
    onClose() {
      this.form.teacher = []
      this.form.dept = ''
      this.$emit('update:visible', false)
    },
    getTeacherList() {
      this.$http
        .post('/jiangoaoffice/Office/task/GetDeptTeacherList.php', {
          param: rsaUtil.encryption()
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        })
        .then(res => {
          this.teacherList = res.data.rows.map(row => {
            return {
              label: row.deptName,
              value: {
                deptId: row.deptId,
                deptName: row.deptName
              },
              children: row.deptArr.map(teacher => {
                return {
                  label: teacher.teacherName,
                  value: teacher.teacherId
                }
              })
            }
          })
        })
    },
    getDeptList() {
      this.$http
        .post('/jiangoaoffice/Office/task/GetDeptList.php', {
          param: rsaUtil.encryption()
        }, {
          baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
        })
        .then(res => {
          this.deptList = res.data.rows
        })
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http
            .post('/jiangoaoffice/Office/work/CreateDeptPass.php', {
              param: rsaUtil.encryption({
                teacherId: this.form.teacher[1],
                passDeptId: this.form.dept
              })
            }, {
              baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
            })
            .then(res => {
              this.$notify({
                title: '提示',
                type: 'success',
                message: res.data.message
              })
              this.$emit('createSuccess')
              this.onClose()
            })
          return true
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
