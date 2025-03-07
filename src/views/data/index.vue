<template>
  <div class="app-container" v-if="tabList.length > 0 && isVisibel">
    <div class="filter-container">
      <div class="filter-title">数据详情</div>
      
    </div>
    <div class="plan-top">
        <el-tabs v-model="listQuery.app_id" @tab-click="handleTabClick" style="width: calc(100% - 130px)"> 
            <el-tab-pane v-for="(item, index) in tabList" :key="index"  :name="item.id">
              <span slot="label" v-if="item.app_os == 1"><svg-icon icon-class="android" style="width:20px;height:20px;vertical-align: middle;margin-top: -5px"/> {{item.app_name}}</span>
              <span slot="label" v-else-if="item.app_os == 2"><svg-icon icon-class="ios" style="width:20px;height:20px;vertical-align: middle;margin-top: -5px"/> {{item.app_name}}</span>
              <span slot="label" v-else><svg-icon icon-class="app" style="width:20px;height:20px;vertical-align: middle;"/> {{item.app_name}}</span>
            </el-tab-pane>
        </el-tabs>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd" style="width: 120px;">添加应用</el-button>
    </div>
    <div class="plan-mid">
        <div class="mid-container">
            <div class="filter-item mid-title">统计日期</div>
            <div class="filter-item" style="width:100%;margin-left:20px;">
                <el-button :plain="activeOne != index" type="primary" size="small" v-for="(item, index) in filterOne" :key="index" @click="handleFileterOne(item, index)">{{item}}</el-button>
                <el-date-picker
                    style="margin-left: 15px;"
                    size="small"
                    v-model="staticDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleStatic"
                    value-format="yyyy-MM-dd"
                    :clearable="false">
                </el-date-picker>
            </div>
        </div>
        <div class="mid-container" style="margin-top: 16px;">
            <div class="filter-item mid-title">广告侧维度</div>
            <div class="filter-item" style="width:100%;margin-left:20px;">
                <el-button style="width: 56px; padding:9px 0; text-algin:center;" :plain="activeTwo != index" type="primary" size="small" v-for="(item, index) in filterTwo" :key="index" @click="handleFileterTwo(item, index)">{{item.name}}</el-button>
            </div>
        </div>
         <div class="mid-container" style="margin-top: 16px;">
            <div class="filter-item mid-title" v-if="listQuery.dimension == 2 || listQuery.dimension == 3">付费日期</div>
            <div class="flex-space">
                <div class="filter-item" style="width:80%;"  >
                    <el-date-picker
                        v-if="listQuery.dimension == 2 || listQuery.dimension == 3"
                        size="small"
                        v-model="payDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        @change="handlePay">
                    </el-date-picker>
                </div>
                <div class="mid-right">
                    <el-button type="primary" plain class="mid-button" @click="handleEdit()"><img class="mid-img" src="@/assets/edit_data.png"/>自定义数据</el-button>
                </div>
            </div>
        </div>
        
      
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :fit="true"
      stripe
      highlight-current-row
      style="margin-top: 8px"
      size="mini"
      class="data-table"
    >
      <el-table-column v-if="listQuery.dimension == 1" align="center" label="统计日期" key="stat">
        <template slot-scope="scope">
          {{ scope.row.stat_date }}
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.dimension == 3" align="center" label="计划名称" key="plan">
        <template slot-scope="scope">
          {{ scope.row.plan_name }}
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.dimension == 2" align="center" label="渠道名称" key="plan">
        <template slot-scope="scope">
          {{ scope.row.channel_name }}
        </template>
      </el-table-column>
      <el-table-column v-for="item in dynamicList" :key="item.id" :label="item.name" align="center" min-width="60px">
        <template slot-scope="scope">{{ scope.row[item.id] }}</template>
      </el-table-column>
    
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <add-form ref="dialogForm" @father="getAppList()" />
    <edit-form ref="editForm" @father="getChildData" />
  </div>
  <div class="app-container-s" v-else-if="isVisibel">
    
    <h2>还未添加任何应用</h2>
    <el-button type="primary"  @click="handleAdd" style="width: 120px;">添加应用</el-button>
    <add-form ref="dialogForm" @father="getAppList()" />
  </div>
</template>

<script>
import { getDataList } from '@/api/data'
import { getList } from '@/api/app'
import getDate from "@/utils/getDate";
import Pagination from '@/components/Pagination'
import  addForm  from '@/views/dashboard/components/addForm'
import  editForm  from './components/addForm'
import checkListAll from '@/assets/data'
export default {
  components: { Pagination, addForm, editForm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      activeName: '1',
      tabList: [],
      isVisibel: false,
      //统计日期
      activeOne: 4,
      staticDate: '',
      filterOne: ['上月','本月','本周','昨天','今天'],
      //
      activeTwo: 0,
      filterTwo: [
          {
              id: '1',
              name: '日期'
          },
          {
              id: '3',
              name: '计划'
          },
          // {
          //     id: '4',
          //     name: '计划组'
          // },
          {
              id: '2',
              name: '渠道'
          },
      ],
      //付费日期
      payDate: '',
      list: [],
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        app_id: null, //应用ID
        dimension: 1, //广告侧维度  1 按日期 2 按渠道 3 按计划 4 按系统用户
        statis_start_date: '', //统计起始日期
        statis_end_date: '', //统计结束日期
        pay_start_date: '',  //付费起始日期（可选）
        pay_end_date: '',  //付费结束日期（可选）
        custom_params: 'base_click,base_active,base_reg,base_reg_device,base_reg_rate,ltv1,ltv2,ltv3,ltv4,ltv5,ltv6,ltv7,ret2,ret3,ret4,ret5,ret6,ret7,pay_total_amount,pay_new_amount,pay_new_device',  //自定义参数
      },
      total: 10,
      //可变列
      dynamicList: [],

    }
  },
  created() {
    //获取可变列
    if(sessionStorage.getItem('checkList')) {
      this.listQuery.custom_params = sessionStorage.getItem('checkList')
    }
    this.listQuery.custom_params.split(',').forEach(jtem => {
      checkListAll.forEach(item => {
        if(item.id == jtem){
          this.dynamicList.push(item)
        }
      })
      
    })
    
    //默认今日时间
    this.staticDate = [getDate.getToday().starttime, getDate.getToday().endtime]
    this.getAppList()
    console.log('checkListAll',checkListAll)
  },
  methods: {
    getAppList() {
       getList({app_step: 3}).then(response => {
        console.log('App', response.data)
        this.tabList = response.data.apps || [];
        if(this.tabList.length > 0){
          this.listQuery.app_id = response.data.apps[0].id;
          this.getList()
        }
        this.isVisibel = true
        
        // this.total = Number(response.data.total)
        // this.listLoading = false
      })
    },
    //重置
    handleReset() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleTabClick() {
      this.handleReset()
    },
    //统计日期
    handleStatic(e) {
      console.log('e',e,this.staticDate)
      this.activeOne = 10;
      this.handleReset()
    },
    //付费日期
    handlePay(e) {
      this.handleReset()
    },
    handleFileterOne(item, index) {
        this.activeOne = index;
        if(item == '上月') {
          this.staticDate = [getDate.getLastMonthDays().starttime, getDate.getLastMonthDays().endtime]
        }
        if(item == '本月') {
          this.staticDate = [getDate.getCurrMonthDays().starttime, getDate.getCurrMonthDays().endtime]
        }
        if(item == '本周') {
          this.staticDate = [getDate.getCurrWeekDays().starttime, getDate.getCurrWeekDays().endtime]
        }
        if(item == '昨天') {
          this.staticDate = [getDate.getYesterday().starttime, getDate.getYesterday().endtime]
        }
        if(item == '今天') {
          this.staticDate = [getDate.getToday().starttime, getDate.getToday().endtime]
        }
        this.handleReset()
    },
    handleFileterTwo(item, index) {
        if(item.id == 1 || item.id == 4) {
          this.listQuery.pay_start_date = ''
          this.listQuery.pay_start_date = ''
          this.payDate = ''
        }
        this.activeTwo = index;
        this.listQuery.dimension = item.id
        this.handleReset()
    },
    init () {
      let newData = []
      this.checkListAll.forEach((item, index) => {
        let isHave = false;
        this.formThead.forEach((jtem, jndex) => {
          if (item == jtem) {
            isHave = true
          }
        })
        if (isHave) newData.push(item)
      })
      console.log('newData', newData)
      // this.newDataTwo = []
      // newData.forEach(item => {
      //   if (item) this.newDataTwo.push(item)
      // })
      // console.log('newDataTwo', this.newDataTwo)
    },
    getChildData(e,eId) {
      console.log('获取组件数据', e, eId)
      this.dynamicList = e;
      this.listQuery.custom_params = eId.join(',')
      this.handleReset()
    },
    getList() {
      this.listQuery.statis_start_date = this.staticDate[0];
      this.listQuery.statis_end_date = this.staticDate[1];
      this.listQuery.pay_start_date = this.payDate[0];
      this.listQuery.pay_end_date = this.payDate[1];
      this.listLoading = true
      getDataList(this.listQuery).then(response => {
        this.list = response.data.rows
        this.listLoading = false
        this.total = Number(response.data.total)
      })
    },
    handleDelete(e) {

    },
    handleAdd() {
      this.$refs.dialogForm.handleOpen()
    },
    //自定义
    handleEdit() {
      this.$refs.editForm.handleEdit(this.listQuery.custom_params)
    },
  },
  
}
</script>
<style>
.el-table th>.cell{
  padding-left: 3px;
  padding-right: 3px;
}
.el-table .cell{
  padding-left: 3px;
  padding-right: 3px;
}
.el-tabs__header{
    margin-bottom: 0;
    
}
.el-tabs__item{
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    color: #666;
    font-weight: normal;
}
.el-tabs__nav-next, .el-tabs__nav-prev{
    line-height: 64px;
    font-size: 16px;
}

</style>
<style lang="scss" scoped>
.plan-top{
    padding-left: 32px;
    padding-right: 24px;
    height: 64px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.plan-mid{
    background: #fff;
    margin-top: 8px;
    padding: 24px 20px 24px 0;
}
.mid-container{
    display: flex;
    align-items: center;
}
.mid-title {
  display: inline-block;
  width: 110px;
  text-align: right;
  color:#333;
  font-size: 14px;
}
.filter-content {
  display: inline-block;
}
.flex-space{
    margin-left: 20px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.mid-img{
    vertical-align: middle;
    margin-right: 4px;
}
.mid-button{
    height: 40px;
    width: 144px;
    padding: 0;
    line-height: 40px;
    background: #e6f2fc;
}
.mid-button:not(.nohover):hover{
    color: #409EFF;
    background: #ecf5ff;
    border-color: #b3d8ff;
}
.mid-top-button{
    color: #409EFF;
    background: #ecf5ff;
    border-color: #b3d8ff;
}

.el-checkbox{
    color: #7999b6;
}
.app-container-s{
  min-height: calc(100vh - 128px);
  background: #fff;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
