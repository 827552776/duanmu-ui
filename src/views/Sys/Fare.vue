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
		 @query="query" @help="helpShow">
		</fa-table>




		<el-dialog :title="operation?'新增':'运费录入'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :inline="true" :model="fare" label-position="right" label-width="90px" size="mini" ref="fare">
				<el-form-item label="ID"  prop="id" v-if="isShow">
					<el-input v-model="fare.id"></el-input>
				</el-form-item>
				<el-form-item label="FID"  prop="fId" v-if="isShow">
					<el-input v-model="fare.fId"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="8">
						<el-form-item label="运费类型:" prop="fareType">
							<el-select v-model="fare.fareType" placeholder="请选择" style="width:130px;">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="9">
						<el-form-item label="运费描述:" prop="descri">
							<el-input v-model="fare.descri" placeholder="" style="width:170px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="物流:" prop="logis">
							<el-input v-model="fare.logis" placeholder="" style="width:103px"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="具体费用:" prop="price" :rules="[{ type: 'number', message: '必须为数字值'}]">
							<el-input v-model.number="fare.price" placeholder="" style="width:130px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="9">
						<el-form-item label="日期:" prop="delvDate">
							<el-date-picker style="width: 170px;" v-model="fare.delvDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item>
							<el-button type="success" size="mini" @click="save">保存</el-button>
							<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<el-dialog title="该订单运费列表" :visible.sync="dialogTableVisible" @close="close" width="57%">
			<el-tooltip content="导出" placement="top">
					<el-button icon="fa fa-file-excel-o" size="mini" @click="leading"> 导出excel</el-button>
				</el-tooltip>
			</el-button-group>
			<el-table :data="gridData" show-summary  @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="50" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column prop="fareType" label="运费类型" width="120"></el-table-column>
				<el-table-column prop="descri" label="运费描述" width="180"></el-table-column>
				<el-table-column prop="logis" label="物流" width="150"></el-table-column>
				<el-table-column prop="delvDate" label="日期" width="150" :dateFormat="yyyy-MM-dd" ></el-table-column>
				<el-table-column prop="price" label="具体费用" width="120">
					<template slot-scope="scope">
						<el-input v-model.number="scope.row.price"  placeholder="请输入价格" size="small"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini"  @click="handleClick(scope.row)">确认修改</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<el-dialog :title="'外协信息'" width="65%" :visible.sync="dialogVisible2" :close-on-click-modal="false" :show-close="false">
			<el-form :inline="true" :model="help" label-position="right" label-width="80px" size="mini" ref="help">
				<el-form-item label="ID" v-if='false' prop="id">
					<el-input v-model="help.id"></el-input>
				</el-form-item>
				<el-form-item label="FID" v-if='false' prop="fId">
					<el-input v-model="help.fId"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="9">
						<el-form-item label="具体业务:" prop="work">
							<el-input v-model="help.work" style="width:160px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="开始时间:" prop="startDate">
							<el-date-picker style="width: 160px;" v-model="help.startDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="结束时间:" prop="endDate">
							<el-date-picker style="width: 160px;" v-model="help.endDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
					</el-col>
					
				</el-row>
				<el-row>
					<el-col :span="9">
						<el-form-item label="数量:" prop="helpQuan">
							<el-input v-model="help.helpQuan" placeholder="" style="width:160px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="价格:" prop="price">
							<el-input v-model="help.price" placeholder="" style="width:160px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="付款时间:" prop="payDate">
							<el-date-picker style="width: 160px;" v-model="help.payDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
					</el-col>
		
					
				</el-row>
				<el-row>
					<el-col :span="9">
						<el-form-item label="外协厂家:" prop="helpNm">
							<el-select v-model="help.helpNm" placeholder="请选择" style="width:160px;">
								<el-option v-for="item in selectInvTend" :key="item.cmName" :label="item.cmName" :value="item.cmName">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="外协备注:" prop="helpRemarks">
							<el-input v-model="help.helpRemarks" placeholder="" style="width:160px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7" >
						<el-form-item>
							<el-button type="success" size="mini" @click="saveHelp">保存</el-button>
							<el-button :size="size" @click="off">{{$t('action.cancel')}}</el-button>
							<el-tooltip content="导出" placement="top">
									<el-button icon="fa fa-file-excel-o" size="mini" @click="daochu">导出excel</el-button>
								</el-tooltip>
							</el-button-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="tableData" style="width: 100%" @row-click="deleteParts" @selection-change="handleSelectionChange1">
				<el-table-column type="selection" width="50" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column prop="work" label="具体业务" width="100"></el-table-column>
				<el-table-column prop="helpQuan" label="数量" width="80"></el-table-column>
				<el-table-column prop="helpNm" label="外协厂家" width="120"></el-table-column>
				<el-table-column prop="startDate" label="开始时间" width="130" :dateFormat="yyyy-MM-dd"></el-table-column>
				<el-table-column prop="endDate" label="结束时间" width="130" :dateFormat="yyyy-MM-dd"></el-table-column>
				<el-table-column prop="price" label="价格" width="80"></el-table-column>
				<el-table-column prop="payDate" label="付款时间" width="130" :dateFormat="yyyy-MM-dd"></el-table-column>
				<el-table-column prop="helpRemarks" label="备注" width="120"></el-table-column>
				<el-table-column label="操作" width="80">
					<template slot-scope="scope">
						<el-button size="mini" type="success" @click="edit(scope.row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
		
		
		
		
		</el-dialog>
	</div>

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import FaTable from "@/views/Core/FaTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import Export2Excel from '../../excel/Export2Excel.js';
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
				multipleSelection: [],
				excelData: [],
				multipleSelection1: [],
				excelData1: [],
				size: 'mini',
				filters: {
					cust: '',
					mouldNm: ''
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
				dialogVisible2: false,
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
				help: {
					id: '',
					fId: '',
					work: '',
					helpNm: '',
					startDate: '',
					endDate: '',
					price: '',
					helpRemarks: '',
					payDate:'',
					helpQuan:''
				},
				core:{
					id:''
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
					attribute: '外协厂家'
				},
				
			}
		},
		methods: {
			//选择导出数据
			handleSelectionChange(val) {
				this.multipleSelection = val
			},
			leading(){
				if (this.multipleSelection.length == 0) {
					this.$alert('请选择要导出的信息', '提示', {
						confirmButtonText: '确定',
						callback: action => {}
					});
				} else {
					this.exportExcel()
				}
			},
			exportExcel() {
				const header = ["运费类型","运费描述","物流","日期","具体费用"] // 导出的表头名
				const filterVal = ["fareType", "descri", "logis", "delvDate", "price"]
				for (let i = 0; i < this.multipleSelection.length; i++) {
					this.excelData.push(this.multipleSelection[i]);
				}
				const list = this.excelData
				const data = this.formatJson(filterVal, list)
			
				const filename = '运费信息' + (new Date()).toLocaleDateString();
				Export2Excel.export_json_to_excel({
					header,
					data,
					filename
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
			//选择导出数据
			handleSelectionChange1(val) {
				this.multipleSelection1 = val
			},
			daochu(){
				if (this.multipleSelection1.length == 0) {
					this.$alert('请选择要导出的信息', '提示', {
						confirmButtonText: '确定',
						callback: action => {}
					});
				} else {
					this.exportExcel1()
				}
			},
			exportExcel1() {
				const header = ["具体业务","数量","外协厂家","开始时间","结束时间","价格","付款时间","备注"] // 导出的表头名
				const filterVal = ["work", "helpQuan", "helpNm", "startDate", "endDate","price","payDate","helpRemarks"]
				for (let i = 0; i < this.multipleSelection1.length; i++) {
					this.excelData1.push(this.multipleSelection1[i]);
				}
				const list = this.excelData1
				const data = this.formatJson1(filterVal, list)
			
				const filename = '外协信息' + (new Date()).toLocaleDateString();
				Export2Excel.export_json_to_excel({
					header,
					data,
					filename
				})
			},
			formatJson1(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
			handleClick(row) {
				this.$confirm('是否执行本操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.fare.id = row.id
					this.fare.fId = row.fId
					this.fare.fareType = row.fareType
					this.fare.descri = row.descri
					this.fare.logis = row.logis
					this.fare.price = row.price
					this.fare.delvDate = row.delvDate
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
			//显示外协信息页面
			helpShow: function(params) {
				this.dialogVisible2 = true
			    this.core = Object.assign({}, params.row)
				this.help.fId = this.core.id
				this.help.id = null
				this.queryHelp()
				this.getSelectInvTend()
			},
			//外协信息保存按钮
			saveHelp() {
				this.$confirm('确定要保存外协信息吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.saveHel()
				})
			},
			//外协信息取消按钮
			off() {
				this.$refs['help'].resetFields()
				this.tableData = []
				this.dialogVisible2 = false
			},
			//保存外协信息
			saveHel() {
				let params = Object.assign({}, this.help)
				this.$api.help.saveHelp(params).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.$refs['help'].resetFields()
						this.tableData = []
						this.dialogVisible2 = false
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!'
						});

					}

				})

			},
			//查询外协信息
			queryHelp() {
				this.$api.help.queryHelp(this.core).then((res) => {
					this.tableData = res.data
				})
			},
			edit(row) {
				this.help = row
			},
			// 时间格式化
			dateFormat: function (row, column, cellValue, index){
			  return format(row[column.property])
			},
			//获取外协厂家
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
				this.fare.id == null
				

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
			close() {
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
						minWidth: 100
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
		},
		mounted() {
			this.initColumns()
		}

	}
</script>

<style scoped>

</style>
