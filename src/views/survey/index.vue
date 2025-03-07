<template>
<div class="app-container">
    <div class="filter-container">
      <div class="filter-title">硬件概况</div>
    </div>
    <el-table v-loading="listLoading" :data="hardwareList" fit stripe highlight-current-row>
      <el-table-column align="center" label="配置项">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置值">
        <template slot-scope="scope">
          {{ scope.row.num }}
        </template>
      </el-table-column>
    </el-table>

    <div class="warn-content">
        <img v-if="vcpuData<4 || memData<4" :src="warnImg" />
        <div v-if="vcpuData<4 || memData<4" class="warn-text">您的系统配置过低，可能无法运行Spark，推荐系统配置4核4G</div>
    </div>

    <div class="filter-container">
      <div class="filter-title">软件概况</div>
    </div>
    <el-table v-loading="listLoading" :data="softwareList" fit stripe highlight-current-row>
      <el-table-column align="center" label="环境">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="item-right">
            <div v-if="scope.row.id == 1" class="item-text" :class="scope.row.num == 1?' installed':''">{{scope.row.num == 1?'已安装':'未安装'}}</div>
            <div v-else class="item-text" :class="scope.row.num == 1?' installed':''">{{scope.row.num == 1?'已启动':'未启动'}}</div>

            <el-button v-if="scope.row.num == 0 && scope.row.id == 1" type="primary" size="mini" @click="handleInstall(scope.row)">
              <i v-if="scope.row.installLoading" class="el-icon-loading"></i>
              {{scope.row.installLoading?'正在安装':'点击安装'}}
            </el-button>
            <el-button v-if="scope.row.num == 0 && scope.row.id != 1" type="primary" size="mini" @click="handleInstall(scope.row)">
              <i v-if="scope.row.installLoading" class="el-icon-loading"></i>
              {{scope.row.installLoading?'正在启动':'点击启动'}}
            </el-button>
         </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import { getList,sysinInstalled } from '@/api/survey'
import Pagination from '@/components/Pagination'
// import  addForm  from './components/addForm'
export default {
  components: {
    Pagination, 
    // addForm
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'Android ',
        '2': 'iOS',
        '4': '小程序',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      hardware: require("@/assets/hardware.png"),
      software: require("@/assets/software.png"),
      warnImg: require("@/assets/warn.png"),
      list: [],
      coresData: 0,
      memData: 0,
      hardwareList: [
        {
          id: 1,
          name: '物理CPU'
        },
        {
          id: 2,
          name: '内存'
        },
        {
          id: 3,
          name: '逻辑vCPU'
        },
      ],
      softwareList: [
        {
          id: 1,
          name: 'kafka-php扩展',
          installLoading: false,
        },
        {
          id: 2,
          name: 'zooKeeper',
          installLoading: false,
        },
        {
          id: 3,
          name: 'kafka',
          installLoading: false,
        },
        {
          id: 4,
          name: 'spark',
          installLoading: false,
        },
        
      ],
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
      var that = this
      getList().then(response => {
        //console.log('列表1111', response.data)
        if(response.code == 200){
          var data = response.data || {}
          that.hardwareList = that.hardwareList.map(ele => {
            if(ele.id == 1){
              ele.num = data.cores+'核'
              that.coresData = data.cores || 0
            }else if(ele.id == 2){
              ele.num = data.mem+'G'
              that.memData = data.mem || 0
            } else if(ele.id == 3){
              ele.num = data.vcpu+'核'
              that.vcpuData = data.vcpu || 0
            }
            return ele
          })
          that.softwareList = that.softwareList.map(ele => {
            if(ele.id == 1){
              ele.num = data['php-kafka']
            }else if(ele.id == 2){
              ele.num = data.zookeeper
            }else if(ele.id == 3){
              ele.num = data.kafka
            }else if(ele.id == 4){
              ele.num = data.spark
            }
            return ele
          })
        }
        this.listLoading = false
      })
    },
    // 点击安装
    handleInstall(item){
      var that = this
      item.installLoading = true
      var params = {}
      if(item.id == 1){
        params.soft = 'php-kafka'
      }else if(item.id == 2){
        params.soft = 'zookeeper'
      }else if(item.id == 3){
        params.soft = 'kafka'
      }else if(item.id == 4){
       params.soft = 'spark'
      }
      sysinInstalled(params).then(response => {
         //console.log('安装111', response.data)
        if(response.code == 200){
          item.installLoading = false
          this.$notify({
                type: "success",
                message: "安装完成!",
                duration: 2000
              });
          that.getList()
        }else{
          item.installLoading = false
          this.$message.error(response.msg)
        }
      })
    },
  },
  
}
</script>
<style scoped>
.warn-content {
  display: flex;
  align-items: center;
  height: 30px;
  margin: 0 0 20px 0;
}
.warn-content img {
  width: 25px;
  height: 25px;
  margin-right: 12px;
}
.warn-content .warn-text {
  font-size: 14px;
  color: #ff9c00;
}
.item-text {
  color: rgb(254, 141, 0);
  display: inline-block;
  vertical-align: middle;
  margin-right: 20px;
}
.installed {
  color: rgb(22, 200, 118);
}

</style>
