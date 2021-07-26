<template>
  <div class="wuye boxright">
    <div class="filter-container">
      <el-input
        placeholder="请输入订单编号"
        v-model="listQuery.ordernum"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  <el-date-picker
        class="filter-item"
        v-model="times"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="头像" align="center" prop="UniqueId" width="60px">
        <template slot-scope="scope">
         <img :src="scope.row.HeadimgUrl" style="width:40px" />
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="left" prop="NickName"></el-table-column>
      <el-table-column label="订单编号" align="center" prop="OrderNum"></el-table-column>
      <el-table-column label="房屋" align="center" prop="CellName">
      <template slot-scope="scope">
         {{scope.row.tung.Tung}}号楼  {{scope.row.tung.Unit}}单元 {{scope.row.tung.Number}}
        </template>
      </el-table-column>  
      <el-table-column label="价格" align="center" prop="ActualPrice"></el-table-column>  
      </el-table-column>  
      <el-table-column label="时间" align="center" prop="CreatedStr"></el-table-column>  
      </el-table-column>  
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
         
        </template>
      </el-table-column> -->
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
  name: "wuye",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载      
      listQuery: {
        //搜素分页处理
        ordernum:'',
        pageIndex: 1,
        pageSize: 15,
        starttime:'',
        endtime:''
      },
      times:'',
    };
  },
  created() {
    this.getList();    
  },
  watch: {
    times(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    }
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "PropertyFeeOrder/GetOrdersList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          for(let i in response.List){
            response.List[i].tung=JSON.parse(response.List[i].UserJson)
          }
          this.list = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
        }
      });
    },
    handleFilter(){
      this.listQuery.pageIndex=1;
      this.getList();  
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.wuye {
  .img{width:40px; height:40px;}
  .status2{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status3{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
