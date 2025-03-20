<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-title">系统设置</div>
    </div>

    <el-form
      ref="domainForm"
      :rules="rules1"
      :model="temp1"
      label-width="120px" 
      label-position="left"
      >
      <el-form-item label="数据采集域名" label-size="12px" prop="configDomain">
        <el-input v-model="temp1.configDomain"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="modifyDomain">保存</el-button>
      </el-form-item>
    </el-form>

    <el-form
      ref="pwdForm"
      :rules="rules2"
      :model="temp2"
      label-width="120px" 
      label-position="left"
      >
      <el-form-item label="系统管理员密码" prop="adminPassword">
        <el-input type="password" v-model="temp2.adminPassword" required></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="temp2.confirmPassword" required></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="modifyPwd">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDomain, modifyDomain, modifyPwd } from '@/api/settings'
export default {
  data() {
    // 自定义校验函数：校验两次密码是否一致
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.temp2.adminPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return {
      temp1:{},
      temp2:{},
      rules1: {
        configDomain: [
          { required: true, message: "数据采集域名不能为空", trigger: "blur" }
        ]
      },
      rules2: {
        adminPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "重复密码不能为空", trigger: "blur" },
          { validator: validateConfirmPassword, trigger: "blur" }
        ],
        
      },
    };
  },
  created() {
    this.fetchDomain();
  },
  methods: {
    // 获取域名并填充到控件
    fetchDomain() {
      getDomain().then(response => {
        if (response.code === 200) {
          //this.temp1.configDomain = response.data;//不会触发视图更新
          this.$set(this.temp1, 'configDomain', response.data);
        } else {
          this.$message.error(response.msg || '获取域名失败');
        }
      }).catch(error => {
        console.error('获取域名失败:', error);
      });
    },
    modifyDomain() {
      this.$refs.domainForm.validate(valid => {
        if (valid) {
          modifyDomain( this.temp1 ).then(response => {
            if(response.code == 200) {
              this.dialogVisible = false;
            }
            else{
              this.$message.error(response.msg)
            }
          });
        } else {
          console.log('表单校验失败');
        }
      })
    },
    modifyPwd() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          modifyPwd( this.temp2 ).then(response => {
            if(response.code == 200) {
              this.dialogVisible = false;
            }
            else{
              this.$message.error(response.msg)
            }
          }).catch(error => {
            console.error('设置失败:', error);
          });
        } else {
          console.log('表单校验失败');
        }
      })
    }
  }
};
</script>

<style scoped>
.settings-page {
  padding: 20px;
}

.el-input {
  width: 300px; /* 设置输入控件的显示宽度 */
}

::v-deep .el-form-item__label {
  font-size: 12px;
}
</style>