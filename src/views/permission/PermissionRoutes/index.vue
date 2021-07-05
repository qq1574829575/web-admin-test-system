<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddAdmin">创建权限路由</el-button>

    <el-table :data="PermissionRoutesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="权限路由id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由权限说明" width="220">
        <template slot-scope="scope">
          {{ scope.row.desc }}
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑权限路由':'创建权限路由'">
      <el-form :model="PermissionRoutes" label-width="80px" label-position="left">
        <el-form-item label="权限说明">
          <el-input v-model="PermissionRoutes.desc" placeholder="路由权限说明" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPermissionRoutes">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { GetAllPermissionRoutes, AddPermissionRoutes, EditPermissionRoutes, DelPermissionRoutes } from '@/api/permission'
import store from '@/store'
import request from '@/utils/request'

const defaultPermissionRoutes = {
  desc: '',
  routes: [],
  create_name: ''
}

export default {
  data() {
    return {
      PermissionRoutes: Object.assign({}, defaultPermissionRoutes),
      routes: [],
      PermissionRoutesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoutes()
    this.getAllPermissionRoutes()
  },
  methods: {
    getRoutes() {
      request({
        url: '/GetRoutes',
        method: 'post',
        data: {
          id: 1
        }
      }).then((res) => {
        if (res.code === 200) {
          const data = JSON.parse(res.routes)
          this.serviceRoutes = data
          this.routes = this.generateRoutes(data)
          console.log(this.routes)
        }
      })
    },
    async getAllPermissionRoutes() {
      const res = await GetAllPermissionRoutes()
      this.PermissionRoutesList = res.data
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddAdmin() {
      this.PermissionRoutes = Object.assign({}, defaultPermissionRoutes)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.PermissionRoutes = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(JSON.parse(this.PermissionRoutes.routes))
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除该用户管理权限吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await DelPermissionRoutes(row)
          await this.getAllPermissionRoutes()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmPermissionRoutes() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.PermissionRoutes.create_name = store.getters.userinfo.Rootname
      this.PermissionRoutes.routes = JSON.stringify(this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys))
      if (isEdit) {
        await EditPermissionRoutes(this.PermissionRoutes)
        await this.getAllPermissionRoutes()
        this.dialogVisible = false
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `保存成功`,
          type: 'success'
        })
      } else {
        await AddPermissionRoutes(this.PermissionRoutes)
        await this.getAllPermissionRoutes()
        this.dialogVisible = false
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `创建管理权限成功`,
          type: 'success'
        })
      }
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
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
