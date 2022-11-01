11项目学习请来这里[eladmin](https://eladmin.vip/)
### 配置node-sass镜像加速 
参考自 https://www.ydyno.com/archives/1219.html
##### 1st 配置淘宝的镜像源
```
npm config set registry https://registry.npm.taobao.org
```
##### 2nd 在 ~/.npmrc 加入下面内容
```
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

# .npmrc 文件位于
# win：C:\Users\[你的账户名称]\.npmrc
# linux：直接使用 vi ~/.npmrc
```

### Build Setup
``` bash
# 安装依赖
npm install

# 启动服务 localhost:8013
npm run dev

# 构建生产环境
npm run build:prod
```
#### 注意问题
#### 1 升级element ui 版本后 DatePicker 浏览器报错，但不影响使用
```
use a data or computed property based on the prop's value. Prop being mutated: "placement"
```
如何更改,添加 align 属性
```
更改前
<date-range-picker v-model="query.createTime" class="date-item" />
更改后
<date-range-picker v-model="query.createTime" class="date-item" align="center" />
```
#### 前端自定义主键
系统里面默认的主键是 id，如果主键字段不是 id 使用 curd 组件就会出现问题，这个时候需要自定义主键名称

在 index.vue 中找到下面节点，并且指定 idField， 由于系统默认是根据 id 字段降序，所以这里排序规则也需要修改
```
cruds() {
    return CRUD({ title: '图片', idField: 'pictureId', sort: 'pictureId,desc', url: 'api/pictures', crudMethod: { ...crudPic }})
  }
```
#### 前端查询条件设置默认值
```
crud() 方法中添加 query 对象即可，不可以使用 this.crud.query['planMonth'] 进行默认值赋值
  cruds() {
    return CRUD({ title: '专业室周检计划', url: 'api/planPeriodSchedule/studioMeterageType', crudMethod: { ...crudPlanPeriodSchedule },
      query: {
      // 设置默认值
        planMonth: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
        planYear: new Date().getFullYear() + ''
      }
    })
  },
```