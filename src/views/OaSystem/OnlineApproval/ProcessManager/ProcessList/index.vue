<template>
  <el-card class="fq-custom-card">
    <el-input
      v-show="switchPage === 'index' "
      v-model="searchContent"
      placeholder="搜索流程名称"
      class="input-with-select"
      size="mini"
      style="width: 300px"
    >
      <el-select
        slot="prepend"
        v-model="searchType"
        placeholder="请选择"
        style="width: 120px"
        @change="buildParams"
      >
        <el-option label="我所属部门的" value="1" />
        <el-option label="我创建的" value="2" />
        <el-option label="我修改过的" value="3" />
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="buildParams" />
    </el-input>
    <!--<el-button
      type="primary"
      style="margin-left: 10px;"
      size="mini"
    >
      创建流程
    </el-button>-->
    <base-table
      v-show="switchPage === 'index' "
      ref="table"
      :request-config="requestConfig"
      :column-width="columnWidth"
      show-index
      size="mini"
    >
      <template v-slot="columnConfig">
        <template v-for="item in columnConfig.columnConfig">
          <el-table-column
            v-if="item.prop === 'formStatus'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
            <template v-slot="scope">
              <el-tag :type="scope.row.formStatus === '1' ? 'warning' : 'success'">
                {{ scope.row.formStatus === '1' ? '暂存' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop !== 'formId' && item.prop !== 'formContent'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          />
        </template>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="del(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>
    <edit-process
      v-show="switchPage === 'editProcess'"
      ref="editProcess"
      @close="onCloseEditProcess"
    />
  </el-card>
</template>

<script>
import BaseTable from '@/components/tableBase'
import EditProcess from './components/EditProcess'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'Index',
  components: { EditProcess, BaseTable },
  data() {
    return {
      switchPage: 'index',
      columnWidth: [],
      requestConfig: {},
      searchType: '2',
      searchContent: ''
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/work/GetWorkFormList.php',
        parameter: {
          page: 1,
          rows: 10,
          formName: this.searchContent,
          flag: this.searchType
        }
      }
    },
    onCloseEditProcess() {
      this.switchPage = 'index'
      this.requestConfig = Object.assign({}, this.requestConfig)
    },
    edit(row) {
      this.switchPage = 'editProcess'
      this.$refs.editProcess.loadProcess(row)
    },
    del(row) {
      this.$confirm('您确定要删除该流程吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row)
          this.$http.post('/jiangoaoffice/Office/work/DelWorkForm.php', {
            param: rsaUtil.encryption({
              formId: row.formId
            })
          }, {
            baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
          }).then(res => {
            this.$notify({
              title: '提示',
              type: 'success',
              message: res.data.message
            })
            this.requestConfig = Object.assign({}, this.requestConfig)
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
