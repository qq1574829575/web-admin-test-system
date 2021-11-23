<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="mini" round @click="addRoutesDialogVisible = true">添加一级路由</el-button>
    </el-row>
    <el-row>
      <el-tree
        ref="tree"
        default-expand-all
        draggable
        :check-strictly="checkStrictly"
        :data="routesData"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="path"
        @node-drop="handleDrop"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.data.meta.title }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => addChildRoute(data)"
            >
              添加子路由
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => edit(node, data)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-row>
    <add-routes-dialog name="添加一级路由" :visible.sync="addRoutesDialogVisible" :routes="routes" />
    <add-child-routes-dialog name="添加子路由" :visible.sync="addChildRouteDialogVisible" :route-data="addChildRouteData" @onAddChildRouteSuccess="onAddChildRouteSuccess" />
    <edit-child-routes-dialog name="编辑子路由" :visible.sync="editChildRouteDialogVisible" :route-data="editRouteData" @onEditSuccess="onEditSuccess" />
  </div>
</template>

<script>
import path from 'path'
import AddRoutesDialog from '@/views/permission/AddRoutes/components/AddRoutesDialog'
import EditChildRoutesDialog from '@/views/permission/AddRoutes/components/EditChildRoutesDialog'
import AddChildRoutesDialog from '@/views/permission/AddRoutes/components/AddChildRoutesDialog'
export default {
  components: { AddChildRoutesDialog, EditChildRoutesDialog, AddRoutesDialog },
  data() {
    return {
      routes: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      addRoutesDialogVisible: false,
      addChildRouteDialogVisible: false,
      addChildRouteData: null,
      editChildRouteDialogVisible: false,
      editRouteData: null
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  mounted() {
    this.getRoutes()
  },
  methods: {
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.updateRoutes()
    },
    addChildRoute(data) {
      this.addChildRouteDialogVisible = true
      this.addChildRouteData = data
    },
    onAddChildRouteSuccess(data) {
      this.updateRoutes()
      this.addChildRouteDialogVisible = false
    },
    edit(node, data) {
      this.editRouteData = data
      this.editChildRouteDialogVisible = true
    },
    onEditSuccess(data) {
      this.updateRoutes()
      this.editChildRouteDialogVisible = false
    },
    remove(node, data) {
      this.$confirm('您确认要删除该路由"' + data.meta.title + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.path === data.path)
        children.splice(index, 1)
        this.updateRoutes()
      }).catch(() => {
      })
    },
    getRoutes() {
      this.$http.post('GetRoutes', {
        id: 1
      }).then((res) => {
        if (res.code === 200) {
          this.routes = JSON.parse(res.routes)
          console.log(this.routes)
        }
      })
    },
    updateRoutes() {
      this.$http.post('UpdateRoutes', {
        id: 1,
        routes: JSON.stringify(this.routes)
      }).then((res) => {
        this.getRoutes()
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
      })
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
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(route)
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
