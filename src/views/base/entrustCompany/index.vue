<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.companyName" clearable placeholder="单位名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.pid" clearable placeholder="父单位ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <entrust-company-form :parent-entrust-companys="parentEntrustCompanys" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" lazy :load="getEntrustCompany" :data="crud.data" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="companyName" label="单位名称" />
        <el-table-column prop="companyAddress" label="单位地址" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column v-if="checkPer([defaultAdminUser,'baseEntrustCompany:edit','baseEntrustCompany:del'])" label="操作" width="150px" align="center">
          <template v-slot="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudBaseEntrustCompany from '@/api/base/entrustCompany/baseEntrustCompany'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { defaultAdminUser } from '@/settings'
import { mapGetters } from 'vuex'
// import DateRangePicker from '@/components/DateRangePicker'
import entrustCompanyForm from './form'

const defaultForm = { id: null, companyName: null, companyAddress: null, createTime: null, updateTime: null, pid: null, subCount: null }

export default {
  name: 'BaseEntrustCompany',
  components: { pagination, crudOperation, rrOperation, udOperation, entrustCompanyForm },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '委托单位', url: 'api/baseEntrustCompany', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBaseEntrustCompany }})
  },
  data() {
    return {
      permission: {
        add: [defaultAdminUser, 'baseEntrustCompany:add'],
        edit: [defaultAdminUser, 'baseEntrustCompany:edit'],
        del: [defaultAdminUser, 'baseEntrustCompany:del']
      },
      rules: {
        id: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'companyName', display_name: '单位名称' },
        { key: 'pid', display_name: '父单位ID' }
      ],
      parentEntrustCompanys: []
    }
  },
  computed: {
    ...mapGetters([
      'defaultAdminUser'
    ])
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 钩子：在新增之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeToAdd]() {
      // 获取所有用户填充到下拉框
      crudBaseEntrustCompany.listAll().then(resp => {
        this.parentEntrustCompanys = resp
      })
      return true
    },
    getEntrustCompany(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudBaseEntrustCompany.list(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    }
  }
}
</script>

<style scoped>

</style>
