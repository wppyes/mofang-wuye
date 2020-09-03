<template>
  <div class="advise boxright">
    <div class="filter-container">
      <el-input
        placeholder="请输入标题"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />   
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="内容" align="left" prop="Details" width="400px"></el-table-column> 
      <el-table-column label="回复内容" align="center" prop="Reply" width="250px"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr" width="180px"></el-table-column>
      <el-table-column label="回复时间" align="center" prop="UpdateTimeStr" width="180px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="huifu(scope.row)">
            回复
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" >
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

    
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="710px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 600px; margin-left:10px;"
      >
        <el-form-item label="意见图片：">
            <el-image v-for="item in imgs"
              style="width: 80px; height: 80px; margin:10px"
              :src="item" 
              :key="item"
              :preview-src-list="imgs">
            </el-image>
        </el-form-item>
        <el-form-item label="回复：" prop="Reply">
          <el-input type="textarea" v-model="temp.Reply" placeholder="请填写回复内容" :disabled="isreplay==1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="subreplay" :disabled="isreplay==1">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "advise",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        name:''
      },
      times:'',
      CategoryList:[],
      dialogFormVisible:false,
      dialogStatus:'',
      imgs:[],
      temp:{
        Id:'',
        Reply:''
      },      
      isreplay:'',
      rules: {
        Reply: [
          { required: true, message: "回复内容必须填写！", trigger: "blur" }
        ],
      }
    };
  },
  created() {        
    request({
      url: "Complaint/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.CategoryList=response.List;
      }
    });
    this.getList(); 
  },
  mounted () {
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
        url: "Complaint/GetComplaintList",
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
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该意见吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Complaint/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
                this.$message({
                    message: response.Msg,
                    type: "success"
                });
            }
          });
        })
        .catch(() => {});
    }, 
    huifu(row){
      this.temp.Id=row.Id;
      this.temp.Reply=row.Reply;
      this.isreplay=row.Status;
      this.imgs=[];
      if(row.Img){
        this.imgs=JSON.parse(row.Img)
      }
      this.dialogFormVisible=true;
      this.dialogStatus='回复';
       this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    subreplay(){      
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Complaint/SetComplaint",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
