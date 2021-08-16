<template>
  <el-timeline>
    <el-timeline-item
      v-for="(processNode, index) in processData"
      :key="index"
      :icon="processNode.icon"
      :type="processNode.type"
      :color="processNode.color"
      :size="processNode.size"
    >
      <span style="font-size: 15px">
        {{ processNode.processNodeName }}
      </span>
      <el-tag v-if="processNode.handleStatus === '0'" size="mini">待处理</el-tag>
      <el-tag v-if="processNode.handleStatus === '1'" size="mini" type="warning">处理中</el-tag>
      <el-tag v-if="processNode.handleStatus === '2'" size="mini" type="success">审核通过</el-tag>
      <el-tag v-if="processNode.handleStatus === '3'" size="mini" type="danger">已驳回</el-tag>
      <el-table
        :data="processNode.approvalNodeList"
        style="width: 100%;margin-top: 5px;"
        size="small"
      >
        <el-table-column
          label="审核节点名称"
        >
          <template slot-scope="approvalNodeScope">
            <span style="font-size: 14px">
              {{ approvalNodeScope.row.approvalNodeName }}
            </span>
            <el-tag v-if="approvalNodeScope.row.handleStatus === '0'" size="mini">待处理</el-tag>
            <el-tag v-if="approvalNodeScope.row.handleStatus === '1'" size="mini" type="warning">处理中</el-tag>
            <el-tag v-if="approvalNodeScope.row.handleStatus === '2'" size="mini" type="success">审核通过</el-tag>
            <el-tag v-if="approvalNodeScope.row.handleStatus === '3'" size="mini" type="danger">已驳回</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column
          label="审核人类型"
        >
          <template slot-scope="approvalNodeScope">
            <el-tag v-if="approvalNodeScope.row.approvalNodeReviewerType === '1'">指定</el-tag>
            <el-tag v-else>用户自行选择审核人</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column
          label="节点审核人"
        >
          <template slot-scope="approvalNodeScope">
            <el-table
              size="mini"
              :data="approvalNodeScope.row.approvalNodeReviewers"
              style="width: 100%"
            >
              <el-table-column
                prop="teacherName"
                label="审核人"
              />
              <el-table-column
                label="审核结果"
              >
                <template slot-scope="reviewer">
                  <el-tag v-if="reviewer.row.handleStatus === '0'" size="mini">待处理</el-tag>
                  <el-tag v-if="reviewer.row.handleStatus === '1'" type="success" size="mini">审核通过</el-tag>
                  <el-tag v-if="reviewer.row.handleStatus === '2'" type="danger" size="mini">已驳回</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="handleContent"
                label="审核意见"
              />
              <el-table-column
                prop="handleFiles"
                label="附件"
              >
                <template slot-scope="handleFiles">
                  <el-popover
                    placement="right"
                    width="400"
                    trigger="hover"
                  >
                    <el-table
                      :show-header="false"
                      :data="handleFiles.row.handleFiles"
                    >
                      <el-table-column label="附件地址">
                        <template slot-scope="fileScope">
                          <el-link
                            :href="fileScope.row.url"
                            target="_blank"
                            style="font-size: 13px"
                          >
                            <i class="el-icon-link" />
                            {{ fileScope.row.name }}
                          </el-link>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button
                      slot="reference"
                      type="text"
                      icon="el-icon-view"
                      size="mini"
                    >查看</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
export default {
  name: 'TimeLineProcess',
  props: {
    processData: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
