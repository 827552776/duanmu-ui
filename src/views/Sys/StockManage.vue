<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.trName" placeholder="名称"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.trType" placeholder="类别"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.trSubdivide" placeholder="细分"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('新增入库')" perms="sys:dict:add" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <pt-table :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage" @handleEditIt="handleEditIt" @handleEditOut="handleEditOut"@handleEdit="handleEdit"  @handleDelete="handleDelete">
    </pt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="80%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-row>
          <el-col :span="5">
            <el-form-item label="名称" prop="label">
              <el-input v-model="dataForm.trName" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="类型" prop="value">
              <el-input v-model="dataForm.trType" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="细分" prop="type">
              <el-input v-model="dataForm.trSubdivide" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="sort">
              <el-input v-model="dataForm.trNumber" auto-complete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="价格 " prop="description">
              <el-input v-model="dataForm.trPrice" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="预警数量" prop="description">
              <el-input v-model="dataForm.typeNumber" auto-complete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="dataForm.trRemarks" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实盘数" prop="sort">
              <el-input v-model="dataForm.number" auto-complete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="差额 " prop="description">
              <el-input v-model="dataForm.xNumber" auto-complete="off"  disabled="false" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
        <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?true:false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" :disabled="operation?true:false">{{$t('action.submit')}}</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单" name="first" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="名称" prop="label">
                  <el-input v-model="dataFormInt.name" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="类型" prop="value">
                  <el-input v-model="dataFormInt.type" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="细分" prop="value">
                  <el-input v-model="dataFormInt.xiType" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入库数量 " prop="description">
                  <el-input v-model="dataFormInt.number" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="价格" prop="value">
                  <el-input v-model="dataFormInt.price" auto-complete="off" disabled="false" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.intTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发票及备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?false:true">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm1" :loading="editLoading" :disabled="operation?false:true">{{$t('action.submit')}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :title="operationStock?'入库':'出库'" width="80%" :visible.sync="editDialogVisibleIn" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="入库数量" prop="label">
          <el-input v-model="dataForm.inNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单" name="first" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="名称" prop="label">
                  <el-input v-model="dataFormInt.name" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="类型" prop="value">
                  <el-input v-model="dataFormInt.type" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="细分" prop="value">
                  <el-input v-model="dataFormInt.xiType" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入库数量 " prop="description">
                  <el-input v-model="dataFormInt.number" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!--              <el-col :span="5">-->
              <!--                &lt;!&ndash;                <el-form-item label="入库时间" prop="label">&ndash;&gt;-->
              <!--                &lt;!&ndash;                  <el-input v-model="dataFormInt.intTime" auto-complete="off" disabled="false"/>&ndash;&gt;-->
              <!--                &lt;!&ndash;                </el-form-item>&ndash;&gt;-->
              <!--&lt;!&ndash;                <el-form-item label="出库时间" prop="sort">&ndash;&gt;-->
              <!--&lt;!&ndash;                  <el-date-picker&ndash;&gt;-->
              <!--&lt;!&ndash;                    v-model="dataFormInt.outTime"&ndash;&gt;-->
              <!--&lt;!&ndash;                    type="date"&ndash;&gt;-->
              <!--&lt;!&ndash;                    placeholder="选择日期">&ndash;&gt;-->
              <!--&lt;!&ndash;                  </el-date-picker>&ndash;&gt;-->
              <!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
              <!--              </el-col>-->
              <el-col :span="5">
                <el-form-item label="价格" prop="value">
                  <el-input v-model="dataFormInt.price" auto-complete="off"  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.intTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发票及备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?true:false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm2" :loading="editLoading" :disabled="operation?true:false">{{$t('action.submit')}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :title="operationStock?'入库':'出库'" width="80%" :visible.sync="editDialogVisibleOut" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="出库数量" prop="label">
          <el-input v-model="dataForm.outNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="出库单" name="first" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="名称" prop="label">
                  <el-input v-model="dataFormInt.name" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="类型" prop="value">
                  <el-input v-model="dataFormInt.type" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="细分" prop="value">
                  <el-input v-model="dataFormInt.xiType" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出库数量 " prop="description">
                  <el-input v-model="dataFormInt.outNumber" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="出库价格" prop="value">
                  <el-input v-model="dataFormInt.price" auto-complete="off"  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="领用人" prop="value">
                  <el-input v-model="dataFormInt.modeBy" auto-complete="off"  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.outTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="领用类型">
                  <el-select v-model="dataFormInt.mode" auto-complete="off" placeholder="请选择">
                    <el-option label="借" value="借"/>
                    <el-option label="换" value="换"/>
                    <el-option label="领" value="领"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?true:false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm3" :loading="editLoading" :disabled="operation?true:false">{{$t('action.submit')}}</el-button>
        </el-tab-pane>
        <el-tab-pane label="外售出库单" name="second" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="名称" prop="label">
                  <el-input v-model="dataFormInt.name" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="类型" prop="value">
                  <el-input v-model="dataFormInt.type" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="细分" prop="value">
                  <el-input v-model="dataFormInt.xiType" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出库数量 " prop="description">
                  <el-input v-model="dataFormInt.outNumber" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="出库价格" prop="value">
                  <el-input v-model="dataFormInt.price" auto-complete="off"  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="外售单位" prop="value">
                  <el-input v-model="dataFormInt.modeBy" auto-complete="off"  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.outTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
<!--              <el-col :span="6">-->
<!--                <el-form-item label="领用类型">-->
<!--                  <el-select v-model="dataFormInt.mode" auto-complete="off" placeholder="请选择">-->
<!--                    <el-option label="借" value="借"/>-->
<!--                    <el-option label="换" value="换"/>-->
<!--                    <el-option label="领" value="领"/>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
              <el-col :span="6">
                <el-form-item label="备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?true:false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm4" :loading="editLoading" :disabled="operation?true:false">{{$t('action.submit')}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "../Core/KtButton";
  import KtTable from "../Core/KtTable";
  import { format } from "@/utils/datetime"
  import KfTable from "../Core/KfTable";
  import PtTable from "../Core/PtTable";
    export default {
        components:{
            KfTable,
            KtTable,
            KtButton,
          PtTable
        },
        data() {
            return {
                size: 'small',
                filters: {
                    trName: '',
                  trType:'',
                  trSubdivide:''
                },
                columns: [
                    {prop:"id", label:"ID", minWidth:50},
                    {prop:"trName", label:"名称", minWidth:100},
                    {prop:"trType", label:"类型", minWidth:100},
                    {prop:"trSubdivide", label:"细分", minWidth:80},
                    {prop:"trNumber", label:"数量", minWidth:80},
                    {prop:"trPrice", label:"价格", minWidth:120},
                    {prop:"type", label:"预警状态", minWidth:120},
                    {prop:"typeNumber", label:"预警数量", minWidth:120},
                  {prop:"number", label:"实盘数量", minWidth:120},
                  {prop:"xNumber", label:"差额", minWidth:120},
                    {prop:"trRemarks", label:"备注", minWidth:120},
                    {prop:"createBy", label:"创建人", minWidth:100},
                    {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
                    // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
                    // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
                ],
                pageRequest: { pageNum: 1, pageSize: 10 },
                pageResult: {},

                operation: false, // true:新增, false:编辑
                operationStock: false,//true入库，false出库
                editDialogVisible: false, // 新增编辑界面是否显示
                editDialogVisibleIn:false,//入库界面是否显示
                editDialogVisibleOut:false,//出库显示界面是否显示
                editLoading: false,
                dataFormRules: {
                    trName: [
                       { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                dataFrom1:{
                    price:''
                },
                // 新增编辑界面数据
                dataForm: {
                    id: 0,
                    trName: '',
                    trType: '',
                    trSubdivide: '',
                    trNumber: '',
                    xNumber:'',
                    number:'',
                    trPrice: '',
                    trRemarks: '',
                    inNumber:'',
                    outNumber:'',
                    type:'0',
                    typeNumber:''
                },
              dataFormInt:{
                id: 0,
                name: '',
                type: '',
                xiType:'',
                price:'',
                sumPrice:'',
                modeBy: '',
                mode: '',
                outTime: '',
                intTime: '',
                outNumber:'',
                state:0,
                number:'',
                remarks:''
              }

            }
        },
        methods: {
          handleClick(tab, event) {
            console.log(tab, event);
          },
            // 获取分页数据
            findPage: function (data) {
                if(data !== null) {
                    this.pageRequest = data.pageRequest
                }
                this.pageRequest.columnFilters = {trName: {name:'trName', value:this.filters.trName},trType: {name:'trType', value:this.filters.trType},trSubdivide: {name:'trSubdivide', value:this.filters.trSubdivide}}
                this.$api.stock.findPage(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.stock.batchDelete(data.params).then(data!=null?data.callback:'')
            },
            // 显示新增界面
            handleAdd: function () {
                this.editDialogVisible = true
                this.operation = true
                this.dataForm = {
                    id: 0,
                    trName: '',
                    trType: '',
                    trSubdivide: '',
                    trNumber: '',
                    xNumber:'',
                    number:'',
                    trPrice: '',
                    trRemarks: '',
                    intNumber: '',
                    outNumber: '',
                    type:'0',
                    typeNumber:''
                }
              this.dataFormInt ={
                id: 0,
                name: '',
                type: '',
                xiType:'',
                price:'',
                sumPrice:'',
                modeBy: '',
                mode: '',
                outTime: '',
                intTime: '',
                outNumber:'',
                state:0,
                number:'',
                remarks:''
              }
            },
            //入库显示界面
            handleEditIt:function(params){
                this.editDialogVisibleIn = true
                this.operationStock = true
                this.dataForm = Object.assign({},params.row)
                this.dataFormInt ={
                  id: 0,
                  name: '',
                  type: '',
                  xiType:'',
                  price:'',
                  sumPrice:'',
                  modeBy: '',
                  mode: '',
                  outTime: '',
                  intTime: '',
                  outNumber:'',
                  state:0,
                  number:'',
                  remarks:''
                }
            },
            //出库
            handleEditOut:function(params){
                this.editDialogVisibleOut =true
                this.operationStock = false
                this.dataForm = Object.assign({}, params.row)
              this.dataFormInt ={
                id: 0,
                name: '',
                type: '',
                xiType:'',
                price:'',
                sumPrice:'',
                modeBy: '',
                mode: '',
                outTime: '',
                intTime: '',
                outNumber:'',
                state:2,
                number:'',
                remarks:''
              }

            },
            // 显示编辑界面
            handleEdit: function (params) {
                this.editDialogVisible = true
                this.operation = false
                this.dataForm = Object.assign({}, params.row)
            },
            // 编辑
            submitForm: function () {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            let params = Object.assign({}, this.dataForm)
                            this.$api.stock.save(params).then((res) => {
                                if(res.code == 200) {
                                    this.$message({ message: '操作成功', type: 'success' })
                                } else {
                                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                                }
                                this.editLoading = false
                                this.$refs['dataForm'].resetFields()
                                this.editDialogVisible = false
                                this.editDialogVisibleIn=false
                                this.editDialogVisibleOut = false
                                this.findPage(null)
                            })
                        })
                    }
                })
            },
          //入库单
          submitForm1: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.trName
                  this.dataFormInt.type = this.dataForm.trType
                  this.dataFormInt.xiType = this.dataForm.trSubdivide
                  this.dataFormInt.number = this.dataForm.trNumber
                  this.dataFormInt.price = this.dataForm.trPrice
                  this.dataFormInt.sumPrice = this.dataFormInt.price * (this.dataFormInt.number + this.dataFormInt.outNumber)
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.access.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    // this.editDialogVisibleIn=false
                    // this.editDialogVisibleOut = false
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.stock.save(params).then((res) => {
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.editDialogVisible = false
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = false
                    this.findPage(null)
                  })
                })
              }
            })
          },
          //入库单
          submitForm2: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.trName
                  this.dataFormInt.type = this.dataForm.trType
                  this.dataFormInt.xiType = this.dataForm.trSubdivide
                  this.dataFormInt.number = this.dataForm.inNumber
                  this.dataFormInt.sumPrice = this.dataFormInt.price * (this.dataFormInt.number + this.dataFormInt.outNumber)
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.access.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    // this.editDialogVisibleIn=false
                    // this.editDialogVisibleOut = false
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.stock.save(params).then((res)=> {
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.editDialogVisible = false
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = false
                    this.findPage(null)
                  })
                })
              }
            })
          },
          //出库单
          submitForm3: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.trName
                  this.dataFormInt.type = this.dataForm.trType
                  this.dataFormInt.xiType = this.dataForm.trSubdivide
                  this.dataFormInt.outNumber = this.dataForm.outNumber
                  this.dataFormInt.sumPrice = this.dataFormInt.price * (this.dataFormInt.number + this.dataFormInt.outNumber)
                  this.dataFormInt.state = 2
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.access.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    // this.editDialogVisibleIn=false
                    // this.editDialogVisibleOut = false
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.stock.save(params).then((res) => {
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.editDialogVisible = false
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = false
                    this.findPage(null)
                  })
                })
              }
            })
          },
          //外售出库点击事件
          submitForm4: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.trName
                  this.dataFormInt.type = this.dataForm.trType
                  this.dataFormInt.xiType = this.dataForm.trSubdivide
                  this.dataFormInt.outNumber = this.dataForm.outNumber
                  this.dataFormInt.sumPrice = this.dataFormInt.price * (this.dataFormInt.number + this.dataFormInt.outNumber)
                  this.dataFormInt.state = 3
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.access.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    // this.editDialogVisibleIn=false
                    // this.editDialogVisibleOut = false
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.stock.save(params).then((res) => {
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.editDialogVisible = false
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = false
                    this.findPage(null)
                  })
                })
              }
            })
          },
            // 时间格式化
            dateFormat: function (row, column, cellValue, index){
                return format(row[column.property])
            }
        },
        name: "StockManage"
    }
</script>

<style scoped>

</style>
