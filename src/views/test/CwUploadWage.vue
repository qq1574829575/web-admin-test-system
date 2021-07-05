<template>
  <div class="app-container">
    <div style="display: flex">
      <el-button style="margin-bottom:20px" type="primary" size="mini" icon="el-icon-document" @click="CwUpDialogVisible = true">上传财务明细表</el-button>
      <el-button style="margin-bottom:20px" type="primary" size="mini" icon="el-icon-document" @click="handleDownloadTemplate">下载财务明细表模板</el-button>
      <el-button style="margin-bottom:20px" type="primary" size="mini" icon="el-icon-download" @click="exportExcel">导出工资表</el-button>
    </div>
    <div style="display: flex">
      <el-tag>筛选：</el-tag>
      <el-date-picker
        v-model="selectedDate"
        type="month"
        placeholder="所有月份"
        size="mini"
        value-format="yyyyMM"
        @change="getList"
      />
      <el-select v-model="selectedDept" clearable placeholder="所有部门" size="mini" @change="getList">
        <el-option
          v-for="item in deptList"
          :key="item.deptId"
          :label="item.deptName"
          :value="item.deptId"
        />
      </el-select>
      <div style="margin-top: 5px;">
        <el-divider direction="vertical" />
      </div>
      <el-tag>搜索：</el-tag>
      <el-input v-model="searchContent" placeholder="请输入内容" size="mini" style="width: 30%;" clearable @clear="onSearchClear">
        <el-select slot="prepend" v-model="searchType" style="width: 120px;" placeholder="搜索方式">
          <el-option label="姓名" value="1" />
          <el-option label="教工号" value="2" />
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      style="margin-top: 10px;"
      :data="list"
      element-loading-text="Loading"
      :height="tableHeight"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="总序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="教职工编号">
        <template slot-scope="scope">
          {{ scope.row[0] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门代码">
        <template slot-scope="scope">
          {{ scope.row[1] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号">
        <template slot-scope="scope" align="center">
          {{ scope.row[2] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="年月">
        <template slot-scope="scope">
          {{ scope.row[3] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row[4] }}
        </template>
      </el-table-column>
      <el-table-column label="工资标准" align="center">
        <el-table-column label="预发岗位工资" align="center">
          <template slot-scope="scope">
            {{ scope.row[5] }}
          </template>
        </el-table-column>
        <el-table-column label="职务津贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[6] }}
          </template>
        </el-table-column>
        <el-table-column label="绩效工资" align="center">
          <template slot-scope="scope">
            {{ scope.row[7] }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="超工作量课时津贴" align="center">
        <el-table-column label="本科课时" align="center">
          <template slot-scope="scope">
            {{ scope.row[8] }}
          </template>
        </el-table-column>
        <el-table-column label="当月课时" align="center">
          <template slot-scope="scope">
            {{ scope.row[9] }}
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center">
          <template slot-scope="scope">
            {{ scope.row[10] }}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="各类津贴" align="center">
        <el-table-column label="省级学科带头人津贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[11] }}
          </template>
        </el-table-column>
        <el-table-column label="省级骨干教师津贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[12] }}
          </template>
        </el-table-column>
        <el-table-column label="学位津贴" align="center">
          <el-table-column label="博士" align="center">
            <template slot-scope="scope">
              {{ scope.row[13] }}
            </template>
          </el-table-column>
          <el-table-column label="双证博士" align="center">
            <template slot-scope="scope">
              {{ scope.row[14] }}
            </template>
          </el-table-column>
          <el-table-column label="单证博士" align="center">
            <template slot-scope="scope">
              {{ scope.row[15] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="高职称津贴" align="center">
          <el-table-column label="教授" align="center">
            <template slot-scope="scope">
              {{ scope.row[16] }}
            </template>
          </el-table-column>
          <el-table-column label="副教授" align="center">
            <template slot-scope="scope">
              {{ scope.row[17] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="紧缺专业" align="center">
          <el-table-column label="硕士" align="center">
            <template slot-scope="scope">
              {{ scope.row[18] }}
            </template>
          </el-table-column>
          <el-table-column label="本科" align="center">
            <template slot-scope="scope">
              {{ scope.row[19] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="双师型" align="center">
          <template slot-scope="scope">
            {{ scope.row[20] }}
          </template>
        </el-table-column>
        <el-table-column label="延时补贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[21] }}
          </template>
        </el-table-column>
        <el-table-column label="兼任" align="center">
          <el-table-column label="各类组织" align="center">
            <template slot-scope="scope">
              {{ scope.row[22] }}
            </template>
          </el-table-column>
          <el-table-column label="教研室职务" align="center">
            <template slot-scope="scope">
              {{ scope.row[23] }}
            </template>
          </el-table-column>
          <el-table-column label="督导员" align="center">
            <template slot-scope="scope">
              {{ scope.row[24] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="津贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[25] }}
          </template>
        </el-table-column>
        <el-table-column label="其他" align="center">
          <el-table-column label="固定工资或津贴" align="center">
            <template slot-scope="scope">
              {{ scope.row[26] }}
            </template>
          </el-table-column>
          <el-table-column label="保险补助" align="center">
            <template slot-scope="scope">
              {{ scope.row[27] }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="校龄津贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[28] }}
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center">
          <template slot-scope="scope">
            {{ scope.row[29] }}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="应加" align="center">
        <el-table-column label="班主任津贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[30] }}
          </template>
        </el-table-column>
        <el-table-column label="班主任余额津贴" align="center">
          <template slot-scope="scope">
            {{ scope.row[31] }}
          </template>
        </el-table-column>
        <el-table-column label="副校长津贴" align="center">
          <el-table-column label="加班津贴" align="center">
            <template slot-scope="scope">
              {{ scope.row[32] }}
            </template>
          </el-table-column>
          <el-table-column label="其他津贴" align="center">
            <template slot-scope="scope">
              {{ scope.row[33] }}
            </template>
          </el-table-column>
          <el-table-column label="津贴或奖励" align="center">
            <template slot-scope="scope">
              {{ scope.row[34] }}
            </template>
          </el-table-column>
          <el-table-column label="工资核补" align="center">
            <template slot-scope="scope">
              {{ scope.row[35] }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>

      <el-table-column label="应减" align="center">
        <el-table-column label="应扣" align="center">
          <template slot-scope="scope">
            {{ scope.row[36] }}
          </template>
        </el-table-column>
        <el-table-column label="请假或缺勤" align="center">
          <template slot-scope="scope">
            {{ scope.row[37] }}
          </template>
        </el-table-column>
        <el-table-column label="上一年度未完成工作量" align="center">
          <template slot-scope="scope">
            {{ scope.row[38] }}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column align="center" label="应发工资" width="95">
        <template slot-scope="scope">
          {{ scope.row[39] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="五险一金" width="95">
        <template slot-scope="scope">
          {{ scope.row[40] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="应税工资" width="95">
        <template slot-scope="scope">
          {{ scope.row[41] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="六项专项附加扣除" width="95">
        <template slot-scope="scope">
          {{ scope.row[42] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="应缴税" width="95">
        <template slot-scope="scope">
          {{ scope.row[43] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工会会费" width="95">
        <template slot-scope="scope">
          {{ scope.row[44] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实发工资1" width="95">
        <template slot-scope="scope">
          {{ scope.row[45] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="财务处回收款（代扣）">
        <el-table-column align="center" label="暂扣款">
          <template slot-scope="scope">
            {{ scope.row[46] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="扣房租">
          <template slot-scope="scope">
            {{ scope.row[47] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="预发款">
          <template slot-scope="scope">
            {{ scope.row[48] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="招生欠款">
          <template slot-scope="scope">
            {{ scope.row[49] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="补扣税金">
          <template slot-scope="scope">
            {{ scope.row[50] }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="实发工资2">
        <template slot-scope="scope">
          {{ scope.row[51] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工资发放时间">
        <template slot-scope="scope">
          {{ scope.row[52] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工资发放银行">
        <template slot-scope="scope">
          {{ scope.row[53] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="openJtDetail(scope)">查看津贴明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px;"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pageConfig.currentPage"
      :page-size="pageConfig.pageSize"
      :page-sizes="[pageConfig.pageSize, 100, 200, 500, 1000]"
      :total="parseInt(pageConfig.total)"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <allowance-list-dialolg
      :visible.sync="allowanceDiaConfig.visible"
      :wage-date="allowanceDiaConfig.wageDate"
      :wage-teacher-no="allowanceDiaConfig.wageTeacherNo"
      :total="allowanceDiaConfig.total"
    />
    <cw-upload-dialog :visible.sync="CwUpDialogVisible" />
  </div>
</template>
<script>

import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'
import AllowanceListDialolg from '@/views/test/components/AllowanceListDialog'
import CwUploadDialog from '@/views/test/components/CwUplooadDialog'
export default {
  name: 'Index',
  components: { CwUploadDialog, AllowanceListDialolg },
  data() {
    return {
      selectedDate: '',
      searchContent: '',
      searchType: '',
      list: [],
      deptList: [],
      selectedDept: '',
      page: 1,
      rows: 50,
      pageConfig: {
        currentPage: 1,
        pageSize: 50,
        total: 0
      },
      allowanceDiaConfig: {
        visible: false,
        wageDate: '',
        wageTeacherNo: '',
        total: 0
      },
      CwUpDialogVisible: false,
      tableHeight: null, // 表格高度
      screenHeight: window.innerHeight,
      timer: false
    }
  },
  mounted() {
    this.getHeight()
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = window.innerHeight
        that.screenHeight = window.screenHeight
      })()
    }
    this.getList()
    this.getDeptList()
  },
  methods: {
    getList() {
      request({
        url: '/personnelsystem/PersonSystem/wage/GetCwWageList.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school({
            page: this.page,
            rows: this.rows,
            wageDate: this.selectedDate,
            wageDeptName: '',
            selectType: this.searchType,
            selectContent: this.searchContent,
            wageDeptId: this.selectedDept
          })
        }
      }).then(res => {
        this.list = res.rows
        this.pageConfig.total = res.total
        if (this.pageConfig.total === '0') {
          this.$notify({
            title: '提示',
            message: '查询结果为空，暂无数据',
            duration: 0
          })
        }
      })
    },
    getDeptList() {
      request({
        url: '/personnelsystem/PersonSystem/wage/GetDeptList.php',
        method: 'post',
        baseURL: 'http://www.unifiedplatform.guolianrobot.com',
        data: {
          param: rsaUtil.encryption_school({
            deptName: '99'
          })
        }
      }).then(res => {
        this.deptList = res.rows
      })
    },
    handleDownloadTemplate() {
      import('@/vendor/Export2Excel').then(excel => {
        const header = ['工资月份', '教职工号', '姓名', '暂扣款', '扣房租', '预发款', '招生欠款', '补扣税金', '实发工资2', '发放银行']
        excel.export_json_to_excel({
          header: header,
          data: [['202106', 'J00000', '张三', '100', '50', '20', '10', '5', '1000', '中国银行']],
          filename: '财务明细表模板'
        })
      })
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [['教职工编号', '部门代码', '序号', '年月', '姓名', '工资标准', '', '', '超工作量课时津贴', '', '', '各类津贴', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '小计', '应加', '', '', '', '', '', '应减', '', '', '应发工资', '五险一金', '应税工资', '六项专项附加扣除', '应交税', '工会会费', '实发工资1', '财务处回收代扣', '', '', '', '', '实发工资2', '工资发放时间', '工资发放银行']]
        const multiHeader2 = [['', '', '', '', '', '预发岗位工资', '职务津贴', '绩效工资', '本科课时', '当月课时', '小计', '省级学科带头人津贴', '省级骨干教师', '学位津贴', '', '', '高职称津贴', '', '紧缺专业', '', '双师型', '延时补贴', '兼任', '', '', '副校长津贴', '其他', '', '校龄津贴', '', '班主任津贴', '班主任余额津贴', '津贴', '', '', '', '应扣', '请假或缺勤', '上一年度未完成工作', '', '', '', '', '', '', '', '暂扣款', '扣房租', '预发款', '招生欠款', '补扣税金', '', '', '']]
        const header = ['', '', '', '', '', '', '', '', '', '', '', '', '', '博士', '双证硕士', '单证硕士', '教授', '副教授', '硕士', '本科', '', '', '各类组织', '教研室职务', '督导员', '', '固定工资或津贴', '保险补助', '', '', '', '', '加班津贴', '其他津贴', '津贴或奖励', '工资核补', '', '', '', '', '', '', '', '', '', '', '财务处回收代扣', '', '', '', '', '', '', '']
        const merges = ['A1:A3', 'B1:B3', 'C1:C3', 'D1:D3', 'E1:E3', 'F1:H1', 'F2:F3', 'G2:G3', 'H2:H3', 'I1:K1', 'I2:I3', 'J2:J3', 'K2:K3', 'L1:AC1', 'L2:L3', 'M2:M3', 'N2:P2', 'Q2:R2', 'S2:T2', 'U2:U3', 'V2:V3', 'W2:Y2', 'Z2:Z3', 'AA2:AB2', 'AC2:AC3', 'AD1:AD3', 'AE1:AJ1', 'AE2:AE3', 'AF2:AF3', 'AG2:AJ2', 'AK1:AM1', 'AK2:AK3', 'AL2:AL3', 'AM2:AM3', 'AN1:AN3', 'AO1:AO3', 'AP1:AP3', 'AQ1:AQ3', 'AR1:AR3', 'AS1:AS3', 'AT1:AT3', 'AU1:AY1', 'AU2:AU3', 'AV2:AV3', 'AW2:AW3', 'AX2:AX3', 'AY2:AY3', 'AZ1:AZ3', 'BA1:BA3', 'BB1:BB3']
        excel.export_json_to_excel({
          multiHeader,
          multiHeader2,
          header: header,
          merges,
          data: this.list,
          filename: this.selectedDate + '工资表'
        })
      })
    },
    handleSizeChange(val) {
      this.rows = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    search() {
      if (this.searchType === '') {
        this.$message({
          message: '请选择搜索方式',
          type: 'error'
        })
        return
      }
      if (this.searchContent === '') {
        this.$message({
          message: '请输入搜索内容',
          type: 'error'
        })
        return
      }
      this.getList()
    },
    onSearchClear() {
      this.getList()
    },
    openJtDetail(scope) {
      this.allowanceDiaConfig.total = scope.row[26]
      this.allowanceDiaConfig.wageDate = scope.row[3]
      this.allowanceDiaConfig.wageTeacherNo = scope.row[0]
      this.allowanceDiaConfig.visible = true
    },
    getHeight() {
      window.screenHeight = window.innerHeight
      this.screenHeight = window.screenHeight
      this.tableHeight = this.screenHeight - 250
    }
  }
}
</script>

<style scoped>
</style>
