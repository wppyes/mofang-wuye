<template>
  <div class="activity boxright">
    <div class="filter-container">
      <el-input
        placeholder="订单编号"
        v-model="listQuery.ordernum"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="用户编号"
        v-model="listQuery.userid"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="产品名字"
        v-model="listQuery.productname"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="姓名/手机"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-select
        v-model="listQuery.status"
        placeholder="订单状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      
      <el-select
        v-model="listQuery.code"
        placeholder="物业选择"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in CompanyList" :label="item.CellName" :value="item.Code" :key="item.Code"></el-option>
      </el-select>
        <el-date-picker
        class="filter-item"
        v-model="value7"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>   
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载订单</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="编号" align="left" prop="PayOrderNum">
        <template slot-scope="scope">
         UserId：{{scope.row.UserId}}<br/>内部：{{scope.row.OrderNum}}<br/>支付：{{scope.row.PayOrderNum}}
        </template>
      </el-table-column>
      <el-table-column label="产品" align="left" prop="Title">
        <template slot-scope="scope">
          名称：{{scope.row.ProductName}}
          <br/>
           规格：{{JSON.parse(scope.row.Specifications).AttrName}} {{JSON.parse(scope.row.Specifications).SpecName}}
        </template>
      </el-table-column>
      <el-table-column label="支付" align="left" prop="PayAmount" width="160px">
         <template slot-scope="scope">
          <span>展示价格：{{scope.row.Amount}}</span>元 <br/>
          类型：<span v-text="setype(scope.row.Type)"></span> <br/>
          <span v-if="scope.row.Type!=1">积分：{{scope.row.IntegralPrice}}</span>
          <br/>
          <span v-if="scope.row.Type!=0"> 现金：{{scope.row.CashPrice}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="Number" width="80px"></el-table-column>      
      <el-table-column label="用户信息" align="left" prop="PayOrderNum">
        <template slot-scope="scope">
         物业名称：{{scope.row.CellName}}<br/>姓名：{{scope.row.Name}}<br/>电话：{{scope.row.Phone}}
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr" width="180px"></el-table-column>
      <el-table-column label="状态" align="center" prop="Status" width="90px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status" v-text="setliexing(scope.row.Status)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
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
    <el-dialog :title="titles" :visible.sync="dialogdingdan" :close-on-click-modal="false" width="700px">
        <ul class="beizhu">
          <li>备注信息：{{item.Remark}}</li>
          <li>规格详情：{{item.Specifications}}</li>
        </ul>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
var tabarr = [];
export default {
  name: "activity",
  components: { Pagination },
  data() {
    return {
      titles:'',
      Model: [],
      list: [], //列表
      total: 0, //总数量
      listLoading: false, //列表加载
      dialogdingdan:false,
      value7:'',
      downloadLoading:false,
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 6,
        status: "",  
        ordernum: "",
        userid: "",
        productname: "",      
        starttime:'',
        endtime:'',
        code:'',
        name:''
      },
      item:{},
      TypeList:[],
      CompanyList:[]

    };
  },
  created() {
    this.getList();
    this.getmodel();
  },
  mounted() {
    this.$bus.$on("navactivechange", () => {
      this.getList();
    });
  },
  watch: {
    value7(val, oldval) {
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
    setype(type){
      for(let i in this.TypeList){
        if(this.TypeList[i].Value==type){
          return this.TypeList[i].Text;
        }
      }
    },
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要下载订单吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Orders/GetOrderExcel",
            method: "get",
            params: {name:this.listQuery.name,
                      ordernum:this.listQuery.ordernum,
                      userid:this.listQuery.userid,
                      productname:this.listQuery.productname,
                      code:this.listQuery.code,
                      status:this.listQuery.status,
                      starttime:this.listQuery.starttime,
                      endtime:this.listQuery.endtime}
          }).then(response => {
              if(response.Status==1){
                import('@/vendor/Export2Excel').then(excel => {
                  const tHeader = response.TableTitle;
                  const filterVal = response.TableField;
                  const data = this.formatJson(filterVal, response.List)
                  if(response.List){
                    excel.export_json_to_excel({
                      header: tHeader,
                      data,
                      filename: '订单'
                    });
                  }
                
              }); 
              this.downloadLoading = false
            }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    detail(row) {      
      this.titles=row.Name+'的订单详情';
      this.dialogdingdan=true;
      this.item=row;
      
    },
    getmodel() {
      request({
        url: "Orders/DDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model = response.Model;
          this.TypeList=response.TypeList;
          this.CompanyList=response.CompanyList;
        }
      });
    },
    setliexing(type) {
      for (let i in this.Model) {
        if (this.Model[i].Value == type) {
          return this.Model[i].Text;
        }
      }
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Orders/GetOrdersList",
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.activity {
  .img {
    width: 40px;
    height: 40px;
  }
  .status3 {
    color: #f56c6c;
  }
  .status0 {
    color: #67c23a;
  }
  .status1 {
    color: #e6a23c;
  }
  .status2 {
    color: #409eff;
  }
  .status4 {
    color: #909399;
  }
  .qingkong {
    margin-left: 30px;
    color: #409eff;
  }
  ul li{list-style: none; line-height: 30px;}
  .flex{display: flex;}
  .flex ul{width: 570px; margin-left: 10px;
  }
  .beizhu li{border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 10px;}
  .beizhu li:last-of-type{border-bottom: none;}
}
</style>
