<template>
  <div class="app-container" style="padding: 8px;">
    <!-- 工具栏 -->
    <div class="head-container">
      minIO 上传测试
      <el-upload
        class="upload"
        :action="uploadAction"
        :headers="headers"
        :show-file-list="false"
      >
        <el-button class="filter-item" icon="el-icon-upload2" type="success" plain>
          import
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  components: { },
  data() {
    return {
      uploadAction: `${process.env.VUE_APP_BASE_API}/api/minio/upload/tulaoda`,
      headers: {
        Authorization: `${getToken()}`
      }
    }
  },
  methods: {
  }
}
</script>
