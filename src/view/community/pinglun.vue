<template>
  <div class="pinglun boxright">  
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>  
    <div>         
      <h3>{{Forummodel.Title}}</h3>
      <div style="display:flex;">
        <el-image
        style="width: 60px; height: 60px; border-radius:50%"
        :src="Forummodel.HeadimgUrl"></el-image>
        <div  class="right-one">
          <div style="line-height:60px;">{{Forummodel.NickName}}    </div>   
          <div class="status4">{{Forummodel.Contents}}</div>
          <div style="margin-top:10px">
            <el-image 
              style="width: 100px; height: 100px"
              v-for="item in srcList"
              :key="item"
              :src="item" 
              :preview-src-list="srcList">
            </el-image>
          </div>
        </div>
      </div>
      <div class="huifu">
        <el-tag @click="huifushow">回复</el-tag>
      </div>
      <el-divider content-position="left">评论</el-divider>
    </div>
    <pagination
      small
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <div class="pinglun-list">
      <ul>
        <li v-for="item in list">
          <div class="flexs">
            <div>
                <el-image
              style="width: 30px; height: 30px;"
              :src="item.HeadimgUrl"></el-image>
            </div>
            <div class="right-one">
              <span class="status3">{{item.NickName}}</span>：{{item.Content}}
              <div class="status4">{{item.CreateTimeStr}}</div>
            </div>
          </div>
          <div class="huifu">
            <el-tag type="danger" @click="handledel(item)">删除</el-tag>
          </div>          
          <el-divider></el-divider>
        </li>
      </ul>
    </div>
    <el-dialog title="回复帖子" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="590px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 500px; margin-left:10px;">        
        <el-form-item label="用户" prop="UserId">
            <div class="userd">
              <el-radio-group v-model="temp.UserId">    
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
        <el-form-item label="内容" prop="Content">
          <el-input v-model="temp.Content" type="textarea" placeholder="请填写内容"/>
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
export default {
  name: "wuye",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载   
      dialogFormVisible:false,
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 9,
        forumid:''
      },
      temp:{
        ForumId: 0,
        UserId: '',
        Content: ''
      },
      listQuery1:{
        pageIndex:1,
        pageSize:10
      },
      usertotal:0,
      userlist:[],//用户列表
      rules: {
        UserId: [{ required: true, message: '评论用户填写！', trigger: 'blur' }],
        Content: [{ required: true, message: '请填写评论内容！', trigger: 'blur' }],
      },
      Forummodel:[],
      srcList:[]
    };
  },
  created() {
    this.listQuery.forumid=this.$route.query.id;
    this.temp.ForumId=this.$route.query.id;
    this.getList();  
    this.getuser();  
    request({
        url: "Forum/GetForum",
        method: "get",
        params: {forumid:this.listQuery.forumid}
      }).then(response => {
        if (response.Status == 1) {          
          this.Forummodel=response.Forummodel
          if(response.Forummodel.ResJson.length>10){
            this.srcList=response.Forummodel.ResJson.split(',')
          }
        }
      });
  },
  methods: {
    backto() {      
      this.$router.go(-1);
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
    getList(){
      this.listLoading = true;
      request({
        url: "Forum/GetReplyList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
        }
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    }, 
    huifushow:function(){
      this.dialogFormVisible=true;
      this.temp.UserId='';
      this.temp.Content='';
    },   
    handleadd(row,title,creat,index){   
      this.temp={
        Code: '',
        CellName: '',
        Corporate: '',
        Phone: '',
        Name: '',
        Address: '',
        Province:'',
        City: '',
        County: '',
        OId:'',
        Agency:''
      };
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      var temps={
        ForumId: this.temp.ForumId,
        UserId: this.temp.UserId,
        Content: this.temp.Content
      }
      var data=this.$qs.stringify(temps);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          request({
            url: "Forum/SetReply",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.dialogFormVisible = false
              this.$message({
                message: response.Msg,
                type: 'success'
              })
            }
          });
        }
      })
    },
    handledel(item,index){      
      var data = this.$qs.stringify({ Id: item.Id});
      this.$confirm("确定要删除该评论吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Forum/UpdateReply",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              const index = this.list.indexOf(item);
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.pinglun {
  .img{width:40px; height:40px;}
  .status2{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status3{color:#409EFF;}
  .status4{color:#909399;}
  .pinglun-list li{list-style: none;}
  .flexs{display:flex; align-items:center}
  .right-one{max-width:93%; font-size:14px; color:#333; margin-left: 10px;}
  .el-divider--horizontal{margin: 15px 0;}
  h3{margin-bottom: 10px;}
  .huifu{text-align: right; }
  .el-tag{cursor: pointer;} 
  .userd{
    img{width: 18px; height: 18px; position: relative;}
    .el-radio{margin-bottom: 10px;}
    .el-radio.is-bordered+.el-radio.is-bordered{margin-left: 0;}
  }
  .el-image{margin-right: 10px;}
}
</style>
