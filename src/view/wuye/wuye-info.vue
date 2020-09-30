<template>
  <div class="wuye boxright">
    <el-row :gutter="12">
      <el-col :span="12">        
        <el-card class="box-card">
          <span>信息</span>
          <el-divider content-position="left">物业信息</el-divider>
          <div class="text item">小区名称:{{list.CellName}}</div>
          <div class="text item">公司名称:{{list.Corporate}}</div>
          <div class="text item">负责人:{{list.Name}}</div>
          <div class="text item">电话:{{list.Phone}}</div>
          <div class="text item">地址:{{list.Address}}</div>
        </el-card> 
      </el-col>
      <!-- <el-col :span="12">         -->
        <!-- <el-card class="box-card">          
          <span>支付</span>
          <el-divider content-position="left">支付配置</el-divider>
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="left"
            label-width="100px"
            style="width: 400px; margin-left:50px;"
          >
            <el-form-item label="是否开启"  v-if="Payment">                  
              <el-switch
                v-model="Switch"
                active-text="开启"
                @change="changes"
                inactive-text="关闭">
              </el-switch>
            </el-form-item>
            <el-form-item label="MchId" prop="MchId">
              <el-input v-model="temp.MchId" placeholder="请填写MchId" show-password/>
            </el-form-item>
            <el-form-item label="AppId" prop="AppId">
              <el-input v-model="temp.AppId" placeholder="请填写AppId" show-password/>
            </el-form-item>
            <el-form-item label="ApiKey" prop="ApiKey">
              <el-input v-model="temp.ApiKey" placeholder="请填写ApiKey" show-password/>
            </el-form-item>
          </el-form>    
          <div class="right">
            <el-button type="primary" @click="sub">确定</el-button>
          </div>      
          
        </el-card>  -->
      <!-- </el-col> -->
    </el-row>  
    
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "wuye",
  data() {
    return {
      list: [], //列表
      Payment:'',
      Switch:false,
      temp:{
        AppId:'',
        MchId:'',
        ApiKey:''
      },  
      rules: {
        AppId: [
          { required: true, message: "AppId必须填写！", trigger: "blur" }
        ],
        MchId: [
          { required: true, message: "MchId必须填写！", trigger: "blur" }
        ],
        ApiKey: [{ required: true, message: "ApiKey必须填写！", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();   
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Company/GetCompany",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.Model;
          this.Payment=response.Payment;
          this.temp.AppId=response.Payment.AppId;
          this.temp.MchId=response.Payment.MchId;
          this.temp.ApiKey=response.Payment.ApiKey;
          this.Switch=response.Payment.Switch==1?true:false;
        }
      });
    },  
    changes(){
      var flag=this.Switch?1:0;
      var str = this.Switch?'开启':'关闭';
      var data = this.$qs.stringify({ isswitch: flag});
      this.$confirm("确定要"+str+"支付吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Company/Update",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
                this.$message({
                    message: response.Msg,
                    type: "success"
                });
            }
          });
        })
        .catch(() => {});
    },
    sub(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Company/SetPayment",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });              
              this.getList();   
            }
          });
        }
      });
    },

  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.wuye {
  .box-card{line-height: 50px; height: 430px;}
  .right{text-align: center;}
}
</style>
