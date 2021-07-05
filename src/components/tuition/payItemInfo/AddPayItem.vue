<template>
  <div>
    <el-dialog
      title="创建专业缴费套餐"
      :visible.sync="visible"
      width="50%"
      :show="visible"
      @close="$emit('update:addShow', false)"
    >
      <el-form
        ref="addPayItemForm"
        :model="addPayItemCanShu"
        label-width="auto"
        :rules="addPayItemRules"
      >
        <el-form-item label="选择专业" prop="majorId">
          <el-select
            v-model="addPayItemCanShu.majorId"
            placeholder="请选择专业"
          >
            <el-option
              v-for="item in majorList"
              :key="item.majorId"
              :label="item.majorName"
              :value="item.majorId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="住宿信息" prop="dormFlag">
          <el-select
            v-model="addPayItemCanShu.dormFlag"
            placeholder="请选择住宿信息"
          >
            <el-option
              v-for="item in dormList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐名" prop="mealName">
          <el-input
            v-model="addPayItemCanShu.mealName"
            placeholder="建议 **专业缴费套餐"
          />
        </el-form-item>
        <el-form-item label="备注" prop="mealMark">
          <el-input
            v-model="addPayItemCanShu.mealMark"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getMajorList, addMealList } from '@/api/tuition'

export default {
  name: 'AddPayItem',
  props: {
    addShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.addShow,
      // 添加用户表单参数
      addPayItemCanShu: {
        majorId: '',
        dormFlag: '',
        mealName: '',
        mealMark: ''
      },
      majorList: [],
      dormList: [
        {
          label: '8人空调间',
          value: '1'
        },
        {
          label: '4人普通间',
          value: '2'
        },
        {
          label: '4人空调间',
          value: '3'
        },
        {
          label: '走读',
          value: '4'
        }
      ],
      // 校验添加框
      addPayItemRules: {
        majorId: [{ required: true, message: '请选择专业', trigger: 'change' }],
        dormFlag: [
          { required: true, message: '请选择住宿信息', trigger: 'change' }
        ],
        mealName: [
          { required: true, message: '请输入套餐名', trigger: 'blur' }
        ],
        mealMark: [
          { required: true, message: '请选择填入备注', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    addShow() {
      this.visible = this.addShow
    },
    // 重置表单
    visible(newValue) {
      if (newValue === false) {
        this.$refs.addPayItemForm.resetFields()
      }
    }
  },
  mounted() {
    this.getMajorList()
  },
  methods: {
    getMajorList() {
      getMajorList().then((res) => {
        this.majorList = res.rows
      }).catch(error => {
        console.log(error)
      })
    },
    onSubmit() {
      const subForm = Object.assign({}, {}, this.addPayItemCanShu)
      this.$refs.addPayItemForm.validate((valid) => {
        if (valid) {
          addMealList(subForm).then((res) => {
            if (res.code === 200) {
              this.visible = !this.visible
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$parent.buildParams()
            }
          })
        } else {
          this.$message({
            message: '请输入必填信息',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-input,
.el-select {
  width: 70%;
}

.el-dialog-div {
  padding-right: 20px;
  height: 55vh;
  overflow: auto;
}
</style>
