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
          <el-input v-model="filters.modeBy" placeholder="外售单位"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <kt-button icon="fa fa-plus" :label="$t('出库录入')" perms="sys:dict:add" type="primary" @click="handleAdd" />-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
    <!--表格内容栏-->
    <PtuWTable :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage"  @handleEditOut="handleEditOut" @handleEdit="handleEdit"  @handleDelete="handleDelete">
    </PtuWTable>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="dataForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="类型" prop="value">
          <el-input v-model="dataForm.type" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="细分" prop="type">
          <el-input v-model="dataForm.xiType" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="出库价格" prop="type">
          <el-input v-model="dataForm.price" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="外售单位" prop="type">
          <el-input v-model="dataForm.modeBy" auto-complete="off"/>
        </el-form-item>

<!--        <el-form-item label="领用类型">-->
<!--          <el-select v-model="dataForm.mode" auto-complete="off" placeholder="请选择">-->
<!--            <el-option label="借" value="借"/>-->
<!--            <el-option label="换" value="换"/>-->
<!--            <el-option label="领" value="领"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="出库时间" prop="sort">
          <el-date-picker
            v-model="dataForm.outTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item label="入库时间" prop="sort">-->
<!--          <el-date-picker-->
<!--            v-model="dataForm.intTime"-->
<!--            type="date"-->
<!--            placeholder="选择日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item label="出库数量 " prop="description">
          <el-input v-model="dataForm.outNumber" auto-complete="off" type="textarea"/>
        </el-form-item>
<!--        <el-form-item label="入库数量 " prop="description">-->
<!--          <el-input v-model="dataForm.number" auto-complete="off" type="textarea"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="确认" width="40%" :visible.sync="editDialogVisible1" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <h1>确认</h1>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible1 = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import KtButton from "../Core/KtButton";
    import { format } from "@/utils/datetime"
    import PtuWTable from "../Core/PtuWTable";
    export default {
        components:{
            KtButton,
            PtuWTable
        },
        data() {
            return {
                size: 'small',
                filters: {
                  name: '',
                  type:'',
                  xiType:'',
                  modeBy:''

                },
                columns: [
                    {prop:"id", label:"ID", minWidth:70},
                    {prop:"name", label:"名称", minWidth:100},
                    {prop:"type", label:"类型", minWidth:100},
                  {prop:"xiType", label:"细分", minWidth:100},
                  {prop:"price", label:"出库价格", minWidth:100},
                    {prop:"modeBy", label:"外售单位", minWidth:100},
                    // {prop:"mode", label:"领用方式", minWidth:100},
                    {prop:"outTime", label:"出库时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"intTime", label:"入库时间", minWidth:100,formatter:this.dateFormat},
                    {prop:"outNumber", label:"出库数量", minWidth:100},
                    // {prop:"number", label:"入库数量", minWidth:100},
                    {prop:"state", label:"状态", minWidth:80},
                    {prop:"remarks", label:"备注", minWidth:120},
                    {prop:"createBy", label:"创建人", minWidth:100},
                    {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
                    // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
                    // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
                ],
                pageRequest: { pageNum: 1, pageSize: 10 },
                pageResult: {},
                operation: false, // true:新增, false:编辑
                editDialogVisible: false, // 新增编辑界面是否显示
                editDialogVisible1: false, // 新增编辑界面是否显示
                editLoading: false,
                dataFormRules: {
                    trName: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                // 新增编辑界面数据
                dataForm: {
                    id: 0,
                    name: '',
                    type: '',
                  xiType:'',
                  price:'',
                    modeBy: '',
                    mode: '',
                    outTime: '',
                    intTime: '',
                    outNumber:'',
                    state:2,
                    number:'',
                    remarks:''
                }
            }
        },
        methods: {
            // 获取分页数据
            findPage: function (data) {
                if(data !== null) {
                    this.pageRequest = data.pageRequest
                }
                this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name},type: {name:'type', value:this.filters.type},xiType: {name:'xiType', value:this.filters.xiType},modeBy: {name:'modeBy', value:this.filters.modeBy}}
                this.$api.access.findPage1(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.access.batchDelete(data.params).then(data!=null?data.callback:'')
            },
            // 显示新增界面
            handleAdd: function () {
                this.editDialogVisible = true
                this.operation = true
                this.dataForm = {
                    id: 0,
                    name: '',
                    type: '',
                  xiType:'',
                  price:'',
                    modeBy: '',
                    mode: '',
                    outTime: '',
                    inTime: '',
                    outNumber:'',
                    state:2,
                    number:'',
                    remarks:''
                }
            },
            //确认
            handleEditOut: function (params) {
                this.editDialogVisible1 = true
                this.operation = false
                this.dataForm = Object.assign({}, params.row)
            },
            // 显示编辑界面
            handleEdit: function (params) {
                this.editDialogVisible = true
                this.dataForm = Object.assign({}, params.row)
            },
            // 编辑
            submitForm: function () {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            let params = Object.assign({}, this.dataForm)
                            this.$api.access.save(params).then((res) => {
                                if(res.code == 200) {
                                    this.$message({ message: '操作成功', type: 'success' })
                                } else {
                                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                                }
                                this.editLoading = false
                                this.$refs['dataForm'].resetFields()
                                this.editDialogVisible = false
                                this.findPage(null)
                            })
                        })
                    }
                })
            },
            // 编辑
            submitFormConfirm: function () {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            let params = Object.assign({}, this.dataForm)
                            this.$api.access.saveConfirmOut(params).then((res) => {
                                if(res.code == 200) {
                                    this.$message({ message: '操作成功', type: 'success' })
                                } else {
                                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                                }
                                this.editLoading = false
                                this.$refs['dataForm'].resetFields()
                                this.editDialogVisible1 = false
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
        name: "Access"
    }
</script>

<style scoped>

</style>
