<template>
  <div class="app-container">
    <el-select v-model="value" value-key="scheme_name" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.scheme_name"
        :label="item.scheme_name"
        :value="item"
      />
    </el-select>
    <el-descriptions
      v-for="(descriptions,index) in value.scheme_forms"
      :key="index"
      class="margin-top"
      title=""
      :column="descriptions.column"
      :size="descriptions.size"
      :border="descriptions.border"
    >
      <el-descriptions-item
        v-for="(descriptionsItem,itemIndex) in descriptions.descriptionsItems"
        :key="itemIndex"
        :label="descriptionsItem.label"
      >
        <el-input v-model="descriptionsItem.value" placeholder="" />
      </el-descriptions-item>
    </el-descriptions>
    <el-button>发起申请</el-button>
  </div>
</template>

<script>

import request from '@/utils/request'
import rsaUtil from '@/utils/rsaUtil'

export default {
  name: 'Index',
  components: { },
  data() {
    return {
      options: [],
      value: {}
    }
  },
  mounted() {
    this.getSchemeList()
  },
  methods: {
    getSchemeList() {
      request({
        url: '/v2/SchemeDesign/GetSchemeList.php',
        method: 'post',
        baseURL: 'http://localhost:8003',
        data: {
          param: rsaUtil.encryption_oa_test(),
          page: 1,
          rows: 100
        }
      }).then((res) => {
        this.options = res.rows
      })
    }
  }
}
</script>

<style scoped>

</style>
