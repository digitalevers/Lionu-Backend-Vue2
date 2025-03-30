<template>
    <div class="app-container">
      <div class="filter-container">
        <div class="filter-title">360 API上报联调</div>
      </div>
  
      <el-form
        ref="reportForm"
        :rules="rules1"
        :model="sem360"
        label-width="120px" 
        label-position="left"
        >
        <el-form-item label="投放广告类型" label-size="14px" prop="advType">
          <el-select v-model="sem360.advType" placeholder="请选择广告类型">
            <el-option label="PC搜索" value="psConvert"></el-option>
            <el-option label="移动搜索" value="msConvert"></el-option>
            <el-option label="展示广告" value="zsConvert"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转化类型" label-size="14px" prop="convertType">
          <el-select v-model="sem360.convertType" placeholder="请选择转化类型">
            <el-option v-for="item in convertTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="key" label-size="14px" prop="key">
          <el-input v-model="sem360.key" placeholder="填入您的 360 key"></el-input>
          <a href="/" target="_blank" class="doc-link">如何查看 360 key 和 secret</a>
        </el-form-item>
        <el-form-item label="secret" label-size="14px" prop="secret">
          <el-input v-model="sem360.secret" placeholder="填入您的 360 secret"></el-input>  
        </el-form-item>
        <el-form-item label="jzqs" label-size="14px" prop="jzqs" v-if="showJzqs">
          <el-input v-model="sem360.jzqs" placeholder="填入您的 jzqs 值"></el-input>
          <a href="/" target="_blank" class="doc-link">如何查看 jzqs 值</a>
        </el-form-item>
        <el-form-item label="落地页url" label-size="14px" prop="landpage">
          <el-input v-model="sem360.landpage" placeholder="填入您的投放落地页URL"></el-input>
        </el-form-item>
        <el-form-item label="联调URL" label-size="14px" prop="debugURL">
          <el-input v-model="sem360.debugURL" placeholder="联调URL，请到360点睛后台获取"></el-input>
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
export default {
    data() {
      return {
        baidu:{},
        generatedJsCode: '',
        convertTypes:[],
        rules1: {
            advType: [
              { required: true, message: "请选择广告类型", trigger: "change" },
            ],
            convertType: [
              { required: true, message: "请选择转化类型", trigger: "change" },
            ],
            key: [
                { required: true, message: "360key不能为空", trigger: "blur" },
            ],
            secret: [
                { required: true, message: "360secret不能为空", trigger: "blur" },
            ],
            landpage: [
                { required: true, message: "落地页URL不能为空", trigger: "blur" },
            ],
            jzqs: [
                { required: true, message: "jzqs不能为空", trigger: "blur" },
            ],
        },
        showJzqs: false, //是否显示jzqs控件
      };
    },
    created() {
      this.fetchKey();
    },
    watch: {
    'sem360.advType': {
      handler(newVal) {
        if (newVal) {
          this.fetchConvertTypes(newVal);
        } else {
          this.convertTypes = [];
        }
      },
      immediate: true
    }
  },
    methods: {
      // 获取key和secret并填充到控件
      fetchKey() {
        get360Key().then(response => {
          if (response.code === 200) {
            response.data.forEach(item => {
                if (item.conf_key === '360key') {
                    this.$set(this.sem360, 'key', item.conf_value);
                } else if (item.conf_key === '360secret') {
                    this.$set(this.sem360, 'secret', item.conf_value);
                } else if (item.conf_key === '360landpage') {
                    this.$set(this.sem360, 'landpage', item.conf_value);
                } else if (item.conf_key === '360jzqs') {
                    this.$set(this.sem360, 'jzqs', item.conf_value);
                }
            });
          } else {
            this.$message.error(response.msg || '获取信息失败');
          }
        }).catch(error => {
          console.error('获取信息失败:', error);
        });
      },
      // 获取转化类型数据
      fetchConvertTypes(advType) {
        get360ConvertTypes({'advType':advType}).then(response => {
          if (response.code === 200) {
            this.convertTypes = Object.keys(response.data).map(key => ({
              value: key,
              label: response.data[key]
            }));
          } else {
            this.$message.error(response.msg || '获取转化类型失败');
            this.convertTypes = [];
          }
        }).catch(error => {
          console.error('获取转化类型失败:', error);
          this.convertTypes = [];
        });
      },
      //获取联调JS代码
      createReportCode() {
        this.$refs.reportForm.validate(valid => {
            if (valid) {
                create360ReportCode( this.sem360 ).then(response => {
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