<template>
  <div class="addproduct boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="width: 1100px; margin-left:20px;"
    >               
      <el-form-item label="分类" prop="CategoryId" style="width:500px">
        <el-select
          v-model="tempca.cate1"
          placeholder="一级分类"
          clearable
          style="width: 150px"
          @change="tempca.cate2='';temp.CategoryId=tempca.cate1"
        >
          <el-option v-for="item in CategoryList" v-if="item.ParentId==0" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
        </el-select>
        <el-select
          v-model="tempca.cate2"
          placeholder="二级分类"
          clearable
          style="width: 150px"
          :disabled="tempca.cate1==''"
          @change="temp.CategoryId=tempca.cate2"
        >
          <el-option v-for="item in CategoryList" v-if="item.ParentId==tempca.cate1" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
        </el-select>
      </el-form-item>  
      <el-form-item label="单位" prop="CompanyId" style="width:500px">
        <el-select
          v-model="temp.CompanyId"
          placeholder="选择单位"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in CompayList" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="ProductName" style="width:500px">
        <el-input v-model="temp.ProductName" placeholder="请填写产品名称" />
      </el-form-item>
      <el-form-item label="封面图：" prop="ProductImg">        
        <Uploadimg v-model="temp.ProductImg" ref="upLoadimg"></Uploadimg>
        <div class="chicun">尺寸：170*170</div>
      </el-form-item>
      <el-form-item label="产品主图：" prop="Img">
        <loadread ref="upLoadimgs" v-model="temp.Img"></loadread>
        <div class="chicun">尺寸：640*640</div>
      </el-form-item>      
      <el-form-item label="规格：" class="guige">       
        <el-card>                
          <div>            
            <el-form-item label="支付方式" prop="ShowType" style="width:300px; margin:0 0 30px 0;">
              <el-select
                  v-model="temp.ShowType"
                  placeholder="支付方式"
                  clearable
                  style="width: 150px"
                >
                  <el-option v-for="item in PriceType" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格：" prop="ShowIntegralPrice" style="width:800px; margin:0 0 10px 0;" v-if="temp.ShowType!==''">
              <el-input style="width: 150px" v-model="temp.ShowIntegralPrice" v-if="temp.ShowType!=1" placeholder="请填写积分价格" />
              <el-input style="width: 150px" v-model="temp.ShowCashPrice" v-if="temp.ShowType!=0" placeholder="请填写现金价格" />
            </el-form-item>
            <el-form-item label="规格名称：" prop="AttrTitle" style="width:300px">
              <el-input style="width: 150px" v-model="temp.AttrTitle" placeholder="请填写规格名称" />
            </el-form-item>
            <div class="height1"></div>
            <el-form-item label="规格值：" prop="AttrValue">
              <div v-for="(item,index) in temp.AttrValue" :key="item.Id" class="inpput-out">
                <el-input style="width: 130px" v-model="item.Name" placeholder="请填写规格值" @change="setguige(index,item)" />
                <i class="el-icon-delete" @click="delguige(index,item.Id)" v-if="temp.AttrValue.length>1"></i>
              </div>              
              <el-button type="text" @click="guigeadd()">增加规格</el-button>
            </el-form-item>
            <div class="filter-container margin-top" v-if="temp.SpecValue.length==0">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-circle-plus" round @click="shuxingadd">增加属性</el-button>
            </div>    
            <div v-if="temp.SpecValue.length>0">
              <div class="height1"></div>
              <div class="height1"></div>
              <el-form-item label="属性名称：" prop="SpecTitle" style="width:300px">
                <el-input style="width: 150px" v-model="temp.SpecTitle" placeholder="请填写属性名称" />
                <i class="el-icon-delete" @click="delshuxingname"></i>
              </el-form-item>
              <div class="height1"></div>
              <el-form-item label="属性值：" prop="SpecValue">
                <div v-for="(item,index) in temp.SpecValue" :key="item.Id" class="inpput-out">
                  <el-input style="width: 130px" v-model="item.Name" @change="setshuxing(index,item)" placeholder="请填写属性值" />
                  <i class="el-icon-delete" @click="delshuxing(index,item.Id)" v-if="temp.SpecValue.length>1"></i>
                </div>              
                <el-button type="text" @click="shuxingadd">增加属性</el-button>
              </el-form-item>
            </div>    
          </div> 
        </el-card>
      </el-form-item>
      <el-form-item label="规格明细：" v-if="temp.Specifications.length>0">
        <el-table :data="temp.Specifications" size="mini" border fit highlight-current-row >
          <el-table-column :label="temp.AttrTitle" prop="AttrName" align="center"></el-table-column>
          <el-table-column :label="temp.SpecTitle" prop="SpecName" v-if="temp.SpecValue.length>0" align="center"></el-table-column>
          <el-table-column label="库存" align="center">
            <template slot-scope="scope">
              <el-input style="width: 80px" v-model="scope.row.Stock" placeholder="库存" />
            </template>
          </el-table-column>
          <el-table-column label="展示价格" align="center">
            <template slot-scope="scope">
              <el-input style="width: 80px" v-model="scope.row.ShowPrice" placeholder="展示价格" />
            </template>
          </el-table-column>
          <el-table-column label="支付方式选择" align="center">
            <template slot-scope="scope">
              <el-select
                  v-model="scope.row.PriceType"
                  placeholder="支付方式"
                  clearable
                  style="width: 100px"
                >
                  <el-option v-for="item in PriceType" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
                </el-select>
            </template>
          </el-table-column>          
          <el-table-column label="积分价格" align="center">
            <template slot-scope="scope">
              <el-input style="width: 80px" v-model="scope.row.IntegralPrice" placeholder="积分" />
            </template>
          </el-table-column>          
          <el-table-column label="现金价格" align="center">
            <template slot-scope="scope">
              <el-input style="width: 80px" v-model="scope.row.CashPrice" placeholder="现金" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> 
      <div>
        <el-form-item label="详情" prop="ProductDetails" style="width:1100px">
          <Tinymce ref="editor" v-model="temp.ProductDetails" :key="tinymceFlag" :height="500" />
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import Tinymce from '@/components/Tinymce';
import Uploadimg from '@/components/Uploadqiniu/single';
import loadread from '@/components/Uploadqiniu/loadread';
export default {
  name: "addproduct",
  components: {Tinymce,Uploadimg,loadread},
  data() {
    return {
      temp: {
        Id: 0,
        CategoryId:'',
        CompanyId:'',
        ProductName: "", //名称
        ProductImg: "", //图片
        Img: '', //主图
        ProductDetails: "", //详情
        AttrTitle:'',//规格名称
        SpecTitle:'',//属性名称
        AttrValue:[],
        SpecValue:[],
        Specifications:[],
        ShowType:'',
        ShowIntegralPrice:0,
        ShowCashPrice:0
      },
      editor: null,	  
      tinymceFlag:1,
      rules: {
        CategoryId: [{ required: true, message: "选择分类！", trigger: "blur" }],
        CompanyId: [{ required: true, message: "选择单位！", trigger: "blur" }],
        ProductName: [
          { required: true, message: "产品名称必须填写！", trigger: "blur" }
        ],
        ProductImg: [
          { required: true, message: "产品图片必须上传！", trigger: "change" }
        ],
        Img: [{ required: true, message: "产品主图必须上传！", trigger: "blur" }],
        ProductDetails: [
          { required: true, message: "详情必须填写！", trigger: "blur" }
        ],
        ShowType: [{ required: true, message: "选择支付方式！", trigger: "blur" }],
      },
      tempca:{
        cate1:'',
        cate2:''
      },
      CategoryList:[],
      CompayList:[],
      temparr:[1,1,1],
      PriceType:[]    
    };
  },
  created() {
    this.temp.Id = this.$route.query.id;
    if(this.temp.Id==0){
      this.temp.AttrTitle='默认规格';
      this.temp.CategoryId = '';
      this.temp.CompanyId = '';
      this.temp.ProductName = '';
      this.temp.ProductImg = '';
      this.temp.ShowType = '';
      this.temp.ShowIntegralPrice = 0;
      this.temp.ShowCashPrice = 0;
      this.temp.Img =''
      this.temp.ProductDetails = '';
      this.temp.SpecTitle = '';
      this.temp.AttrValue = [];
      this.temp.SpecValue = [];
      this.temp.Specifications = [];
      this.guigeadd();
    }
    this.getproduct();
  },
  methods: {
    getproduct() {
      request({
        url: "Product/GetProduct",
        method: "get",
        params: { id: this.temp.Id }
      }).then(response => {
        if (response.Status == 1) {
          if(response.Model.Id){
            this.temp.CategoryId = response.Model.CategoryId;
            for(var i in response.CategoryList){
              if(response.CategoryList[i].Id==this.temp.CategoryId){
                if(response.CategoryList[i].ParentId==0){
                  this.tempca.cate1=response.Model.CategoryId;
                }else{
                  this.tempca.cate2=response.Model.CategoryId;
                  this.tempca.cate1=response.CategoryList[i].ParentId;
                }
                break;
              }
            }
            this.temp.CompanyId = response.Model.CompanyId;
            this.temp.ProductName = response.Model.ProductName; 
            this.temp.ShowType =  response.Model.ShowType.toString();
            this.temp.ShowIntegralPrice =  response.Model.ShowIntegralPrice;
            this.temp.ShowCashPrice =  response.Model.ShowCashPrice; 
            this.temp.ProductImg = response.Model.ProductImg;
            this.temp.Img = response.Model.Img;
            this.temp.ProductDetails = response.Model.ProductDetails;
            this.temp.AttrTitle = response.Model.AttrTitle;
            this.temp.SpecTitle = response.Model.SpecTitle;
            this.temp.AttrValue = JSON.parse(response.Model.AttrValue);
            if(response.Model.SpecValue){
              this.temp.SpecValue = JSON.parse(response.Model.SpecValue);
            }            
            this.temp.Specifications = JSON.parse(response.Model.Specifications);
            for(var i in this.temp.Specifications){
              this.temp.Specifications[i].PriceType=(this.temp.Specifications[i].PriceType).toString();
            }             
            for(let i in this.temp.AttrValue){
              if(this.temparr[0]<=this.temp.AttrValue[i].Id){
                this.temparr[0]=this.temp.AttrValue[i].Id+1;
              }              
            }
            for(let i in this.temp.SpecValue){
              if(this.temparr[1]<=this.temp.SpecValue[i].Id){
                this.temparr[1]=this.temp.SpecValue[i].Id+1;
              }              
            }
            for(let i in this.temp.Specifications){
              if(this.temparr[2]<=this.temp.Specifications[i].Id){
                this.temparr[2]=this.temp.Specifications[i].Id+1;
              }              
            }
          }
          this.CategoryList=response.CategoryList;
          this.CompayList=response.CompayList;
          this.PriceType=response.PriceType;          
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      });
    },
    guigeadd(){
      var id=this.temparr[0]++;
      var param={
        Id:id,
        Name:''
      }
      this.temp.AttrValue.push(param);
      var length = this.temp.SpecValue.length;
      if (length > 1) {
          for (var i = 0; i < length; i++) {
            var bigid=this.temparr[2]++;
              var param2 = {
                  Id: bigid,
                  AId: id,
                  SId: this.temp.SpecValue[i].Id,
                  AttrName: '',
                  SpecName: this.temp.SpecValue[i].Name,
                  Stock: 1000,
                  ShowPrice: 0,
                  PriceType: '0',
                  IntegralPrice:0,
                  CashPrice:0
              };
              this.temp.Specifications.push(param2);
          }
      } else {
        var bigid=this.temparr[2]++;
          var param1 = {
              Id: bigid,
              AId: id,
              SId: '',
              AttrName: '',
              SpecName: '',
              Stock: 1000,
              ShowPrice: 0,
              PriceType: '0',
              IntegralPrice:0,
              CashPrice:0
          };
          this.temp.Specifications.push(param1);
      };
    },
    shuxingadd(){
      var id=this.temparr[1]++;
      var param={
        Id:id,
        Name:''
      }
      this.temp.SpecValue.push(param);      
      var i = this.temp.SpecValue.length;
      if (i > 1) {
          for (var k = 0; k < this.temp.AttrValue.length; k++) {
            var bigid=this.temparr[2]++;
             var param2 = {
                  Id: bigid,
                  AId: this.temp.AttrValue[k].Id,
                  SId: id,
                  AttrName: this.temp.AttrValue[k].Name,
                  SpecName: '',
                  Stock: 1000,
                  ShowPrice: 0,
                  PriceType: '0',
                  IntegralPrice:0,
                  CashPrice:0
              };
              this.temp.Specifications.push(param2);
          };
      }else{
        for(var ii=0; ii<this.temp.Specifications.length ; ii++){
          this.temp.Specifications[ii].SpecName=this.temp.SpecTitle;
          this.temp.Specifications[ii].SId=id;
        }
      }
    },
    setguige(index,item){
      var count=0;
      for (var i in this.temp.AttrValue) {
          if (this.temp.AttrValue[i].Name == item.Name) {
              count++;              
          }
      };
       if (count > 1) {
            this.$message({
              message: '不能输入重复的规格！',
              type: "error"
            });
            return;
        }
        for(var i in this.temp.Specifications){
          if(this.temp.Specifications[i].AId==item.Id){
            this.temp.Specifications[i].AttrName=item.Name;
          }
        }
    },
    setshuxing(index,item){
      var count=0;
      for (var i in this.temp.SpecValue) {
          if (this.temp.SpecValue[i].Name == item.Name) {
              count++;              
          }
      };
       if (count > 1) {
            this.$message({
              message: '不能输入重复的属性！',
              type: "error"
            });
            return;
        }
        for(var i in this.temp.Specifications){
          if(this.temp.Specifications[i].SId==item.Id){
            this.temp.Specifications[i].SpecName=item.Name;
          }
        }
    },
    delguige(index,id){
      for(var i=0; i<this.temp.Specifications.length; i++){
        if(this.temp.Specifications[i].AId==id){
          this.temp.Specifications.splice(i,1);
          i--;
        }
      }
      this.temp.AttrValue.splice(index,1);
    },
    delshuxingname(){
      this.$confirm("删除属性所有规格明细重置，确定要删除属性吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {           
          this.temp.SpecTitle='';
          this.temp.SpecValue=[]; 
          this.temp.Specifications=[];       
          for(var i=0; i<this.temp.AttrValue.length; i++){        
              var bigid=this.temparr[2]++;
              var param2 = {
                Id: bigid,
                AId: this.temp.AttrValue[i].Id,
                SId: '',
                AttrName: this.temp.AttrValue[i].Name,
                SpecName: '',
                Stock: 1000,
                ShowPrice: 0,
                PriceType: '0',
                IntegralPrice:0,
                CashPrice:0
            };
            this.temp.Specifications.push(param2);
          } 
        }).catch(() => {         
      })  
    },
    delshuxing(index,id){
      for(var i=0; i<this.temp.Specifications.length; i++){
        if(this.temp.Specifications[i].SId==id){
          this.temp.Specifications.splice(i,1);
          i--;
        }
      }
      this.temp.SpecValue.splice(index,1);
    },
    backto() {      
      // this.temp.CategoryId = '';
      // this.temp.CompanyId = '';
      // this.temp.ProductName = '';
      // this.temp.ProductImg = '';
      // this.temp.Img = []
      // this.temp.ProductDetails = '';
      // this.temp.AttrTitle = '';
      // this.temp.SpecTitle = '';
      // this.temp.AttrValue = [];
      // this.temp.SpecValue = [];
      // this.temp.Specifications = [];
      this.$router.go(-1);
    },
    createData() {
      if(this.temp.AttrValue.length>0){
        if(this.temp.AttrTitle == ''){
          this.$message({
                message: '请输入规格名称',
                type: "success"
            });
            return;
        }
        for(var i in this.temp.AttrValue){
          if(this.temp.AttrValue[i].Name==''){
            this.$message({
                  message: '请输入规格值',
                  type: "success"
              });
              return;
          }
        }
      }
      if(this.temp.SpecValue.length>0){
        if(this.temp.SpecTitle == ''){
          this.$message({
                message: '请输入属性名称',
                type: "success"
            });
            return;
        }
        for(var i in this.temp.SpecValue){
          if(this.temp.SpecValue[i].Name==''){
            this.$message({
                  message: '请输入属性值',
                  type: "success"
              });
              return;
          }
        }
      }
      var reg= /^[0-9]+.?[0-9]*$/;
      var reg1=/^[0-9]+[0-9]*]*$/;
      if(this.temp.Specifications.length>0){
        for(var i in this.temp.Specifications){

          if(!reg1.test(this.temp.Specifications[i].Stock)){
            this.$message({
                  message: '库存不能为空，暂无库存请输入0,请输入正确库存数量',
                  type: "success"
              });
              return;
          }
          if(!reg.test(this.temp.Specifications[i].ShowPrice)){
            this.$message({
                  message: ',请输入正确的展示价格！',
                  type: "success"
              });
              return;
          }
          if(this.temp.Specifications[i].PriceType==''){
            this.$message({
                  message: '请选择支付类型！',
                  type: "success"
              });
              return;
          }
          if(this.temp.Specifications[i].PriceType==0 && !reg1.test(this.temp.Specifications[i].IntegralPrice)){
            this.$message({
                  message: '请输入正确的积分数量！',
                  type: "success"
              });
              return;
          }
          if(this.temp.Specifications[i].PriceType==1 && !reg.test(this.temp.Specifications[i].CashPrice)){
            this.$message({
                  message: '请输入现金金额！',
                  type: "success"
              });
              return;
          }
          if(this.temp.Specifications[i].PriceType==2 && !reg.test(this.temp.Specifications[i].CashPrice) || this.temp.Specifications[i].PriceType==2 && !reg1.test(this.temp.Specifications[i].IntegralPrice)){
            this.$message({
                  message: '请输入现金金额以及积分数量！',
                  type: "success"
              });
              return;
          };
          this.temp.Specifications[i].Stock=parseInt(this.temp.Specifications[i].Stock);
          this.temp.Specifications[i].PriceType=parseInt(this.temp.Specifications[i].PriceType);
          this.temp.Specifications[i].CashPrice=parseInt(this.temp.Specifications[i].CashPrice);
          this.temp.Specifications[i].IntegralPrice=parseInt(this.temp.Specifications[i].IntegralPrice);
        }
      }     

      if(this.temp.ShowType==0 && !reg1.test(this.temp.ShowIntegralPrice)){
        this.$message({
              message: '请输入正确的积分数量！',
              type: "success"
          });
          return;
      }
      if(this.temp.ShowType ==1 && !reg.test(this.temp.ShowCashPrice)){
        this.$message({
              message: '请输入现金金额！',
              type: "success"
          });
          return;
      }
      if(this.temp.ShowType ==2 && !reg.test(this.temp.ShowCashPrice) || this.temp.ShowType==2 && !reg1.test(this.temp.ShowIntegralPrice)){
        this.$message({
              message: '请输入现金金额以及积分数量！',
              type: "success"
          });
          return;
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.subadd();
        }
      });
    },
    subadd(){    
      var param={
        Id: this.temp.Id,
        CategoryId:this.temp.CategoryId,
        CompanyId:this.temp.CompanyId,
        ProductName:this.temp.ProductName, //名称
        ShowType:this.temp.ShowType, //名称
        ShowIntegralPrice:this.temp.ShowIntegralPrice, //名称
        ShowCashPrice:this.temp.ShowCashPrice, //名称
        ProductImg: this.temp.ProductImg, //图片
        Img: this.temp.Img, //主图
        ProductDetails: this.temp.ProductDetails, //详情
        AttrTitle:this.temp.AttrTitle,//规格名称
        SpecTitle:this.temp.SpecTitle,//属性名称
        AttrValue:JSON.stringify(this.temp.AttrValue),
        SpecValue:JSON.stringify(this.temp.SpecValue),
        Specifications:JSON.stringify(this.temp.Specifications)
      }
      var data = this.$qs.stringify(param);
      request({
        url: "Product/SetProduct",
        method: "post",
        data
      }).then(response => {
        if (response.Status == 1) {  
          this.$bus.$emit("productchange");
          this.$message({
            message: response.Msg,
            type: "success"
          });
          // this.backto();
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.addproduct {
  .chicun {
    color: #f00;
  }
  .ql-container {
    height: 180px;
  }
  .imgs li{list-style: none; position: relative; display: inline-block; margin: 0 20px 10px 0;}
  .imgs li img{width: 100px; height: 100px; border: 1px solid #f2f2f2;}
  .imgs .el-icon-delete{position:absolute; right: -5px; top: -5px; cursor: pointer; color: #f00;} 
  .imgs{display: flex; flex-wrap: wrap;}
  .margin-top{margin-top: 20px;}
  .height1{height: 10px;}
  .inpput-out{display: inline-block; margin: 0 10px 10px 0; position: relative;}
  .guige .el-icon-delete{position:absolute; right: -5px; top: -5px; cursor: pointer; color: #f00;}
  .el-upload-list__item {
    transition: none !important;
  } 
}
</style>
