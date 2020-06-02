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
		<re-table :height="350" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleEdit="handleEdit">
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
					mouldNm: '',
          lotNo: '',
          qianTime: '',
          houTime: ''
				},
				columns: [],
				filterColumns: [],
				pageRequest: {
					pageNum: 1,
					pageSize: 5
				},
				pageResult: {},
				dialogVisible: false,
				dialogTableVisible: false,
				operation: false,
				editLoading: false,
				dataFormRules: {
					name: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}]
				},
				options: [{
					value: '派工拉货',
					label: '派工拉货'
				}, {
					value: '外协',
					label: '外协'
				}, {
					value: '采购',
					label: '采购'
				}, {
					value: '其他',
					label: '其他'
				}],
				fare: {
					id: '',
					fId: '',
					fareType: '',
					descri: '',
					logis: '',
					price: '',
					delvDate: ''
				},
				orderReg: {
					id: '',
					lotNo: '',
					cust: '',
					mouldNm: '',
					quantity: '',
					company: '',
					dispatchNo: '',
					buyMaterial: '',
					remarks: ''
				},
				isShow: false,
				gridData: [],
				selectInvTend: [],
				customerParam: {
					attribute: '物流'
				}
			}
		},
		methods: {
			handleEdit: function(params) {
				window.open('http://123.56.123.34:8080/ugo/ureport/preview?_u=file:URforkitty.ureport.xml' + '&id=' + params.row.id)
				},
			// 时间格式化
			dateFormat: function (row, column, cellValue, index){
			  return format(row[column.property])
			},
			getSelectInvTend() {
				this.$api.customer.query(this.customerParam).then((res) => {
					this.selectInvTend = res.data
				})
			},
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
					},
          lotNo: {
            name: 'lotNo',
            value: this.filters.lotNo
          },
          qianTime: {
            name: 'qianTime',
            value: this.filters.qianTime
          },
          houTime: {
            name: 'houTime',
            value: this.filters.houTime
          }
				}
				this.$api.order.findPage(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},
			close() {
				this.gridData = []
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
						minWidth: 120
					},
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
// 					{
// 						prop: "sts",
// 						label: "订单状态",
// 						minWidth: 100
// 					},
					{
						prop: "shuxing",
						label: "属性",
						minWidth: 100
					},
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
		},
		mounted() {
			this.initColumns()
		}

	}
</script>

<style scoped>

</style>
