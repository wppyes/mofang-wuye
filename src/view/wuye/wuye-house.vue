<template>
  <div class="wuye boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary"  @click="handleadd(0,'增加业主',true)">
          <i class="el-icon-circle-plus"></i> 增加业主
        </el-button>        
      </div>
      <el-input
        placeholder="请输入名称"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      /> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
      
      <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleup">批量上传业主</el-button>  
      <el-button
         class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载业主信息</el-button>
      
      <a class="filter-item" style="color:#f00" href="/Api/Upload/School/上传业主信息模板.xls" download="上传业主信息模板">下载模板</a>  
    </div>    
    <el-row class="rows">
      <el-col :span="6">
        <el-table v-loading="listLoading" :data="bigList" border :span-method="objectSpanMethod">
          <el-table-column label="小区" align="center">
            <template slot-scope="scope">
              <div style="height:505px; overflow-y:auto; background:#fff">
               <el-tree
                  :data="bigList"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </div>
            </template>
          </el-table-column>
        </el-table>      
      </el-col>
      <el-col :span="18">        
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row height="579px">
          <el-table-column label="房间号" align="center" prop="Number"></el-table-column>
          <el-table-column label="业主名字" align="center" prop="Holder"></el-table-column>
          <el-table-column label="电话" align="center" prop="Phone"></el-table-column>  
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改',false)">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button
                  size="mini" type="danger"
                  @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
            </template>
          </el-table-column>
        </el-table> 
      </el-col>
    </el-row>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:10px;">
        <el-form-item label="单元选择" prop="HUId">
          <el-select
            v-model="temp.HTId"
            placeholder="选择楼栋"
            style="width:150px"
             @change="changeloudong"
          >
            <el-option v-for="item in bigList" :label="item.Name" :value="item.Id" :key="item.Id"/>
          </el-select>
          <el-select
            v-model="temp.HUId"
            placeholder="选择单元"
            style="width:150px"
          >
            <el-option v-for="item in danyuanlist" :label="item.Name" :value="item.Id" :key="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号" prop="Number">
          <el-input v-model="temp.Number" placeholder="请填写门牌号"/>
        </el-form-item>
        <el-form-item label="业主" prop="Holder">
          <el-input v-model="temp.Holder" placeholder="请填写业主名字"/>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="temp.Phone" placeholder="请填写联系方式"/>
        </el-form-item>
        <el-form-item label="户型" prop="Room" class="spans">          
          <el-row>
            <el-col :span="5">
              <el-form-item prop='Room' style="width:70px; margin-right:10px" >
                <el-input v-model="temp.Room" />
              </el-form-item>
            </el-col>
            <el-col :span="2"><span>室</span></el-col>
            <el-col :span="5">
              <el-form-item prop='Office' style="width:70px; margin-right:10px" >
                <el-input v-model="temp.Office" />
              </el-form-item>
            </el-col>
            <el-col :span="2"><span>厅</span></el-col>
            <el-col :span="5">
              <el-form-item prop='Wei' style="width:70px; margin-right:10px" >
                <el-input v-model="temp.Wei" />
              </el-form-item>
            </el-col>
            <el-col :span="2"><span>卫</span></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="面积" prop="Area">
          <el-input v-model="temp.Area" placeholder="请填写面积（m²）"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量上传业主" :visible.sync="dialogload" :close-on-click-modal="false" width="550px">
      <el-form ref="dataloadForm" :rules="loadrules" :model="tempload" label-position="left" label-width="100px" style="width: 500px; margin-left:10px;">
        <el-form-item label="单元选择" prop="huid">
          <el-select
            v-model="tempload.htid"
            placeholder="选择楼栋"
            style="width:150px"
             @change="changeloudong1"
          >
            <el-option v-for="item in bigList" :label="item.Name" :value="item.Id" :key="item.Id"/>
          </el-select>
          <el-select
            v-model="tempload.huid"
            placeholder="选择单元"
            style="width:150px"
          >
            <el-option v-for="item in danyuanlist" :label="item.Name" :value="item.Id" :key="item.Id"/>
          </el-select>
        </el-form-item>
         <el-form-item label="文件上传" prop="filepath">          
          <el-upload
              class="upload-demo"
              drag
              ref="upload"
              accept=".xls,.xlsx"
              action=""
              :http-request="upLoad"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogload = false">取消</el-button>
        <el-button type="primary" @click="subfile">确定</el-button>
      </div>
    </el-dialog>    
    <el-dialog title="下载业主信息" :visible.sync="dialogyezhu" :close-on-click-modal="false" width="550px">
      <el-form label-position="left" label-width="100px" style="width: 500px; margin-left:10px;">
        <el-form-item label="单元选择" prop="huid">
          <el-select
            v-model="uploadyezhutemp.htid"
            placeholder="选择楼栋"
            style="width:150px"
             @change="changeloudong2"
          >
            <el-option label="全部" value="0"/>
            <el-option v-for="item in bigList" :label="item.Name" :value="item.Id" :key="item.Id"/>
          </el-select>
          <el-select
            v-model="uploadyezhutemp.huid"
            placeholder="选择单元"
            style="width:150px"
          >
            <el-option label="全部" value="0"/>
            <el-option v-for="item in danyuanlist" :label="item.Name" :value="item.Id" :key="item.Id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button
        :loading="downloadLoading"
         class="filter-item"
        type="primary"
        icon="el-icon-download"
         style="margin-left:110px;"
        @click="loadyezhu"
      >下载</el-button>
    </el-dialog>
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
import { isvalidPhone,validNum,validtwo } from "@/utils/validate";
import upfile from '@/utils/upload';
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
var validnum = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入内容"));
    return;
  }
  if (!validNum(value)) {
    callback(new Error("内容有误"));
  } else {
    callback();
  }
};
var validm = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入面积"));
    return;
  }
  if (!validtwo(value)) {
    callback(new Error("请输入正确的面积"));
  } else {
    callback();
  }
};
export default {
  name: "wuye",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载      
      iscreate:false,//是否是添加
      dialogStatus:'',
      dialogFormVisible:false,
      listQuery: {
        name:'',
        pageIndex: 1,
        pageSize: 10,
        htid:'',
        huid:''
      },
      temp:{
        Id:'',
        HTId: '',
        HUId: '',
        Number: '',
        Room: '',
        Office: '',
        Wei: '',
        Area:'',
        Holder: '',
        Phone: ''
      },
      rules: {
        HTId: [{ required: true, message: '楼栋必须选择！', trigger: 'blur' }],
        HUId: [{ required: true, message: '单元必须选择！', trigger: 'blur' }],
        Number: [{ required: true, message: '门牌号必须填写！', trigger: 'blur' }],
        Room: [{ required: true, validator: validnum, trigger: 'blur' }],
        Office: [{ required: true,validator: validnum, trigger: 'blur' }],
        Wei: [{ required: true, validator: validnum, trigger: 'blur' }],
        Area: [{ required: true, validator: validm, trigger: 'blur' }],
        Holder: [{ required: true, message: '业主名字必须填写！', trigger: 'blur' }],
        Phone: [{ required: true, trigger: ["blur"], validator: validPhone }],
      },
      bigList:[],      
      defaultProps: {
        children: "HouseList",
        label: "Name"
      },
      danyuanlist:[],
      dialogload:false,
      tempload:{
        htid:'',
        huid:'',
        filepath:'',
      },
      uploadyezhutemp:{
        htid:'',
        huid:''
      },
      downloadLoading: false,
      dialogyezhu:false,
      loadrules:{
        htid: [{ required: true, message: '楼栋必须选择！', trigger: 'blur' }],
        huid: [{ required: true, message: '单元必须选择！', trigger: 'blur' }],
        filepath: [{ required: true, message: '文件必须上传！', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.getList();    
    request({
      url: "HouseOwner/GetHouseList",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.bigList=response.List;
      }
    });
  },
  methods: {     
    loadyezhu(){
      this.$confirm("确定要下载业主信息吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {          
          this.downloadLoading = true;
          request({
            url: "HouseOwner/GetHouseOwnerExcel",
            method: "get",
            params: this.uploadyezhutemp
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
                      filename: '业主信息'
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
    handleDownload(){
      this.uploadyezhutemp.htid='0';
      this.uploadyezhutemp.huid='0';
      this.dialogyezhu=true;
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },    
    changeloudong2(){
      for(let i in this.bigList){
        if(this.bigList[i].Id==this.uploadyezhutemp.htid){
          this.danyuanlist=this.bigList[i].HouseList;
          break;
        }
      }      
    },
    handleup(){
      this.dialogload=true;
      this.tempload.filepath='';
      this.$nextTick(() => {
        this.$refs["dataloadForm"].clearValidate();
      });
    },  
    subfile(){      
      this.$refs["dataloadForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.tempload);
          request({
            url: "HouseOwner/HouseOwnerWork",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.dialogload = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.$refs.upload.clearFiles();
            }
          });
        }
      });
    },
    upLoad(param){
        upfile(param.file,'Upload/UploadFile',(data => {
            if(data.Status){
                this.tempload.filepath=data.Path;
            }else{
                this.$message({
                  message: data.Msg,
                  type: "error"
              });
            };
        }))
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },    
    handleNodeClick(data) {
      if(data.HouseList){
        this.listQuery.htid=data.Id;
         this.listQuery.huid='';
          this.temp.HTId=data.Id;
      }
      if(data.ParentId){
         this.listQuery.htid=data.ParentId;
         this.listQuery.huid=data.Id;
        this.temp.HTId=data.ParentId;
        this.temp.HUId=data.Id;
      }
      this.changeloudong();
      this.handleFilter();
    },
    changeloudong(){
      for(let i in this.bigList){
        if(this.bigList[i].Id==this.temp.HTId){
          this.danyuanlist=this.bigList[i].HouseList;
          break;
        }
      }      
    },
    changeloudong1(){
      for(let i in this.bigList){
        if(this.bigList[i].Id==this.tempload.htid){
          this.danyuanlist=this.bigList[i].HouseList;
          break;
        }
      }      
    },
    handledel(row) {
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除该业主吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "HouseOwner/Del",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            }                      
          });
        }).catch(() => {         
      })  
    },  
    getList(){
      this.listLoading = true;
      request({
        url: "HouseOwner/GetHouseOwnerList",
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
    handleadd(row,title,creat,index){   
      this.temp={
        Id: '',
        HTId: '',
        HUId: '',
        Number: '',
        Room: '',
        Office: '',
        Wei:'',
        Area: '',
        Holder: '',
        Phone:''
      };
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleditor(row,title,creat){      
      this.temp={
        Id: row.Id,
        HTId: row.HTId,
        HUId: row.HUId,
        Number: row.Number,
        Room:row.Room,
        Office: row.Office,
        Wei:row.Wei,
        Area:row.Area,
        Holder:row.Holder,
        Phone:row.Phone
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.changeloudong();
      this.iscreate=creat;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      var temps={
        Id: this.temp.Id,
        HTId: this.temp.HTId,
        HUId: this.temp.HUId,
        Number: this.temp.Number,
        Room:this.temp.Room,
        Office: this.temp.Office,
        Wei:this.temp.Wei,
        Area:this.temp.Area,
        Holder:this.temp.Holder,
        Phone:this.temp.Phone
      }
      var data=this.$qs.stringify(temps);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          request({
            url: "HouseOwner/SetHouseOwner",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              if(this.iscreate){
                this.temp.Id=response.Id;
                this.list.push(this.temp);            
              }else{
                 for (let i in this.list) {
                    if (this.list[i].Id === this.temp.Id) {
                      this.list[i].HTId=this.temp.HTId;
                      this.list[i].HUId=this.temp.HUId;
                      this.list[i].Number=this.temp.Number;
                      this.list[i].Room=this.temp.Room;
                      this.list[i].Office=this.temp.Office;
                      this.list[i].Wei=this.temp.Wei;
                      this.list[i].Area=this.temp.Area;
                      this.list[i].Holder=this.temp.Holder;
                      this.list[i].Phone=this.temp.Phone;
                      break
                    }
                  }             
              }
              this.dialogFormVisible = false
              this.$message({
                message: response.Msg,
                type: 'success'
              })
            }
          });
        }
      })
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
  .spans span{margin-right: 10px;}
}
</style>
