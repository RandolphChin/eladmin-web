<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.username" clearable placeholder="姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.certificName" clearable placeholder="证书名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.certificNo" clearable placeholder="证书编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select
          v-model="query.certificLevel"
          clearable
          filterable
          placeholder="请选择证书级别"
          style="width: 185px;"
          class="filter-item"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in dict.person_certificate_level"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="query.certificProject" clearable placeholder="取证项目" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.certificDept" clearable placeholder="发证单位" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker
          v-model="query.validityTime"
          start-placeholder="有效期至开始"
          end-placeholder="有效期至截止"
          class="date-item"
          align="center"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-select v-model="form.userId" filterable clearable placeholder="请选择人员" style="width: 270px;" @change="userChange">
                  <el-option
                    v-for="item in usersOptions"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门">
                <el-input v-model="chosedUserDeptName" style="width: 270px;" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证书名称">
                <el-input v-model="form.certificName" style="width: 270px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证书编号">
                <el-input v-model="form.certificNo" style="width: 270px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证书级别">
                <el-select v-model="form.certificLevel" filterable placeholder="请选择" style="width: 270px;">
                  <el-option
                    v-for="item in dict.person_certificate_level"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="取证项目">
                <el-input v-model="form.certificProject" style="width: 270px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="取证时间">
                <el-date-picker v-model="form.certificTime" type="date" style="width: 270px" align="center" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期至">
                <el-date-picker v-model="form.validityTime" type="datetime" style="width: 270px;" align="center" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发证单位">
                <el-input v-model="form.certificDept" style="width: 270px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" :rows="2" style="width: 270px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="电子附件" prop="attach">
            <el-upload
              ref="upload"
              :action="uploadURL"
              list-type="picture-card"
              :class="{hide:hideUpload}"
              :on-preview="handlePreview"
              :on-remove="remove"
              :on-change="uploadChange"
              :file-list="headFileList"
              :on-success="onSuccess"
              :headers="headers"
              multiple
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="previewVisible" :append-to-body="dialogAppendBody">
              <img width="100%" :src="previewPath" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button v-if="crud.showConfirmBtn" :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="deptName" label="部门" />
        <el-table-column prop="certificName" label="证书名称" />
        <el-table-column prop="certificNo" label="证书编号" />
        <el-table-column prop="certificLevel" label="证书级别">
          <template v-slot="scope">
            {{ dict.label.person_certificate_level[scope.row.certificLevel] }}
          </template>
        </el-table-column>
        <el-table-column prop="certificProject" label="取证项目" />
        <el-table-column prop="certificTime" label="取证时间">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.certificTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="certificDept" label="发证单位" />
        <el-table-column prop="validityTime" label="有效期至">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.validityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="attach" label="电子附件">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="viewAttach(scope.row)">预览附件</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column v-if="checkPer([defaultAdminUser,'basePersonCertific:edit','basePersonCertific:del'])" label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            >
              <el-button slot="left" size="mini" type="warning" icon="el-icon-view" @click="viewDetail(scope.row)" />
            </udOperation>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
    <el-dialog :title="currentRow.allImageTitle" :visible.sync="currentRow.allImageDialog" width="800px" append-to-body>
      <div v-for="(i,index) in currentRow.attachs" :key="index" class="imageView">
        <el-card :body-style="{ padding: '0px' }">
          <el-image :src="i.url" />
        </el-card>
      </div>
      <div class="closeClass">
        <el-button type="primary" @click="currentRow.allImageDialog=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudBasePersonCertific from '@/api/base/certificateManage/person/basePersonCertific'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { defaultAdminUser, certificateBucketName } from '@/settings'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import DateRangePicker from '@/components/DateRangePicker'
import crudUser from '@/api/system/user'
import crudDept from '@/api/system/dept'
import crudLocalStorage from '@/api/tools/localStorage'
const defaultForm = { id: null, name: null, dept: null, certificName: null, certificNo: null, certificLevel: null, certificProject: null, certificTime: null, certificDept: null, validityTime: null, attach: null, remark: null, createBy: null, createTime: null, updateBy: null, updateTime: null, delStatus: null }

export default {
  name: 'BasePersonCertific',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['person_certificate_level', 'del_status'],
  cruds() {
    return CRUD({ title: '人员资质', url: 'api/basePersonCertific', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBasePersonCertific }})
  },
  data() {
    return {
      permission: {
        add: [defaultAdminUser, 'basePersonCertific:add'],
        edit: [defaultAdminUser, 'basePersonCertific:edit'],
        del: [defaultAdminUser, 'basePersonCertific:del']
      },
      rules: {
        attach: [{ required: true, message: '请上传图片', trigger: 'change' }]
      },
      uploadURL: process.env.VUE_APP_BASE_API + '/api/minio/upload/' + certificateBucketName,
      previewPath: '',
      previewVisible: false,
      hideUpload: false,
      limitCount: 1,
      currentRow: {
        attachs: [],
        allImageDialog: false,
        allImageTitle: ''
      },
      headFileList: [],
      headers: { 'Authorization': getToken() },
      dialogAppendBody: true,
      usersOptions: [],
      chosedUserDeptName: ''
    }
  },
  computed: {
    ...mapGetters([
      'defaultAdminUser'
    ]),
    dialogOpen() {
      return this.crud.status.cu > 0
    }
  },
  watch: {
    // 如果不清除 headFileList 附件图片会累计
    dialogOpen(val) {
      if (!val) {
        this.headFileList = []
      }
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 钩子：在新增之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeToAdd]() {
      // 获取所有用户填充到下拉框
      crudUser.all({ 'isAdmin': false }).then(resp => {
        this.usersOptions = resp
      })
      return true
    },
    // 编辑 - 之前
    [CRUD.HOOK.beforeToEdit]() {
      crudUser.all({ 'isAdmin': false }).then(resp => {
        this.usersOptions = resp
        this.userChange(this.form.userId)
        crudLocalStorage.list({ 'storageId': this.form.attach }).then(resp => {
          const localStorageArr = resp.content
          localStorageArr.forEach(v => {
            this.headFileList.push({
              name: v.name,
              id: v.id,
              url: this.calImagePath(v.path)
            })
          })
        })
      })
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.url
      this.previewVisible = true
    },
    // 删除图片时触发
    remove(file, fileList) {
      if (fileList.length === 0) {
        this.rules.attach = [{ required: true, message: '请上传设备头像', trigger: 'change' }]
      }
      const attachIds = []
      fileList.forEach(k => {
        attachIds.push(k.id)
      })
      this.form.attach = attachIds.join(',')
      this.hideUpload = fileList.length >= this.limitCount
    },
    uploadChange(file, fileList) {
      this.headFile = file
      this.headFileList = fileList
      this.$refs.form.clearValidate('attach')
      this.hideUpload = fileList.length >= this.limitCount
    },
    calImagePath(imgPath) {
      return process.env.VUE_APP_SERVER_ENDPOINT + '/' + imgPath
    },
    onSuccess(response, file, fileList) {
      let attachIds = []
      if (this.form.attach) {
        attachIds = this.form.attach.split(',')
      }
      fileList.forEach(k => {
        if (k.response) {
          attachIds.push(k.response.id)
        }
      })
      this.form.attach = attachIds.join(',')
    },
    userChange(val) {
      const user = this.usersOptions.find(k => k.id === val)
      crudDept.getById(user.deptId).then(resp => {
        this.form.deptId = resp.id
        this.chosedUserDeptName = resp.name
      })
    },
    viewDetail(data) {
      this.crud.toEdit(data)
      this.crud.showConfirmBtn = false
    },
    viewAttach(data) {
      crudLocalStorage.list({ 'storageId': data.attach }).then(resp => {
        const localStorageArr = resp.content
        this.currentRow.attachs = []
        localStorageArr.forEach(v => {
          this.currentRow.attachs.push({
            name: v.name,
            id: v.id,
            url: this.calImagePath(v.path)
          })
        })
        this.currentRow.allImageTitle = data.certificName
        this.currentRow.allImageDialog = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.closeClass {
  display: flex;
  justify-content: flex-end;
}
.imageView {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
