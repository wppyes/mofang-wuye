<template>
  <div class="list boxright">
      <div class="filter-container">
        <div class="filter-item" style="margin-right:20px;">
          <el-button type="primary" @click="handleadd('增加帖子',true)">
            <i class="el-icon-circle-plus"></i> 增加帖子
          </el-button>
        </div>
      
      <el-select
        v-model="listQuery.province"
        placeholder="省"
        clearable
        style="width: 150px"
        class="filter-item"
         @change="getshi(1)"
      >
        <el-option v-for="item in citys" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select> 
      <el-select
        v-model="listQuery.areo"
        placeholder="市"
        clearable
        style="width: 200px"
        class="filter-item"
         @change="getqu(1)"
      >
        <el-option v-for="item in shi" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select> 
    </div>
    
     <el-tabs v-model="listQuery.category" type="card" @tab-click="getList()">
        <el-tab-pane v-for="item in dellist" :label="item.Name" :name="item.Id.toString()" :key="item.Id"></el-tab-pane>
      </el-tabs>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="标题" align="left" prop="Title"></el-table-column>
      <el-table-column label="发帖人" align="center" prop="NickName" width="100"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreateTimeStr" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktodetail(scope.row.Id)">
            帖子详情
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      class="pagination-container1"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    
    <el-dialog title="增加帖子" :visible.sync="dialogaddVisible" :close-on-click-modal="false" width="700px" top="10px">
      <el-form
        ref="dataadd"
        :rules="rulesadd"
        :model="tempadd"
        label-position="left"
        label-width="80px"
        style="width: 600px; margin-left:50px;"
      >
         <el-form-item label="选择地址" prop="Areo">
            <el-select
              v-model="tempadd.Province"
              placeholder="省"
              clearable
              style="width: 130px"
              class="filter-item"
              @change="getshi(2)"
            >
              <el-option v-for="item in citys" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 
            <el-select
              v-model="tempadd.Areo"
              placeholder="市"
              clearable
              style="width: 130px"
              class="filter-item"
            >
              <el-option v-for="item in shi" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 
        </el-form-item>
        <el-form-item label="分类" prop="Category">
           <el-select
              v-model="tempadd.Category"
              placeholder="选择分类"
              clearable
              style="width: 130px"
              class="filter-item"
            >
              <el-option v-for="item in dellist" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
            </el-select> 
        </el-form-item> 
        <el-form-item label="标题" prop="Title">
          <el-input v-model="tempadd.Title" placeholder="请填写标题"/>
        </el-form-item> 
        <el-form-item label="内容" prop="Contents">
          <el-input type="textarea" v-model="tempadd.Contents" placeholder="请填写内容"/>
        </el-form-item>
        <el-form-item label="图片" prop="picIds">
          <el-upload
            ref="upLoadimg"
            list-type="picture-card"
            :show-file-list="true"
            accept=".jpg, .png"
            action
            :multiple="true"
            :limit="9"
            :on-remove="handleRemove"
            :http-request="upLoadimg"
            :on-change="changes"
            :auto-upload="false"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>            
          </el-upload>
        </el-form-item>
        <el-form-item label="用户选择" prop="UserId">
            <div class="userd">
              <el-radio-group v-model="tempadd.UserId">    
                  <el-radio v-for="item in userlist" :label="item.UserId" :key="item.UserId">
                    <img :src="item.headimgUrl" />
                    {{item.NickName}}
                    </el-radio>    
              </el-radio-group>           
            </div> 
            <pagination
              v-show="usertotal>0"
              :total="usertotal"
              :page.sync="listQuery1.pageIndex"
              :limit.sync="listQuery1.pageSize"
              @pagination="getuser"
            />      
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import request from "@/utils/request";
import citys from '@/utils/city.json';
import Pagination from "@/components/Pagination";
import upfile from "@/utils/upload";
var imglegth,templength=0;

import * as qiniu from "qiniu-js";
export default {
  name: "list",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      dellist:[],
      listLoading: false, //列表加载
      total:0,//总页数
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 10,
        province:'',
        areo:'',
        category:''
      },
      listQuery1:{
        pageIndex:1,
        pageSize:10
      },
      dialogaddVisible: false,
      userlist:[],//用户列表
      piclist:[],//上传图片数组
      usertotal:0,
      citys:[],
      shi:[],
      qu:[],
      tempadd:{
          Areo:'',
          Category:'',
          UserId:'',
          Title:'',
          Contents:'',
          picIds:'',
          Province:''
      },
      qiniu:{
        token:'',
        Domain:''
      },
      rulesadd: {
        //校验
        Areo: [
          { required: true, message: "区域必须选择！", trigger: "blur" }
        ],
        Category: [
          { required: true, message: "分类必须选择！", trigger: "blur" }
        ],
        Title: [
          { required: true, message: "标题必须填写！", trigger: "blur" }
        ],
        Contents: [
          { required: true, message: "内容必须填写！", trigger: "blur" }
        ],
        UserId: [
          { required: true, message: "请选择用户！", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.citys=citys;
    request({
      url: "Forum/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
          this.dellist = response.List;
          this.listQuery.category=response.List[0].Id.toString();
          this.getList();
      }
    });
    this.getuser();
  },
  methods: {
    linktodetail(id){
      this.$router.push({
        path: "/community/list/pinglun",
        query: { id:id }
      });
    },
    getshi(type,bo){
      for(let i in this.citys){
        if(this.citys[i].code==this.listQuery.province && type==1){
          this.shi=this.citys[i].cityList;
          this.list=[]
          this.listQuery.areo='';
          break;
        }
        if(this.citys[i].code==this.tempadd.Province && type==2){
          this.shi=this.citys[i].cityList;  
          if(!bo){
           this.tempadd.Areo='';
          }
          break;
        }
      }
    },
    getqu(type,bo){
      this.getList();
    },
    handleRemove(file) {
      for(let i in this.piclist){
        if(file.uid==this.piclist[i].uid){
          this.piclist.splice(i,1);
          break;
        }
      }          
      this.getpicids();
    },
    changes(file, fileList){
      imglegth=fileList.length;
    },
    upLoadimg(param){
      let paramimg={
        uid:param.file.uid,
        url:''
      };  
      var keys=''   
      const isJPG = param.file.type === "image/jpeg";
      const isPNG = param.file.type === "image/png";
      if(isJPG){
        keys=new Date().getTime()+'.jpg'
      } if(isPNG){
        keys=new Date().getTime()+'.png'
      }
      const key = keys;
      const token = this.qiniu.token; //从服务器拿的并存在本地data里
      const putExtra = {
        fname: '',
        params: {},
        mimeType: ['image/png', 'image/jpeg', 'image/gif'],
      };
      const config = {
        useCdnDomain: true, //使用cdn加速
      };
      const observable = qiniu.upload(param.file, key, token, putExtra, config);
      observable.subscribe({
        next: (result) => {
          console.warn(result);
        },
        error: () => {
          this.$notify('上传图片失败');
        },
        complete: (res) => {
          templength++;
          paramimg.url=this.qiniu.Domain+'/'+res.key;
          this.piclist.push(paramimg);            
          this.getpicids();
          if(imglegth==templength){
            this.subadd();
          }
        },
      });
      return
      upfile(param.file, data => {
        if (data.Status) {
            templength++;
            paramimg.url=data.Path;
            this.piclist.push(paramimg);            
            this.getpicids();
            if(imglegth==templength){
              this.subadd();
            }
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    getuser(){
      request({
          url: "Forum/GetUserList",
          method: "get",
          params: this.listQuery1
        }).then(response => {
          if (response.Status==1) {
            this.userlist = response.List;
            this.usertotal = response.PageCount;
          }
        });
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Forum/GetForumList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          if(response.PageCount){
            this.total = response.PageCount;
          }          
          this.listLoading = false;
        }
      });
    }, 
    handleFilter(){
      this.listQuery.pageIndex=1;
      this.getList();
    },
    delpic(item,index,pic,picindex){
      var data = this.$qs.stringify({ id: item.Id,rid:pic.Id });
      this.$confirm("确定要删除图片吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "QuanForum/DelResJson",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });  
              var arr= JSON.parse(this.list[index].ResJson);
              arr.splice(picindex,1);
              this.list[index].ResJson=JSON.stringify(arr);
            }
          });
        })
        .catch(() => {});
    },
    getpicids(){
      let str='';
      for(let i in this.piclist){
          str+=this.piclist[i].url+','
      };
      str=str.substring(0,str.length-1);
      this.tempadd.picIds=str;
    },
    handledel(row,index){      
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该帖子吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Forum/UpdateForum",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    handleadd(){
      this.tempadd.UserId='';
      this.tempadd.Category='';
      this.tempadd.Contents='';
      this.tempadd.picIds='';
      this.tempadd.Title='';
      this.tempadd.Province='';
      this.tempadd.Areo='';
      if(this.qiniu.token==''){
       this.gettocken();
      }
      this.piclist=[];
      this.dialogaddVisible = true;
      this.$nextTick(() => {
        this.$refs["dataadd"].clearValidate();
      });
    },
    gettocken(){
       request({
          url: "Upload/GetToken",
          method: "get",
          params: {}
        }).then(response => {
          if (response.Status == 1) {
            this.qiniu.token=response.Token;
            this.qiniu.Domain=response.Domain;
          }
        });
    },
    add(){
      this.$refs.upLoadimg.submit();
      if(this.tempadd.picIds!='' && this.tempadd.Contents==''){
        this.tempadd.Contents='*1';
      };
    
    },
    subadd(){
      this.$refs["dataadd"].validate(valid => {
        if (valid) {
          if(this.tempadd.Contents=='*1'){
            this.tempadd.Contents='';
          };
          let param={
            Areo:this.tempadd.Areo,
            Category:this.tempadd.Category,
            Title:this.tempadd.Title,
            Contents:this.tempadd.Contents,
            ResJson:this.tempadd.picIds,
            UserId:this.tempadd.UserId,
          }
          var data = this.$qs.stringify(param);
          request({
            url: "Forum/SetForum",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.dialogaddVisible = false;
              imglegth=0;
              templength=0;
              this.$refs.upLoadimg.clearFiles();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.list{
  .userd{
    img{width: 18px; height: 18px; position: relative;}
    .el-radio{margin-bottom: 10px;}
    .el-radio.is-bordered+.el-radio.is-bordered{margin-left: 0;}
  }
}
</style>
