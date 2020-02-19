<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-date-picker-->
<!--            v-model="filters.intTime"-->
<!--            type="date"-->
<!--            placeholder="入库时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-date-picker-->
<!--            v-model="filters.endDate"-->
<!--            type="date"-->
<!--            placeholder="选择日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <kt-button icon="fa fa-plus" :label="$t('出库录入')" perms="sys:dict:add" type="primary" @click="handleAdd" />-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <kt-button icon="fa fa-plus" :label="$t('出库录入')" perms="sys:dict:add" type="primary" @click="handleAdd" />-->
<!--        </el-form-item>-->
      </el-form>
    </div>
    <!--表格内容栏-->
    <HanCaiIntTable :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage"  @handleEditOut="handleEditOut" @handleEdit="handleEdit"  @handleDelete="handleDelete">
    </HanCaiIntTable>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="80%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="5">
            <el-form-item label="材料名称" prop="label">
              <el-input v-model="dataForm.name" auto-complete="off"/>
              </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="来源" prop="label">
              <el-input v-model="dataForm.source " auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="单位" prop="value">
              <el-input v-model="dataForm.company " auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--    出库时显示        -->
            <el-form-item label="型号" prop="type">
              <el-input v-model="dataForm.model " auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="价格" prop="type">
              <el-input v-model="dataForm.price " auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="入库时间" prop="sort">
              <el-date-picker
                v-model="dataForm.intTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="入库数量" prop="value">
              <el-input v-model="dataForm.number " auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--    出库时显示        -->
            <el-form-item label="备注" prop="type">
              <el-input v-model="dataForm.remarks " auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>

<!--        <el-form-item label="模具名称" prop="label">-->
<!--           <el-select v-model="dataForm.mName" placeholder="请输入关键字"   filterable-->
<!--          remote :remote-method="remoteMethod" style="width:510px">-->
<!--                	<el-option v-for="item in options4"  :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--                	</el-option>-->
<!--                </el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="确认" width="40%" :visible.sync="editDialogVisible1" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
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
    import { format } from "@/utils/datetime"
    import HanCaiIntTable from "../Core/HanCaiIntTable";
    export default {
        components:{
            KtButton,
          HanCaiIntTable
        },
        data() {
            return {
                size: 'small',
                filters: {
                    name: '',
                  intTime:'',
                  endDate:''
                },
                columns: [
                    {prop:"id", label:"ID", minWidth:70},
                    {prop:"name", label:"焊材名称", minWidth:100},
                    // {prop:"deTime", label:"销售出库时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"deCompany", label:"出售单位", minWidth:100},
                    {prop:"source", label:"来源", minWidth:100},
                    {prop:"model", label:"型号", minWidth:100},
                    // {prop:"deNumber", label:"出售数量", minWidth:100},
                    {prop:"company", label:"单位", minWidth:100},
                    {prop:"price", label:"价格", minWidth:100},
                    {prop:"intTime", label:"入库时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"outTime", label:"出库时间", minWidth:100,formatter:this.dateFormat},
                    // {prop:"intNumber", label:"入库数量", minWidth:100},
                    // {prop:"reNumber", label:"领用数", minWidth:100},
                    {prop:"number", label:"入库数量", minWidth:100},
                    // {prop:"sNumber", label:"入库数量", minWidth:100},
                    {prop:"type", label:"状态", minWidth:100},
                    // {prop:"mouldName", label:"模具数量", minWidth:100},
                    // {prop:"zu", label:"班组", minWidth:100},
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
				loading:false,
				selectInvTend: [],
				list:[],
				options4: [],
                // 新增编辑界面数据
                dataForm: {
                  id: 0,
                  name: '',
                  deTime :'',
                  deCompany: '',
                  source: '',
                  model:'',
                  deNumber: '',
                  company: '',
                  price: '',
                  intTime:'',
                  outTime:'',
                  reNumber:'',
                  number:'',
                  sNumber:'',
                  type: 0,
                  mouldName:'',
                  zu:'',
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
                this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
                this.$api.weldingInt.findPage(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.weldingInt.batchDelete(data.params).then(data!=null?data.callback:'')
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
                  name: '',
                  deTime :'',
                  deCompany: '',
                  source: '',
                  model:'',
                  deNumber: '',
                  company: '',
                  price: '',
                  intTime:'',
                  outTime:'',
                  reNumber:'',
                  number:'',
                  sNumber:'',
                  type: 0,
                  mouldName:'',
                  zu:'',
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
                            this.$api.weldingInt.save(params).then((res) => {
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
                            this.$api.accessMaterial.saveConfirm(params).then((res) => {
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
        name: "WeldingInt"
    }
</script>

<style scoped>

</style>
