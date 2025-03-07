<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-title">计划列表</div>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建计划</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      stripe
      highlight-current-row
    >
      <el-table-column align="center" label="计划ID" width="105">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="投放应用" align="center">
        <template slot-scope="scope">
          {{ scope.row.app_name }}
        </template>
      </el-table-column>
      <el-table-column label="计划名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.plan_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="监测链接（点击复制）"  align="center" width="200px">
        <template slot-scope="scope">
          <span @click="handleCopy(scope.$index, scope.row)">{{ scope.row.click_monitor_link }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  label="展示链接（点击复制）"  align="center" width="200px">
         <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>>
      </el-table-column> -->
      <el-table-column  label="渠道"  align="center">
         <template slot-scope="scope">
          {{ scope.row.channel_name }}
        </template>>
      </el-table-column>
      <el-table-column  label="创建时间"  align="center">
         <template slot-scope="scope">
          {{ scope.row.add_time }}
        </template>>
      </el-table-column>
      <!-- <el-table-column  label="状态"  align="center">
         <template slot-scope="scope">
          {{ scope.row.name }}
        </template>>
      </el-table-column> -->
      <el-table-column align="center"  label="操作" >
        <template slot-scope="scope">
         <el-button type="primary" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <add-form ref="dialogForm" @father="getList()" />
  </div>
</template>

<script>
import { getList, requestDelete } from '@/api/plan'
import Pagination from '@/components/Pagination'
import  addForm  from './components/addForm'
export default {
  components: { Pagination, addForm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'Android ',
        '2': 'iOS',
        '3': 'H5',
        '4': '小程序',
        '5': 'Unity'
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
      total: 0,

      copyData: '',//复制数据
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log('列表', response)
        this.list = response.data.plans;
        this.total = Number(response.data.total);
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
            plan_id: e.id
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
        })
    },
    handleAdd() {
      this.$refs.dialogForm.handleOpen()
    },
    handleCopy(index,row){
      this.copyData = row.click_monitor_link
      this.copy(this.copyData)
    },
    copy(data){
        let url = data;
        let oInput = document.createElement('input');
        oInput.value = url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        console.log(oInput.value)
        document.execCommand("Copy"); // 执行浏览器复制命令
        this.$message({
          message: '复制成功',
          type: 'success'
        });
        oInput.remove()
      },
  },
  
}
</script>
