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
              v-if="item.prop === 'process_nodes'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  title="流程"
                  width="600"
                  trigger="hover"
                >
                  <el-timeline style="margin-top: 20px;">
                    <el-timeline-item
                      v-for="(processNode, index) in scope.row.process_nodes"
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
                            <el-tag v-else>用户自行选择审核人</el-tag>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-timeline-item>
                  </el-timeline>
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
              v-else-if="item.prop === 'process_files'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag v-for="file in scope.row.process_files" :key="file.url">
                  {{ file.name }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            />
          </template>
          <el-table-column label="操作" width="150px" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="del(scope.row.id)">删除流程</el-button>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </el-card>
    <!--<preview-nodes-dialog :visible.sync="previewNodsDiaVisible" :node-list="nodeList" />-->
  </div>
</template>

<script>
import BaseTable from '@/views/OaSystem/components/BaseTable'
import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'Index',
  components: { BaseTable },
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
        url: '/process/GetProcessList.php',
        baseUrl: 'http://192.168.110.183:8003',
        data: {
          page: 1,
          rows: 10
        }
      }
    },
    del(id) {
      this.$confirm('您确定要删除此条流程吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/process/DelProcess.php',
          method: 'post',
          baseURL: 'http://192.168.110.183:8003',
          data: {
            param: rsaUtil.encryption_oa_test({
              id: id
            })
          }
        }).then((res) => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.requestConfig = Object.assign({}, this.requestConfig)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
