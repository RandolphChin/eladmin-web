<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">jobName</label>
        <el-input v-model="query.jobName" clearable placeholder="jobName" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">groupName</label>
        <el-input v-model="query.groupName" clearable placeholder="groupName" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">jobClass</label>
        <el-input v-model="query.jobClass" clearable placeholder="jobClass" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="jobName">
            <el-input v-model="form.jobName" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="groupName">
            <el-input v-model="form.groupName" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="jobClass">
            <el-input v-model="form.jobClass" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="cronExpression">
            <el-input v-model="form.cronExpression" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="param">
            <el-input v-model="form.param" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="description">
            <el-input v-model="form.description" style="width: 300px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="jobName" label="jobName" />
        <el-table-column prop="groupName" label="groupName" />
        <el-table-column prop="jobClass" label="jobClass" />
        <el-table-column prop="cronExpression" label="cronExpression" />
        <el-table-column prop="param" label="param" />
        <el-table-column prop="createTime" label="createTime" />
        <el-table-column prop="description" label="description" />
        <el-table-column prop="updateTime" label="updateTime" />
        <el-table-column prop="isPause" label="isPause">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isPause ? 'warning' : 'success'">{{ scope.row.isPause ? '已暂停' : '运行中' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','qrtzJob:edit','qrtzJob:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['admin','qrtzJob:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
            <el-button v-permission="['admin','qrtzJob:edit']" style="margin-left: -2px" type="text" size="mini" @click="execute(scope.row.id)">执行</el-button>
            <el-button v-permission="['admin','qrtzJob:edit']" style="margin-left: 3px" type="text" size="mini" @click="updateStatus(scope.row.id,scope.row.isPause ? '恢复' : '暂停')">
              {{ scope.row.isPause ? '恢复' : '暂停' }}
            </el-button>
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','qrtzJob:del']"
              placement="top"
              width="200"
            >
              <p>确定停止并删除该任务吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="text" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudQrtzJob from '@/api/quartz/qrtzJob'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, jobName: null, groupName: null, jobClass: null, cronExpression: null, param: null, createTime: null, description: null, updateTime: null, isPause: false }
export default {
  name: 'QrtzJob',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'Quartz集群定时', url: 'api/qrtzJob', idField: 'id', sort: 'id,desc', crudMethod: { ...crudQrtzJob }})
  },
  data() {
    return {
      delLoading: false,
      permission: {
        add: ['admin', 'qrtzJob:add'],
        edit: ['admin', 'qrtzJob:edit'],
        del: ['admin', 'qrtzJob:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'jobName', display_name: 'jobName' },
        { key: 'groupName', display_name: 'groupName' },
        { key: 'jobClass', display_name: 'jobClass' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 改变状态
    updateStatus(id, status) {
      crudQrtzJob.updateIsPause(id).then(res => {
        this.crud.toQuery()
        this.crud.notify(status + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    execute(id) {
      crudQrtzJob.runOnce(id).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    delMethod(id) {
      this.delLoading = true
      crudQrtzJob.del([id]).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    }
  }
}
</script>

<style scoped>

</style>
