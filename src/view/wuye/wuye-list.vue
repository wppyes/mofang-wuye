<template>
  <div class="wuye boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary"  @click="handleadd(0,'增加物业',true)">
          <i class="el-icon-circle-plus"></i> 增加物业
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
        v-model="listQuery.province"
        placeholder="省"
        clearable
        style="width: 150px"
        class="filter-item"
         @change="getshi(1)"
      >
        <el-option v-for="item in citys" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select> 
      <el-select
        v-model="listQuery.city"
        placeholder="市"
        clearable
        style="width: 200px"
        class="filter-item"
         @change="getqu(1)"
      >
        <el-option v-for="item in shi" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select> 
      <el-select
        v-model="listQuery.county"
        placeholder="区"
        clearable
        style="width: 200px"
        class="filter-item"        
      >
        <el-option v-for="item in qu" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select> 
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
      <el-table-column label="CODE" align="left" prop="Code" width="110px"></el-table-column>
      <el-table-column label="识别码" align="left" prop="UniqueId" width="150px"></el-table-column>
      <el-table-column label="街道办" align="left" prop="Agency" width="150px"></el-table-column>
      <el-table-column label="小区名称" align="center" prop="CellName" width="150px"></el-table-column>  
      <el-table-column label="公司名称" align="center" prop="Corporate" width="150px"></el-table-column>  
      <el-table-column label="负责人" align="center" prop="Name" width="80px"></el-table-column>  
      <el-table-column label="电话" align="center" prop="Phone" width="120px"></el-table-column>  
      <el-table-column label="地址" align="left" prop="Address" width="150px"></el-table-column>  
      <el-table-column label="状态" align="center" width="60px">
        <template slot-scope="scope">
         <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column>  
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改物业',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          
          <el-button size="mini" type="primary" @click="shangjai(scope.row,1,'禁用')" v-if="scope.row.Status!=1">
            禁用
          </el-button>
          <el-button size="mini" v-if="scope.row.Status!=2" type="danger" @click="shangjai(scope.row,2,'解约')">
            解约
          </el-button>
          <el-button size="mini" v-if="scope.row.Status!=0" type="danger" @click="shangjai(scope.row,0,'启用')">
            启用
          </el-button>
          <el-button size="mini" @click="linktoadd(scope.row.Code)">
            人员
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:10px;">
         <el-form-item label="选择地址" prop="Province">
            <el-select
              v-model="temp.Province"
              placeholder="省"
              clearable
              style="width: 130px"
              class="filter-item"
              @change="getshi(2)"
            >
              <el-option v-for="item in citys" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 
            <el-select
              v-model="temp.City"
              placeholder="市"
              clearable
              style="width: 130px"
              class="filter-item"
              @change="getqu(2)"
            >
              <el-option v-for="item in shi" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 
            <el-select
              v-model="temp.County"
              placeholder="区"
              clearable
              style="width: 130px"
              class="filter-item"
              @change="getbanshi"
            >
              <el-option v-for="item in qu" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 

        </el-form-item>
        <el-form-item label="街道办名字" prop="Agency">
          <el-input v-model="temp.Agency" placeholder="街道办名字" readonly/>
        </el-form-item>
        <el-form-item label="小区名称" prop="CellName">
          <el-input v-model="temp.CellName" placeholder="请填写小区名称"/>
        </el-form-item>
        <el-form-item label="公司名称" prop="Corporate">
          <el-input v-model="temp.Corporate" placeholder="请填写公司名称"/>
        </el-form-item>
        <el-form-item label="负责人" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写负责人"/>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="temp.Phone" placeholder="请填写电话"/>
        </el-form-item>
        <el-form-item label="地址" prop="Address">
          <el-input v-model="temp.Address" placeholder="请填写地址"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
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
import citys from '@/utils/city.json'
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import { isvalidPhone } from "@/utils/validate";
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
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
        //搜素分页处理
        name:'',
        pageIndex: 1,
        pageSize: 15,
        status:'',
        province:'',
        city:'',
        county:''
      },
      temp:{
        Code: 0,
        CellName: '',
        Corporate: '',
        Phone: '',
        Name: '',
        Address: '',
        Province:'',
        City: '',
        County: '',
        OId:'',
        Agency:''
      },
      rules: {
        Name: [{ required: true, message: '负责人必须填写！', trigger: 'blur' }],
        Agency: [{ required: true, message: '请选择地址或者暂无街道办！', trigger: 'blur' }],
        CellName: [{ required: true, message: '小区名称必须填写！', trigger: 'blur' }],
        Corporate: [{ required: true, message: '公司名称必须填写！', trigger: 'blur' }],
        Phone: [{ required: true, trigger: ["blur"], validator: validPhone }],
        Address: [{ required: true, message: '地址必须填写！', trigger: 'blur' }],
      },
      StatusList:[],
      citys:[],
      shi:[],
      qu:[],
      quyu:{
        sheng:'',
        shi:'',
        qu:''
      }
    };
  },
  created() {
    this.getList();    
    request({
      url: "Company/DDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.StatusList=response.Model;
      }
    });
    this.citys=citys;
  },
  methods: {
    linktoadd(id){
      this.$router.push({
        path: "/wuye/wuye-list/wuye-renyuan",
        query: { id:id }
      });
    },
    getshi(type){
      for(let i in this.citys){
        if(this.citys[i].code==this.listQuery.province && type==1){
          this.shi=this.citys[i].cityList;
          this.listQuery.city='';
          this.listQuery.county='';
          this.temp.Agency='';
          break;
        }
        if(this.citys[i].code==this.temp.Province && type==2){
          this.shi=this.citys[i].cityList;  
          this.quyu.sheng=this.citys[i].name;
           this.temp.City='';
          this.temp.County='';
          this.temp.Agency='';
          break;
        }
      }
    },
    getqu(type){
      for(let i in this.shi){
        if(this.shi[i].code==this.listQuery.city && type==1){
          this.qu=this.shi[i].areaList;
          this.listQuery.county='';
          break;
        }
        if(this.shi[i].code==this.temp.City && type==2){
          this.qu=this.shi[i].areaList;
          this.quyu.shi=this.shi[i].name;
          this.temp.County='';
          break;
        }
      }
    },
    getquname(){
      for(let i in this.qu){
        if(this.qu[i].code==this.temp.County){
          this.quyu.qu=this.qu[i].name;
          break;
        }
      }
    },
    getbanshi(){      
      request({
        url: "Company/GetOffice",
        method: "get",
        params: {county:this.temp.County}
      }).then(response => {
        if (response.Status == 1) {
          if(response.Model){
            var _this=this;
            this.temp.OId=response.Model.Id;
            this.temp.Agency=response.Model.Agency;    
          }else{
            this.temp.OId='';
            this.temp.Agency=''; 
          }
        }
      });
    },
    shangjai(row,value,title) {
      var str= '要'+title+'该物业吗？';
      var data = this.$qs.stringify({ code: row.Code,Status:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Company/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=value;
            }
          });
        })
        .catch(() => {});
    },  
    getList(){
      this.listLoading = true;
      request({
        url: "Company/GetCompanyList",
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
        Code: '',
        CellName: '',
        Corporate: '',
        Phone: '',
        Name: '',
        Address: '',
        Province:'',
        City: '',
        County: '',
        OId:'',
        Agency:''
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
        Code: row.Code,
        CellName: row.CellName,
        Corporate: row.Corporate,
        Phone: row.Phone,
        Name:row.Name,
        Address: row.Address,
        OId:row.OId,
        Agency:row.Agency,
        Province:'',
        City: '',
        County: '',
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      var temps={
        Code: this.temp.Code,
        CellName: this.temp.CellName,
        Corporate: this.temp.Corporate,
        Phone: this.temp.Phone,
        Name:this.temp.Name,
        Address: this.temp.Address,
        Province:this.temp.Province,
        City:this.temp.City,
        County:this.temp.County,
        OId:this.temp.OId
      }
      var data=this.$qs.stringify(temps);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          request({
            url: "Company/SetCompany",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              if(this.iscreate){
                this.temp.UniqueId=response.UniqueId;
                this.temp.Code=response.Code;
                this.temp.Status=0;
                this.list.push(this.temp);            
              }else{
                 for (let i in this.list) {
                    if (this.list[i].Code === this.temp.Code) {
                      this.list[i].Name=this.temp.Name;
                      this.list[i].CellName=this.temp.CellName;
                      this.list[i].Corporate=this.temp.Corporate;
                      this.list[i].Phone=this.temp.Phone;
                      this.list[i].Address=this.temp.Address;
                      this.list[i].Province=this.temp.Province;
                      this.list[i].City=this.temp.City;
                      this.list[i].County=this.temp.County;
                      this.list[i].OId=this.temp.OId;
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
