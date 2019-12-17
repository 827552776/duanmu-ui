<template>
	<div class="page-container">
		<!--工具栏-->
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form :inline="true" :model="filters" :size="size">
				<el-form-item>
					<el-input v-model="filters.cmName" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)" />
				</el-form-item>
				<el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('新增')" perms="sys:dict:add" type="primary" @click="handleAdd" />
				</el-form-item>
			</el-form>
		</div>
		<!--表格内容栏-->
		<kr-table :height="350" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete" :data="pageResult" :columns="columns"
		 @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
		</kr-table>
		<!--新增编辑界面-->
		<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
			<el-form :inline="true" :model="dataForm" label-width="80px" label-position="right" :rules="dataFormRules" ref="dataForm" :size="size">
				<el-form-item label="ID" prop="id" v-if="false">
					<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="关系属性" prop="attribute" >
							<el-select v-model="dataForm.attribute" placeholder="请选择" style="width: 180px;">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="公司名称" prop="cmName" >
								<el-input v-model="dataForm.cmName" auto-complete="off" style="width: 180px;"></el-input>
							</el-form-item>
						</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="公司地址" prop="cmAddress" >
							<el-input v-model="dataForm.cmAddress" auto-complete="off" style="width: 180px;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系人" prop="cmContacts" >
							<el-input v-model="dataForm.cmContacts" auto-complete="off" style="width: 180px;"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="cnPhone" >
							<el-input v-model="dataForm.cmPhone" auto-complete="off" style="width: 180px;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
					<el-form-item label="备注 " prop="cmRemarks" >
						<el-input v-model="dataForm.cmRemarks" auto-complete="off" style="width: 180px;"></el-input>
					</el-form-item>
					</el-col>
				</el-row>
				
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
				<el-button :size="size" type="primary" @click.native="submitForm" >{{$t('action.submit')}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>


<script>
	import KtTable from "@/views/Core/KtTable"
	import KrTable from "../Core/KrTable";
	import KtButton from "@/views/Core/KtButton"
	import {
		format
	} from "@/utils/datetime"

	export default {
		components: {
			KrTable,
			KtButton
		},
		data() {
			return {
				size: 'small',
				filters: {
					cmName: ''
				},
				options: [{
					value: '客户',
					label: '客户'
				}, {
					value: '外协厂家',
					label: '外协厂家'
				}, {
					value: '供应商',
					label: '供应商'
				}, {
					value: '物流',
					label: '物流'
				}],
				columns: [
					{
						prop: "attribute",
						label: "关系属性",
						minWidth: 80
					},
					{
						prop: "cmName",
						label: "公司名称",
						minWidth: 100
					},
					{
						prop: "cmAddress",
						label: "公司地址",
						minWidth: 150
					},
					{
						prop: "cmContacts",
						label: "联系人",
						minWidth: 100
					},
					{
						prop: "cmPhone",
						label: "电话",
						minWidth: 100
					},
					{
						prop: "cmRemarks",
						label: "备注",
						minWidth: 150
					},
					
					// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
					// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
				],
				pageRequest: {
					pageNum: 1,
					pageSize: 10
				},
				pageResult: {},

				operation: false, // true:新增, false:编辑
				editDialogVisible: false, // 新增编辑界面是否显示
				editLoading: false,
				dataFormRules: {
					label: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}]
				},
				
				// 新增编辑界面数据
				dataForm: {
					id: '',
					attribute: '',
					cmName: '',
					cmAddress: '',
					cmContacts: '',
					cmPhone: '',
					cmRemarks: '',
					attribute: ''
				}
			}
		},
		methods: {
			
			// 获取分页数据
			findPage: function(data) {
				if (data !== null) {
					this.pageRequest = data.pageRequest
				}
				this.pageRequest.columnFilters = {
					cmName: {
						name: 'cmName',
						value: this.filters.cmName
					}
				}
				this.$api.customer.findPage(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},
			// 批量删除
			handleDelete: function(data) {
				this.$api.customer.deleteCustomer(data.params).then(data != null ? data.callback : '')
			},
			// 显示新增界面
			handleAdd: function() {
				this.editDialogVisible = true
				this.operation = true
			
			},
			// 显示编辑界面
			handleEdit: function(params) {
				this.editDialogVisible = true
				this.operation = false
				this.dataForm = Object.assign({}, params.row)
			},
			// 编辑
			submitForm: function() {
				if(this.dataForm.cmName==''){
					alert('公司名称 不能为空！！')
					return
				}
				this.$refs.dataForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true
							let params = Object.assign({}, this.dataForm)
							this.$api.customer.save(params).then((res) => {
								if (res.code == 200) {
									this.$message({
										message: '操作成功',
										type: 'success'
									})
								} else {
									this.$message({
										message: '操作失败, ' + res.msg,
										type: 'error'
									})
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
			// 时间格式化
			dateFormat: function(row, column, cellValue, index) {
				return format(row[column.property])
			}
		},
		name: "Customer"
	}
</script>

<style scoped>

</style>
