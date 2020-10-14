<template>
	<div>
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form :inline="true" :model="filters" :size="size">
				<el-form-item>
					<el-input v-model="filters.cust" placeholder="客户名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.mouldNm" placeholder="模具名称"></el-input>
				</el-form-item>
				<el-form-item>
					<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:user:view" type="primary" @click="findPage(null)" />
				</el-form-item>
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
		<gs-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete" :data="pageResult" :columns="filterColumns"
		 @findPage="findPage" @handleEdit="handleEdit" @kaipiao="kaipiao" @handleDelete="handleDelete">
		</gs-table>
		<el-dialog :title="'请输入工时费用'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false">
			<el-form :inline="true" :model="orderReg" label-position="right" label-width="100px" size="mini" ref="orderReg">
				<el-form-item label="ID" v-if="isShow" prop="id">
					<el-input v-model="orderReg.id"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="工时费:" prop="gongshi">
							<el-input style="width: 160px;" v-model="orderReg.gongshi " >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7" :offset="16">
						<el-form-item>
							<el-button type="success" size="mini" @click="save">保存</el-button>
							<el-button :size="size" @click="off">{{$t('action.cancel')}}</el-button>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>


				</el-row>
			</el-form>
		</el-dialog>
	</div>

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import GsTable from "@/views/Core/GsTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			GsTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				size: 'mini',
				filters: {
					cust: '',
					mouldNm: ''
				},
				columns: [],
				filterColumns: [],
				pageRequest: {
					pageNum: 1,
					pageSize: 10
				},
				pageResult: {},
				dialogVisible: false,
				operation: false,
				editLoading: false,
				dataFormRules: {
					name: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}]
				},
				orderReg: {
					id: '',
					shuxing:'',
					lotNo: '',
					cust: '',
					mouldNm: '',
					wareDate:'',
					wareNum:'',
					quantity: '',
					company: '',
					dispatchNo: '',
					// buyMaterial: '',
					remarks: '',
					kaipiaoTime:'',
					billNo:'',
					gongshi:0
				},
				dispa: {
					id: '',
					fId: '',
					dispatchNo: '',
					dispaNo: '',
					category: '',
					supplier: '',
					contractNo: '',
					dispaMakeTime: '',
					useUnit: '',
					productNo: '',
					markNo: '',
					frockNo: '',
					frockNm: '',
					units: '',
					dispaQuantity: '',
					dispaContent: '',
					dispaBasis: '',
					delvDate: '',
					techCon: '',
					quality: '',
					price: '',
					mouldQuota: '',
					completeQuan: '',
					dispaRemarks: ''
				},
				activeName: 'first',
				isShow: false,
				selectInvTend: [],
				customerParam: {
					attribute: '客户'
				}
			}
		},
		methods: {
			findPage: function(data) {
				if (data !== null) {
					this.pageRequest = data.pageRequest
				}
				this.pageRequest.columnFilters = {
					cust: {
						name: 'cust',
						value: this.filters.cust
					},
					mouldNm: {
						name: 'mouldNm',
						value: this.filters.mouldNm
					}
				}
				this.$api.order.findPage(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},


			off(){
				this.dialogVisible = false
			},
			//保存订单
			save() {
				this.$confirm('是否执行本操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = Object.assign({}, this.orderReg)
					this.$api.order.save(params).then((res) => {
						if (res.code == 200) {
							this.dialogVisible = false
							this.findPage(null)
						} else {
							this.$message({
								type: 'error',
								message: '删除失败!' + response.data.msg
							});

						}

					})
				})


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
										prop: "lotNo",
										label: "批号",
										minWidth: 80
									},
									{
										prop: "cust",
										label: "客户",
										minWidth: 80
									},
									{
										prop: "mouldNm",
										label: "模具名称",
										minWidth: 100
									},
				// 					{
				// 						prop: "buyMaterial",
				// 						label: "模具号",
				// 						minWidth: 80
				// 					},
									{
										prop: "quantity",
										label: "派工数量",
										minWidth: 80
									},

									{
										prop: "company",
										label: "单位",
										minWidth: 80
									},
									{
										prop: "dispatchNo",
										label: "派工号",
										minWidth: 100
									},
									{
										prop: "shuxing",
										label: "属性",
										minWidth: 80
									},

									{
										prop: "remarks",
										label: "备注",
										minWidth: 80
									},
									{
										prop: "gongshi",
										label: "工时费",
										minWidth: 80
									},
									// {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
									// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
									// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
								]
				this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			},
			//显示录入工时费
			handleEdit:function(params){
				this.dialogVisible = true
				this.orderReg = Object.assign({}, params.row)
				},
			// 时间格式化
			dateFormat: function(row, column, cellValue, index) {
				return format(row[column.property])
			},
			getSelectInvTend() {
				this.$api.customer.query(this.customerParam).then((res) => {
					this.selectInvTend = res.data
				})
			}
		},
		mounted() {
			this.initColumns()
		}

	}
</script>

<style scoped>

</style>
