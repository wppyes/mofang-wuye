<template>
  <div class="user boxright">
    <div class="back">
      <span @click="backto"> <i class="el-icon-arrow-left"></i>返回 </span>
    </div>
    <div class="filter-container">
      <div class="filter-item" style="margin-right: 20px">
        <el-button type="primary" @click="set()">
          <i class="el-icon-circle-plus"></i> 增加
        </el-button>
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
      <el-table-column
        label="姓名"
        prop="Name"
        align="center"
        width="200px"
      ></el-table-column>
      <el-table-column label="头像" prop="Img" align="center" width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.Img" alt="" style="width: 50px" />
        </template>
      </el-table-column>
      <el-table-column
        label="职务"
        prop="Function"
        align="center"
      ></el-table-column>
      <el-table-column
        label="职称"
        prop="Title"
        align="center"
      ></el-table-column>
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
          <el-button size="mini" type="danger" @click="del(scope.row)">
            移除
          </el-button>
          <el-button size="mini" type="primary" @click="zhiding(scope.row)">
            置顶
          </el-button>          
          <el-button size="mini" type="primary" @click="detail(scope.row)">
            评价详情
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
      title="增加人员"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="1000px"
    >
      <div class="filter-container">
        <el-input
          placeholder="请输入名字"
          v-model="box.title"
          style="width: 150px"
          class="filter-item"
          clearable
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="boxfilter"
          >搜索</el-button
        >
      </div>
      <el-table
        v-loading="boxLoading"
        :data="boxlist"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="姓名"
          prop="Name"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column label="头像" prop="Img" align="center" width="100px">
          <template slot-scope="scope">
            <img :src="scope.row.Img" alt="" style="width: 50px" />
          </template>
        </el-table-column>
        <el-table-column
          label="职务"
          prop="Function"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职称"
          prop="Title"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="addbox(scope.row)">
              添加
            </el-button>            
          </template>
        </el-table-column>
      </el-table>
      <pagination
        small
        :total="totalbox"
        :page.sync="box.pageIndex"
        :limit.sync="box.pageSize"
        @pagination="getbox"
      />
    </el-dialog>
    <el-dialog
      :title="dialogStatus"
      :visible.sync="dialogFormVisible1"
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
      list1: [],
      listLoading: true,
      listLoading1: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 7,
        title: "",
        hrid: "",
        type: "",
      },
      listQuery1: {
        pageIndex: 1,
        pageSize: 8,
        HRId: "",
        HRSId:''
      },
      total: 0, //总数量
      total1: 0,
      dialogFormVisible: false,
      dialogFormVisible1:false,
      dialogStatus:'',
      box: {
        pageIndex: 1,
        pageSize: 5,
        title: "",
        hrid: "",
      },
      tempadd: {
        HRId: "",
        HRSId: "",
      },
      boxLoading: true,
      boxlist: [],
      totalbox: 0,
      flist:[]
    };
  },
  created() {
    this.tempadd.HRId = this.$route.query.id;
    this.listQuery.hrid = this.$route.query.id;
    this.listQuery1.HRId=this.$route.query.id;
    this.box.hrid = this.$route.query.id;
    this.getList();
    this.getfliet();
  },
  methods: {    
    detail(row) {
      this.dialogFormVisible1 = true;
      this.dialogStatus = row.Name + "的评价列表";
      this.listQuery1.HRSId = row.HRSId;
      this.listQuery1.pageIndex = 1;
      this.getpllist();
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
        url: "HonourRollColumn/GetHonourEvaluateTypeList",
        method: "get",
        params: {},
      }).then((response) => {
        if (response.Status == 1) {
          this.flist=response.List
        }
      });
    },
    getpllist() {
      this.listLoading1 = true;
      request({
        url: "HonourRollColumn/GetHonourEvaluateList",
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
    changeSort(val) {
      this.listQuery.type = "";
      if (val.prop == "HCount" && val.order) {
        this.listQuery.type = 1;
      }
      if (val.prop == "CCount" && val.order) {
        this.listQuery.type = 2;
      }
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    addbox(row) {
      var data = this.$qs.stringify({ HRId: this.tempadd.HRId, HRSId: row.Id });
      this.$confirm("确定要添加该人员吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          request({
            url: "HonourRollColumn/SetHonourRollroster",
            method: "post",
            data,
          }).then((response) => {
            if (response.Status == 1) {
              const index = this.boxlist.indexOf(row);
              this.boxlist.splice(index, 1);
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
    zhiding(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要置顶该人员吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          request({
            url: "HonourRollColumn/UpdateTime",
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
    set(row) {
      this.dialogFormVisible = true;
      this.box.title = "";
      this.boxfilter();
    },
    del(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要移除该人员吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          request({
            url: "HonourRollColumn/Del",
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
    boxfilter() {
      this.box.pageIndex = 1;
      this.getbox();
    },
    getbox() {
      this.boxLoading = true;
      request({
        url: "HonourRollColumn/GetHonourRollStaffList",
        method: "get",
        params: this.box,
      }).then((response) => {
        if (response.Status == 1) {
          this.boxlist = response.List;
          this.totalbox = response.PageCount;
          this.boxLoading = false;
        }
      });
    },
    backto() {
      this.$router.go(-1);
    },
    getList() {
      this.listLoading = true;
      request({
        url: "HonourRollColumn/GetHonourRollrosterList",
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
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.user {
  .text-red {
    margin-left: 20px;
    color: #f00;
  }

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
