<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.mName" placeholder="模具"></el-input>
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
    <ku-table :height="500" permsEdit="sys:dict:edit" permsDelete="sys:accessMaterial:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage"  @handleEditOut="handleEditOut" @handleEdit="handleEdit"  @handleDelete="handleDelete">
    </ku-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="30%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="材料名称" prop="label">
          <el-input v-model="dataForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="材质" prop="label">
          <el-input v-model="dataForm.texture" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="单位" prop="label">
          <el-input v-model="dataForm.company" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="模具名称" prop="label">
          <el-select v-model="dataForm.mName" placeholder="请输入关键字"   filterable
    remote :remote-method="remoteMethod" >
          	<el-option v-for="item in options4"  :key="item.value"
      :label="item.label"
      :value="item.value">
          	</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" prop="value">
          <el-input v-model="dataForm.intNumber" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="入库时间" prop="sort">
          <el-date-picker
            v-model="dataForm.intTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item label="外协单位" prop="type">-->
<!--          <el-input v-model="dataForm.waixie" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="外协时间" prop="sort">-->
<!--          <el-date-picker-->
<!--            v-model="dataForm.wxTime"-->
<!--            type="date"-->
<!--            placeholder="选择日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="外协入库时间" prop="sort">-->
<!--          <el-date-picker-->
<!--            v-model="dataForm.wxInt"-->
<!--            type="date"-->
<!--            placeholder="选择日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="外协数量 " prop="description">-->
<!--          <el-input v-model="dataForm.wxNumber" auto-complete="off" type="textarea"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="入库价格 " prop="description">
          <el-input v-model="dataForm.wxPrice" auto-complete="off" type="textarea"/>
        </el-form-item>
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
        <el-button :size="size" type="primary" @click.native="submitFormConfirm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import KtButton from "../Core/KtButton";
    import KtTable from "../Core/KtTable";
    import { format } from "@/utils/datetime"
    import KuTable from "../Core/KuTable";
    export default {
        components:{
            KtTable,
            KtButton,
            KuTable
        },
        data() {
            return {
                size: 'small',
                filters: {
                    name: '',
                    mName:''
                },
                columns: [
                    {prop:"id", label:"ID", minWidth:70},
                    {prop:"name", label:"材料名称", minWidth:100},
                    {prop:"company", label:"单位", minWidth:100},
                    {prop:"texture", label:"材质", minWidth:100},
                    {prop:"mName", label:"模具名称", minWidth:100},
                    {prop:"intTime", label:"入库时间", minWidth:100,formatter:this.dateFormat},
                    {prop:"intNumber", label:"入库数量", minWidth:120},
                    // {prop:"number", label:"模具自用数", minWidth:100},
                    // {prop:"trTime", label:"自用出库时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"waixie", label:"外协单位", minWidth:100},
                    // {prop:"wxTime", label:"外协时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"wxInt", label:"外协入库时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"wxNumber", label:"外协数量", minWidth:80},
                    {prop:"wxPrice", label:"入库价格", minWidth:120},
                    {prop:"type", label:"状态", minWidth:80},
                    {prop:"remarks", label:"工艺备注", minWidth:120},
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
				loading:false,
				selectInvTend: [],
				list:[],
				options4: [],
                // 新增编辑界面数据
                dataForm: {
                    id: 0,
                  company:'',
                  texture:'',
                    mName:'',
                    name: '',
                    intTime: '',
                    intNumber: '',
                    number: '',
                    trTime: '',
                    waixie: '',
                    wxTime:'',
                    type:2,
                    wxInt:'',
                    wxNumber:'',
                    wxPrice:'',
                    remarks:''
                }
            }
        },
		mounted() {
      this.getSelectInvTend()
    },
        methods: {
			remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }

    },
			getSelectInvTend(){
				this.$api.order.queryMoudles().then((res) => {
					if (res.code == 200) {
						this.selectInvTend = res.data
					} else {
						this.$message({
							type: 'error',
							message: '查询失败!' + response.data.msg
						});
					}
				})
			},
            // 获取分页数据
            findPage: function (data) {
                if(data !== null) {
                    this.pageRequest = data.pageRequest
                }
                this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name},mName: {name:'mName', value:this.filters.mName}}
                this.$api.accessMaterial.findPageA(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.accessMaterial.batchDelete(data.params).then(data!=null?data.callback:'')
            },
            // 显示新增界面
            handleAdd: function () {
                this.editDialogVisible = true

				this.list = this.selectInvTend.map(item => {
				  return { value: item, label: item };
				});
                this.operation = true
                this.dataForm = {
                    id: 0,
                    mName:'',
                    company:'',
                    texture:'',
                    name: '',
                    intTime: '',
                    intNumber: '',
                    number: '',
                    trTime: '',
                    waixie: '',
                    wxTime:'',
                    type:2,
                    wxInt:'',
                    wxNumber:'',
                    wxPrice:'',
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
                            this.$api.accessMaterial.save(params).then((res) => {
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
          submitFormAll: function () {
            this.$refs.dataForm.validate((valid) => {
              if (valid) {
                this.$confirm('确认入库？', '提示', {}).then(() => {
                  this.editLoading = true
                  let params = Object.assign({}, this.dataForm)
                  this.$api.accessMaterial.save(params).then((res) => {
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
                            this.$api.accessMaterial.saveConfirmInt(params).then((res) => {
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
        name: "AccessStock"
    }
</script>

<style scoped>

</style>
