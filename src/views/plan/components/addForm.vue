<template>
  <el-dialog title="新建计划" :visible.sync="dialogVisible" width="644px" @close="close" :lock-scroll="false">
   
    <!-- 第一步 -->
    <el-form
      ref="dataForm"
      :model="temp"
      label-position="right"
      label-width="110px"
      :rules="rules"
      style="margin-left:20px;margin-right:80px;"
    >
      <el-row :gutter="20">
        <el-col :span='14'>
           <el-form-item label="投放应用">
            <el-select v-model="app_os" placeholder="请选择" style="width: 100%" @change="handleChange">
              <el-option
                v-for="item in optionsOne"
                :key="item.app_os"
                :label="item.app_platform"
                :value="item.app_os">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='10'>
           <el-form-item label label-width="0" prop="app_id">
            <el-select v-model="temp.app_id" placeholder="请选择应用" style="width: 100%">
              <el-option
                v-for="item in optionsTwo"
                :key="item.app_id"
                :label="item.app_name"
                :value="item.app_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span='4'>
          <el-form-item label label-width="0" prop="app_id">
            <el-button type="primary" plain @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-form-item label="投放渠道" prop="channel_id">
        <el-select v-model="temp.channel_id" placeholder="请选择投放渠道" style="width: 100%">
          <el-option
            v-for="item in optionsThree"
            :key="item.id"
            :label="item.channel_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划名称" prop="plan_name">
        <el-input v-model="temp.plan_name" placeholder="请输入计划名称"  style="width: 100%" />
      </el-form-item>
      <el-form-item label="批量创建" prop="advertisingName">
        <el-radio-group v-model="planNumber" style="width: 100%" @change="handleRadio">
          <el-radio :label="1">单条计划</el-radio>
          <el-radio :label="2">多条计划</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="planNumber == 2" label="" prop="plan_count">
        <el-input v-model="temp.plan_count" placeholder="请输入计划数量"  style="width: 100%" />
      </el-form-item>
    </el-form>
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

      temp: {},
      app_os: '', //投放平台
      optionsOne: [],
      optionsTwo: [],
      optionsThree: [],
      planNumber: 1, //创建计划
      options: [
        {
          value: '1',
          label: 'Android'
        }, {
          value: '2',
          label: 'IOS'
        }, {
          value: '3',
          label: 'H5'
        }, {
          value: '4',
          label: '小程序'
        }, {
          value: '5',
          label: 'Unity'
        }
      ],
      rules: {
        app_id: [
          { required: true, message: "请选择应用", trigger: "change" }
        ],
        channel_id: [
          { required: true, message: "请选择投放渠道", trigger: "change" }
        ],
        plan_name: [
          { required: true, message: "请输入计划名称", trigger: "change" }
        ],
        plan_count: [
          { required: true, message: "请输入计划数量", trigger: "change" }
        ],
      },
    };
  },
  created() {},
  methods: {
    handleOpen() {
      this.dialogVisible = true;
     
      this.init()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    init() {
      console.log('走这里')
      requestAddInit().then(response => {
        this.optionsOne = response.data.apps
        this.app_os = response.data.apps[0].app_os
        this.optionsTwo = response.data.apps[0].data
        this.optionsThree = response.data.channels
      });
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
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          requestAdd( this.temp ).then(response => {
            if(response.code == 200) {
              console.log('新增', response)
              this.$notify({
                type: "success",
                message: "新增成功!",
                duration: 2000
              });
              this.$emit('father')
              this.close()
            }
            else{
              this.$message.error(response.msg)
            }
          });
        }
      });
    },
   
    close () {
      console.log('close方法')

      this.temp = this.$options.data().temp;
      this.dialogVisible = false;
     
    },
  },
};
</script>
<style lang="scss" scoped>
.three{
  // padding-right: 100px;
   margin-bottom: 30px;
  .three-item{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .three-left{
    font-size: 14px;
    color: #000;
    text-align: right;
    width: 350px;
    margin-right: 20px;
  }
}
.content{
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 80px 30px;
  .con-item{
    height: 100px;
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #aec9e1;
    border-radius: 5px;
    cursor: pointer;
  }
  .item-text{
    font-size: 14px;
    margin-top: 8px;
  }
}
.dialog-footer{
  padding-right: 80px;
}
.bottom-content {
  text-align: center;
  padding-bottom: 30px;
  font-size: 0;
}
.step:first-child {
  margin-left: 0;
}
.step {
  display: inline-block;
  margin-left: 145px;
  vertical-align: middle;
}
.step-top {
	font-size: 16px;
  color: #aec9e1;
  
}
.step-top-finish {
  color: #2b8be1;
}
.step-top-process {
  background: #ffb2c4;
  color: #fff;
}

.step-mid {
  margin-top: 15px;
  display: inline-block;
  position: relative;
}
.step-line {
  display: inline-block;
  position: absolute;
  top: 21px;
  left: 0;
  width: 236px;
  height: 2px;
  background: #aec9e1;
}
.step-line-finish {
  background: #2b8be1;
}
.step-line-process {
  background: #ffb2c4;
}

.step-circle {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 100%;
  border: 1px solid #b4cde2;
  background: #f0f8fd;
  color: #8f8f8f;
  position: relative;
  font-size: 20px;
}
.step-circle-finish{
  background: #fff;
  border: 1px solid#2b8be1;
}
.step-circle-in {
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 100%;
  background: #2b8be1;
  color: #fff;
}
.step-circle-text {
  position: absolute;
}
.step-circle-text-finish{
  color: #fff;
}
.step-circle-process {
  border-color: #ffb2c4;
}

</style>     