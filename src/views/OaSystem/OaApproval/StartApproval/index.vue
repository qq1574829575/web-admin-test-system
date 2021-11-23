<template>
  <div class="app-container">
    <el-card style="width: 60%;margin: 0 auto">
      <el-form
        ref="form"
        v-loading="loading"
        :rules="rules"
        :model="form"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="申请内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入申请内容" />
        </el-form-item>
        <el-form-item label="审批详情" prop="detail">
          <el-input v-model="form.detail" type="textarea" :rows="3" placeholder="请输入审批详情" />
        </el-form-item>
        <el-form-item label="流程" prop="selectedProcess">
          <el-radio v-model="form.processRadio" label="1">固定流程</el-radio>
          <el-radio v-model="form.processRadio" label="2">自由流程</el-radio>
          <div v-if="form.processRadio === '1'">
            <el-select
              v-model="form.selectedProcess"
              value-key="id"
              placeholder="请选择流程"
            >
              <el-option
                v-for="item in processList"
                :key="item.id"
                :label="item.process_name"
                :value="item"
              />
            </el-select>
            <el-timeline style="margin-top: 20px;">
              <el-timeline-item
                v-for="(processNode, index) in form.selectedProcess.process_nodes"
                :key="index"
                :icon="processNode.icon"
                :type="processNode.type"
                :color="processNode.color"
                :size="processNode.size"
              >
                {{ processNode.processNodeName }}
                <el-table
                  :data="processNode.approvalNodeList"
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
                    <template slot-scope="approvalNodeScope">
                      <el-tag v-if="approvalNodeScope.row.approvalNodeReviewerType === '1'">指定</el-tag>
                      <el-tag v-else>用户自行选择审核人</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="审核人"
                  >
                    <template slot-scope="approvalNodeScope">
                      <div v-if="approvalNodeScope.row.approvalNodeReviewerType === '1'">
                        <el-tag v-for="(approvalNode,approvalNodeIndex) in approvalNodeScope.row.approvalNodeReviewers" :key="approvalNodeIndex">{{ approvalNode.teacherName }}</el-tag>
                      </div>
                      <div v-else>
                        <el-select
                          v-model="approvalNodeScope.row.approvalNodeReviewers"
                          value-key="teacherId"
                          multiple
                          placeholder="请选择节点审核人"
                          size="mini"
                        >
                          <el-option
                            v-for="item in reviewerList"
                            :key="item.teacherId"
                            :label="item.teacherName"
                            :value="item"
                          />
                        </el-select>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-else>
            自由流程
          </div>
        </el-form-item>
        <el-form-item label="附件" prop="uploadedFileList">
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
            <el-select
              v-if="form.selectedProcess.process_files"
              v-model="form.selectedFileTemplate"
              placeholder="搜索附件模板下载"
              size="mini"
              style="margin-left: 10px;"
              filterable
            >
              <el-option
                v-for="item in form.selectedProcess.process_files"
                :key="item.url"
                :label="item.name"
                :value="item.url"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  <el-button
                    size="mini"
                    icon="el-icon-down"
                    type="primary"
                    plain
                    @click="download(item)"
                  >下载</el-button>
                </span>
              </el-option>
            </el-select>
            <div slot="tip" class="el-upload__tip">支持上传jpg、png、gif、xls、xlsx、doc、docx、pdf格式的文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="抄送人" prop="Cc">
          <el-select v-model="form.Cc" multiple placeholder="选择抄送人" style="width: 50%">
            <el-option
              v-for="item in CcList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="success" @click="confirm">确认发起申请</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'StartApprovalDialog',
  data() {
    return {
      loading: false,
      form: {
        content: '',
        detail: '',
        uploadedFileList: [],
        processRadio: '1',
        selectedProcess: {},
        Cc: [],
        selectedFileTemplate: ''
      },
      rules: {
        content: [{ required: true, trigger: 'change', message: '请输入申请内容' }],
        detail: [{ required: true, trigger: 'change', message: '请输入申请详情' }],
        selectedProcess: [{ required: true, trigger: 'change', message: '请选择流程' }]
      },
      processList: [],
      CcList: [
        {
          label: '张三',
          value: '张三'
        },
        {
          label: '李四',
          value: '李四'
        }
      ],
      reviewerList: [
        {
          teacherId: '1',
          teacherName: '张三',
          handleStatus: '0' // 审核人处理状态 0待处理 1处理中 2已通过 3已驳回
        },
        {
          teacherId: '2',
          teacherName: '李四',
          handleStatus: '0'
        }
      ]
    }
  },
  mounted() {
    this.getProcessList()
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    getProcessList() {
      // 获取固定流程列表
      this.$http.post('process/GetProcessList.php', {
        param: rsaUtil.encryption_oa_test({
          page: 1,
          rows: 100
        })
      }).then((res) => {
        this.processList = res.rows
      })
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('您确定要发起该条申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('approval/CreateApproval.php', {
              param: rsaUtil.encryption_oa_test(),
              approvalContent: this.form.content,
              approvalDetail: this.form.detail,
              approvalProcess: JSON.stringify(this.form.selectedProcess.process_nodes),
              approvalProcessType: this.form.processRadio,
              approvalFiles: JSON.stringify(this.form.uploadedFileList),
              approvalCc: JSON.stringify(this.form.Cc)
            }).then((res) => {
              this.$message({
                type: 'success',
                message: res.message
              })
            })
          }).catch(() => {
          })
        } else {
          return false
        }
      })
    },
    handleRemove(file, fileList) {
      for (let i = 0; i < this.form.uploadedFileList.length; i++) {
        if (this.form.uploadedFileList[i].url === file.response.fileList[0].url) {
          this.form.uploadedFileList.splice(i, 1)
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
      this.form.uploadedFileList.push(...response.fileList)
    },
    download(scope) {
      window.open(scope.url)
      // const a = document.createElement('a')
      // fetch(scope.url).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
      //   a.href = URL.createObjectURL(blob)
      //   console.log(a.href)
      //   a.download = scope.name // 下载文件的名字
      //   document.body.appendChild(a)
      //   a.click()
      //   document.body.removeChild(a)
      // })
    }
  }
}
</script>

<style scoped>
</style>
