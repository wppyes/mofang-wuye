<template>
  <div class="product boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加通知
        </el-button>
      </div>
      <el-input
        placeholder="请输入通知标题"
        v-model="listQuery.title"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="标题" align="left" prop="Title" width="700px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row.Id)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="shangjai(scope.row,0,'上架')" v-if="scope.row.Status!=0">
            上架
          </el-button>
          <el-button size="mini" v-if="scope.row.Status!=1" type="danger" @click="shangjai(scope.row,1,'下架')">
            下架
          </el-button>          
          <el-button size="mini" type="danger" @click="shangjai(scope.row,2,'删除')">
            <i class="el-icon-delete"></i>
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
// import upfile from "@/utils/upload";
var tabarr=[];
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
        title:'',
        pageIndex: 1,
        pageSize: 15
      },
    };
  },
  created() {
    this.getList();    
  },
  mounted () {
    this.$bus.$on('infochange', ()=> {
      this.getList()
    })
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Notice/GetNoticeList",
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
      this.$confirm("确定要置顶该公告吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Notice/UpdateTime",
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
    shangjai(row,value,title) {
      var data = this.$qs.stringify({ Id: row.Id,Status:value});
      this.$confirm("确定要"+title+"该公告吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Notice/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=value;
              if(value==2){
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              }
            }
          });
        })
        .catch(() => {});
    },    
    linktoadd(id){
      this.$router.push({
        path: "/info/info-list/add-info",
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
