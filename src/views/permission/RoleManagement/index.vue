<template>
  <div class="app-container">
    <el-table
      :data="roles"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="roleName"
        label="角色"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        label="根路由权限"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-tag
            v-for="(item,index) in scope.row.routes"
            :key="index"
            :type="item.available === false ? 'info' : item.hidden === true ? 'info' : 'success'"
            style="margin-right: 5px;"
          >
            {{ item.meta.title }}
            <el-tooltip
              v-if="item.available === false || item.hidden === true"
              effect="dark"
              :content="item.available === false ? '该路由被设定为[无效的路由]' : '该路由为不在导航栏显示的隐藏路由'"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="130"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="configureRoutePermission(scope.row)"
          >
            配置路由权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <configure-route-permission-dialog
      :visible.sync="showConfigureRoutePermission"
      :role-id="roleId"
      :title="configureRoutePermissionDialogTitle"
      @roleRoutePermissionChanged="getGlobalRoles"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ConfigureRoutePermissionDialog from '@/views/permission/RoleManagement/components/ConfigureRoutePermissionDialog'

export default {
  name: 'RoleManagement',
  components: { ConfigureRoutePermissionDialog },
  data() {
    return {
      roles: [],
      showConfigureRoutePermission: false,
      configureRoutePermissionDialogTitle: '配置路由权限',
      roleId: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted() {
    this.getGlobalRoles()
  },
  methods: {
    getGlobalRoles() {
      this.$http
        .post('admin/GetGlobalRoles', {
          token: this.user.token
        })
        .then(res => {
          this.roles = res.data.roles
        })
    },
    configureRoutePermission(row) {
      this.roleId = row.id
      this.configureRoutePermissionDialogTitle = '配置路由权限 - ' + row.roleName
      this.showConfigureRoutePermission = true
    }
  }
}
</script>
