<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="onClose"
    width="60%"
    @open="onOpen"
  >
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
      :height="350"
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
        label="是否授权"
        width="80"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.hasPermission"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="routePermissionStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="50"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="子路由" placement="top">
            <i
              class="el-icon-share"
              style="cursor: pointer;font-size: 20px"
              @click="pushCurrentRoutesPath(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ConfigureRoutePermissionDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: '配置路由权限'
    }
  },
  data() {
    return {
      routes: [],
      currentRoutesPath: []
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
  methods: {
    onOpen() {
      this.pushCurrentRoutesPath({
        id: 0,
        meta: {
          title: '根路由'
        }
      })
      this.getGetGlobalRoutesWithPermissions()
    },
    onClose() {
      this.$emit('update:visible', false)
      this.routes = []
      this.currentRoutesPath = []
    },
    goBack() {
      this.currentRoutesPath.splice(this.currentRoutesPath.length - 1, 1)
      this.getGetGlobalRoutesWithPermissions()
    },
    getGetGlobalRoutesWithPermissions() {
      this.$http
        .post('admin/GetGlobalRoutesWithPermissions', {
          token: this.user.token,
          roleId: this.roleId,
          fatherRouteId: this.currentRoutesPath[this.currentRoutesPath.length - 1].id
        })
        .then(res => {
          this.routes = res.data.routes
        })
    },
    pushCurrentRoutesPath(route) {
      this.currentRoutesPath.push(route)
      this.getGetGlobalRoutesWithPermissions()
    },
    routePermissionStatusChange(row) {
      this.$http
        .post('admin/GrantOrCancelRoleRoutePermission', {
          token: this.user.token,
          roleId: this.roleId,
          routeId: row.id
        })
        .then(res => {
          this.$notify({
            type: 'success',
            title: '提示',
            message: res.data.message
          })
          this.$emit('roleRoutePermissionChanged')
        })
    }
  }
}
</script>

<style scoped>

</style>
