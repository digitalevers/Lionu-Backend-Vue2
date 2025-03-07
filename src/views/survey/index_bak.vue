<template>
  <div v-loading="listLoading" class="app-container">
    <div class="title-content">
      <img class="hardware-img" :src="hardware" />
      <div class="title-text">硬件概况</div>
    </div>
    <div class="hardware-list">
      <div class="list-item" v-for="(item,index) in hardwareList" :key="index">
        <div class="item-name">{{item.name}}</div>
        <div>{{item.num}}</div>
      </div>
    </div>
    <div class="warn-content">
      <img v-if="coresData<2 || memData<2" :src="warnImg" />
      <div v-if="coresData<2 || memData<2" class="warn-text">您的系统配置过低，可能无法运行Spark，推荐系统配置4核4G</div>
    </div>
    <div class="title-content">
      <img class="software-img" :src="software" />
      <div class="title-text">软件概况</div>
    </div>
    <div class="software-list">
      <div class="list-item" v-for="(item,index) in softwareList" :key="index">
        <div>{{item.name}}</div>
        <div class="item-right">
          <div v-if="item.id == 1" class="item-text" :class="item.num == 1?' installed':''">{{item.num == 1?'已安装':'未安装'}}</div>
          <div v-else class="item-text" :class="item.num == 1?' installed':''">{{item.num == 1?'已启动':'未启动'}}</div>
          <div v-if="item.num == 0 && item.id == 1" class="item-btn" @click="handleInstall(item)">
            <i v-if="item.installLoading" class="el-icon-loading"></i>
            <span v-if="item.installLoading">正在安装</span>
            <span v-else>点击安装</span>
          </div>
          <div v-if="item.num == 0 && item.id != 1" class="item-btn" @click="handleInstall(item)">
            <i v-if="item.installLoading" class="el-icon-loading"></i>
            <span v-if="item.installLoading">正在启动</span>
            <span v-else>点击启动</span>
          </div>
        </div>
      </div>
    </div>
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
          name: 'CPU'
        },
        {
          id: 2,
          name: '内存'
        },
      ],
      softwareList: [
        {
          id: 1,
          name: 'Kafka-php扩展',
          installLoading: false,
        },
        {
          id: 2,
          name: 'ZooKeeper',
          installLoading: false,
        },
        {
          id: 3,
          name: 'Kafka',
          installLoading: false,
        },
        {
          id: 4,
          name: 'Spark',
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
        console.log('列表1111', response.data)
        if(response.code == 200){
          var data = response.data || {}
          that.hardwareList = that.hardwareList.map(ele => {
            if(ele.id == 1){
              ele.num = data.cores+'核'
              that.coresData = data.cores || 0
            }else if(ele.id == 2){
              ele.num = data.mem+'G'
              that.memData = data.mem || 0
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
         console.log('安装111', response.data)
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
<style>
.app-main {
  height: 100% !important;
  background: #fff !important;
}
</style>
<style scoped>
.app-container {
  background: #fff;
  padding: unset;
}
.title-content {
  height: 68px;
  background: rgb(230, 242, 252);
  padding-left: 50px;
  font-size: 26px;
  color: rgb(43, 139, 225);
  display: flex;
  align-items: center;
}

.warn-content {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 90px;
}
.warn-content img {
  width: 25px;
  height: 23px;
  margin-right: 12px;
}
.warn-content .warn-text {
  font-size: 14px;
  color: #ff9c00;
}
.hardware-img {
  width: 26px;
	height: 20px;
  margin-right: 12px;
}
.software-img {
  width: 26px;
	height: 29px;
  margin-right: 12px;
}
.hardware-list {
  padding: 0 90px;
  /* margin-bottom: 20px; */
}
.hardware-list .list-item {
  display: flex;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid #e4f0f7;
  font-size: 14px;
  color: #111213;
}
.hardware-list .list-item .item-name {
  margin-right: 100px;
}
.software-list {
  padding: 0 90px;
}
.software-list .list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  border-bottom: 1px solid #e4f0f7;
  font-size: 14px;
  color: #111213;
}
.software-list .list-item .item-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
}
.item-text {
  color: rgb(254, 141, 0);
}
.installed {
  color: rgb(22, 200, 118);
}
.item-btn {
  margin-left: 25px;
  width: 90px;
  height: 28px;
  background: rgb(64,158,255);
  border-radius: 4px;
  line-height: 28px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.item-btn .el-icon-loading {
  margin-right: 5px;
}

</style>
