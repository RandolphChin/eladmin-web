<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" />
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="deptId" label="展区" />
        <el-table-column prop="jobId" label="场馆" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column v-if="checkPer(['admin','testing:edit','testing:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
      <el-button type="button" @click="sendMsg">ToServer</el-button>
    </div>
  </div>
</template>

<script>
import crudTesting from '@/api/testing'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth' // getToken from cookie
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const defaultForm = { id: null, deptId: null, jobId: null, name: null }
export default {
  name: 'Testing',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '测试', url: 'api/testing', idField: 'id', sort: 'id,desc', crudMethod: { ...crudTesting }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'testing:add'],
        edit: ['admin', 'testing:edit'],
        del: ['admin', 'testing:del']
      },
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      socket: null,
      stompClient: null
    }
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
      return true
    },
    connect() {
      const token = '?Authorization=' + `${getToken()}`
      const url = process.env.VUE_APP_BASE_API + crudTesting.linkWebsocket.replace(':id', token)
      this.socket = new SockJS(url)
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect(
        { },
        frame => {
          this.connected = true
          // 发送的信息只要订阅这个地址就能获取到
          this.stompClient.subscribe('/topic/chatRoom', tick => {
            // const messageResponse = JSON.parse(tick.body)
            console.log(tick)
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
        alert('See you next time!')
      })
    },
    sendMsg() {
      if (this.stompClient && this.stompClient.connected) {
        const message = { 'username': 'Jackie Chan' }
        this.stompClient.send('/app/chatRoom.send', JSON.stringify(message))
      }
    }
  }
}
</script>

<style scoped>

</style>
