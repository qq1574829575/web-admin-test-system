<template>
  <div class="app-container">
    <el-card style="width: 70%;margin: 0 auto">
      <el-form
        ref="mainForm"
        :rules="mainFormRules"
        :model="mainForm"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="流程名称:" prop="processName">
          <el-input v-model="mainForm.processName" />
        </el-form-item>
        <el-form-item label="流程附件:" prop="uploadedFileList">
          <el-upload
            ref="upload"
            class="upload-demo"
            multiple
            action="http://localhost:8003/upload/upload.php"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :auto-upload="true"
          >
            <el-button slot="trigger" size="mini" icon="el-icon-plus" type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">支持上传jpg、png、gif、xls、xlsx、doc、docx、pdf格式的文件</div>
          </el-upload>
        </el-form-item>
        <!--<el-form-item label="流程表单:" prop="processForm">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="addProcessFormItem">设计表单</el-button>
          <form-create
            v-model="fapi"
            :rule="rule"
            :option="option"
            @submit="onSubmit"
          />
        </el-form-item>-->
        <el-form-item label="流程节点:" prop="processNodeList">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addProcessNode">增加流程节点</el-button>
          <el-timeline style="margin-top: 10px;">
            <el-timeline-item
              v-for="(node, index) in mainForm.processNodeList"
              :key="index"
              :icon="node.icon"
              :type="node.type"
              :color="node.color"
              :size="node.size"
            >
              {{ node.processNodeName }}
              <el-divider content-position="left">审核节点</el-divider>
              <el-table
                :data="node.approvalNodeList"
                style="width: 100%"
                size="mini"
                border
              >
                <el-table-column
                  prop="approvalNodeName"
                  label="审核节点名称"
                />
                <el-table-column
                  label="审核人类型"
                >
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.approvalNodeReviewerType === '1'">指定</el-tag>
                    <el-tag v-else>用户自行选择审核人</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="审核人"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalNodeReviewerType === '1'">
                      <el-tag v-for="(item,index1) in scope.row.approvalNodeReviewers" :key="index1">{{ item.teacherName }}</el-tag>
                    </div>
                    <el-tag v-else>用户自行选择审核人</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-button
                type="text"
                style="color: red"
                icon="el-icon-delete"
                size="mini"
                @click="mainForm.processNodeList.splice(index, 1)"
              >删除节点
              </el-button>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">创建流程</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <add-process-node-dialog :visible.sync="addProcessNodeDiaVisible" @onAddProcessNodeSuccess="onAddProcessNodeSuccess" />
    <!--<add-form-item-dialog :visible.sync="addFormItemDiaVisible" @onDesignFormSuccess="onDesignFormSuccess" />-->
  </div>
</template>

<script>
// import AddFormItemDialog from '@/views/OaSystem/ApprovalSystem/ProcessCreate/components/AddFormItemDialog'
import AddProcessNodeDialog from '@/views/OaSystem/ApprovalSystem/ProcessCreate/components/AddProcessNodeDialog'
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'Index',
  components: { AddProcessNodeDialog },
  data() {
    return {
      fapi: null,
      rule: [],
      option: {},
      mainForm: {
        processName: '',
        uploadedFileList: [],
        processNodeList: []
      },
      mainFormRules: {
        processName: [{ required: true, trigger: 'change', message: '请输入流程名称' }],
        uploadedFileList: [{ required: true, trigger: 'change', message: '请上传流程附件' }],
        processNodeList: [{ required: true, trigger: 'change', message: '请至少添加一个流程节点' }]
      },
      addProcessNodeDiaVisible: false
      // addFormItemDiaVisible: false
    }
  },
  methods: {
    confirm() {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          request({
            url: '/process/CreateProcess.php',
            method: 'post',
            baseURL: 'http://localhost:8003',
            data: {
              param: rsaUtil.encryption_oa_test(),
              processName: this.mainForm.processName,
              processFiles: JSON.stringify(this.mainForm.uploadedFileList),
              processNodeList: JSON.stringify(this.mainForm.processNodeList)
            }
          }).then((res) => {
            this.$message({
              type: 'success',
              message: res.message
            })
          })
        } else {
          return false
        }
      })
    },
    addProcessFormItem() {
      // this.addFormItemDiaVisible = true
    },
    onDesignFormSuccess(rule, options) {
      this.rule = rule
      this.option = options
      // this.addFormItemDiaVisible = false
    },
    onSubmit() {
    },
    addProcessNode() {
      this.addProcessNodeDiaVisible = true
    },
    onAddProcessNodeSuccess(node) {
      console.log(node)
      this.mainForm.processNodeList.push(node)
      this.addProcessNodeDiaVisible = false
    },
    handleRemove(file, fileList) {
      for (let i = 0; i < this.mainForm.uploadedFileList.length; i++) {
        if (this.mainForm.uploadedFileList[i].url === file.response.fileList[0].url) {
          this.mainForm.uploadedFileList.splice(i, 1)
          break
        }
      }
    },
    handleSuccess(response, file, fileList) {
      if (response.code !== 1) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].uid === file.uid) {
            fileList.splice(i, 1)
            break
          }
        }
        this.$message({
          type: 'error',
          message: response.message
        })
        return
      }
      this.mainForm.uploadedFileList.push(...response.fileList)
    }
  }
}
</script>

<style scoped>

</style>
