<template>
    <div class="app-container">
      <div class="filter-container">
        <div class="filter-title">百度API 上报联调</div>
      </div>
  
      <el-form
        ref="reportForm"
        :rules="rules1"
        :model="baidu"
        label-width="120px" 
        label-position="left"
        >
        <el-form-item label="转化类型" label-size="14px" prop="convertType">
          <el-select v-model="baidu.convertType" placeholder="请选择转化类型">
            <el-option v-for="item in convertTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="token" label-size="14px" prop="token">
          <el-input v-model="baidu.token" placeholder="填入您的百度token"></el-input>
          <a href="/" target="_blank" class="doc-link">如何查看百度token</a>
        </el-form-item>
        <el-form-item label="落地页url" label-size="14px" prop="landpage">
          <el-input v-model="baidu.landpage" placeholder="填入您的投放落地页URL，需要和baidu营销后台保持一致"></el-input>
        </el-form-item>
        <el-form-item label="联调URL" label-size="14px" prop="debugURL">
          <el-input v-model="baidu.debugURL" placeholder="联调URL，请到baidu营销后台获取"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createReportCode">生成联调代码</el-button>
        </el-form-item>
        <!-- 添加 textarea 控件 -->
        <el-form-item label="联调JS代码" label-size="14px">
          <el-input
              type="textarea"
              :rows="10"
              v-model="generatedJsCode"
              readonly
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </template>

 <script>
  import { getBaiduInfo, createBaiduReportCode } from '@/api/sem'
  export default {
    data() {
      return {
        baidu:{},
        generatedJsCode: '',
        convertTypes:[],
        rules1: {
            convertType: [
              { required: true, message: "请选择转化类型", trigger: "change" },
            ],
            token: [
                { required: true, message: "百度token不能为空", trigger: "blur" },
            ],
        }
      };
    },
    created() {
      this.fetchToken();
    },
    methods: {
      // 获取 token 并填充到控件
      fetchToken() {
        getBaiduInfo().then(response => {
          if (response.code === 200) {
            response.data.conf.forEach(item => {
                if (item.conf_key === 'baiduToken') {
                    this.$set(this.baidu, 'token', item.conf_value);
                } else if (item.conf_key === 'baiduLandpage') {
                    this.$set(this.baidu, 'landpage', item.conf_value);
                }
            });
            this.convertTypes = Object.keys(response.data.convertTypes).map(key => ({
              value: key,
              label: response.data.convertTypes[key]
            }));
          } else {
            this.$message.error(response.msg || '获取信息失败');
          }
        }).catch(error => {
          console.error('获取信息失败:', error);
        });
      },
      //获取联调JS代码
      createReportCode() {
        this.$refs.reportForm.validate(valid => {
            if (valid) {
              createBaiduReportCode( this.baidu ).then(response => {
                    if(response.code == 200) {
                        this.$message.success('生成成功');
                        this.generatedJsCode = response.data;
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
      },
    }
  };
  </script>

<style scoped>
.settings-page {
  padding: 20px;
}

.el-input {
  width: 550px; /* 设置输入控件的显示宽度 */
}

::v-deep .el-form-item__label {
  font-size: 14px;
}
.doc-link {
  margin-left: 10px;
  color: #409EFF;
  text-decoration: underline; /* 添加下划线 */
  font-size: 12px; /* 设置字体大小 */
}
</style>