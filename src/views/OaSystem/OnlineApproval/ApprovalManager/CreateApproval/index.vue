<template>
  <el-card class="fq-custom-card">
    <!--<el-tabs v-model="processType" style="width: 80%;margin: 0 auto;padding: 10px" type="card">
      <el-tab-pane label="固定流程" name="1">
        <fixed-process ref="fixedProcess" />
      </el-tab-pane>
      <el-tab-pane label="自由流程" name="2">
        <free-process />
      </el-tab-pane>
    </el-tabs>-->
    <el-tabs
      v-if="processList.length > 0"
      v-model="tabsValue"
      type="border-card"
      tab-position="left"
      style="height: 80vh"
    >
      <!--<el-tab-pane
        label="所有审批流程"
      >
        123
      </el-tab-pane>-->
      <el-tab-pane
        v-for="item in processList"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      >
        <el-table
          v-if="tabsValue === item.value"
          :data="item.children"
          size="mini"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
          />
          <el-table-column
            prop="label"
            label="流程名"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="createProcess(scope.row)"
              >
                发起审批
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div v-else>暂无可发起的流程</div>
    <create-approval-dialog
      :visible.sync="showCreateApproval"
      :form-id="formId"
    />
  </el-card>
</template>

<script>
// import FixedProcess from './components/FixedProcess'
// import FreeProcess from './components/FreeProcess'
import rsaUtil from '@/utils/rsaUtil'
import CreateApprovalDialog from './components/CreateApprovalDialog'

export default {
  name: 'Index',
  components: { CreateApprovalDialog },
  data() {
    return {
      showCreateApproval: false,
      processList: [],
      tabsValue: '0',
      formId: ''
    }
  },
  mounted() {
    this.getProcessList()
  },
  methods: {
    getProcessList() {
      this.$http.post('/jiangoaoffice/Office/work/GetDeptTeacherFormList.php', {
        param: rsaUtil.encryption(),
        formName: ''
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.processList = res.data.rows.map(row => {
          return {
            label: row.deptName,
            value: row.deptId,
            children: row.formArr.map(form => {
              return {
                label: form.formName,
                value: form.formId
              }
            })
          }
        })
        if (this.processList.length > 0) {
          this.tabsValue = this.processList[0].value
        }
      })
    },
    createProcess(row) {
      this.formId = row.value
      this.showCreateApproval = true
    }
  }
}
</script>

<style scoped>

</style>
