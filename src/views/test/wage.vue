<template>
  <div class="app-container">
    <el-date-picker
      v-model="selectedDate"
      type="month"
      placeholder="选择月份"
      size="mini"
      value-format="yyyyMM"
      :clearable="false"
      @change="getTeacherWage"
    />
    <el-divider />
    <div v-if="!teacherWageInfo || teacherWageInfo.length === 0">
      您没有当月的工资信息哦
    </div>
    <div v-else>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-card style="height: 220px">
            <div class="item">
              <i class="el-icon-user" />
              <div style="margin-left: 5px;font-size: 18px">{{ teacherWageInfo[0].wageTeacherName }}</div>
            </div>
            <div class="item">
              <i class="el-icon-tickets" />
              <div style="margin-left: 5px;">教工号：{{ teacherWageInfo[0].wageTeacherNo }}</div>
            </div>
            <div class="item">
              <i class="el-icon-help" />
              <div style="margin-left: 5px;">部门：{{ teacherWageInfo[0].wageDeptName }}</div>
            </div>
            <div class="item">
              <i class="el-icon-time" />
              <div style="margin-left: 5px;">月份：{{ teacherWageInfo[0].wageDate }}</div>
            </div>
            <div class="item">
              <i class="el-icon-bank-card" />
              <div style="margin-left: 5px;">工资发放银行：{{ teacherWageInfo[0].wageCwArr.wageCwBankName }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <el-card style="height: 220px">
            <div slot="header" class="clearfix">
              <i style="color:#409EFF;font-size: 20px" class="el-icon-menu" />
              <span>本月工资一览</span>
            </div>
            <el-table
              ref="table"
              size="mini"
              :data="teacherWageInfo"
              :lazy="true"
              empty-text="暂无数据"
              :header-cell-style="{background:'#9DC9F8',color:'#606266'}"
            >
              <el-table-column align="center" label="应发工资">
                <template slot-scope="scope">
                  {{ scope.row.wageYFGZ }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="五险一金">
                <template slot-scope="scope">
                  {{ scope.row.wageGLBX }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="应税工资">
                <template slot-scope="scope">
                  {{ scope.row.wageYSGZ }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="六项专项附加扣除">
                <template slot-scope="scope">
                  {{ scope.row.wageZXKC }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="应交税">
                <template slot-scope="scope">
                  {{ scope.row.wageYJS }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="工会会费">
                <template slot-scope="scope">
                  {{ scope.row.wageGHHF }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="实发工资1">
                <template slot-scope="scope">
                  {{ scope.row.wageSFGZ1 }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="实发工资2" fixed="right" width="120">
                <template slot-scope="scope">
                  <el-tag type="success" style="font-size: 15px">
                    ￥{{ scope.row.wageSFGZ2 }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <div slot="header" class="clearfix">
              <i style="color:#E6A23C;font-size: 20px" class="el-icon-document" />
              <span>工资+课时+各类津贴</span>
              <el-tag style="float:right;">小计：{{ teacherWageInfo[0].wageOtherArr.wageOtherSum }}</el-tag>
            </div>
            <el-table
              ref="table"
              size="mini"
              :data="teacherWageInfo"
              :lazy="true"
              empty-text="暂无数据"
              :header-cell-style="{background:'#9DC9F8',color:'#606266'}"
            >
              <el-table-column label="省级学科带头人津贴" align="center" fit="true" style="background: #0a76a4">
                <template slot-scope="scope">
                  {{ scope.row.wageOtherArr.wageOtherSJDT }}
                </template>
              </el-table-column>
              <el-table-column label="省级骨干教师津贴" align="center">
                <template slot-scope="scope">
                  {{ scope.row.wageOtherArr.wageOtherSJGG }}
                </template>
              </el-table-column>
              <el-table-column label="学位津贴" align="center">
                <el-table-column label="博士" align="center" fit="true">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherBSXW }}
                  </template>
                </el-table-column>
                <el-table-column label="双证博士" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherSZXW }}
                  </template>
                </el-table-column>
                <el-table-column label="单证博士" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherDZXW }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="高职称津贴" align="center">
                <el-table-column label="教授" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherGZCJS }}
                  </template>
                </el-table-column>
                <el-table-column label="副教授" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherGZCF }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="紧缺专业" align="center">
                <el-table-column label="硕士" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherJQSS }}
                  </template>
                </el-table-column>
                <el-table-column label="本科" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherJQBK }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-table
              ref="table"
              size="mini"
              style="margin-top: 10px;"
              :data="teacherWageInfo"
              :lazy="true"
              empty-text="暂无数据"
              :header-cell-style="{background:'#9DC9F8',color:'#606266'}"
            >
              <el-table-column label="双师型津贴" align="center">
                <template slot-scope="scope">
                  {{ scope.row.wageOtherArr.wageOtherSSX }}
                </template>
              </el-table-column>
              <el-table-column label="延时补贴" align="center">
                <template slot-scope="scope">
                  {{ scope.row.wageOtherArr.wageOtherWSBT }}
                </template>
              </el-table-column>
              <el-table-column label="兼任" align="center">
                <el-table-column label="各类组织" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherJRZZ }}
                  </template>
                </el-table-column>
                <el-table-column label="教研室职务" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherJRJY }}
                  </template>
                </el-table-column>
                <el-table-column label="督导员" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherJRDD }}
                  </template>
                </el-table-column>
              </el-table-column>
              <!--<el-table-column label="津贴" align="center">
                <template slot-scope="scope">
                  {{ scope.row.wageOtherArr.wageOtherFXZ }}
                </template>
              </el-table-column>-->
              <el-table-column label="其他" align="center">
                <el-table-column label="固定工资" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherGDGZ }}
                  </template>
                </el-table-column>
                <el-table-column label="保险补助" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.wageOtherArr.wageOtherBXBZ }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="校龄津贴" align="center">
                <template slot-scope="scope">
                  {{ scope.row.wageOtherArr.wageOtherXL }}
                </template>
              </el-table-column>
            </el-table>

            <el-table
              ref="table"
              style="margin-top: 10px;"
              size="mini"
              :data="teacherWageInfo"
              :lazy="true"
              empty-text="暂无数据"
              :header-cell-style="{background:'#9DC9F8',color:'#606266'}"
            >
              <el-table-column align="center" label="工资标准">
                <el-table-column align="center" label="预发岗位工资">
                  <template slot-scope="scope">
                    {{ scope.row.wageJBGZ }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="职务津贴">
                  <template slot-scope="scope">
                    {{ scope.row.wageZWJT }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="绩效工资">
                  <template slot-scope="scope">
                    {{ scope.row.wageJXGZ }}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column align="center" label="超工作量课时津贴">
                <el-table-column align="center" label="本科课时">
                  <template slot-scope="scope">
                    {{ scope.row.wageBKJT }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="当月课时">
                  <template slot-scope="scope">
                    {{ scope.row.wageDYJT }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="超工作量课时津贴小计">
                  <template slot-scope="scope">
                    {{ scope.row.wageJTSum }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-card style="height: 230px">
            <div slot="header" class="clearfix">
              <i style="color:#67C23A;font-size: 20px" class="el-icon-upload2" />
              <span>应加</span>
            </div>
            <el-table
              ref="table"
              size="mini"
              :data="teacherWageInfo"
              :lazy="true"
              empty-text="暂无数据"
            >
              <el-table-column align="center" label="班主任津贴">
                <template slot-scope="scope">
                  {{ scope.row.wageAddReduceArr.wageAddBZR }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="班主任余额津贴">
                <template slot-scope="scope">
                  {{ scope.row.wageAddReduceArr.wageAddBZRYE }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="津贴">
                <el-table-column align="center" label="加班津贴">
                  <template slot-scope="scope">
                    {{ scope.row.wageAddReduceArr.wageAddJB }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="其他津贴">
                  <template slot-scope="scope">
                    {{ scope.row.wageAddReduceArr.wageAddOther }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="津贴或奖励">
                  <template slot-scope="scope">
                    {{ scope.row.wageAddReduceArr.wageAddReward }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="工资核补">
                  <template slot-scope="scope">
                    {{ scope.row.wageAddReduceArr.wageAddGZHB }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120px" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="openJtDetail(scope)">查看津贴明细</el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-card style="height: 230px">
            <div slot="header" class="clearfix">
              <i style="color:#F56C6C;font-size: 20px" class="el-icon-download" />
              <span>应减</span>
            </div>
            <el-table
              ref="table"
              size="mini"
              :data="teacherWageInfo"
              :lazy="true"
              empty-text="暂无数据"
            >
              <el-table-column align="center" label="应扣">
                <template slot-scope="scope">
                  {{ scope.row.wageAddReduceArr.wageReduceYK }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="请假或缺勤">
                <template slot-scope="scope">
                  {{ scope.row.wageAddReduceArr.wageReduceQQ }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="上一年度未完成工作量">
                <template slot-scope="scope">
                  {{ scope.row.wageAddReduceArr.wageReduceWWC }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="财务处回收款（代扣）">
                <el-table-column align="center" label="暂扣款">
                  <template slot-scope="scope">
                    {{ scope.row.wageCwArr.wageCwZKK }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="扣房租">
                  <template slot-scope="scope">
                    {{ scope.row.wageCwArr.wageCwKFZ }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="预发款">
                  <template slot-scope="scope">
                    {{ scope.row.wageCwArr.wageCwYFK }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="招生欠款">
                  <template slot-scope="scope">
                    {{ scope.row.wageCwArr.wageCwZSQK }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="补扣税金">
                  <template slot-scope="scope">
                    {{ scope.row.wageCwArr.wageCwBKSJ }}
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <allowance-list-dialolg
      :visible.sync="allowanceDiaConfig.visible"
      :wage-date="allowanceDiaConfig.wageDate"
      :wage-teacher-no="allowanceDiaConfig.wageTeacherNo"
    />
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import AllowanceListDialolg from '@/views/test/components/AllowanceListDialog'
export default {
  name: 'Wage',
  components: { AllowanceListDialolg },
  data() {
    return {
      selectedDate: '',
      teacherWageInfo: [],
      allowanceDiaConfig: {
        visible: false,
        wageDate: '',
        wageTeacherNo: ''
      }
    }
  },
  mounted() {
    this.getTeacherWage()
  },
  methods: {
    getTeacherWage() {
      this.$http.post('personnelsystem/PersonSystem/wage/GetWebWageList.php', {
        param: rsaUtil.encryption_school({
          wageDate: this.selectedDate,
          wageTeacherNo: 'J01811'
        })
      }).then(res => {
        this.teacherWageInfo = res.rows
        if (res.message === '操作成功') {
          this.selectedDate = this.teacherWageInfo[0].wageDate
        }
      })
    },
    openJtDetail(scope) {
      this.allowanceDiaConfig.wageDate = scope.row.wageDate
      this.allowanceDiaConfig.wageTeacherNo = scope.row.wageTeacherNo
      this.allowanceDiaConfig.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.item {
  display: flex;
  margin-bottom: 10px;
  i {
    color:#409EFF;
    font-size: 20px
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
