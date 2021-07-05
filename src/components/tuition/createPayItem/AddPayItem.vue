<template>
  <div>
    <el-dialog
      title="新增缴费项"
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
        <el-form-item label="专业缴费套餐" prop="mealId">
          <el-select
            v-model="addPayItemCanShu.mealId"
            placeholder="请选择缴费套餐"
          >
            <el-option
              v-for="item in classMealList"
              :key="item.mealId"
              :label="item.mealName"
              :value="item.mealId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费名称" prop="typeName">
          <el-input
            v-model="addPayItemCanShu.typeName"
            placeholder="请输入缴费名称"
          />
        </el-form-item>
        <el-form-item label="缴费金额" prop="typeMoney">
          <el-input
            v-model="addPayItemCanShu.typeMoney"
            placeholder="请缴费金额"
          />
        </el-form-item>
        <el-form-item label="是否必缴" prop="mustFlag">
          <el-radio-group v-model="addPayItemCanShu.mustFlag">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
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
import { addPayType } from '@/api/tuition'

export default {
  name: 'AddPayItem',
  props: {
    addShow: {
      type: Boolean,
      default: false
    },

    classMealList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      isShowScore: true,
      // 班级套餐列表
      // classMealList: [],
      visible: this.addShow,
      // 添加用户表单参数
      addPayItemCanShu: {
        typeName: '',
        typeMoney: '',
        mustFlag: '',
        mealId: ''
      },
      // 校验添加框
      addPayItemRules: {
        typeName: [
          { required: true, message: '请输入缴费名称', trigger: 'blur' }
        ],
        typeMoney: [
          { required: true, message: '请输入缴费金额', trigger: 'blur' }
        ],
        mustFlag: [
          { required: true, message: '请选择是否必缴', trigger: 'blur' }
        ],
        mealId: [{ required: true, message: '请选择缴费菜单', trigger: 'blur' }]
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
  created() {
  },
  methods: {
    onSubmit() {
      const subForm = Object.assign({}, {}, this.addPayItemCanShu)
      this.$refs.addPayItemForm.validate((valid) => {
        if (valid) {
          addPayType(subForm).then((res) => {
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
