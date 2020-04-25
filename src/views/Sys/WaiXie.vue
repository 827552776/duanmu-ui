<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.mould" placeholder="名称"/>
        </el-form-item>
<!--        <el-form-item label="" prop="sort">-->
<!--          <el-date-picker-->
<!--            v-model="filters.qianTime"-->
<!--            type="date"-->
<!--            placeholder="开始日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="" prop="sort">-->
<!--          <el-date-picker-->
<!--            v-model="filters.houTime"-->
<!--            type="date"-->
<!--            placeholder="结束日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <WaiXieTable :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage" @handleEditIt="handleEditIt" @handleEditOut="handleEditOut"@handleEdit="handleEdit"  @handleDelete="handleDelete">
    </WaiXieTable>
    <!--新增编辑界面-->
    <!-- 出库弹出界面   -->
    <el-dialog :title="operationStock?'入库':'出库'" width="40%" :visible.sync="editDialogVisibleIn" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="入库数量" prop="label">
          <el-input v-model="dataForm.intNumber" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!--  入库显示界面  -->
    <el-dialog :title="operationStock?'入库':'出库'" width="40%" :visible.sync="editDialogVisibleOut" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="出库数量" prop="label">
          <el-input v-model="dataForm.outNumber" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "../Core/KtButton";
  import { format } from "@/utils/datetime"
  import KfTable from "../Core/KfTable";
  import KfYTable from "../Core/KfYTable";
  import WaiXieTable from "../Core/WaiXieTable";
    export default {
        components:{
            KfYTable,
            KtButton,
          WaiXieTable
        },
        data() {
            return {
                size: 'small',
                filters: {
                    mould: ''
                },
                columns: [
                    {prop:"id", label:"ID", minWidth:50},
                     {prop:"mould", label:"模具名称", minWidth:220},
                  {prop:"number", label:"数量", minWidth:80},
                  {prop:"company", label:"单位", minWidth:80},
                  {prop:"price", label:"金额", minWidth:120},
                    {prop:"startDate", label:"出库时间", minWidth:100,formatter:this.dateFormat},
                  {prop:"endDate", label:"入库时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"outNumber", label:"出库数量", minWidth:120},
                    // {prop:"intNumber", label:"入库数量", minWidth:120},
                    // {prop:"type", label:"预警状态", minWidth:120},
                    {prop:"remarks", label:"备注", minWidth:120},
                    // {prop:"createBy", label:"创建人", minWidth:100},
                    // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
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
                    name: '',
                    number: '',
                    size: '',
                    price: '',
                    outNumber: 0,
                    intNumber: 0,
                    type: 0,
                    typeNumber: '',
                    state: '',
                    remarks: '',
                    invoice:''

                }
            }
        },
        methods: {
            // 获取分页数据
            findPage: function (data) {
                if(data !== null) {
                    this.pageRequest = data.pageRequest
                }
                this.pageRequest.columnFilters = {mould: {name:'mould', value:this.filters.mould}}
                this.$api.order.findAllw(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.dict.batchDelete(data.params).then(data!=null?data.callback:'')
            },
            // 显示新增界面
            handleAdd: function () {
                this.editDialogVisible = true
                this.operation = true
                this.dataForm = {
                    id: 0,
                    name: '',
                    number: '',
                    size: '',
                    price: '',
                    outNumber: 0,
                    intNumber: 0,
                    type: '',
                    typeNumber: '',
                    state: '',
                    remarks: '',
                    invoice:''
                }
            },
            //入库显示界面
            handleEditIt:function(params){
                this.editDialogVisibleIn = true
                this.operationStock = true
                this.dataForm = Object.assign({},params.row)
            },
            //出库
            handleEditOut:function(params){
                this.editDialogVisibleOut =true
                this.operationStock = false
                this.dataForm = Object.assign({}, params.row)

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
                            this.$api.material.save(params).then((res) => {
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
            // 时间格式化
            dateFormat: function (row, column, cellValue, index){
                return format(row[column.property])
            }
        },
        name: "WaiXie"
    }
</script>

<style scoped>

</style>
