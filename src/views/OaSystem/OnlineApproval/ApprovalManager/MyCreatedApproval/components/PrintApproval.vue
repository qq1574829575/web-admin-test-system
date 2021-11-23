<template>
  <div class="print-body">
    <div style="position: absolute;top: 0;left: 6px">
      <vue-qr :text="approvalUrl" :margin="0" :size="50" />
    </div>
    <div v-html="workContent" />
  </div>
</template>

<script>
import vueQr from 'vue-qr'
import { getQueryVariable } from '@/utils'
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'PrintApproval',
  components: {
    vueQr
  },
  data() {
    return {
      approvalUrl: '',
      workContent: ''
    }
  },
  mounted() {
    this.loadApprovalDetail()
  },
  methods: {
    loadApprovalDetail() {
      const approvalId = getQueryVariable('approvalId')
      if (!approvalId) {
        return
      }
      this.$http.post('/jiangoaoffice/Office/work/GetOfficeWorkDetail.php', {
        param: rsaUtil.encryption({
          workId: approvalId
        })
      }, {
        baseURL: 'http://www.unifiedplatform.guolianrobot.com/'
      }).then(res => {
        this.approvalUrl = 'http://192.168.110.183:8080/#/PreviewApproval?approvalId=' + approvalId
        this.workContent = res.data.rows[0].workContent
      })
    }
  }
}
</script>

<style scoped>
.print-body {
  width: 100%;
  height: 100%;
  -webkit-print-color-adjust: exact;
  background-image: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201710%2F16%2F20171016010355_S8hwP.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1639123566&t=e9926a79aeeee26aa46fc8e9e995f444");
}
</style>
