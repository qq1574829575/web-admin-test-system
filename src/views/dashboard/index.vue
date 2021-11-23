<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.currentRole = 'adminDashboard'
  },
  methods: {
    onClick() {
      this.$http.post('api.do', {
        jsonParams: JSON.stringify({
          method: 1,
          params: {
            userId: '1234',
            fileId: '123456487',
            filePath: 'null/江西工程学院维修申请单.doc'
          }
        })
      }, {
        baseURL: 'http://42.194.128.96:8080/'
      }).then(res => {
        if (res.data.errorCode === '0') {
          window.open(res.data.result.urls)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
