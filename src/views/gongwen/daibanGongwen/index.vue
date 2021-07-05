<template>
  <div class="container">
    <el-table :data="gongwenList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="header-center" label="文件标题">
        <template slot-scope="scope">
          {{ scope.row.fileTitle }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="文件类型">
        <template slot-scope="scope">
          {{ scope.row.fileType }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="来自">
        <template slot-scope="scope">
          {{ scope.row.fromTeacherName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="处理意见">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="是否查阅">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isRead === '1'" size="mini" type="success">已查阅</el-tag>
          <el-tag v-else size="mini" type="danger">未查阅</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="是否已处理">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isTransmit === '1'" size="mini" type="success">已处理</el-tag>
          <el-tag v-else size="mini" type="danger">未处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="处理内容">
        <template slot-scope="scope">
          {{ scope.row.remarkContent }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="接收时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handlePreviewGongwen(scope)">查看</el-button>
          <zhuanfaDialog :gongwen="scope.row" admin-flag="0" style="display:inline;margin-left: 10px;" @onHandleSuccess="getGongwenList()" />
          <process-dialog :gongwen="scope.row" style="display:inline;margin-left: 10px;" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
import zhuanfaDialog from '@/views/gongwen/components/zhuanfaDialog'
import ProcessDialog from '@/views/gongwen/components/processDialog'
export default {
  name: 'Index',
  components: {
    zhuanfaDialog,
    ProcessDialog
  },
  data() {
    return {
      gongwenList: [],
      loading: false
    }
  },
  mounted() {
    this.getGongwenList()
  },
  methods: {
    getGongwenList() {
      request({
        url: '/jiangoaoffice/Office/office/GetOfficeRecordList.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school({
            teacherNo: 'J09993' // 此处应更改为当前登录系统的教职工号
          })
        }
      }).then(res => {
        this.gongwenList = res.rows
      })
    },
    handlePreviewGongwen(scope) {
      request({
        url: '/jiangoaoffice/Office/office/ModifyFileRead.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school({
            recordId: scope.row.recordId
          })
        }
      }).then(res => {
        this.getGongwenList()
        window.open(scope.row.fileAddr)
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
