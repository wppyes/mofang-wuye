<template>
  <div class="user spai boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right: 20px">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加人员
        </el-button>
        <el-select v-model="listQuery.htid" clearable style="width: 200px">
          <el-option
            v-for="item in CategoryList"
            :label="item.Name"
            :value="item.Id"
            :key="item.Id"
          ></el-option>
        </el-select>
      </div>
      <el-input
        placeholder="请输入名字"
        v-model="listQuery.title"
        style="width: 150px"
        class="filter-item"
        clearable
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >搜索</el-button
      >
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      @sort-change="changeSort"
    >
      <el-table-column label="类型" prop="HTId" align="center" width="200px">
        <template slot-scope="scope">
          <span v-text="setname(scope.row.HTId)"></span>
        </template>
      </el-table-column>
      <el-table-column label="头像" prop="Img" align="center" width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.Img" alt="" style="width: 50px" />
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="Name"
        align="center"
        width="200px"
      ></el-table-column>
      <el-table-column label="职务" prop="Function" align="center"></el-table-column>
      <el-table-column
        label="好评"
        prop="HCount"
        align="center"
        width="200px"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        label="差评"
        prop="CCount"
        align="center"
        width="200px"
        sortable="custom"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row)">
            评价详情
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="linktoadd(scope.row.Id)"
          >
            <i class="el-icon-edit"></i>
          </el-button>
          <!-- <el-button size="mini" type="primary" @click="zhiding(scope.row.Id)">
            置顶
          </el-button> -->
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
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
    <el-dialog
      :title="dialogStatus"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="850px"
    >
      <div class="spl">
        <div v-if="list1.length==0">
        暂无
        </div>
        <div v-for="item in list1" class="flex">
          <div>
            <img :src="item.HeadimgUrl" />          
          </div>
          <div>
            <div style="margin-bottom:5px">{{item.NickName}}</div>            
             <el-tag  v-if="item.Type==1" type="success" size="small" style="margin-right:5px;" v-for="item1 in item.arr" :key="item1" v-text="setstr(item1)"></el-tag>
              <el-tag  v-else type="danger" size="small" style="margin-right:5px;" v-for="item1 in item.arr" :key="item1" v-text="setstr(item1)"></el-tag>
            {{item.Content}}<span class="time">{{item.CreatedStr}}</span>
          </div>
        </div>
      </div>
      <pagination
        small
        :total="total1"
        :page.sync="listQuery1.pageIndex"
        :limit.sync="listQuery1.pageSize"
        @pagination="getpllist"
      />
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "user",
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      listLoading1: true,
      list1: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 8,
        title: "",
        htid: "",
        type:''
      },
      listQuery1: {
        pageIndex: 1,
        pageSize: 8,
        id: "",
      },
      total: 0, //总数量
      total1: 0,
      CategoryList: [],
      dialogFormVisible: false,
      dialogStatus: "",
      flist:[]
    };
  },
  created() {
    this.getfenlei();
    this.getList();
    this.getfliet();
  },
  mounted() {
    this.$bus.$on("starchange", () => {
      this.getList();
    });
  },
  methods: {
    changeSort(val){
      this.listQuery.type='';
      if(val.prop=='HCount' && val.order){
        this.listQuery.type=1
      }
      if(val.prop=='CCount' && val.order){
        this.listQuery.type=2
      }
      this.listQuery.pageIndex=1;
      this.getList();
    },
    setstr(id){
      for(let i in this.flist){
        if(this.flist[i].Id==id){
          return this.flist[i].Name
        }
      }
    },
    getfliet(){
      request({
        url: "Honour/GetHonourEvaluateTypeList",
        method: "get",
        params: {},
      }).then((response) => {
        if (response.Status == 1) {
          this.flist=response.List
        }
      });
    },
    handleFilter1() {
      this.listQuery1.pageIndex = 1;
      this.getpllist();
    },
    detail(row) {
      this.dialogFormVisible = true;
      this.dialogStatus = row.Name + "的评价列表";
      this.listQuery1.id = row.Id;
      this.listQuery1.pageIndex = 1;
      this.getpllist();
    },
    getpllist() {
      this.listLoading1 = true;
      request({
        url: "Honour/GetHonourEvaluateList",
        method: "get",
        params: this.listQuery1,
      }).then((response) => {
        if (response.Status == 1) {
          this.list1 = response.List;
          for(let i in response.List){
            this.list1[i].arr=response.List[i].Represent.split(',')
          }
          this.total1 = response.PageCount;
          this.listLoading1 = false;
        }
      });
    },
    zhiding(row) {
      var data = this.$qs.stringify({ Id: row });
      this.$confirm("确定要置顶该人员吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          request({
            url: "Honour/Update",
            method: "post",
            data,
          }).then((response) => {
            if (response.Status == 1) {
              this.getList();
              this.$message({
                message: response.Msg,
                type: "success",
              });
            }
          });
        })
        .catch(() => {});
    },
    setname(type) {
      for (let i in this.CategoryList) {
        if (this.CategoryList[i].Id == type) {
          return this.CategoryList[i].Name;
        }
      }
    },
    getfenlei() {
      request({
        url: "Honour/GetHonourTypeList",
        method: "get",
        params: {},
      }).then((response) => {
        if (response.Status == 1) {
          this.CategoryList = response.List;
        }
      });
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Honour/GetHonourList",
        method: "get",
        params: this.listQuery,
      }).then((response) => {
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
    linktoadd(id) {
      this.$router.push({
        path: "star-biglist/add-star",
        query: { id: id },
      });
    },
    handledel(row, value, str) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除该人员吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          request({
            url: "Honour/Del",
            method: "post",
            data,
          }).then((response) => {
            if (response.Status == 1) {
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
              this.$message({
                message: response.Msg,
                type: "success",
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.spai .text-red {
  margin-left: 20px;
  color: #f00;
}
.spai{
  .el-table .sort-caret.ascending {
      border-bottom-color: transparent !important;
    }
  .spl{
    .flex{display: flex; background: #f5f5f5; border-radius: 10px; padding: 5px; align-items: center; position: relative; margin-bottom: 10px;}
    img{width: 50px; height: 50px; border-radius: 50%;margin-right: 10px;}
    span.time{color: #999; font-size: 12px; position: absolute; right: 10px; bottom: 10px;}
  }
}
</style>
