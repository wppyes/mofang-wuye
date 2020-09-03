<template>
  <div class="wuye boxright">
    <div class="filter-container">
        <el-date-picker
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
      <el-table-column label="业主信息" align="center" prop="UserJson">
        <template slot-scope="scope">
         <span>{{JSON.parse(scope.row.UserJson).Tung}}</span> -
         <span>{{JSON.parse(scope.row.UserJson).Unit}}</span> -
         <span>{{JSON.parse(scope.row.UserJson).Number}}</span>
        </template>
      </el-table-column>  
      <el-table-column label="提交时间" align="center" prop="CreatedStr"></el-table-column>  
      <el-table-column label="处理时间" align="center" prop="UpdateTimeStr"></el-table-column>  
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
         <span :class="'status'+scope.row.Status">{{scope.row.StatusStr}}</span>
        </template>
      </el-table-column>  
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.Status==0" type="danger" @click="shangjai(scope.row,1,'拒绝')">
            拒绝
          </el-button>
          <el-button size="mini" v-if="scope.row.Status==0" type="primary" @click="shangjai(scope.row,2,'处理')">
            处理
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
  name: "wuye",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载    
      listQuery: {
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
    shangjai(row,value,title) {
      var str= '要'+title+'该票据吗？';
      var data = this.$qs.stringify({  id: row.Id,status:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Voucher/Update",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=value;
              row.StatusStr='已'+title;
            }
          });
        })
        .catch(() => {});
    },  
    getList(){
      this.listLoading = true;
      request({
        url: "Voucher/GetVoucherList",
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
