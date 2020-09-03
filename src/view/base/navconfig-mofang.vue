<template>
  <div class="navconfig boxright">
      <div class="filter-container">
        <div class="filter-item">
          <el-button type="primary" @click="handleadd('增加导航配置项',true)">
          <i class="el-icon-circle-plus"></i> 增加导航配置项
          </el-button>
        </div>
      </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名称" prop="Name" align="center"></el-table-column>
      <el-table-column label="链接" prop="Url" align="left"></el-table-column>    
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
      <el-table-column label="类型" align="center">
         <template slot-scope="scope">
          <span v-text="setType(scope.row.Type)"></span>
        </template>
      </el-table-column>
      <el-table-column label="跳转方式" align="center">
         <template slot-scope="scope">
          <span v-text="setJumpType(scope.row.JumpType)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改导航配置项',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类型" prop="Type">
          <el-select v-model="temp.Type" placeholder="请选择类型">
            <el-option v-for="item in NavModel" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转方式" prop="JumpType">
          <el-select v-model="temp.JumpType" placeholder="请选择跳转方式">
            <el-option v-for="item in NavJumpModel" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写名称"/>
        </el-form-item>
        <el-form-item label="跳转链接" prop="Url">
          <el-input v-model="temp.Url" placeholder="请填写跳转链接"/>
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
export default {
  name: "navconfig",
  data() {
    return {
      list: null,
      listLoading: true,
      NavJumpModel: [], //跳转方式
      NavModel:[],//类型
      flag:true,
      temp: {
        Id: 0,
        Type: '0',
        JumpType: '0',
        Name:'',
        Url:'',
        Mold:0
      },
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      rules: {
        Type: [{ required: true, message: "类型必须选择！", trigger: "change" }],        
        JumpType: [{ required: true, message: "跳转方式必须选择！", trigger: "change" }],        
        Name: [{ required: true, message: "名称必须选择！", trigger: "blur" }],        
        Url: [{ required: true, message: "跳转链接必须选择！", trigger: "blur" }]
      }
    };
  },
  created() {
    request({
      url: "CConfigNav/GetConfigNavList",
      method: "get",
      params: {mold:0}
    }).then(response => {
       if(response.Status){ 
        this.list = response.List;
        this.NavJumpModel=response.JumpTypeList;
        this.NavModel=response.CTypeList;
        this.listLoading = false;
       }
    });
  },
  methods: {
    handleditor(row, title, creat) { 
      this.temp = {
        Id: row.Id,
        Type: row.Type.toString(),
        JumpType: row.JumpType.toString(),
        Name: row.Name,
        Url: row.Url,
        Mold:0
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    setType(type){
        if(type==0){
            return '默认';
        };
        for(let i in this.NavModel){
            if(this.NavModel[i].Value==type){
                return this.NavModel[i].Text;
            };
        };
    },
    setJumpType(type){
      for(let i in this.NavJumpModel){
          if(this.NavJumpModel[i].Value==type){
              return this.NavJumpModel[i].Text;
          };
      };
    },
    handledel(row) {
      var data = this.$qs.stringify({ id: row.Id });
      this.$confirm("确定要删除导航配置项吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "CConfigNav/Del",
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
        Type: '',
        JumpType: '',
        Name:'',
        Url:'',
        Mold:0
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "CConfigNav/SetConfigNav",
            method: "post",
            data
          }).then(response => {
            if (response.Status) {  
              this.dialogFormVisible = false;            
              this.temp.Type=parseInt(this.temp.Type);
              this.temp.RelType=parseInt(this.temp.JumpType);
                if(this.temp.Id==0){
                    this.temp.Id = response.Id;
                    this.list.push(this.temp);
                }else{
                    for (let v in this.list) {
                        if (this.list[v].Id === this.temp.Id) {
                            this.list[v].Type=this.temp.Type;
                            this.list[v].JumpType=this.temp.JumpType;
                            this.list[v].Name=this.temp.Name;
                            this.list[v].Url=this.temp.Url;
                            break
                        }
                    }
                }
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },    
    sort: function (row, index, type) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移  
        this.setup(row, index, type,this.list);
    },
    setup: function (row, index, type, arr1) {
        if (!this.flag) {
            return;
        }
        this.flag = false;
        if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
            return;
        }; 
        var temp = arr1[index];        
        var id1 = row.Id, id2 = arr1[index + type].Id;//当前id为 id1,替换id为id2
        var data=this.$qs.stringify({id1: id1, id2: id2,});
        request({
          url: "CConfigNav/Sort",
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
.navconfig .tdspan span {
  margin-right: 10px;
}
  .navconfig .disabled{color: #C0C4CC;}
  .navconfig span{cursor: pointer;}
.navconfig  .chicun {
    color: #f00;
  }
</style>
