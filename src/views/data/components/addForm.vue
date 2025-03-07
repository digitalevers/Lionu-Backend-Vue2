<template>
  <el-dialog title="自定义数据" :visible.sync="dialogVisible" width="864px" @close="close" :append-to-body="false" :lock-scroll="false">
    <div class="mid-spec" >
        <div class="mid-container">
            <div class="filter-item mid-title" style="width: 62px">LTV</div>
            <div class="filter-item one" style="width:100%;margin-left:20px;">
                <el-checkbox-group v-model="checkList" @change="init">
                    <el-checkbox v-for="(item, index) in checkOneList" :key="index" :label="item.id" :disabled="item.disabled">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="mid-container" style="margin-top: 16px;">
            <div class="filter-item mid-title" style="width: 62px">留存</div>
            <div class="filter-item two" style="width:100%;margin-left:20px;">
                <el-checkbox-group v-model="checkList" @change="init">
                    <el-checkbox v-for="(item, index) in checkTwoList" :key="index" :label="item.id" :disabled="item.disabled">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="mid-container" style="margin-top: 16px;">
            <div class="filter-item mid-title" style="width: 62px">付费</div>
            <div class="filter-item three" style="width:100%;margin-left:20px;">
                <el-checkbox-group v-model="checkList" @change="init">
                    <el-checkbox v-for="(item, index) in checkThreeList" :key="index" :label="item.id" :disabled="item.disabled">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="mid-container" style="margin-top: 16px;">
            <div class="filter-item mid-title" style="width: 62px">基本</div>
            <div class="filter-item three" style="width:100%;margin-left:20px;">
                <el-checkbox-group v-model="checkList" @change="init">
                    <el-checkbox v-for="(item, index) in checkFourList" :key="index" :label="item.id" :disabled="item.disabled">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" plain @click="close">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确 定</el-button>
    </span>
   
  </el-dialog>
</template>
<script>
import { requestAdd, requestAddInit } from '@/api/plan'
export default {
  data() {
    return {
      dialogVisible: false,

      //编辑列表
      edit: false,
      checkOneList: [
          {
              id: 'ltv1',
              name: 'LTV1',
              disabled: true,
          },
          {
              id: 'ltv2',
              name: 'LTV2',
              disabled: true,
          }
          ,
          {
              id: 'ltv3',
              name: 'LTV3',
              disabled: true,
          }
          ,
          {
              id: 'ltv4',
              name: 'LTV4',
              disabled: true,
          }
          ,
          {
              id: 'ltv5',
              name: 'LTV5',
              disabled: true,
          }
          ,
          {
              id: 'ltv6',
              name: 'LTV6',
              disabled: true,
          }
          ,
          {
              id: 'ltv7',
              name: 'LTV7',
              disabled: true,
          }
          ,
          {
              id: 'ltv14',
              name: 'LTV14',
          }
          ,
          {
              id: 'ltv30',
              name: 'LTV30',
          }
          ,
          {
              id: 'ltv45',
              name: 'LTV45',
          }
          ,
          {
              id: 'ltv60',
              name: 'LTV60',
          },
          {
              id: 'ltv75',
              name: 'LTV75',
          },
          {
              id: 'ltv90',
              name: 'LTV90',
          },
          {
              id: 'ltv120',
              name: 'LTV120',
          }
      ],
      checkTwoList: [
        //   {
        //       id: 'ret1',
        //       name: 'D1留存',
        //       disabled: true,
        //   },
          {
              id: 'ret2',
              name: 'D2留存',
              disabled: true,
          },
          {
              id: 'ret3',
              name: 'D3留存',
              disabled: true,
          },
          {
              id: 'ret4',
              name: 'D4留存',
              disabled: true,
          },
          {
              id: 'ret5',
              name: 'D5留存',
              disabled: true,
          },
          {
              id: 'ret6',
              name: 'D6留存',
              disabled: true,
          },
          {
              id: 'ret7',
              name: 'D7留存',
              disabled: true,
          }
          ,
          {
              id: 'ret14',
              name: 'D14留存',
          }
          ,
          {
              id: 'ret30',
              name: 'D30留存',
          }
          ,
          {
              id: 'ret45',
              name: 'D45留存',
          }
          ,
          {
              id: 'ret60',
              name: 'D60留存',
          },
          {
              id: 'ret75',
              name: 'D75留存',
          },
          {
              id: 'ret90',
              name: 'D90留存',
          },
          {
              id: 'ret120',
              name: 'D120留存',
          }
      ],
      checkThreeList: [
          {
              id: 'pay_total_amount',
              name: '总付费',
              disabled: true,
          },
          {
              id: 'pay_total_count',
              name: '总付费次数',
          },
          {
              id: 'pay_active_amount',
              name: '激活付费',
          },
          {
              id: 'pay_active_count',
              name: '激活付费次数',
          },
          {
              id: 'pay_new_amount',
              name: '新增付费',
              disabled: true,
          },
          {
              id: 'pay_new_rate',
              name: '新增付费率',
          },
          {
              id: 'pay_new_device',
              name: '新增付费设备数',
              disabled: true,
          },
          {
              id: 'pay_total_devices',
              name: '总付费设备数',
          },
          {
              id: 'pay_arpu',
              name: 'ARPU',
          },
          {
              id: 'pay_arppu',
              name: 'ARPPU',
          }
      ],
      checkFourList: [
          {
              id: 'base_click',
              name: '点击数',
              disabled: true,
          },
          {
              id: 'base_active',
              name: '激活设备数',
              disabled: true,
          },
          {
              id: 'base_reg',
              name: '注册数',
              disabled: true,
          },
          {
              id: 'base_reg_device',
              name: '去重注册数',
              disabled: true,
          },
          {
              id: 'base_reg_rate',
              name: '注册率',
              disabled: true,
          }
      ],
      checkList: [],
      checkListAll: [],
    };
  },
  created() {},
  methods: {
    handleEdit(e) {
      this.checkList = e.split(',')
      this.dialogVisible = true;
      this.checkListAll = this.checkFourList.concat(this.checkOneList.concat(this.checkTwoList.concat(this.checkThreeList)))
      console.log('this.checkListAll',this.checkListAll,this.checkList)
    },
    init() {
      console.log('走这里')
      
    },
    handleChange(e) {
      console.log('e',e)
      this.$set(this.temp, 'app_id', '')
      this.optionsOne.forEach((item) => {
        if(item.app_os == e) {
          this.optionsTwo = item.data
        }
      })
    },
    handleRadio(e) {
      console.log('e',e)
    },
    //添加
    handleAdd () {
      console.log('checkList',this.checkList)
      let newData = []
      let newDataId = []
      this.checkListAll.forEach((item, index) => {
        let isHave = false;
        this.checkList.forEach((jtem, jndex) => {
          if (item.id == jtem) {
            isHave = true
          }
        })
        if (isHave) newData.push(item)
      })
      newData.forEach(item => {
        newDataId.push(item.id)
      })
      this.$emit('father', newData, newDataId)
      this.dialogVisible = false;
      sessionStorage.setItem('checkList', newDataId)
      console.log('newData', newData)
    },
   
    close () {
      console.log('close方法')

      this.temp = this.$options.data().temp;
      this.dialogVisible = false;
     
    },
  },
};
</script>
<style>
.one .el-checkbox__label{
  width: 58px;
}
.two .el-checkbox__label{
  width: 58px;
}
.three .el-checkbox__label{
  width: 88px;
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
.mid-spec{
    padding: 25px 0;
    margin-bottom: 30px;
    border: 1px solid #aec9e1;
    border-radius: 4px;
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