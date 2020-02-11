<template>
	<div>
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form :inline="true" :model="filters" :size="size">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="部件名称"></el-input>
				</el-form-item>
				<el-form-item>
				</el-form-item>
				<el-button type="primary" icon="fa fa-search" size="mini" @click="findPage(null)">查询</el-button>
				<el-button type="primary" icon="fa fa-plus" size="mini" @click="addPurch">新增临时采购</el-button>
			</el-form>
		</div>
		<div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
			<el-form :inline="true" :size="size">
				<el-form-item>
					<el-button-group>
						<el-tooltip content="刷新" placement="top">
							<el-button icon="fa fa-refresh" @click="findPage(null)"></el-button>
						</el-tooltip>
						<el-tooltip content="列显示" placement="top">
							<el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
						</el-tooltip>
						<el-tooltip content="导出" placement="top">
							<el-button icon="fa fa-file-excel-o"></el-button>
						</el-tooltip>
						<el-tooltip content="导入" placement="top">
							<el-button icon="fa fa-file-excel-o"></el-button>
						</el-tooltip>
					</el-button-group>
				</el-form-item>
			</el-form>
			<!--表格显示列界面-->
			<table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" @handleFilterColumns="handleFilterColumns">
			</table-column-filter-dialog>
		</div>
		<!--表格内容栏-->
		<pr-table :height="350" :data="pageResult" :columns="filterColumns" @findPage="findPage" @isok="isok" @again="again" @print="print">
		</pr-table>
		<el-dialog :title="'价格'" width="20%" :visible.sync="dialogVisible1" :close-on-click-modal="false">
			<div>请输入价格：<input v-model="parts.partPrice"  style="width: 100px;"></input>
			<el-button type="success" size="mini" @click="isok1">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog :title="新增临时采购计划" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="close">
			<el-form :inline="true" :model="parts" label-position="right" label-width="90px" size="mini" ref="parts">
				<el-form-item label="ID" v-if="isShow" prop="id">
					<el-input v-model="purch.id"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="11">
						<el-form-item label="名称:" prop="name">
							<el-input v-model="parts.name" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="型号:" prop="modle">
							<el-input v-model="parts.modle" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="规格:" prop="specs">
							<el-input v-model="parts.specs" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="数量:" prop="quantity">
							<el-input v-model="parts.quantity" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="用途:" prop="ask">
							<el-input v-model="parts.ask" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="供应商:" prop="supplier">
							<el-input v-model="parts.supplier" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="申请人:" prop="applicant">
							<el-input v-model="parts.applicant" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="部门:" prop="dept">
							<el-select v-model="parts.dept" placeholder="请选择" size="mini" clearable style="width:150px">
								<el-option v-for="item in selectInvTend" :key="item.name" :label="item.name" :value="item.name">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="预算:" prop="budget">
							<el-input v-model="parts.budget" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="备注:" prop="remarks">
							<el-input v-model="parts.remarks" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7" :offset="15">
						<el-form-item>
							<el-button type="success" size="mini" @click="savePurch">保存</el-button>
							<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import PrTable from "@/views/Core/PrTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			PrTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				tableData: [],
				size: 'mini',
				filters: {
					name: ''
				},
				parts: {
					id: '',
					name: '',
					specs: '',
					modle: '',
					ask: '',
					supplier: '',
					quantity: '',
					applicant: '',
					dept: '',
					budget: '',
					partPrice:0,
					remarks: ''
				},
				dialogVisible: false,
				dialogVisible1: false,
				columns: [],
				filterColumns: [],
				pageRequest: {
					pageNum: 1,
					pageSize: 5
				},
				pageResult: {},
				operation: false,
				editLoading: false,
				selectInvTend: []
			}
		},
		methods: {
			getSelectInvTend() {
					this.$api.dept.findDeptTree().then((res) => {
						this.selectInvTend = res.data
					})
			},
			close(){
				this.parts.id = '',
				this.parts.name = '',
				this.parts.specs = '',
				this.parts.modle = '',
				this.parts.ask =  '',
				this.parts.supplier = '',
				this.parts.quantity = '',
				this.parts.budget = '',
				this.parts.remarks = '',
				this.parts.partPrice = 0
			},
			addPurch() {
				this.dialogVisible = true
				this.getSelectInvTend()
			},
			//保存临时采购计划
			savePurch() {
				this.$api.parts.savePurch(this.parts).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.dialogVisible = false
						this.findPage(null)
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!'
						});

					}

				})
			},
			isok(params){
				this.dialogVisible1 = true
				this.parts = Object.assign({}, params.row)
			},
			print(params){
				window.open('http://123.56.123.34:80/ugo/ureport/preview?_u=file:caigouList.ureport.xml' + '&id=' + params.row.id)
			},
			//已购，更改生产状态，进入质检状态
			isok1() {
				
				this.$api.parts.updateStsC(this.parts).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.findPage(null)
						this.close()
						this.dialogVisible1 = false
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!'
						});

					}

				})
			},
			//开始定制，更改状态
			again(params) {
				this.parts = Object.assign({}, params.row)
				this.$api.parts.updateStsB(this.parts).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.findPage(null)
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!'
						});

					}

				})
			},
			//分页条件查询部件信息
			findPage: function(data) {
				if (data !== null) {
					this.pageRequest = data.pageRequest
				}
				this.pageRequest.columnFilters = {
					name: {
						name: 'name',
						value: this.filters.name
					}
				}
				this.$api.parts.findPagePr(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},
			// 处理表格列过滤显示
			displayFilterColumnsDialog: function() {
				this.$refs.tableColumnFilterDialog.setDialogVisible(true)
			},
			// 处理表格列过滤显示
			handleFilterColumns: function(data) {
				this.filterColumns = data.filterColumns
				this.$refs.tableColumnFilterDialog.setDialogVisible(false)
			},
			// 处理表格列过滤显示
			initColumns: function() {
				this.columns = [{
						prop: "name",
						label: "部件名称",
						minWidth: 100
					},
					{
						prop: "attribute",
						label: "部件属性",
						minWidth: 100
					},
					{
						prop: "quantity",
						label: "数量",
						minWidth: 100
					},
					{
						prop: "specs",
						label: "部件规格",
						minWidth: 100
					},
					{
						prop: "modle",
						label: "部件型号",
						minWidth: 100
					},
					{
						prop: "ask",
						label: "用途",
						minWidth: 100
					},
					{
						prop: "supplier",
						label: "供应商",
						minWidth: 100
					},
					{
						prop: "temPurch",
						label: "临时采购",
						minWidth: 80
					}
					
					// {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
					// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
					// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
				]
				this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			}
		},
		mounted() {
			this.initColumns()
		}

	}
</script>

<style>
	.el-tag+.el-tag {
		margin-left: 10px;
	}

	/* .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  } */
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>
