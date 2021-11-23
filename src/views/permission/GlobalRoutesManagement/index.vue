<template>
  <div class="app-container">
    <el-page-header
      v-if="currentRoutesPath.length > 1"
      style="margin-bottom: 10px;"
      @back="goBack"
    >
      <template slot="content">
        <div style="font-size: 15px">
          {{ currentRoutesPathTitle }}
        </div>
      </template>
    </el-page-header>
    <el-table
      :data="routes"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        label="路由标题"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.meta.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="路由图标"
        width="100"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <i :class="scope.row.meta.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="路由名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="path"
        label="路由路径"
        show-overflow-tooltip
      />
      <el-table-column
        prop="component"
        label="路由组件"
        show-overflow-tooltip
      />
      <el-table-column
        prop="redirect"
        label="重定向"
        show-overflow-tooltip
      />
      <el-table-column
        label="是否根路由"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_root_route?'success':'info'">
            {{ scope.row.is_root_route ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="固定在标签栏"
        align="center"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.meta.affix?'success':'info'">
            {{ scope.row.meta.affix ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="不缓存页面"
        align="center"
        min-width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.meta.noCache?'success':'info'">
            {{ scope.row.meta.noCache ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="100"
      >
        <template slot="header">
          总是显示
          <el-tooltip effect="dark" content="此项为true,则对应导航栏效果为可展开且总是会显示" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-tag :type="scope.row.alwaysShow?'success':'info'">
            {{ scope.row.alwaysShow ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否隐藏"
        align="center"
        min-width="80"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.hidden?'success':'info'">
            {{ scope.row.hidden ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效"
        align="center"
        min-width="80"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.available?'success':'info'">
            {{ scope.row.available ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="130"
        align="center"
        fixed="right"
      >
        <template slot="header">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            round
            @click="showAddRouteDialog = true"
          >
            添加路由
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="子路由" placement="top">
            <i
              class="el-icon-share"
              style="cursor: pointer;font-size: 20px"
              @click="pushCurrentRoutesPath(scope.row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑路由" placement="top">
            <i
              class="el-icon-edit"
              style="cursor: pointer;font-size: 20px;margin-left: 10px;"
              @click="editRoute(scope.row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除路由" placement="top">
            <i
              class="el-icon-delete"
              style="cursor: pointer;font-size: 20px;margin-left: 10px;"
              @click="delRoute(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <add-route-dialog
      :visible.sync="showAddRouteDialog"
      :father-route="currentRoutesPath[currentRoutesPath.length - 1]"
      @onAddRouteSuccess="getRoutesByFatherRouteId"
    />
    <edit-route-dialog
      :visible.sync="showEditRouteDialog"
      :father-route="currentRoutesPath[currentRoutesPath.length - 1]"
      :route="currentRoute"
      @onEditRouteSuccess="getRoutesByFatherRouteId"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddRouteDialog from '@/views/permission/GlobalRoutesManagement/components/AddRouteDialog'
import EditRouteDialog from '@/views/permission/GlobalRoutesManagement/components/EditRouteDialog'

export default {
  name: 'GlobalRoutesManagement',
  components: { EditRouteDialog, AddRouteDialog },
  data() {
    return {
      showAddRouteDialog: false,
      showEditRouteDialog: false,
      fatherRouteId: 0,
      routes: [],
      currentRoutesPath: [],
      currentRoute: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    currentRoutesPathTitle: function() {
      let title = ''
      for (let i = 0; i < this.currentRoutesPath.length; i++) {
        if (title === '') {
          title = this.currentRoutesPath[i].meta.title
        } else {
          title = title + ' / ' + this.currentRoutesPath[i].meta.title
        }
      }
      return title
    }
  },
  mounted() {
    this.pushCurrentRoutesPath({
      id: 0,
      meta: {
        title: '根路由'
      }
    })
  },
  methods: {
    goBack() {
      this.currentRoutesPath.splice(this.currentRoutesPath.length - 1, 1)
      this.getRoutesByFatherRouteId()
    },
    pushCurrentRoutesPath(route) {
      this.currentRoutesPath.push(route)
      this.getRoutesByFatherRouteId()
    },
    getRoutesByFatherRouteId() {
      this.$http
        .post('admin/GetRoutesByFatherRouteId', {
          fatherRouteId: this.currentRoutesPath[this.currentRoutesPath.length - 1].id,
          token: this.user.token
        })
        .then(res => {
          this.routes = res.data.routes
        })
    },
    editRoute(row) {
      this.currentRoute = row
      this.showEditRouteDialog = true
    },
    delRoute(row) {
      this.$confirm('您确定要删除该路由吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .post('admin/DelRoute', {
            routeId: row.id,
            token: this.user.token
          })
          .then(res => {
            this.$notify({
              type: 'success',
              title: '提示',
              message: res.data.message
            })
            this.getRoutesByFatherRouteId()
          })
      }).catch(() => {})
    }
  }
}
</script>
