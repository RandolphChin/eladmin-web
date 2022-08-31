<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">jobName</label>
        <el-input v-model="searchJobName" clearable placeholder="jobName" style="width: 185px;" class="filter-item" @keyup.enter.native="quartzQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="jobName" label="jobName" />
        <el-table-column prop="groupName" label="groupName" />
        <el-table-column prop="jobClass" label="jobClass" />
        <el-table-column prop="cronExpression" label="cronExpression" />
        <el-table-column prop="param" label="param" />
        <el-table-column prop="triggerState" label="triggerState">
          <template slot-scope="scope">
            <el-tag :type="scope.row.triggerState ==='PAUSED' ? 'warning' : 'success'">{{ scope.row.triggerState ==='PAUSED' ? '已暂停' : '运行中' }}</el-tag>
          </template>

        </el-table-column>
        <el-table-column v-if="checkPer([defaultAdminUser,'jobs:edit','jobs:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button v-permission="[defaultAdminUser,'jobs:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
            <el-button v-permission="[defaultAdminUser,'jobs:edit']" style="margin-left: -2px" type="text" size="mini" @click="execute(scope.row)">执行</el-button>
            <el-button v-permission="[defaultAdminUser,'jobs:edit']" style="margin-left: 3px" type="text" size="mini" @click="updateStatus(scope.row)">
              {{ scope.row.triggerState ==='PAUSED' ? '恢复' : '暂停' }}
            </el-button>
            <el-popover
              :ref="scope.row.id"
              v-permission="[defaultAdminUser,'jobs:del']"
              placement="top"
              width="200"
            >
              <p>确定停止并删除该任务吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row)">确定</el-button>
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
import crudQrtzJob from '@/api/system/qrtzJob'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { Notification } from 'element-ui'
import { defaultAdminUser } from '@/settings'
import { mapGetters } from 'vuex'
const defaultForm = { id: null, jobName: null, groupName: null, jobClass: null, cronExpression: null, param: null, createTime: null, description: null, updateTime: null, isPause: false }
export default {
  name: 'QrtzJob',
  components: { pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ title: 'Quartz集群定时', url: 'api/quartzJobs', idField: 'jobName', optShow: {
      add: true,
      edit: true,
      del: true,
      download: false,
      reset: false
    }, sort: 'jobName,desc', crudMethod: { ...crudQrtzJob }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delLoading: false, searchJobName: '',
      permission: {
        add: [defaultAdminUser, 'jobs:add'],
        edit: [defaultAdminUser, 'jobs:edit'],
        del: [defaultAdminUser, 'jobs:del']
      },
      rules: {
      }
    }
  },
  computed: {
    ...mapGetters([
      'defaultAdminUser'
    ])
  },
  mounted() {
    this.connect()
  },
  destroyed() {
    this.disconnect()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.query['jobName'] = this.searchJobName
      return true
    },
    // 改变状态
    updateStatus(data) {
      if (data.triggerState === 'PAUSED') {
        crudQrtzJob.resumeJob(data).then(res => {
          this.crud.toQuery()
          this.crud.notify(status + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(err => {
          console.log(err.response.data.message)
        })
      } else {
        crudQrtzJob.pauseJob(data).then(res => {
          this.crud.toQuery()
          this.crud.notify(status + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(err => {
          console.log(err.response.data.message)
        })
      }
    },
    execute(data) {
      crudQrtzJob.runOnce(data).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    delMethod(data) {
      this.delLoading = true
      crudQrtzJob.del(data).then(() => {
        this.delLoading = false
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
      })
    },
    quartzQuery() {
      crudQrtzJob.get(this.searchJobName).then(res => {
        this.crud.page.total = res.totalElements
        this.crud.data = res.content
      })
    },
    connect() {
      // test env：VUE_APP_WESOCKET = 'http://localhost:8000'
      // prod env: VUE_APP_WESOCKET = 'https://hkwis.com'
      const url = process.env.VUE_APP_WESOCKET + crudQrtzJob.linkWebsocket
      this.socket = new SockJS(url)
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect(
        { },
        frame => {
          this.connected = true
          // 发送的信息只要订阅这个地址就能获取到
          // messagingTemplate.convertAndSend("/topic/quartz",msg)
          this.stompClient.subscribe(crudQrtzJob.subscribeWebsocker, tick => {
            // const msg = JSON.parse(tick.body)
            const msg = tick.body
            console.log(msg)
            Notification.success({
              title: 'websocket test ' + msg,
              duration: 5000
            })
          })
        }, error => {
          console.log('error')
          console.log(error)

          this.connected = false
        }
      )
    },
    disconnect() {
      this.stompClient.disconnect(function() {
        console.log('See you next time!')
      })
    }
  }
}
</script>

<style scoped>

</style>
