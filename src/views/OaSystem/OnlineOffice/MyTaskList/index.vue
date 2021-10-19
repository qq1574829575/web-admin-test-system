<template>
  <div class="app-container">
    <el-card>
      <el-input v-model="taskName" style="width:350px;margin-bottom: 10px;" placeholder="搜索任务名称" class="input-with-select">
        <el-select slot="prepend" v-model="taskStatus" style="width: 150px" placeholder="任务状态" @change="buildParams">
          <el-option label="全部" value="" />
          <el-option label="待办" value="1" />
          <el-option label="待阅" value="2" />
          <el-option label="办结" value="3" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="buildParams" />
      </el-input>
      <base-table
        v-show="switchPage === 'TaskList'"
        ref="table"
        :request-config="requestConfig"
        :column-width="columnWidth"
        show-index
        size="medium"
      >
        <template v-slot="columnConfig">
          <template v-for="item in columnConfig.columnConfig">
            <el-table-column
              v-if="item.prop === 'taskComProgress'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            >
              <template v-slot="scope">
                {{ scope.row.taskComProgress }}%
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'taskStatus'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            >
              <template v-slot="scope">
                <el-tag v-if="scope.row.taskStatus === '待阅'">待阅</el-tag>
                <el-tag v-if="scope.row.taskStatus === '待办'" type="warning">待办</el-tag>
                <el-tag v-if="scope.row.taskStatus === '办结'" type="success">办结</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop !== 'taskId'"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            />
          </template>
          <el-table-column label="操作" fixed="right" width="120" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleTask(scope.row.taskId)"
              >{{ scope.row.taskStatus === '办结' ? '查看任务信息' : '处理任务' }}</el-button>
            </template>
          </el-table-column>
        </template>
      </base-table>
      <handle-task
        v-show="switchPage === 'HandleTask'"
        ref="handleTask"
        @close="onCloseHandleTask"
      />
    </el-card>
  </div>
</template>

<script>
import BaseTable from '@/views/OaSystem/components/BaseTable'
import HandleTask from '@/views/OaSystem/OnlineOffice/MyTaskList/components/HandleTask'
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  components: { BaseTable, HandleTask },
  data() {
    return {
      switchPage: 'TaskList',
      columnWidth: [],
      requestConfig: null,
      taskStatus: '',
      taskName: ''
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/task/GetMineTaskList.php',
        data: {
          page: 1,
          rows: 10,
          taskType: '1',
          taskStatus: this.taskStatus,
          taskName: this.taskName,
          taskTime: null,
          Rootcardid: this.userinfo.Rootcardid // 万
          // Rootcardid: '362427199509224717' // 郭
          // Rootcardid: '36252919960225103X' // 王
        }
      }
    },
    handleTask(taskId) {
      this.switchPage = 'HandleTask'
      this.$nextTick(() => {
        this.$refs.handleTask.loadTask(taskId)
      })
    },
    onCloseHandleTask() {
      this.switchPage = 'TaskList'
      this.requestConfig = Object.assign({}, this.requestConfig)
    }
  }
}
</script>

<style scoped>

</style>
