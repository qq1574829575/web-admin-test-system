<template>
  <div class="app-container">
    <el-card>
      <el-button type="primary" size="mini" @click="createApplyDialogVisible = true">发起申请</el-button>
      <el-table :data="tableData" size="mini" style="width: 100%;margin-top: 10px;">
        <el-table-column label="序号" width="50" fixed="left" align="center">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="类型">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="附件">
          <template slot-scope="scope">
            <el-link style="font-size: 13px">
              <i class="el-icon-link" />
              {{ scope.row.file }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="申请时间">
          <template slot-scope="scope">
            {{ scope.row.time }}
          </template>
        </el-table-column>
        <el-table-column align="header-center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="warning">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">已通过</el-tag>
            <el-tag v-if="scope.row.status === 3" type="danger">未通过</el-tag>
            <el-tag v-if="scope.row.status === 4" type="info">已撤销</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="260px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handlePreviewGongwen(scope)">查看进度</el-button>
            <el-button v-if="scope.row.status !== 2 && scope.row.status !== 4" type="text" size="mini" @click="handlePreviewGongwen(scope)">撤销申请</el-button>
            <el-button v-if="scope.row.status === 3" type="text" size="mini" @click="handlePreviewGongwen(scope)">重新发起申请</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <create-apply-dialog :visible.sync="createApplyDialogVisible" @onCreateApply="onCreateApply" />
  </div>
</template>

<script>
import CreateApplyDialog from '@/views/OaSystem/ApprovalSystem/MyApproval/components/CreateApplyDialog'
export default {
  name: 'Index',
  components: { CreateApplyDialog },
  data() {
    return {
      tableData: [{
        id: 1,
        title: '项目用印申请',
        type: '用印申请',
        file: '测试.doc',
        time: '2021-7-2',
        status: 1 // 1待审核 2已通过 3未通过
      }, {
        id: 2,
        title: '项目用印申请',
        type: '用印申请',
        file: '测试.doc',
        time: '2021-7-2',
        status: 2 // 1待审核 2已通过 3未通过
      }, {
        id: 3,
        title: '项目用印申请',
        type: '用印申请',
        file: '测试.doc',
        time: '2021-7-2',
        status: 3 // 1待审核 2已通过 3未通过
      }, {
        id: 4,
        title: '项目用印申请',
        type: '用印申请',
        file: '测试.doc',
        time: '2021-7-2',
        status: 4 // 1待审核 2已通过 3未通过 4已撤销
      }
      ],
      createApplyDialogVisible: false
    }
  },
  mounted() {
  },
  methods: {
    onCreateApply(data) {
      this.tableData.push(data)
    }
  }
}
</script>

<style scoped>

</style>
