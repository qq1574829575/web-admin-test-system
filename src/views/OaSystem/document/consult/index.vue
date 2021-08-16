<template>
  <div class="app-container">
    <router-view />
    <div style="display: flex">
      <el-tag>搜索：</el-tag>
      <el-input v-model="searchContent" placeholder="请输入内容" size="mini" style="width: 30%;" clearable @clear="buildParams">
        <el-select slot="prepend" v-model="searchType" style="width: 120px;" placeholder="搜索方式">
          <el-option label="标题" value="1" />
          <el-option label="文号" value="2" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="buildParams" />
      </el-input>
    </div>
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
        <el-table-column label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handlePreview(scope)">在线阅读</el-button>
            <el-button v-if="scope.row.noticeFlag === '1'" type="text" size="mini" @click="download(scope)">下载文件</el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>
    <pdf-preview :visible.sync="pdfDialogConfig.visible" :url="pdfDialogConfig.url" />
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable/BaseTable'
import PdfPreview from '../components/PdfPreviewDialog'
export default {
  name: 'Index',
  components: { BaseTable, PdfPreview },
  data() {
    return {
      requestConfig: {},
      columnWidth: [],
      searchContent: '',
      searchType: '1',
      pdfDialogConfig: {
        visible: false,
        url: ''
      }
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
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
