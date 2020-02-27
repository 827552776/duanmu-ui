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
				<el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
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
		<or-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete" :data="pageResult" :columns="filterColumns"
		 @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @Warehous="Warehous">
		</or-table>




		<el-dialog :title="operation?'新增':'编辑'" width="100%" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :inline="true" :model="orderReg" label-position="right" label-width="80px" size="mini" ref="orderReg">
				<el-form-item label="ID" prop="id" v-if="isShow">
					<el-input v-model="orderReg.id"></el-input>
				</el-form-item>
				<el-form-item label="属性" prop="shuxing" v-if="isShow">
					<el-input v-model="orderReg.shuxing"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="5">
						<el-form-item label="产品批号:" prop="lotNo">
							<el-input v-model="orderReg.lotNo" style="width:150px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="客户名称:" prop="cust">
							<el-select v-model="orderReg.cust" placeholder="请选择" size="mini" clearable style="width:150px;">
								<el-option v-for="item in selectInvTend" :key="item.cmName" :label="item.cmName" :value="item.cmName">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="派工号:" prop="dispatchNo">
							<el-input v-model="orderReg.dispatchNo" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="数量:" prop="quantity">
							<el-input v-model="orderReg.quantity" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="单位:" prop="company">
							<el-input v-model="orderReg.company" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="5">

						<el-form-item label="模具名称:" prop="mouldNm">
							<el-input v-model="orderReg.mouldNm" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="4">
						<el-form-item label="模具号:" prop="buyMaterial">
							<el-input v-model="orderReg.buyMaterial" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col> -->
					<el-col :span="8">
						<el-form-item label="备注:" prop="remarks">
							<el-input v-model="orderReg.remarks" type="textarea" autosize style="width:380px"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="4">
						<el-form-item>
							<el-button type="success" size="mini" @click="saveButton">保存</el-button>
							<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
							<el-button type="danger" size="mini" @click="reset">清空全部</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-tabs v-model="activeName">
				<el-tab-pane label="派工单" name="first">
					<el-form :inline="true" :model="dispa" label-position="right" label-width="80px" size="mini" ref="dispa">
						<el-form-item label="ID" prop="id" v-if="isShow">
							<el-input v-model="dispa.id"></el-input>
						</el-form-item>
						<el-form-item label="FID" prop="fId" v-if="isShow">
							<el-input v-model="dispa.fId"></el-input>
						</el-form-item>
						<el-row>
							<el-col :span="5">
								<el-form-item label="派工单号:" prop="dispatchNo">
									<el-input v-model="dispa.dispatchNo" style="width:150px;">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="派工号:" prop="dispaNo">
									<el-input v-model="dispa.dispaNo" style="width:150px;" @change="change">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="工装类别:" prop="category">
									<el-input v-model="dispa.category" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="供应商:" prop="supplier">
									<el-input v-model="dispa.supplier" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="合同号:" prop="contractNo">
									<el-input v-model="dispa.contractNo" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="5">
								<el-form-item label="制单时间:" prop="dispaMakeTime">
									<el-date-picker style="width: 140px;" v-model="dispa.dispaMakeTime" type="date" placeholder="选择日期"
									 value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="使用单位:" prop="useUnit">
									<el-input v-model="dispa.useUnit" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="产品名称:" prop="productNo">
									<el-input v-model="dispa.productNo" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="标识号:" prop="markNo">
									<el-input v-model="dispa.markNo" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="工装编号:" prop="frockNo">
									<el-input v-model="dispa.frockNo" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="5">
								<el-form-item label="工装名称:" prop="frockNm">
									<el-input v-model="dispa.frockNm" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="计量单位:" prop="units">
									<el-input v-model="dispa.units" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="派工数量:" prop="dispaQuantity">
									<el-input v-model="dispa.dispaQuantity" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="派工内容:" prop="dispaContent">
									<el-input v-model="dispa.dispaContent" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="派工依据:" prop="dispaBasis">
									<el-input v-model="dispa.dispaBasis" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="5">
								<el-form-item label="交付日期:" prop="delvDate">
									<el-date-picker style="width: 140px;" v-model="dispa.delvDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="技术条件:" prop="techCon">
									<el-input v-model="dispa.techCon" placeholder="" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="质量要求:" prop="quality">
									<el-input v-model="dispa.quality" placeholder="" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="单价(元):" prop="price">
									<el-input v-model="dispa.price" placeholder="" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="模具定额:" prop="mouldQuota">
									<el-input v-model="dispa.mouldQuota" placeholder="" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="5">
								<el-form-item label="完成数量:" prop="completeQuan">
									<el-input v-model="dispa.completeQuan" placeholder="" style="width:150px"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="派工单备注:" label-width="100px" prop="dispaRemarks">
									<el-input v-model="dispa.dispaRemarks" type="textarea" autosize style="width:380px"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-tab-pane>
				<!-- <el-tab-pane label="附件" name="second">上传附件</el-tab-pane> -->
			</el-tabs>
		</el-dialog>
		<el-dialog :title="'输入入库信息'" width="40%" :visible.sync="dialogVisible1" :close-on-click-modal="false" :show-close="false">
			<el-form :inline="true" :model="ware" label-position="right" label-width="100px" size="mini" ref="ware">
				<el-form-item label="ID" v-if="isShow" prop="id">
					<el-input v-model="ware.id"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="入库时间:" prop="wareDate">
							<el-date-picker style="width: 160px;" v-model="ware.wareDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="总入库数量:" prop="wareNum" :rules="[{ type: 'number', message: '必须为数字值'}]">
							<el-input v-model.number="ware.wareNum" @blur="xianzhi" style="width:120px"></el-input>
						</el-form-item>
					</el-col>
		
				</el-row>
				<el-row>
		
					<el-col :span="7" :offset="16">
						<el-form-item>
							<el-button type="success" size="mini" @click="saveWare">保存</el-button>
							<el-button :size="size" @click="off">{{$t('action.cancel')}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</div>

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import OrTable from "@/views/Core/OrTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			OrTable,
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
				dialogVisible1:false,
				operation: false,
				editLoading: false,
				dataFormRules: {
					name: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}]
				},
				ware:{
					id:'',
					wareDate:'',
					wareNum:'',
					quantity:''
				},
				orderReg: {
					id: '',
					shuxing:'铸造',
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
			xianzhi(){
				if(this.ware.wareNum > this.ware.quantity){
					alert('入库数量不能大于派工数量')
				}
				return
			},
			change(val) {
				if (val != this.orderReg.dispatchNo) {
					alert('两个派工号必须一致！！')
				}
			},
			// 批量删除
			handleDelete: function(data) {
				this.$api.order.deleteOrd(data.params).then(data != null ? data.callback : '')
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
				this.$api.order.findPage1(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},//显示入库确认界面
			Warehous:function(params){
				this.dialogVisible1 = true
				this.ware = Object.assign({}, params.row)
			},
			off(){
				this.$refs['ware'].resetFields()
				this.dialogVisible1 = false
			},
			saveWare(){
				this.$confirm('是否执行本操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = Object.assign({}, this.ware)
					this.$api.order.saveWare(params).then((res) => {
						if (res.code == 200) {
							this.$refs['ware'].resetFields()
							this.dialogVisible1 = false
							this.findPage(null)
							this.$message({
								message: '操作成功',
								type: 'success'
							})
						} else {
							this.$message({
								type: 'error',
								message: '删除失败!' + response.data.msg
							});
				
						}
				
					})
				})
			},
			// 显示编辑界面
			handleEdit: function(params) {
				this.dialogVisible = true
				this.operation = false
				this.orderReg = Object.assign({}, params.row)
				let reg = this.orderReg
				this.queryDispa(reg)
			},
			// 显示新增界面
			handleAdd: function() {
				this.dialogVisible = true
				this.operation = true
				this.getSelectInvTend()
				// 				this.orderReg = {
				// 					id: '',
				// 					lotNo: '',
				// 					custNm: '',
				// 					mouldNm: '',
				// 					quantity: '',
				// 					company: '',
				// 					dispatchNo: '',
				// 					buyMaterial: '',
				// 					remarks: ''
				// 				}
			},
			//保存按钮
			saveButton() {
				if (this.orderReg.id == '' || this.orderReg.id == null) {
					this.getId()
				}
				this.save()

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
							this.saveDispa()
						} else {
							this.$message({
								type: 'error',
								message: '删除失败!' + response.data.msg
							});

						}

					})
				})


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
			getId() {
				this.$api.order.queryPrimaryKey().then((res) => {
					this.orderReg.id = res.msg
					this.dispa.fId = res.msg
				})

			},
			//保存派工单
			saveDispa() {
				let params = Object.assign({}, this.dispa)
				this.$api.order.saveDispa(params).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.dialogVisible = false
						this.findPage(null)
						this.orderReg.id = '',
							this.orderReg.mouldNm = '',
							this.orderReg.buyMaterial = '',
							this.orderReg.quantity = '',
							this.orderReg.company = '',
							this.orderReg.remarks = '',
							this.dispa.id = '',
							this.dispa.fId = '',
							this.dispa.productNo = '',
							this.dispa.markNo = '',
							this.dispa.frockNo = '',
							this.dispa.frockNm = '',
							this.dispa.units = '',
							this.dispa.dispaQuantity = '',
							this.dispa.dispaContent = '',
							this.dispa.dispaBasis = '',
							this.dispa.techCon = '',
							this.dispa.quality = '',
							this.dispa.price = '',
							this.dispa.mouldQuota = '',
							this.dispa.completeQuan = '',
							this.dispa.dispaRemarks = ''
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!' + response.data.msg
						});

					}

				})
			},
			reset() {
				this.$refs['orderReg'].resetFields()
				this.$refs['dispa'].resetFields()
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
										minWidth: 80
									},
									{
										prop: "cust",
										label: "客户名称",
										minWidth: 80
									},
									{
										prop: "mouldNm",
										label: "模具名称",
										minWidth: 120
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
										prop: "wareNum",
										label: "入库数量",
										minWidth: 80
									},
									{
										prop: "wareDate",
										label: "入库时间",
										minWidth: 100,
										formatter:this.dateFormat
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
				// 					{
				// 						prop: "sts",
				// 						label: "订单状态",
				// 						minWidth: 100
				// 					},
									{
										prop: "remarks",
										label: "备注",
										minWidth: 120
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
