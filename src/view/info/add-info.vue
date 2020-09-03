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
      <el-form-item label="标题" prop="Title" style="width:500px">
        <el-input v-model="temp.Title" placeholder="请填写标题" />
      </el-form-item>
      <el-form-item label="内容" prop="Content" style="width:1100px">
        <Tinymce ref="editor" v-model="temp.Content" :key="tinymceFlag" :height="500" />
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import Tinymce from '@/components/Tinymce';
export default {
  name: "addproduct",
  components: {Tinymce},
  data() {
    return {
      temp: {
        Id: 0,
        Title:'',
        Content:''
      }, 
      tinymceFlag:1,
      rules: {
        Title: [
          { required: true, message: "标题必须填写！", trigger: "blur" }
        ],
        Content: [{ required: true, message: "内容必须填写！", trigger: "blur" }],
      },  
    };
  },
  created() {
    this.temp.Id = this.$route.query.id;
    if(this.temp.Id==0){
      this.temp.Title='';
      this.temp.Content = '';
    }
    this.getproduct();
  },
  methods: {
    getproduct() {
      request({
        url: "Notice/GetNotice",
        method: "get",
        params: { id: this.temp.Id }
      }).then(response => {
        if (response.Status == 1) {
            this.temp.Title = response.Model.Title;
            this.temp.Content =  response.Model.Content;   
            this.$refs.editor.setContent(response.Model.Content);     
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
        }
      });
    },
    backto() {      
      this.$router.go(-1);
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {              
          var param={
            Id: this.temp.Id,
            Title:this.temp.Title,
            Content:this.temp.Content
          }
          var data = this.$qs.stringify(param);
          request({
            url: "Notice/SetNotice",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$bus.$emit("infochange");
              this.$message({
                message: response.Msg,
                type: "success"
              });
              if(this.temp.Id==0){
                this.temp.Title='';
                this.temp.Content = '';
                this.$refs.editor.setContent('');
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
</style>
