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
		<fa-table :height="350" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleEdit="handleEdit"
		 @query="query">
		</fa-table>




		<el-dialog :title="operation?'新增':'运费录入'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :inline="true" :model="fare" label-position="right" label-width="90px" size="mini" ref="fare">
				<el-form-item label="ID" v-if="isShow" prop="id">
					<el-input v-model="fare.id"></el-input>
				</el-form-item>
				<el-form-item label="FID" v-if="isShow" prop="fId">
					<el-input v-model="fare.fId"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="7" >
						<el-form-item label="运费类型:" prop="fareType">
							<el-select v-model="fare.fareType" placeholder="请选择" style="width:130px;">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="9" >
						<el-form-item label="运费描述:" prop="descri">
							<el-input v-model="fare.descri" placeholder="" style="width:170px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7" >
						<el-form-item label="物流:" prop="logis">
							<el-select v-model="fare.logis" placeholder="请选择" size="mini" clearable style="width:103px">
								<el-option v-for="item in selectInvTend" :key="item.cmName" :label="item.cmName" :value="item.cmName">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="7" >
						<el-form-item label="具体费用:" prop="price" :rules="[{ type: 'number', message: '必须为数字值'}]">
							<el-input v-model.number="fare.price" placeholder="" style="width:130px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="9" >
						<el-form-item label="日期:" prop="delvDate">
							<el-date-picker style="width: 170px;" v-model="fare.delvDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7" :offset="1">
						<el-form-item>
							<el-button type="success" size="mini" @click="save">保存</el-button>
							<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<el-dialog title="该订单运费列表" :visible.sync="dialogTableVisible" @close="close">
			<el-table :data="gridData"  show-summary>
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column prop="fareType" label="运费类型" width="120"></el-table-column>
				<el-table-column prop="descri" label="运费描述" width="180"></el-table-column>
				<el-table-column prop="logis" label="物流" width="150"></el-table-column>
				<el-table-column prop="delvDate" label="日期" width="150"></el-table-column>
				<el-table-column prop="price" label="具体费用" width="120"></el-table-column>
			</el-table>
		</el-dialog>
	</div>

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import FaTable from "@/views/Core/FaTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			FaTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				size: 'mini',
				filters: {
					cust: '',
					mouldNm:''
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
					logis:'',
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
				customerParam:{
					attribute:'物流'
				}
			}
		},
		methods: {
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
					mouldNm:{
						name:  'mouldNm',
						value:this.filters.mouldNm
					}
				}
				this.$api.order.findPage(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},
			// 显示运费录入界面
			handleEdit: function(params) {
				this.dialogVisible = true
				this.operation = false
				this.orderReg = Object.assign({}, params.row)
				this.fare.fId = this.orderReg.id
				this.getSelectInvTend()

			},
			//查询运费信息
			query(params) {
				this.dialogTableVisible = true
				this.orderReg = Object.assign({}, params.row)
				this.fare.fId = this.orderReg.id
				let param = Object.assign({}, this.fare)
				this.$api.order.queryFare(param).then((res) => {
					this.gridData = res.data
				})
			},
			close(){
				this.gridData = []
			},
			//保存运费
			save() {
				this.$confirm('是否执行本操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = Object.assign({}, this.fare)
					this.$api.order.saveFare(params).then((res) => {
						if (res.code == 200) {
							this.$message({
								type: 'success',
								message: '保存成功!'
							});
							this.$refs['fare'].resetFields()
							this.dialogVisible = false
						} else {
							this.$message({
								type: 'error',
								message: '保存失败!' + response.data.msg
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
						prop: "buyMaterial",
						label: "模具号",
						minWidth: 80
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
					{
						prop: "sts",
						label: "订单状态",
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
