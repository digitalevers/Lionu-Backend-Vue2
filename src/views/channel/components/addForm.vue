<template>
  <el-dialog title="新建渠道" :visible.sync="dialogVisible" width="644px" @close="close" :lock-scroll="false">
    <el-form
      ref="dataForm"
      :model="temp"
      label-position="right"
      label-width="130px"
      :rules="rules"
      style="margin-left:20px;margin-right:80px;"
    >
      <el-form-item label="渠道名称" prop="channel_name">
        <el-input v-model="temp.channel_name" placeholder="请填下您的渠道名称" style="width: 100%" />
      </el-form-item>
      <el-form-item label="Android监测链接" prop="android_monitor_url">
        <el-input v-model="temp.android_monitor_url" placeholder="只需要填写参数即可，示例 aid=__AID__&imei_md5=__IMEI__&mac_md5=__MAC1__....."  style="width: 100%" />
      </el-form-item>
      <el-form-item label="iOS监测链接" prop="ios_monitor_url">
        <el-input v-model="temp.ios_monitor_url" placeholder="只需要填写参数即可，示例 aid=__AID__&idfa_md5=__IDFA_MD5__&mac_md5=__MAC1__&caid=__CAID__....."  style="width: 100%" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" plain @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { requestAdd } from '@/api/channel'
export default {
  data() {
    return {
      isRotate: [{rotate:false},{rotate:false},{rotate:false}],
      dialogVisible: false,
      temp: {},
      rules: {
        channel_name: [
          { required: true, message: "请填写渠道名称", trigger: "change" }
        ]
      },

      eventIndex: 0,
      processImg: require('@/assets/process.png'),
      finishImg: require('@/assets/finish.png'),
    };
  },
  created() {},
  methods: {
    handleOpen() {
      this.dialogVisible = true
    },
    //确定
    handleAdd() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = this.temp
          requestAdd( tempData ).then(response => {
            if(response.code == 200) {
              this.dialogVisible = false;
            }
            else{
              this.$message.error(response.msg)
            }
            // this.$router.back();
          });
        }
      })
    },
    close () {
      //console.log('close方法')
      this.$emit('father')  
      //this.temp = this.$options.data().temp;
      this.dialogVisible = false;
      window.clearInterval(this.timer)
    },
    handleClose() {
      this.dialogVisible = false;
    }
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