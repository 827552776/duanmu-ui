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
					<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)" />
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
		<re-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete" :data="pageResult" :columns="filterColumns"
		 @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
		</re-table>
	</div>

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import ReTable from "@/views/Core/ReTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			ReTable,
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
					shuxing:'锻造',
					lotNo: '',
					cust: '',
					mouldNm: '',
					quantity: '',
					company: '',
					dispatchNo: '',
					buyMaterial: '',
					remarks: ''
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
				this.$api.order.findPageQuery(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},

			
			queryDispa(reg) {
				let params = Object.assign({}, reg)
				this.$api.order.queryDispa(params).then((res) => {
					if (res.code == 200) {
						this.dispa = res.data
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!' + response.data.msg
						});
					}
				})
			},
			handleEdit(params){
				window.open('http://123.56.123.34:8080/ugo/ureport/preview?_u=file:duanmu.ureport.xml' + '&id=' + params.row.id)
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
						label: "产品批号",
						minWidth: 100
					},
					{
						prop: "cust",
						label: "客户名称",
						minWidth: 100
					},
					{
						prop: "mouldNm",
						label: "模具名称",
						minWidth: 140
					},
// 					{
// 						prop: "buyMaterial",
// 						label: "模具号",
// 						minWidth: 80
// 					},
					{
						prop: "quantity",
						label: "数量",
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
						minWidth: 60
					},
// 					{
// 						prop: "sts",
// 						label: "订单状态",
// 						minWidth: 100
// 					},
					{
						prop: "remarks",
						label: "备注",
						minWidth: 150
					},
					// {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
					// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
					// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
				]
				this.filterColumns = JSON.parse(JSON.stringify(this.columns));
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
