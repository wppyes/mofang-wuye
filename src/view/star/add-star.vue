<template>
  <div class="addproduct boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="width: 1100px; margin-left:20px;"
    >
      
      <el-form-item label="类型" prop="Name" style="width:500px">
        <el-select
          v-model="temp.HTId"
          clearable
          style="width: 200px"
          class="filter-item"        
        >
          <el-option v-for="item in CategoryList" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
        </el-select> 
      </el-form-item>   
      <el-form-item label="姓名" prop="Name" style="width:500px">
        <el-input v-model="temp.Name" placeholder="请填写姓名" />
      </el-form-item>     
      <el-form-item label="图片：" prop="Img">   
        <Uploadimgs v-model="temp.Img" ref="upLoadimg"></Uploadimgs>
        <div class="chicun">尺寸：200*200</div>
      </el-form-item>   
      <el-form-item label="职务：" prop="Function" style="width:500px">
        <el-input v-model="temp.Function" placeholder="请填写职务" />
      </el-form-item> 
    </el-form>
    <el-button type="primary" style="margin-left:170px"@click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import Tinymce from '@/components/Tinymce';
import Uploadimgs from '@/components/Uploadqiniu/single';
export default {
  name: "addproduct",
  components: {Tinymce,Uploadimgs },
  data() {
    return {
      temp: {
        Id: 0,
        Name:'',
        Img:'',
        HTId:'',
        Function:''
      },
      tinymceFlag:1,
      CategoryList:[],
      rules: {
        HTId: [
          { required: true, message: "分类必须选择！", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "名字必须填写！", trigger: "blur" }
        ],
        Img: [
          { required: true, message: "图片必须上传！", trigger: "blur" }
        ],
        Function: [
          { required: true, message: "职务必须填写！", trigger: "blur" }
        ],
      },  
    };
  },
  created() {
    this.temp.Id = this.$route.query.id; 
    this.getfenlei();
    if(this.temp.Id==0){
      this.temp.Name = '';
      this.temp.Img = '';
      this.temp.Function = '';
      this.temp.HTId = '';
    }else{ 
      this.getdetail()
    }
  },
  methods: {
    getfenlei(){
      request({
        url: "Honour/GetHonourTypeList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.CategoryList=response.List; 
        }
      });
    },
    getdetail() {
      request({
        url: "Honour/GetHonour",
        method: "get",
        params: { id: this.temp.Id }
      }).then(response => {
        if (response.Status == 1) {
          this.temp.Name=response.Model.Name;  
          this.temp.Img = response.Model.Img;
          this.temp.HTId = response.Model.HTId;
          this.temp.Function = response.Model.Function;
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      });
    },   
    backto() {   
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.$router.go(-1);
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Honour/SetHonour",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$bus.$emit("starchange");
              this.$message({
                message: response.Msg,
                type: "success"
              });                 
              if(this.temp.Id==0){
                this.temp.Name = '';
                this.temp.Img = '';
                this.temp.HTId = '';
                this.temp.Function = '';
              }   
              this.backto();
            }
          });
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.addproduct {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  
  .chicun {
    color: #f00;
  }
}
</style>
