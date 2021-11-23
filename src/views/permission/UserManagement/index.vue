<template>
  <div class="app-container">
    <el-table
      :data="users"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="id"
        label="uid"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="username"
        label="用户名"
        show-overflow-tooltip
      />
      <el-table-column
        label="关联角色"
        show-overflow-tooltip
      />
      <el-table-column
        prop="reg_time"
        label="注册时间"
      />
      <el-table-column
        prop="last_login_time"
        label="最后登录时间"
      />
      <el-table-column
        label="操作"
        width="150"
        align="center"
        fixed="right"
      >
        <template>
          <el-button
            type="primary"
            size="mini"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UserManagement',
  components: { },
  data() {
    return {
      users: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      this.$http
        .post('admin/GetUsers', {
          token: this.user.token
        })
        .then(res => {
          this.users = res.data.users
        })
    }
  }
}
</script>
