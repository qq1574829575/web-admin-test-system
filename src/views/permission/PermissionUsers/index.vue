<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddAdminUser">分配用户权限</el-button>

    <el-table :data="adminUsersList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="关联用户" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="权限路由id">
        <template slot-scope="scope">
          {{ scope.row.permission_routes_id }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建人">
        <template slot-scope="scope">
          {{ scope.row.create_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑管理权限':'新增管理权限'">
      <el-form :model="adminUser" label-width="100px" label-position="left">
        <el-form-item label="关联用户">
          <el-input v-model="adminUser.username" placeholder="关联用户" />
        </el-form-item>
        <el-form-item label="权限路由id">
          <el-input v-model="adminUser.permission_routes_id" placeholder="权限路由id" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="adminUser.remarks" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmAdmin">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { GetAdminUsers, AddAdminUser, EditAdminUser, DelAdminUser } from '@/api/admin'
import store from '@/store'

const defaultAdminUser = {
  username: '',
  permission_routes_id: '',
  ass_per_routes: [],
  remarks: '',
  create_name: ''
}

export default {
  data() {
    return {
      adminUser: Object.assign({}, defaultAdminUser),
      adminUsersList: [],
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  created() {
    this.getAdminUsers()
  },
  methods: {
    async getAdminUsers() {
      const res = await GetAdminUsers()
      this.adminUsersList = res.data
    },
    handleAddAdminUser() {
      this.adminUser = Object.assign({}, defaultAdminUser)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.adminUser = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除该用户管理权限吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await DelAdminUser(row)
          await this.getAdminUsers()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmAdmin() {
      const isEdit = this.dialogType === 'edit'
      this.adminUser.create_name = store.getters.userinfo.Rootname
      if (isEdit) {
        await EditAdminUser(this.adminUser)
        await this.getAdminUsers()
        this.dialogVisible = false
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `保存成功`,
          type: 'success'
        })
      } else {
        await AddAdminUser(this.adminUser)
        await this.getAdminUsers()
        this.dialogVisible = false
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `创建管理权限成功`,
          type: 'success'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .admins-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
