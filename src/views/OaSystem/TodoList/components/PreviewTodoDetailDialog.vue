<template>
  <el-dialog
    :title="name"
    :visible.sync="visible"
    :before-close="onClose"
    append-to-body
    width="60%"
    @open="onOpen"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="详情">
        <el-descriptions title="" :column="1" size="medium" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets" />
              事项
            </template>
            {{ detailData.approval_content }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-document-copy" />
              事项详情
            </template>
            {{ detailData.approval_detail }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-time" />
              事项状态
            </template>
            <el-tag v-if="detailData.status === '0'">待处理</el-tag>
            <el-tag v-if="detailData.status === '1'" type="warning">审核中</el-tag>
            <el-tag v-if="detailData.status === '2'" type="success">审核通过</el-tag>
            <el-tag v-if="detailData.status === '3'" type="danger">已驳回</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-paperclip" />
              附件
            </template>
            <el-link
              v-for="(file,index) in detailData.approval_files"
              :key="index"
              :href="file.url"
              target="_blank"
              style="font-size: 13px"
            >
              <i class="el-icon-link" />
              {{ file.name }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user" />
              发起人
            </template>
            {{ detailData.approval_create_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location" />
              当前流程节点
            </template>
            {{ detailData.process_node_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline" />
              当前审核节点
            </template>
            {{ detailData.approval_node_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom" />
              审核人
            </template>
            {{ detailData.approval_node_reviewer }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-time" />
              处理状态
            </template>
            <el-tag v-if="detailData.handleStatus === '0'">待处理</el-tag>
            <el-tag v-if="detailData.handleStatus === '1'" type="success">审核通过</el-tag>
            <el-tag v-if="detailData.handleStatus === '2'" type="danger">已驳回</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="进度">
        <time-line-process :process-data="detailData.approval_process" />
      </el-tab-pane>
      <el-tab-pane label="沟通">沟通</el-tab-pane>
      <el-tab-pane label="处理">
        <el-result
          v-if="detailData.status === '3'"
          icon="warning"
          title="审核已被驳回"
        />
        <el-result
          v-else-if="detailData.status === '2' || detailData.handleStatus === '1'"
          icon="success"
          title="审核已通过"
        />
        <el-form
          v-else
          ref="handleForm"
          :rules="handleFormRules"
          :model="handleForm"
          label-width="100px"
          label-position="right"
          size="mini"
        >
          <el-form-item label="处理意见" prop="handleContent">
            <el-input
              v-model="handleForm.handleContent"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="附件" prop="handleFiles">
            <el-upload
              ref="upload"
              class="upload-demo"
              multiple
              action="http://localhost:8003/upload/upload.php"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :auto-upload="true"
            >
              <el-button slot="trigger" icon="el-icon-plus" type="primary">上传附件</el-button>
              <div slot="tip" class="el-upload__tip">支持上传jpg、png、gif、xls、xlsx、doc、docx、pdf格式的文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="confirmHandle(1)">审核通过</el-button>
            <el-button type="danger" @click="confirmHandle(2)">驳回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="打印">打印</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>

import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
import TimeLineProcess from '@/views/OaSystem/components/TimeLineProcess'

export default {
  name: 'PreviewTodoDetailDialog',
  components: { TimeLineProcess },
  props: {
    name: {
      type: String,
      default: '待办详情'
    },
    visible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: ''
    },
    reviewerId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detailData: {},
      handleForm: {
        handleContent: '',
        handleFiles: []
      },
      handleFormRules: {
        handleContent: [{ required: true, trigger: 'change', message: '请输入处理意见' }]
      }
    }
  },
  methods: {
    onOpen() {
      this.getTodoDetail()
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    getTodoDetail() {
      request({
        url: '/OnlineOffice/GetTodoDetail.php',
        method: 'post',
        baseURL: 'http://localhost:8003',
        data: {
          param: rsaUtil.encryption_oa_test({
            task_id: this.taskId,
            reviewerId: this.reviewerId
          })
        }
      }).then((res) => {
        this.detailData = res.rows
      })
    },
    handleRemove(file, fileList) {
      for (let i = 0; i < this.handleForm.handleFiles.length; i++) {
        if (this.handleForm.handleFiles[i].url === file.response.fileList[0].url) {
          this.handleForm.handleFiles.splice(i, 1)
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
      this.handleForm.handleFiles.push(...response.fileList)
    },
    confirmHandle(handleStatus) {
      this.$refs.handleForm.validate(valid => {
        if (valid) {
          console.log(true)
          request({
            url: '/OnlineOffice/HandleApproval.php',
            method: 'post',
            baseURL: 'http://localhost:8003',
            data: {
              param: rsaUtil.encryption_oa_test({
                task_id: this.taskId,
                reviewerId: this.reviewerId
              }),
              handleContent: this.handleForm.handleContent,
              handleStatus: handleStatus,
              handleFiles: JSON.stringify(this.handleForm.handleFiles),
              process_node_key: this.detailData.process_node_key,
              approval_node_key: this.detailData.approval_node_key,
              approval_node_reviewer_key: this.detailData.approval_node_reviewer_key
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
    }
  }
}
</script>

<style scoped>
</style>
