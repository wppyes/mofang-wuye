<template>
  <div class="bannerlist boxright">    
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
     <el-tabs v-model="bannerqu.mold" type="card" @tab-click="temp.Mold=bannerqu.mold;getList()">
        <el-tab-pane v-for="item in TypeList" :label="item.Text" :name="item.Value" :key="item.Value"></el-tab-pane>
      </el-tabs>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" class="filter-item" @click="handleadd('增加广告位',true)">
          <i class="el-icon-circle-plus"></i> 增加广告位
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.Images+'?imageView2/1/w/150/h/50'">
        </template>
      </el-table-column>
      <el-table-column label="跳转" align="center" prop="JumpTypeStr"></el-table-column>
      <el-table-column label="分类" align="center" prop="SiteTypeStr"></el-table-column>
      <el-table-column label="类型" align="center" prop="TypeStr"></el-table-column>
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
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改广告位',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="分类" prop="SiteType">
          <el-select v-model="temp.SiteType" placeholder="请选择分类">
            <el-option v-for="item in SiteTypeList" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接设置" prop="NavId">
          <el-select v-model="temp.NavId" placeholder="请选择链接类型" @change="isgetlist(false)">
            <el-option v-for="item in ConfigList" :label="item.Name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <div v-show="temp.NavId==2">
          <el-form-item label="门店选择" prop="RelId">       
            <div class="filter-container">
              <div class="filter-item">
                <el-input
                  placeholder="请输入手机号/店名/联系人任意关键字"
                  v-model="listQuery.str"
                  style="width: 200px;"
                  class="filter-item"
                  clearable
                />
              </div>
              <div class="filter-item" style="margin-right:20px;">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
              </div>
            </div> 
              <div v-for="item in mendianlist">
                <div>{{item.Name}}</div>
                <el-radio-group v-model="temp.RelId">    
                    <el-radio v-for="item1 in item.MerchantStoreList" :label="item1.Id" :key="item1.Id">{{item1.Name}}</el-radio>    
                </el-radio-group>           
              </div>    
          </el-form-item>                    
          <pagination
            small
            layout="prev, pager, next"
            v-show="mendiantotal>0"
            :total="mendiantotal"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.sum"
            @pagination="getmendian"
          />
        </div>
        <div v-show="temp.NavId==9">
          <el-form-item label="文章选择" prop="RelId">       
            <div class="filter-container">
              <div class="filter-item">
                <el-input
                  placeholder="请输入手机号/店名/联系人任意关键字"
                  v-model="listQuery1.title"
                  style="width: 200px;"
                  class="filter-item"
                  clearable
                />
              </div>
              <div class="filter-item" style="margin-right:20px;">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter1">搜索</el-button>
              </div>
            </div> 
              <div>
                <el-radio-group v-model="temp.RelId">    
                    <el-radio v-for="item in wenzhanglist" :label="item.Id" :key="item.Id">{{item.Title}}</el-radio>    
                </el-radio-group>           
              </div>    
          </el-form-item>                    
          <pagination
            small
            layout="prev, pager, next"
            v-show="wenzhangtotal>0"
            :total="wenzhangtotal"
            :page.sync="listQuery1.page"
            :limit.sync="listQuery1.sum"
            @pagination="getwenzhang"
          />
        </div> -->
        <el-form-item label="跳转地址" prop="Link" v-show="temp.NavId==1">
          <el-input v-model="temp.Link" placeholder="请填写跳转地址"/>
        </el-form-item>
        <el-form-item label="图片" prop="Images">
          <div class="video">
            <Uploadimgs v-model="temp.Images" ref="upLoadimg"></Uploadimgs>
            <div class="chicun">尺寸：690*300</div>  
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
import Uploadimgs from '@/components/Uploadqiniu/single';
var validnum = (rule, value, callback) => {
  if (value==0) {
    callback(new Error("请选择"));
    return;
  }
  callback();
};
export default {
  name: "bannerlist",
  components: { Pagination,Uploadimgs },
  data() {
    return {
      bannerqu:{
        mold:0,
        oid:''
      },
      list: [], //列表
      mendianlist:[],//门店列表
      mendiantotal:0,//门店总数量
      listLoading: false, //列表加载
      wenzhanglist:[],//文章列表
      wenzhangtotal:0,//文章总数量
      listLoadingmendian:false,//门店加载
      flag:true,
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        Type:'',
        JumpType:'',
        Images:'',
        Link:'',
        NavId:'',
        RelId:0,
        Mold:0,
        OId:'',
        SiteType:''
      }, 
      listQuery: {
        //搜素分页处理
        str: "",
        page: 1,
        sum: 10
      },
      listQuery1: {
        //搜素分页处理
        title: "",
        page: 1,
        sum: 10,
        type:3
      },
      ConfigList:[],
      SiteTypeList:[],
      TypeList:[],
      rules:{  
        SiteType: [
          { required: true, message: "请选择类型！", trigger: "blur" }
        ],
        Images: [
          { required: true, message: "图片必须上传！", trigger: "blur" }
        ],
        NavId:[
          { required: true, message: "请选择链接设置", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.temp.OId=this.$route.query.id;
    this.bannerqu.oid=this.$route.query.id;
    this.getList();
  },
  methods: {
    backto() {      
      this.$router.go(-1);
    },
    getwenzhang(){
      this.listLoadingmendian = true;
      request({
        url: "Article/GetArticleList",
        method: "get",
        params: this.listQuery1
      }).then(response => {
        if (response.Status == 1) {
          this.wenzhanglist = response.List.DataList;
          this.wenzhangtotal = response.List.TotalPage;
          this.listLoadingmendian = false;
        }
      });
    },
    getmendian(){
      this.listLoadingmendian = true;
      request({
        url: "Merchants/MerchantList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.mendianlist = response.List.DataList;
          this.mendiantotal = response.List.TotalPage;
          this.listLoadingmendian = false;
        }
      });
    },
    isgetlist(flag){
      if(!flag){
        this.temp.RelId='';
      }
      // if(this.temp.NavId==2){
      //   this.listQuery.str='';
      //   this.listQuery.page = 1;
      //   this.getmendian();
      // };        
      // if(this.temp.NavId==9){
      //   this.listQuery1.title='';
      //   this.listQuery1.page = 1;
      //   this.getwenzhang();
      // };  
      for(let i in this.ConfigList){
        if(this.ConfigList[i].Id==this.temp.NavId){
          this.temp.JumpType=this.ConfigList[i].JumpType;
          this.temp.Link=this.ConfigList[i].Url;
          this.temp.Type=this.ConfigList[i].Type;
        }
      }    
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getmendian();
    },
    getList() {
      this.listLoading = true;
      request({
        url: "CAds/GetAdsList",
        method: "get",
        params: this.bannerqu
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.ConfigList=response.ConfigList;
          this.TypeList=response.TypeList;
          this.SiteTypeList = response.SiteTypeList;
          this.listLoading = false;
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.JumpType='';
      this.temp.Images='';
      this.temp.Link='';
      this.temp.NavId='';
      this.temp.RelId='';
      this.temp.SiteType=''
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.isgetlist(true);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.JumpType=row.JumpType;
      this.temp.Images=row.Images;
      this.temp.Link=row.Link;
      this.temp.NavId=row.NavId;
      this.temp.SiteType=row.SiteType.toString();
      row.RelId==0?this.temp.RelId='':this.temp.RelId=parseInt(row.RelId);
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.isgetlist(true);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleFilter1() {
      this.listQuery1.page = 1;
      this.getwenzhang();
    }, 
    createData(){  
      // if(this.temp.JumpType!=1 || this.temp.JumpType==1 && this.temp.NavId==8){        
      //   this.temp.RelId='100';
      // }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {                
          // if(this.temp.JumpType!=1 || this.temp.JumpType==1 && this.temp.NavId==8){        
          //   this.temp.RelId=0;
          // }
          this.subrequest();
        }
      });
    }, 
    subrequest(){
      var param={
          Id:this.temp.Id,
          Type:this.temp.Type,
          JumpType:this.temp.JumpType,
          Images:this.temp.Images,
          NavId:this.temp.NavId,
          RelId:this.temp.RelId,
          Link:this.temp.Link,
          Mold:this.temp.Mold,
          OId:this.temp.OId,
          SiteType:this.temp.SiteType
      };     
      var data = this.$qs.stringify(param);
      request({
        url: "CAds/SetAds",
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
    },  
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id, Type:this.temp.Type });
      this.$confirm("确定要删除广告位吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "CAds/Del",
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
        url: "CAds/Sort",
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
