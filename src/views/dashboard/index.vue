<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-title">应用管理</div>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加应用</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      stripe
      highlight-current-row
    >
      <el-table-column align="center" label="应用ID" width="105">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="应用名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.app_name }}
        </template>
      </el-table-column>
      <el-table-column label="平台"  align="center">
        <template slot-scope="scope">
          <div style="text-align: left;margin-left: 130px;" v-if="scope.row.app_os == 1"><svg-icon icon-class="android" style="width:20px;height:20px;vertical-align: middle;margin-top: -3px;"/> {{ scope.row.app_os | statusFilter }}</div>
          <div style="text-align: left;margin-left: 130px;" v-else-if="scope.row.app_os == 2"><svg-icon icon-class="ios" style="width:20px;height:20px;vertical-align: middle;margin-top: -3px;"/> {{ scope.row.app_os | statusFilter }}</div>
          <div style="text-align: left;margin-left: 130px;" v-else><svg-icon icon-class="app" style="width:20px;height:20px;vertical-align: middle;margin-top: -3px;"/> {{ scope.row.app_os | statusFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="包名"  align="center">
        <template slot-scope="scope">
          {{ scope.row.package_name }}
        </template>
      </el-table-column>
      <el-table-column  label="创建时间"  align="center">
         <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>>
      </el-table-column>
      <el-table-column  label="状态"  align="center" width="110px">
         <template slot-scope="scope">
          <!-- {{ scope.row.app_step }} -->
          <div class="list-type" v-if="scope.row.app_step == 3" @click="handleOpen(scope.row)">
            <div class="circle circle-finish"></div>
            <div class="circle-text">数据已接入</div>
          </div>
          <div class="list-type" v-else @click="handleOpen(scope.row)">
            <div class="circle"></div>
            <div class="circle-text">等待接入</div>
          </div>
        </template>>
      </el-table-column>
      <el-table-column align="center"  label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDownload(scope)">下载SDK</el-button>
         <el-button type="primary" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <add-form ref="dialogForm" @father="getList()" />
  </div>
</template>

<script>
import { getList, requestDelete } from '@/api/app'
import Pagination from '@/components/Pagination'
import  addForm  from './components/addForm'
export default {
  components: { Pagination, addForm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'Android ',
        '2': 'iOS',
        /*'3': 'H5',
        '4': '小程序',
        '5': 'Unity'*/
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
      },
      total: 10,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        //console.log('列表', response.data)
        this.list = response.data.apps;
        this.total = Number(response.data.total)
        if(this.list.length === 0 && this.total > 0) {
          this.listQuery.page = this.listQuery.page - 1;
          this.getList()
        }
        this.listLoading = false
      })
    },
    handleDelete(e) {
      this.$confirm('确认删除该应用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tempData = {
            app_id: e.id
          }
          requestDelete( tempData ).then(response => {
            if(response.code == 200) {
              this.getList()
              this.$notify({
                type: "success",
                message: "删除成功!",
                duration: 2000
              });
            }
            else{
              this.$message.error(response.msg)
            }
          }); 
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
    },
    handleDownload(scope) {
      window.open(process.env.VUE_APP_BASE_API + '/Sysin/downloadSDK?app_id=' + scope.row.id); 
    },
    handleAdd() {
      this.$refs.dialogForm.handleOpen()
    },
    handleOpen(e) {
      this.$refs.dialogForm.handleOpen(Number(e.app_step) + 1, e.id, e.app_event )
    }
  },
  
}
</script>
<style scoped>
.list-type{
  cursor: pointer;
  text-align: left;
  margin-left: 3px;
}
.circle{
  display: inline-block;
  width: 12px;
	height: 12px;
	background-color: #fe8d00;
	border-radius: 6px;
  margin-right: 8px;
}
.circle-finish{
  background-color: #16c876;
}
.circle-text{
  display: inline-block;
}
</style>
