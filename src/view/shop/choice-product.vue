<template>
  <div class="product-choice boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd">
          <i class="el-icon-circle-plus"></i> 选择产品
        </el-button>
      </div>  
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="产品名称" align="left" prop="ProductName" width="700px"></el-table-column>
      <el-table-column label="产品图片" align="center" width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.ProductImg+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>  
      <el-table-column label="排序" align="center">
         <template slot-scope="scope">
          <span @click="sort(scope.row,scope.$index,-1)" :class="scope.$index==0?'disabled':''">  
          <i class="fa fa-arrow-up"></i>上移  
          </span>&nbsp;&nbsp;&nbsp;  
          <span @click="sort(scope.row,scope.$index,+1)" :class="scope.$index==list.length-1?'disabled':''">  
          <i class="fa fa-arrow-down"></i>下移  
          </span> 
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table> 

    <el-dialog title="选择产品" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="750px">      
      <div class="filter-container">
        <el-input
          placeholder="请输入商品名称"
          v-model="listQuery1.productname"
          style="width: 150px;"
          class="filter-item"
          clearable
        />  
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
      </div>
      
      <el-table v-loading="listLoading" :data="listchoice" border fit highlight-current-row>
        <el-table-column label="产品名称" align="left" prop="ProductName" width="500px"></el-table-column>
        <el-table-column label="图片" align="center" width="80px">
          <template slot-scope="scope">
            <img :src="scope.row.ProductImg+'?imageView2/1/w/40/h/40'" class="img">
          </template>
        </el-table-column>   
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="yep(scope.row)">
              确定
            </el-button>
          </template>
        </el-table-column>
      </el-table> 
      <pagination
        small
        :total="total"
        :page.sync="listQuery1.pageIndex"
        :limit.sync="listQuery1.pageSize"
        @pagination="getList1"
      />
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "product-choice",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        //搜素分页处理
        specialid:''
      },
      listQuery1:{
        pageIndex:1,
        pageSize:8,
        productname:''
      },
      dialogFormVisible:false,
      listchoice:[],
      flag:true,//排序连点禁止
    };
  },
  created() {
    this.listQuery.specialid = this.$route.query.id;
    this.getList();    
  },
  methods: {
    backto() {      
      this.$router.go(-1);
    },
    getList(){
      this.listLoading = true;
      request({
        url: "Special/GetSpecialProductList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.listLoading = false;
        }
      });
    },
    getList1(){
      this.listLoading = true;
      request({
        url: "Special/GetProductList",
        method: "get",
        params: this.listQuery1
      }).then(response => {
        if (response.Status == 1) {
          this.listchoice = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
        }
      });
    },
    handleFilter() {
      this.listQuery1.pageIndex = 1;
      this.getList1();
    },    
    linktoadd(id){
      this.dialogFormVisible=true;
      this.getList1()
    },
    yep(row){
      var data=this.$qs.stringify({SpecialId: this.listQuery.specialid, ProductId: row.Id});
        request({
          url: "Special/SetSpecialProduct",
          method: "post",
          data
        }).then(response => {
          if(response.Status==1){               
              const index = this.listchoice.indexOf(row);
              this.listchoice.splice(index, 1);
             this.$bus.$emit("choicechange");
             this.getList();  
          }
        });
    },
    handledel(row){
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除该产品吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Special/DelProduct",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            }                      
          });
        }).catch(() => {         
      })  
    },
    
    sort: function (item, index, type) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移  
        this.setup(item, index, type,this.list);
    },
    setup: function (item, index, type, arr1) {
        if (!this.flag) {
            return;
        }
        this.flag = false;
        if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
            return;
        }; 
        var temp = arr1[index];        
        var id1 = item.Id, id2 = arr1[index + type].Id;//当前id为 id1,替换id为id2
        var data=this.$qs.stringify({id1: id1, id2: id2,});
        request({
          url: "Special/SortProduct",
          method: "post",
          data
        }).then(response => {
          if(response.Status==1){              
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
.product-choice {
  .img{width:40px; height:40px;}
  .disabled{color: #C0C4CC;}
  span{cursor: pointer;}
}
</style>
