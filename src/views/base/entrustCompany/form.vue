<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="父单位名称">
        <el-select v-model="form.pid" filterable clearable placeholder="选择父单位(没有可不选)" style="width: 370px;">
          <el-option
            v-for="item in parentEntrustCompanys"
            :key="item.id"
            :label="item.companyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-input v-model="form.companyName" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="单位地址">
        <el-input v-model="form.companyAddress" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'

const defaultForm = { id: null, companyName: null, companyAddress: null, createTime: null, updateTime: null, pid: null, subCount: null }
export default {
  mixins: [form(defaultForm)],
  props: {
    parentEntrustCompanys: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
