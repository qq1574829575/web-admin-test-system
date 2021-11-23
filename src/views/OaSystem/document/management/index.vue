<template>
  <div class="app-container">
    <router-view />
    <el-input v-model="searchContent" placeholder="请输入内容" size="mini" style="width: 30%" clearable @clear="buildParams">
      <el-select slot="prepend" v-model="searchType" style="width: 100px" size="mini" placeholder="搜索方式">
        <el-option label="标题" value="1" />
        <el-option label="文号" value="2" />
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="buildParams" />
    </el-input>
    <el-button style="margin-left: 10px" type="primary" size="mini" icon="el-icon-edit" @click="handleNew">新建公文</el-button>
    <base-table
      ref="table"
      :request-config="requestConfig"
      :column-width="columnWidth"
      :show-index="true"
      size="medium"
    >
      <template v-slot="columnConfig">
        <template v-for="item in columnConfig.columnConfig">
          <el-table-column
            v-if="item.prop !== 'noticeId' && item.prop !== 'noticeRange' && item.prop !== 'noticeFileAddr' && item.prop !== 'noticeFlag'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
          />
          <el-table-column
            v-else-if="item.prop === 'noticeFlag'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.noticeFlag === '1'" type="success">是</el-tag>
              <el-tag v-else type="info">否</el-tag>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="180px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope)">撤销</el-button>
            <el-button type="text" size="mini" @click="download(scope)">下载</el-button>
            <el-button type="text" size="mini" @click="handlePreview(scope)">在线阅读</el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>
    <new-document-dialog :visible.sync="documentDialogConfig.visible" :config="documentDialogConfig" />
    <pdf-preview :visible.sync="pdfDialogConfig.visible" :url="pdfDialogConfig.url" />
  </div>
</template>

<script>
import NewDocumentDialog from '../components/NewDocumentDialog'
import BaseTable from '@/components/BaseTable/BaseTable'
import rsaUtil from '@/utils/rsaUtil'
import PdfPreview from '../components/PdfPreviewDialog'
export default {
  name: 'Index',
  components: { PdfPreview, NewDocumentDialog, BaseTable },
  data() {
    return {
      tableData: [],
      requestConfig: {},
      columnWidth: [],
      searchContent: '',
      searchType: '1',
      documentDialogConfig: {
        visible: false,
        title: '新建公文',
        type: 'add'
      },
      pdfDialogConfig: {
        visible: false,
        url: ''
      }
    }
  },
  mounted() {
    this.buildParams()
    this.getDeptList()
  },
  methods: {
    getDeptList() {
      this.$http.post('jiangoaoffice/Office/office/GetDeptList.php', {
        param: rsaUtil.encryption_school_long()
      }).then(res => {
        this.deptList = res.rows
      })
    },
    handleNew() {
      this.documentDialogConfig = {
        visible: true,
        title: '新建公文',
        type: 'add',
        formData: {
          noticeTitle: '',
          noticeType: '通知',
          noticeNum: '',
          noticeFileAddr: '',
          noticeRange: '99',
          teacherNo: 'J00000',
          noticeFlag: '1'
        }
      }
    },
    handleEdit(scope) {
      this.documentDialogConfig = {
        visible: true,
        title: '编辑公文',
        type: 'edit',
        formData: {
          ...scope.row,
          teacherNo: 'J00000'
        }
      }
    },
    handleDelete(scope) {
      this.$confirm('您确定要撤销此条公文吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('jiangoaoffice/Office/office/DeleteFileContent.php', {
          param: rsaUtil.encryption_school_long({
            noticeId: scope.row.noticeId
          })
        }).then(res => {
          if (res.code === 1) {
            this.buildParams()
            this.$message({
              type: 'success',
              message: '撤销成功'
            })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    handlePreview(scope) {
      this.pdfDialogConfig.url = scope.row.noticeFileAddr
      this.pdfDialogConfig.visible = true
    },
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/office/GetOfficeNoticeList.php',
        data: {
          page: 1,
          rows: 50,
          noticeTitle: this.searchType === '1' ? this.searchContent : '',
          deptId: '99',
          noticeNum: this.searchType === '2' ? this.searchContent : '',
          adminFlag: '1',
          teacherNo: 'J00000'
        },
        baseUrl: 'http://www.unifiedplatform.guolianrobot.com'
      }
    },
    download(scope) {
      const a = document.createElement('a')
      fetch(scope.row.noticeFileAddr).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
        a.href = URL.createObjectURL(blob)
        console.log(a.href)
        a.download = scope.row.noticeTitle // 下载文件的名字
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    }
  }
}
</script>

<style scoped>

</style>
