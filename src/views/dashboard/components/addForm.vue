<template>
  <el-dialog title="新建应用" :visible.sync="dialogVisible" width="644px" @close="close" :lock-scroll="false">
    <div class="bottom-content">
      <div class="step" v-for="(item, index) in steps" :key="index">
        <div class="step-top" :class="{'step-top-finish': item.id < stepIndex}">
          {{ item.top }}
        </div>
        <div class="step-mid">
          <div class="step-line" v-if="item.id < 3" :class="{'step-line-finish': item.id < stepIndex - 1}"></div>
          <div class="step-circle" :class="{'step-circle-finish':item.id < stepIndex}">
            <div class="step-circle-in" v-show="item.id < stepIndex"></div>
            <div class="step-circle-text" :class="{'step-circle-text-finish':item.id < stepIndex}">{{ item.mid }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 第一步 -->
    <el-form
      v-if="step == 1"
      ref="dataForm"
      :model="temp"
      label-position="right"
      label-width="130px"
      :rules="rules"
      style="margin-left:20px;margin-right:80px;"
    >
      <el-form-item label="应用名称" prop="app_name">
        <el-input v-model="temp.app_name" placeholder="请填下您的应用名称" style="width: 100%" />
      </el-form-item>
      <el-form-item label="应用类型" prop="app_os">
        <el-select v-model="temp.app_os" placeholder="请选择应用类型" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用包名" prop="package_name">
        <el-input v-model="temp.package_name" placeholder="请输入应用包名"  style="width: 100%" />
      </el-form-item>
      <!-- <el-form-item label="下载地址" prop="advertisingName">
        <el-input v-model="temp.advertisingName" placeholder="https://" style="width: 100%" />
      </el-form-item> -->
    </el-form>
    <!-- 第二步 -->
    <div class="content" v-else-if="step == 2">
      <div class="con-item" @click="handleLook">
        <img src="@/assets/look.png" />
        <div class="item-text">查看文档</div>
      </div>
      <div class="con-item" @click="handleDownload">
        <img src="@/assets/download.png" />
        <div class="item-text">下载SDK</div>
      </div>
    </div>
    <!-- 第三步 -->
    <div class="three"  v-else-if="step == 3 || step == 4">
      <div class="three-item">
        <div class="three-left">等待授权后激活回传</div>
        <img :src="eventIndex > 0 ? finishImg : processImg" :class="{'three-img':isRotate[0].rotate}"/>
      </div>
      <div class="three-item" >
        <div class="three-left">等待注册事件回传</div>
        <img :src="eventIndex > 1 ? finishImg : processImg" :class="{'three-img':isRotate[1].rotate}"/>
      </div>
      <div class="three-item">
        <div class="three-left">等待付费事件回传</div>
        <img :src="eventIndex > 2 ? finishImg : processImg" :class="{'three-img':isRotate[2].rotate}"/>
      </div>
    </div>
     <span slot="footer" class="dialog-footer" v-if="step == 3 || step == 4" style="padding-right: 218px;">
      <el-button type="primary" plain @click="handleAdd" :disabled="eventIndex < 3">确定</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button type="primary" plain @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleNext">下一步</el-button>
    </span>
   
  </el-dialog>
</template>
<script>
import { requestAdd,requestEvent } from '@/api/app'
export default {
  data() {
    return {
      isRotate: [{rotate:false},{rotate:false},{rotate:false}],
      dialogVisible: false,

      steps: [
        { id: 1, top: "应用信息", mid: '1' },
        { id: 2, top: "接入SDK", mid: '2' },
        { id: 3, top: "调试SDK", mid: '3' },

      ],
      stepIndex: 1,
      //第一步
      step: 1,
      temp: {},
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
        app_name: [
          { required: true, message: "请填下您的应用名称", trigger: "change" }
        ],
        app_os: [
          { required: true, message: "请选择应用类型", trigger: "change" }
        ],
        package_name: [
          { required: true, message: "请输入应用包名", trigger: "change" }
        ]
      },
      app_id: null, //应用id
      eventIndex: 0,
      processImg: require('@/assets/process.png'),
      finishImg: require('@/assets/finish.png'),
    };
  },
  created() {},
  methods: {
    handleOpen(e, app_id, app_event) {
      console.log('弹窗数据',e,app_id, app_event)
      this.app_id = app_id
      this.dialogVisible = true;
      this.step = e ? e : 1;
      this.stepIndex = e ? e : 1;
      this.eventIndex = 0;
      this.isRotate = [{rotate:false}, {rotate:false}, {rotate:false}]
      if(app_event && app_event.active == 1) {
        this.eventIndex = 1
        if(app_event.reg == 1){
          this.isRotate[2].rotate = true
        }
        else {
          this.isRotate[1].rotate = true
        } 
        
      }
      if(app_event && app_event.reg == 1) {
        this.eventIndex = 2
        if(app_event.pay != 1) this.isRotate[2].rotate = true
      }
      if(app_event && app_event.pay == 1) {
        this.eventIndex = 3
        this.isRotate[2].rotate = false
      }
      if(app_event && app_event.active == 0 && app_event.reg == 0 && app_event.pay == 0) {
        this.isRotate[0].rotate = true
      }
      
      if(this.step == 3) {
        this.handleInterval()
      }
      if(this.step == 1) {
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
      
    },
    //下一步
    handleNext () {
      if(this.step == 1) {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            
            this.step = 2;
            this.stepIndex = 2;
            const tempData = {
              ...this.temp,
              step: 1,
            }
            requestAdd( tempData ).then(response => {
              if(response.code == 200) {
                console.log('新增', response)
                this.app_id = response.data.app_id;
                this.$notify({
                  type: "success",
                  message: "新增成功!",
                  duration: 2000
                });
              }
              else{
                this.$message.error(response.msg)
              }
             
              // this.$router.back();
            });
          }
        });
      }
      else{
        const tempData = {
          app_id: this.app_id,
          step: 2,
        }
        requestAdd( tempData ).then(response => {
          if(response.code == 200) {
            // console.log('新增', response)
            // this.app_id = response.data.app_id;
            // this.$notify({
            //   type: "success",
            //   message: "新增成功!",
            //   duration: 2000
            // });
            this.handleInterval()
            this.step = 3;
            this.stepIndex = 3;
            
          }
          else{
            this.$message.error(response.msg)
          }
          
          // this.$router.back();
        });
        
      } 
    },
    handleInterval() {
      this.handleList() 
      this.timer = window.setInterval(() => {
          setTimeout(() => {
              this.handleList()
          },0)
      },5000)
    },
    handleList() {
      // this.isRotate[this.eventIndex].rotate = true; 
      
      
      let eventNames = ['active', 'reg', 'pay']
      const tempData = {
        app_id: this.app_id,
        event_name: eventNames[this.eventIndex],
      }

      // setTimeout(() => {
      //          this.isRotate[this.eventIndex].rotate = false;
      //           this.eventIndex += 1;
      //     },1000)
     
      requestEvent(tempData).then(res => {
        if(this.eventIndex == 3) {
          window.clearInterval(this.timer)
        }
        if(res.data && res.data.event_status == 1) {
          this.isRotate[this.eventIndex].rotate = false;
          this.eventIndex += 1;
          if(this.eventIndex < 3) {
            let data = this.isRotate[this.eventIndex]
            console.log('data',data)
            this.$set(data, 'rotate', true)
            console.log('1',this.eventIndex,this.isRotate )
          }
        }
      })
    },
    //确定
    handleAdd() {
      const tempData = {
        app_id: this.app_id,
        step: 3,
      }
      requestAdd( tempData ).then(response => {
        if(response.code == 200) {
          
          this.step = 4;
          this.stepIndex = 4;
          this.dialogVisible = false;
        }
        else{
          this.$message.error(response.msg)
        }
        
        // this.$router.back();
      });
      
    },
    close () {
      console.log('close方法')
      this.$emit('father')  
      this.temp = this.$options.data().temp;
      this.dialogVisible = false;
      window.clearInterval(this.timer)
     
    },
    handleClose() {
      this.dialogVisible = false;
    },
    //查看文档
    handleLook() {
      window.open(process.env.VUE_APP_BASE_API + '/Sysin/doc');
    },
    //下载sdk
    handleDownload() {
      window.open(process.env.VUE_APP_BASE_API + '/Sysin/downloadSDK?app_id=' + this.app_id); 
    },
  },
};
</script>
<style scoped>
.three-img{
    /* transform: rotate(180deg);
    transition: all 2s; */
    animation: three-img 5s linear infinite;
  }
  @keyframes three-img {
    0% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(72deg);
    }

    40% {
        transform: rotate(144deg);
    }

    60% {
        transform: rotate(216deg);
    }

    80% {
        transform: rotate(288deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
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