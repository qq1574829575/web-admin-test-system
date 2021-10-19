<template>
  <div>
    <el-cascader
      v-if="taskIsEnd === false"
      v-model="selectedMembers"
      :props="{ multiple: true }"
      :options="deptList"
      placeholder="请输入名字搜索"
      filterable
      collapse-tags
      size="mini"
      popper-class="my-menu"
      @visible-change="onCascaderVisibleChanged"
    />
    <el-button
      v-if="taskIsEnd === false && myMemberList.length > 0"
      type="danger"
      size="mini"
      plain
      style="margin-left: 10px;"
      @click="clearTeacherList"
    >
      清空列表
    </el-button>
    <el-table
      v-if="myMemberList.length > 0"
      :data="myMemberList"
      border
      size="mini"
      max-height="300px"
      style="width: 100%;margin-top: 10px;"
    >
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="teacherName" label="负责人" align="center" />
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.taskRemark }}
          <el-link :underline="false" @click="editRemark(scope.row)">
            <i class="el-icon-edit" style="font-size: 15px" />
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="taskStatus" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.taskStatus === '待阅' ? 'danger' : scope.row.taskStatus === '待阅' ? 'warning' : 'success'">
            {{ scope.row.taskStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center">
        <template slot-scope="scope">
          {{ scope.row.taskComProgress }}%
        </template>
      </el-table-column>
      <el-table-column label="回传附件" align="center">
        <template slot-scope="scope">
          <show-file-list :file-list="scope.row.taskFileArr" />
        </template>
      </el-table-column>
      <el-table-column v-if="taskIsEnd === false" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleDelTeacher(scope.$index,scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
import ShowFileList from '../components/ShowFileList'
export default {
  name: 'AddChildTaskMembers',
  components: { ShowFileList },
  props: {
    memberList: {
      type: Array,
      default: function() {
        return []
      }
    },
    taskIsEnd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deptList: [],
      selectedMembers: [],
      myMemberList: this.memberList
    }
  },
  watch: {
    memberList(val) {
      this.myMemberList = val
    }
  },
  mounted() {
    this.getDeptList()
  },
  methods: {
    getDeptList() {
      this.$http
        .post('/jiangoaoffice/Office/task/GetDeptTeacherList.php', {
          param: rsaUtil.encryption({
            teacherName: '99'
          })
        })
        .then(res => {
          this.deptList = res.data.rows.map(row => {
            return {
              label: row.deptName,
              value: {
                deptId: row.deptId,
                deptName: row.deptName
              },
              children: row.deptArr.map(teacher => {
                return {
                  label: teacher.teacherName,
                  value: teacher
                }
              })
            }
          })
        })
    },
    handleDelTeacher(index, row) {
      this.$confirm('您确定要删除成员 ' + row.teacherName + ' 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.memberList.splice(index, 1)
        })
        .catch(() => {})
    },
    clearTeacherList() {
      this.$confirm('您确定要清空已选成员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.myMemberList = []
        })
        .catch(() => {})
    },
    editRemark(row) {
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.taskRemark
      })
        .then(({ value }) => {
          row.taskRemark = value
        })
        .catch(() => {})
    },
    onCascaderVisibleChanged(visible) {
      if (visible === false) {
        if (this.selectedMembers.length === 0) {
          return
        }
        for (let i = 0; i < this.selectedMembers.length; i++) {
          if (this.checkDuplicateTeacher(this.selectedMembers[i][1].teacherId, this.myMemberList)) {
            continue
          }
          const teacher = {
            teacherId: this.selectedMembers[i][1].teacherId,
            teacherNo: this.selectedMembers[i][1].teacherNo,
            teacherName: this.selectedMembers[i][0].deptName + '-' + this.selectedMembers[i][1].teacherName,
            childTaskRemark: ''
          }
          this.myMemberList.push(teacher)
        }
        this.selectedMembers = []
      }
    },
    checkDuplicateTeacher(teacherId, teacherList) {
      // 去重
      for (let i = 0; i < teacherList.length; i++) {
        if (teacherId === teacherList[i].teacherId) {
          return true
        }
      }
      return false
    },
    getMemberList() {
      return this.myMemberList
    }
  }
}
</script>

<style lang="scss">
.my-menu {
  .el-cascader-menu__wrap {
    height: 500px;
    overflow: scroll;
  }
}
</style>
