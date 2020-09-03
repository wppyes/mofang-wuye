<template>
  <div class="product boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加产品
        </el-button>
      </div>
      <el-select
        v-model="temp.cate1"
        placeholder="一级分类"
        clearable
        style="width: 150px"
        class="filter-item"
        @change="temp.cate2='';listQuery.categoryid=temp.cate1"
      >
        <el-option v-for="item in CategoryList" v-if="item.ParentId==0" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
      </el-select>
      <el-select
        v-model="temp.cate2"
        placeholder="二级分类"
        clearable
        style="width: 150px"
        class="filter-item"
        :disabled="temp.cate1==''"
        @change="listQuery.categoryid=temp.cate2"
      >
        <el-option v-for="item in CategoryList" v-if="item.ParentId==temp.cate1" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in StatusList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-input
        placeholder="请输入商品名称"
        v-model="listQuery.productname"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="产品名称" align="left" prop="ProductName" width="700px"></el-table-column>
      <el-table-column label="产品图片" align="center" width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.ProductImg+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>  
      <el-table-column label="销量" align="center" prop="SaleNum" width="100px"></el-table-column>   
      <el-table-column label="状态" align="center" width="100px">
        <template slot-scope="scope">
         <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column>  
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row.Id)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="shangjai(scope.row,1)" v-if="scope.row.Status!=1">
            上架
          </el-button>
          <el-button size="mini" v-if="scope.row.Status==1" type="danger" @click="shangjai(scope.row,2)">
            下架
          </el-button>
          <el-button size="mini" type="primary" @click="zhiding(scope.row)">
            置顶
          </el-button>
        </template>
      </el-table-column>
    </el-table> 

    <pagination
      small
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "product",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        //搜素分页处理
        productname:'',
        pageIndex: 1,
        pageSize: 15,
        categoryid:'',
        status:''
      },
      temp:{
        cate1:'',
        cate2:''
      },
      CategoryList:[],
      StatusList:[]
    };
  },
  created() {
    this.getList();    
    request({
      url: "Product/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.CategoryList=response.CategoryList;
        this.StatusList=response.StatusList;
      }
    });
  },
  mounted () {
    this.$bus.$on('productchange', ()=> {
      this.getList()
    })
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Product/GetProductList",
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
    zhiding(row){
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要置顶该产品吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Product/UpdateTime",
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
    shangjai(row,value) {
      var str= value==2?'下架产品彻底消失，确定要下架该产品吗？':'确定要上架该产品吗？';
      var data = this.$qs.stringify({ Id: row.Id,Status:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Product/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=value;
            }
          });
        })
        .catch(() => {});
    },    
    linktoadd(id){
      this.$router.push({
        path: "/shop/product-list/add-product",
        query: { id:id }
      });
    },
    setstatus(code){
      for(let i in this.StatusList){
        if(this.StatusList[i].Value == code){
          return this.StatusList[i].Text;
        }
      }
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.product {
  .img{width:40px; height:40px;}
  .status2{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status3{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
