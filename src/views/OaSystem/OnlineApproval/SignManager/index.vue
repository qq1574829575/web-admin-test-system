<template>
  <el-card class="fq-custom-card">
    <el-input
      v-model="searchContent"
      placeholder="搜索教师名称"
      class="input-with-select"
      size="mini"
      style="width: 300px"
    >
      <el-button slot="append" icon="el-icon-search" @click="buildParams" />
    </el-input>
    <el-button
      type="primary"
      size="mini"
      style="margin-left: 10px;"
      icon="el-icon-upload"
      @click="showUploadSign = true"
    >
      上传签名
    </el-button>
    <base-table
      ref="table"
      :request-config="requestConfig"
      :column-width="columnWidth"
      show-index
      size="mini"
    >
      <template v-slot="columnConfig">
        <template v-for="item in columnConfig.columnConfig">
          <el-table-column
            v-if="item.prop === 'signAddr'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
            <template v-slot="scope">
              <el-image
                style="width: 100px; height: 50px"
                :src="scope.row.signAddr"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop !== 'signId'"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          />
        </template>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
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
    <upload-sign-dialog
      :visible.sync="showUploadSign"
      @uploadSuccess="uploadSuccess"
    />
  </el-card>
</template>

<script>
import BaseTable from '@/components/tableBase'
import rsaUtil from '@/utils/rsaUtil'
import UploadSignDialog from '@/views/OaSystem/OnlineApproval/SignManager/UploadSignDialog'
export default {
  name: 'SignManager',
  components: { UploadSignDialog, BaseTable },
  data() {
    return {
      columnWidth: [],
      requestConfig: {},
      searchContent: '',
      showUploadSign: false
    }
  },
  mounted() {
    this.buildParams()
  },
  methods: {
    buildParams() {
      this.requestConfig = {
        url: '/jiangoaoffice/Office/work/GetSignList.php',
        parameter: {
          page: 1,
          rows: 10,
          teachName: this.searchContent
        }
      }
    },
    del(row) {
      this.$confirm('您确定要删除该签名吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/jiangoaoffice/Office/work/DelSignFile.php', {
            param: rsaUtil.encryption({
              signId: row.signId
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
    },
    uploadSuccess() {
      this.requestConfig = Object.assign({}, this.requestConfig)
    }
  }
}
</script>

<style scoped>

</style>
