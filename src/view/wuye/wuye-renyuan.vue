<template>
  <div class="bannerlist boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" class="filter-item" @click="handleadd('增加人员',true)">
          <i class="el-icon-circle-plus"></i> 增加人员
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.Img+'?imageView2/1/w/50/h/50'">
        </template>
      </el-table-column>
      <el-table-column label="名字" align="center" prop="Name"></el-table-column>
      <el-table-column label="手机号码" align="center" prop="Phone"></el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span @click="sort(scope.row,scope.$index,-1)" :class="scope.$index==0?'disabled':''">
            <i class="fa fa-arrow-up"></i>上移
          </span>&nbsp;&nbsp;&nbsp; 
          <span
            @click="sort(scope.row,scope.$index,+1)"
            :class="scope.$index==list.length-1?'disabled':''"
          >
            <i class="fa fa-arrow-down"></i>下移
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改人员',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:10px;"
      >

        <el-form-item label="名字" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写负责人名字"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="Phone">
          <el-input v-model="temp.Phone" placeholder="请填写手机号码"/>
        </el-form-item>
        <el-form-item label="头像" prop="Img">
          <div class="">            
            <Uploadimg v-model="temp.Img" ref="upLoadimg"></Uploadimg>
            <div class="chicun">尺寸：224*224</div>  
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import Uploadimg from '@/components/Uploadqiniu/single';
import { isvalidPhone } from "@/utils/validate";
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  name: "bannerlist",
  components: { Pagination ,Uploadimg},
  data() {
    return {
      list: [], //列表
      listLoading: false, //列表加载
      flag:true,
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Code:'',
        Id:0,
        Name:0,
        Phone:'',
        Img:'',
      }, 
      rules:{  
        Name: [
          { required: true, message: "请填写负责人名字！", trigger: "blur" }
        ],
        Phone: [
         { required: true, trigger: ["blur"], validator: validPhone }
        ],
        Img: [
          { required: true, message: "图片必须上传！", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.temp.Code=this.$route.query.id;
    this.getList();
  },
  methods: {
    backto() {      
      this.$router.go(-1);
    },
    getList() {
      this.listLoading = true;
      request({
        url: "CPublicity/GetPublicityList",
        method: "get",
        params: {code:this.temp.Code}
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.listLoading = false;
        }
      });
    },
    upLoad(param) {
      upfile(param.file, "Upload/Upload?folder=CPublicity", data => {
        if (data.Status) {
          this.temp.Img = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.Name='';
      this.temp.Phone='';
      this.temp.Img=''
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Name=row.Name;
      this.temp.Phone=row.Phone;
      this.temp.Img=row.Img
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(){  
      this.$refs["dataForm"].validate(valid => {
        if (valid) {   
          var param={
              Id:this.temp.Id,
              Name:this.temp.Name,
              Phone:this.temp.Phone,
              Img:this.temp.Img,
              Code:this.temp.Code
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "CPublicity/SetPublicity",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();          
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },    
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该人员吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "CPublicity/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
    sort: function(item, index, type) {
      //使用方法：传递当前数组的item,index下标,-1为上移，+1为下移
      this.setup(item, index, type, this.list);
    },
    setup: function(item, index, type, arr1) {
      if (!this.flag) {
        return;
      }
      this.flag = false;
      if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
        return;
      }
      var temp = arr1[index];
      var id1 = item.Id,
        id2 = arr1[index + type].Id; //当前id为 id1,替换id为id2
      var data = this.$qs.stringify({ id1: id1, id2: id2 });
      request({
        url: "CPublicity/Sort",
        method: "post",
        data
      }).then(response => {
        if (response.Status == 1) {
          this.$set(arr1, index, arr1[index + type]);
          this.$set(arr1, index + type, temp);
        }
        this.flag = true;
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.bannerlist {
  .disabled {
    color: #c0c4cc;
  }
   .el-radio{margin-bottom: 10px;}
  span {
    cursor: pointer;
  }
  .video .avatar-uploader{
    width: 200px;
    .el-upload{width: 200px;
      .avatar{width: 200px;}
    }
    
  }
  .chicun {
    color: #f00;
  }

}
</style>
