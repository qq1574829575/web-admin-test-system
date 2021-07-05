<template>
  <div class="container">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-upload"
      @click="handleNewGongwen"
    >新建公文
    </el-button>
    <el-dialog
      :title="dialogType==='edit'?'编辑公文':'新建公文'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form ref="form" v-loading="loading" :rules="rules" :model="gongwen" label-width="100px" label-position="left">
        <el-form-item label="公文标题" prop="fileTitle">
          <el-input v-model="gongwen.fileTitle" placeholder="公文标题" />
        </el-form-item>
        <el-form-item label="发文日期" prop="publicTime">
          <el-date-picker
            v-model="gongwen.publicTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="公文类型" prop="fileType">
          <el-select v-model="gongwen.fileType" placeholder="请选择公文类型">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公文文件" prop="fileAddr">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="http://www.tushuguan.guolianrobot.com:37885/docunifiedplatform/UploadPic.php"
            name="file"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :limit="1"
            accept=".pdf"
          >
            <el-button slot="trigger" type="primary" size="mini">选择PDF文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-table :data="gongwenList" style="width: 100%;margin-top:30px;" border>
      <el-table-column label="序号" width="50" fixed="left" align="center">
        <template slot-scope="scope">
          {{ scope.row.fileId }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="标题">
        <template slot-scope="scope">
          {{ scope.row.fileTitle }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="类型">
        <template slot-scope="scope">
          {{ scope.row.fileType }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="处理内容">
        <template slot-scope="scope">
          {{ scope.row.remarkContent }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="发送时间">
        <template slot-scope="scope">
          {{ scope.row.sendTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="260px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleEditGongwen(scope)">编辑</el-button>
          <el-button type="text" size="mini" @click="handlePreviewGongwen(scope)">查看</el-button>
          <!--<a :href="scope.row.fileAddr" :download="scope.row.fileTitle">下载</a>-->
          <zhuanfaDialog :gongwen="scope.row" admin-flag="1" style="display:inline;margin-left: 10px;" @onHandleSuccess="getGongwenList()" />
          <process-dialog :gongwen="scope.row" style="display:inline;margin-left: 10px;" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'
import uuidUtil from '@/utils/onlyidUtil'
import rsaUtil from '@/utils/rsaUtil'
import zhuanfaDialog from '@/views/gongwen/components/zhuanfaDialog'
import ProcessDialog from '@/views/gongwen/components/processDialog'
const defaultGongwen = {
  teacherNo: 'J09993',
  fileTitle: '',
  publicTime: '',
  fileType: '',
  fileAddr: '' // 公文url地址
}
export default {
  name: 'Index',
  components: {
    ProcessDialog,
    zhuanfaDialog
  },
  data() {
    return {
      dialogType: 'new',
      dialogVisible: false,
      gongwenList: [],
      loading: false,
      types: [
        {
          label: '中央文件',
          value: '中央文件'
        },
        {
          label: '教育部文件',
          value: '教育部文件'
        },
        {
          label: '省委省政府文件',
          value: '省委省政府文件'
        },
        {
          label: '委厅文件',
          value: '委厅文件'
        },
        {
          label: '学校文件',
          value: '学校文件'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      gongwen: Object.assign({}, defaultGongwen),
      rules: {
        fileTitle: [{ required: true, trigger: 'blur', message: '请输入公文标题' }],
        publicTime: [{ required: true, trigger: 'blur', message: '请选择发文时间' }],
        fileType: [{ required: true, trigger: 'blur', message: '选择公文类型' }],
        fileAddr: [{ required: true, trigger: 'blur', message: '请上传公文文件' }]
      }
    }
  },
  mounted() {
    this.getGongwenList()
  },
  methods: {
    getGongwenList() {
      const param = {
        fileType: '99',
        Rootcardid: '123456',
        Rootname: '123456',
        Onlyid: uuidUtil.uuid(22, 10)
      }
      request({
        url: '/jiangoaoffice/Office/office/GetOfficeFileList.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school(param)
        }
      }).then(res => {
        this.gongwenList = res.rows
      })
    },
    handleSuccess(res, file) {
      if (res.result === true) {
        this.gongwen.fileAddr = res.url
        this.$message({
          type: 'success',
          message: res.msg
        })
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    },
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'pdf'
      if (!extension) {
        this.$message.error('文件类型错误')
        return false
      }
      return true
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    handlePreviewGongwen(scope) {
      window.open(scope.row.fileAddr)
    },
    handleEditGongwen(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.gongwen = scope.row
    },
    handleNewGongwen() {
      this.gongwen = Object.assign({}, defaultGongwen)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            this.editGongwen()
          } else {
            this.addGongwen()
          }
        } else {
          return false
        }
      })
    },
    addGongwen() {
      if (this.gongwen.fileAddr === '') {
        this.$message.error('请选择公文PDF文件')
        return
      }
      this.loading = true
      const param = {
        Rootcardid: '123456',
        Rootname: '123456',
        Onlyid: uuidUtil.uuid(22, 10)
      }
      request({
        url: '/jiangoaoffice/Office/office/CreateOfficeFile.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school(param),
          teacherNo: this.gongwen.teacherNo,
          fileType: this.gongwen.fileType,
          fileTitle: this.gongwen.fileTitle,
          fileAddr: this.gongwen.fileAddr,
          publicTime: this.gongwen.publicTime
        }
      }).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.getGongwenList()
          this.$notify({
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: `新建公文成功`,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: res.message,
            type: 'error'
          })
        }
        this.dialogVisible = false
      })
    },
    editGongwen() {
      this.loading = true
      const param = {
        Onlyid: uuidUtil.uuid(22, 10),
        Rootcardid: '123456',
        Rootname: '123456',
        fileId: this.gongwen.fileId
      }
      request({
        url: '/jiangoaoffice/Office/office/ModifyOfficeFile.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school(param),
          fileType: this.gongwen.fileType,
          fileTitle: this.gongwen.fileTitle,
          fileAddr: this.gongwen.fileAddr,
          publicTime: this.gongwen.publicTime
        }
      }).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.getGongwenList()
          this.$notify({
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: `更新公文成功`,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: res.message,
            type: 'error'
          })
        }
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
.container {
  margin: 10px 20px 0;
  overflow: hidden;
}
</style>
