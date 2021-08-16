<template>
  <div class="app-container">
    <el-card>
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
              v-if="item.prop === 'approval_process'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  title="申请审核流程"
                  width="800"
                  trigger="hover"
                >
                  <time-line-process :process-data="scope.row.approval_process" />
                  <el-button
                    slot="reference"
                    type="text"
                    icon="el-icon-view"
                    size="mini"
                  >查看</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'approval_files'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-link v-for="(file,index) in scope.row.approval_files" :key="index" style="font-size: 13px">
                  <i class="el-icon-link" />
                  {{ file.name }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'approval_cc'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag v-for="(cc,index) in scope.row.approval_cc" :key="index" type="success">{{ cc }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'status'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '0'">待审核</el-tag>
                <el-tag v-if="scope.row.status === '1'" type="warning">审核中</el-tag>
                <el-tag v-if="scope.row.status === '2'" type="success">审核通过</el-tag>
                <el-tag v-if="scope.row.status === '3'" type="danger">已驳回</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop !== 'id'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            />
          </template>
          <!--<el-table-column label="操作" width="150px" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="previewDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>-->
        </template>
      </base-table>
    </el-card>
  </div>
</template>

<script>
import BaseTable from '@/views/OaSystem/components/BaseTable'
import TimeLineProcess from '@/views/OaSystem/components/TimeLineProcess'
export default {
  name: 'Index',
  components: { TimeLineProcess, BaseTable },
  data() {
    return {
      requestConfig: {},
      columnWidth: []
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/approval/GetMyApprovalList.php',
        baseUrl: 'http://localhost:8003',
        data: {
          page: 1,
          rows: 10
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
