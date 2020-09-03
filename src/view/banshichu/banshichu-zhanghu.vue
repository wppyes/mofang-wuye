<template>
  <div class="zhanghu boxright">
    <div class="filter-container">
      <div class="filter-item">
        <el-button type="primary" @click="handleadd('增加角色',true)">
          <i class="el-icon-circle-plus"></i> 增加用户
        </el-button>
      </div>
      <el-input
        placeholder="请输入名称"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      /> 
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in StatusList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> 
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="登录名" prop="Login" width="120px" align="center"></el-table-column>
      <el-table-column label="用户名" prop="Name" width="120px" align="center"></el-table-column>
      <el-table-column label="角色" prop="RoleName" width="120px" align="center"></el-table-column>
      <el-table-column label="街道办" prop="Agency" align="center"></el-table-column>
      <el-table-column label="状态" align="center" width="120px" class="tdspan">
        <template slot-scope="scope">
          <span v-if="scope.row.Status==0" class="maincolor">启用</span>
          <span v-if="scope.row.Status==1" class="status2">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" v-if="scope.row.Status==0" @click="updatastatus(scope.row)">禁用</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.Status==1" @click="updatastatus(scope.row)">启用</el-button>
          <el-button size="mini" type="success" @click="reset(scope.row)">重置</el-button>
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改用户',false)">
            <i class="el-icon-edit"></i>
          </el-button>
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
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="登录名" prop="Login">
          <el-input v-model="temp.Login" placeholder="请填写登录名" :disabled="temp.Id>0"/>
        </el-form-item>
        <el-form-item label="姓名" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写姓名"/>
        </el-form-item>
        <el-form-item label="角色" prop="Role">
          <el-select v-model="temp.Role" placeholder="请选择角色">
            <el-option v-for="item in rolelist" :label="item.Name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="街道办" prop="OId">
          <el-select v-model="temp.OId" placeholder="请选择角色" :disabled="temp.Id>0">
            <el-option v-for="item in wuyelist" :label="item.Agency" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
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
  name: "user",
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      rolelist: [], //角色列表
      wuyelist:[],
      temp: {
        Id: 0,
        Login: "",
        Name: "",
        Role: '',
        OId:''
      },
      listQuery: {
        //搜素分页处理
        name:'',
        pageIndex: 1,
        pageSize: 15,
        status:''
      },
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      iscreate: false, //是否是添加
      StatusList:[],
      total:0,
      rules: {
        Login: [
          { required: true, message: "登录名必须填写！", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "用户名必须填写！", trigger: "blur" }
        ],
        Role: [{ required: true, message: "角色必须选择！", trigger: "change" }],        
        OId: [{ required: true, message: "街道办必须选择！", trigger: "change" }]
      }
    };
  },
  created() {
    request({
      url: "OEmployee/GetRoleList",
      method: "get",
      params: {}
    }).then(response => { 
      if(response.Status==1){
        this.rolelist = response.RList;
        this.wuyelist = response.List;
        this.StatusList=response.StatusList;
      }
    });
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    }, 
    getList(){
      this.listLoading = true;
      request({
        url: "OEmployee/GetOEmployeeList",
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
    handleditor(row, title, creat) {
      this.temp = {
        Id: row.Id,
        Login: row.Login,
        Name: row.Name,
        Role: row.Role,
        OId: row.OId
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updatastatus(row){
      this.$confirm("确定要修改状态吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          var statu = 0;
          row.Status == 0?statu = 1:statu = 0;
          var data = this.$qs.stringify({ Id: row.Id,Status: statu});
          request({
            url: "OEmployee/ChangeStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.Status = statu;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    reset(row){
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要重置密码吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "OEmployee/ResetPwd",
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
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除用户吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "OEmployee/Del",
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
    handleadd(title, creat) {
      this.temp = {
        Id: 0,
        Login: "",
        Name: "",
        Role: '',
        OId: ''
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "OEmployee/SaveOEmployee",
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
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.zhanghu .tdspan span {
  margin-right: 10px;
}
.zhanghu{
  .status2{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status3{color:#409EFF;}
}

</style>
