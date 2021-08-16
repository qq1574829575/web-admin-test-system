<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
  >
    <el-form ref="mainForm" :rules="mainFormRules" :model="mainForm" label-width="100px" label-position="right">
      <el-form-item label="流程名称" prop="processName">
        <el-input v-model="mainForm.processName" style="width: 80%" />
        <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="addNode">增加流程节点</el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar style="height: 60vh" :wrap-style="[{ 'overflow-x': 'hidden'}]">
      <el-timeline style="margin-top: 10px;">
        <el-timeline-item
          v-for="(node, index) in processConfig.nodeList"
          :key="index"
          :icon="node.icon"
          :type="node.type"
          :color="node.color"
          :size="node.size"
        >
          流程节点
          <el-divider content-position="left">节点审核人</el-divider>
          <el-divider content-position="left">节点表单</el-divider>
          <el-form :model="node.formVal" label-width="90px" label-position="right" style="margin-top: 20px;">
            <el-form-item
              v-for="formItem in node.formItemList"
              :key="formItem.key"
              :label="formItem.label"
              :prop="formItem.key"
              :rules="formItem.rules"
            >
              <el-input v-if="formItem.type === 'input'" v-model="formItem.value" />
            </el-form-item>
          </el-form>
          <el-button type="text" style="color: red" icon="el-icon-delete" size="mini" @click="processConfig.nodeList.splice(index, 1)">删除节点</el-button>
        </el-timeline-item>
      </el-timeline>
    </el-scrollbar>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'CreateProcessDialog',
  props: {
    name: {
      type: String,
      default: '创建流程'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mainForm: {
        processName: ''
      },
      mainFormRules: {
        processName: [{ required: true, trigger: 'blur', message: '请输入流程名称' }]
      },
      processConfig: {
        processName: '用印申请',
        nodeList: []
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          console.log(true)
        } else {
          return false
        }
      })
    },
    addNode() {
      this.processConfig.nodeList.push({
        nodeName: '流程表单',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more',
        color: '#0bbd87',
        formVal: {},
        formItemList: [
          {
            type: 'input',
            label: '测试：',
            value: '',
            key: 'test',
            rules: {
              required: true, message: '不能为空', trigger: 'blur'
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
</style>
