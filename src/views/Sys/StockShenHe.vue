<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.type" placeholder="类别"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.xiType" placeholder="细分"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('新增审核')" perms="sys:dict:add" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <shen-table :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete" permsEdit2="sys:tong:edit"
              :data="pageResult" :columns="columns" @Warehous="handleEdit4" @Outhous="handleEdit2" @Outhous1="handleEdit3" @Outhous2="handleEdit1"
              @findPage="findPage" @handleEdit="handleEdit"  @handleDelete="handleDelete">
    </shen-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="80%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-row>
          <el-col :span="5">
            <el-form-item label="名称" prop="label">
              <el-input v-model="dataForm.name" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="类型" prop="value">
              <el-input v-model="dataForm.type" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="细分" prop="type">
              <el-input v-model="dataForm.xiType" auto-complete="off"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="sort">
              <el-input v-model="dataForm.number" auto-complete="off"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="价格 " prop="description">
              <el-input v-model="dataForm.price" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="备注" prop="description">
              <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
        <el-button :size="size" @click.native="editDialogVisible = false" >{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" >{{$t('action.submit')}}</el-button>
    </el-dialog>
<!--    //审核确认界面-->
    <el-dialog :title="'审核确认'" width="80%" :visible.sync="ShenQueRen" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
      </el-form>
      <el-button :size="size" @click.native="ShenQueRen = false" >{{$t('action.cancel')}}</el-button>
      <el-button :size="size" type="primary" @click.native="Outhous2" :loading="editLoading" >{{$t('action.submit')}}</el-button>
    </el-dialog>
<!--    //审核界面-->
    <el-dialog :title="'通过审核'" width="80%" :visible.sync="ShenTong" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
      </el-form>
      <el-button :size="size" @click.native="ShenTong = false" >{{$t('action.cancel')}}</el-button>
      <el-button :size="size" type="primary" @click.native="Outhous" :loading="editLoading" >{{$t('action.submit')}}</el-button>
    </el-dialog>
<!--    //审核未通过界面-->
    <el-dialog :title="'未通过'" width="80%" :visible.sync="ShenWei" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
      </el-form>
      <el-button :size="size" @click.native="ShenWei = false" >{{$t('action.cancel')}}</el-button>
      <el-button :size="size" type="primary" @click.native="Outhous1" :loading="editLoading" >{{$t('action.submit')}}</el-button>
    </el-dialog>
    <!--    //确认入库-->
    <el-dialog :title="'确认入库'" width="80%" :visible.sync="QueRen" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="入库数量" prop="label">
          <el-input v-model="dataForm.inNumber" auto-complete="off"></el-input>
        </el-form-item>
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
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-button :size="size" @click.native="QueRen = false" >{{$t('action.cancel')}}</el-button>
      <el-button :size="size" type="primary" @click.native="Warehous" :loading="editLoading" >{{$t('action.submit')}}</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "../Core/KtButton";
  import KtTable from "../Core/KtTable";
  import { format } from "@/utils/datetime"
  import KfTable from "../Core/KfTable";
  import PtTable from "../Core/PtTable";
  import ShenTable from "../Core/ShenTable";
    export default {
        components:{
            KfTable,
            KtTable,
            KtButton,
          ShenTable,
          PtTable
        },
        data() {
            return {
                size: 'small',
                filters: {
                    name: '',
                  trType:'',
                  trSubdivide:''
                },
                columns: [
                    {prop:"id", label:"ID", minWidth:50},
                    {prop:"name", label:"名称", minWidth:100},
                    {prop:"type", label:"类型", minWidth:100},
                    {prop:"xiType", label:"细分", minWidth:80},
                    {prop:"number", label:"数量", minWidth:80},
                    {prop:"price", label:"价格", minWidth:120},
                  {prop:"mn", label:"状态", minWidth:120},
                    {prop:"remarks", label:"备注", minWidth:100},
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
              QueRen:false,
                 ShenQueRen:false,
              ShenWei:false,
                editLoading: false,
              ShenTong:false,
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
                    name: '',
                    type: '',
                    xiType: '',
                    number: '',
                    price:'',
                    mn:'',
                    remarks:'',
                    inNumber: ''
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
                this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name},trType: {name:'trType', value:this.filters.trType},trSubdivide: {name:'trSubdivide', value:this.filters.trSubdivide}}
                this.$api.shen.findPage(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.shen.batchDelete(data.params).then(data!=null?data.callback:'')
            },
            // 显示新增界面
            handleAdd: function () {
                this.editDialogVisible = true
                this.operation = true
                this.dataForm = {
                  id: 0,
                  name: '',
                  type: '',
                  xiType: '',
                  number: '',
                  price:'',
                  mn:'0',
                  remarks:''
                }
            },
            // 显示编辑界面
            handleEdit: function (params) {
                this.editDialogVisible = true
                this.operation = false
                this.dataForm = Object.assign({}, params.row)
            },
          // 显示编辑界面
          handleEdit1: function (params) {
            this.ShenQueRen = true
            this.operation = false
            this.dataForm = Object.assign({}, params.row)
          },
          handleEdit2: function (params) {
            this.ShenTong = true
            this.operation = false
            this.dataForm = Object.assign({}, params.row)
          },
          handleEdit3: function (params) {
            this.ShenWei = true
            this.operation = false
            this.dataForm = Object.assign({}, params.row)
          },
          handleEdit4: function (params) {
            this.QueRen = true
            this.operation = false
            this.dataForm = Object.assign({}, params.row)
          },
            // 编辑
            submitForm: function () {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                          this.dataForm.mn = 0
                            let params = Object.assign({}, this.dataForm)
                            this.$api.shen.save(params).then((res) => {
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
          Warehous:function () {
            this.$refs.dataForm.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.name
                  this.dataFormInt.type = this.dataForm.type
                  this.dataFormInt.xiType = this.dataForm.xiType
                  this.dataFormInt.number = this.dataForm.number
                  let params1 = Object.assign({}, this.dataFormInt)
                  this.$api.access.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.shen.save(params).then((res) => {
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.QueRen = false
                    this.findPage(null)
                  })
                })
              }
            })
          },
          Outhous:function () {
            this.$refs.dataForm.validate((valid) => {
              if (valid) {
                  this.editLoading = true
                  this.dataForm.mn = 1
                  let params = Object.assign({}, this.dataForm)
                  this.$api.shen.save(params).then((res) => {
                    if(res.code == 200) {
                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.ShenTong = false
                    this.findPage(null)
                  })

              }
            })
          },
          Outhous2:function () {
            this.$refs.dataForm.validate((valid) => {
              if (valid) {
                  this.editLoading = true
                  this.dataForm.mn = 2
                  let params = Object.assign({}, this.dataForm)
                  this.$api.shen.save(params).then((res) => {
                    if(res.code == 200) {
                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.ShenQueRen = false
                    this.findPage(null)
                  })
              }
            })
          },
          Outhous1:function () {
            this.$refs.dataForm.validate((valid) => {
              if (valid) {
                  this.editLoading = true
                  this.dataForm.mn = 3
                  let params = Object.assign({}, this.dataForm)
                  this.$api.shen.save(params).then((res) => {
                    if(res.code == 200) {
                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.ShenWei = false
                    this.findPage(null)
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
