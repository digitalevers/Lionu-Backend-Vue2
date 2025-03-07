<template>
    <div class="app-container">
      <div class="filter-container">
        <div class="filter-title">渠道管理</div>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加渠道</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        stripe
        highlight-current-row
      >
        <el-table-column align="center" label="渠道ID" width="105">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="渠道名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.channel_name }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="Android监测参数(点击复制)"  align="center" width="200px">
          <template slot-scope="scope">
            <span @click="handleCopy(scope.$index, scope.row)">{{ scope.row.android_monitor_url }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="iOS监测参数(点击复制)"  align="center" width="200px">
          <template slot-scope="scope">
            <span @click="handleCopy(scope.$index, scope.row)">{{ scope.row.ios_monitor_url }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="添加时间"  align="center">
           <template slot-scope="scope">
            {{ scope.row.add_time }}
          </template>>
        </el-table-column>
        <el-table-column align="center"  label="操作" width="200px">
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
  import { getList, requestDelete } from '@/api/channel'
  import Pagination from '@/components/Pagination'
  import  addForm  from './components/addForm'
  export default {
    components: { Pagination, addForm },
    filters: {

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
          this.list = response.data.channels;
          this.total = Number(response.data.total)
          if(this.list.length === 0 && this.total > 0) {
            this.listQuery.page = this.listQuery.page - 1;
            this.getList()
          }
          this.listLoading = false
        })
      },
      handleDelete(e) {
        this.$confirm('确认删除该渠道, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const tempData = {
              channel_id: e.id
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
      handleAdd() {
        this.$refs.dialogForm.handleOpen()
      },
      handleOpen(e) {
        this.$refs.dialogForm.handleOpen(Number(e.app_step) + 1, e.id, e.app_event )
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
  