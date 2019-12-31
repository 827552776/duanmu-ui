<template>
	<div>
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form :inline="true" :model="filters" :size="size">
				<el-form-item>
					<el-input v-model="filters.mouldNm" placeholder="模具名称"></el-input>
				</el-form-item>
				<el-form-item>
				</el-form-item>
				<el-button type="primary" icon="fa fa-search" size="mini" @click="findPage(null)">查询</el-button>
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
						<el-tooltip content="" placement="top">
							<el-button icon="fa fa-file-excel-o"></el-button>
						</el-tooltip>
						<el-tooltip content="" placement="top">
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
		<ch-table :height="350" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleEdit="handleEdit"
		 @split="split" @trans="trans">
		</ch-table>
		<el-dialog :title="'预估成本费用'" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :inline="true" :model="arr" label-position="right" label-width="90px" size="mini" ref="arr" :rules="sub1Rules">
				<el-form-item label="ID" v-if='false' prop="id">
					<el-input v-model="arr.id"></el-input>
				</el-form-item>
				<el-form-item label="FID" v-if='false' prop="fId">
					<el-input v-model="arr.fId"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="8">
						<el-form-item label="材料费:" prop="cai">
							<el-input v-model="arr.cai" style="width:150px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="焊材费:" prop="hanCai">
							<el-input v-model="arr.hanCai" style="width:150px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="热处理:" prop="reCh">
							<el-input v-model="arr.reCh" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="外委:" prop="waiWei">
							<el-input v-model="arr.waiWei" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="外购费:" prop="waiGou">
							<el-input v-model="arr.waiGou" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="运费:" prop="yunFei">
							<el-input v-model="arr.yunFei" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="工时费:" prop="gongShi">
							<el-input v-model="arr.gongShi" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="其他费用:" prop="others">
							<el-input v-model="arr.others" placeholder="" style="width:150px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6" :offset='2'>
						<el-form-item>
							<el-button type="success" size="mini" @click="save">保存</el-button>
							<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
							<!-- <el-button type="success" size="mini" @click="resetForm('refname')">清空</el-button> -->
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		<el-dialog :title="'部件拆分'" width="60%" :visible.sync="dialogVisible1" :close-on-click-modal="false" @close="restParts">
			<el-form :inline="true" :model="parts" label-position="right" label-width="80px" size="mini" ref="parts">
				<el-form-item label="ID" v-if='false' prop="id">
					<el-input v-model="parts.id"></el-input>
				</el-form-item>
				<el-form-item label="FID" v-if='false' prop="fId">
					<el-input v-model="parts.fId"></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="9">
						<el-form-item label="部件名称:" prop="name">
							<el-input v-model="parts.name" style="width:160px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="部件属性:" prop="attribute">
							<el-select v-model="parts.attribute" placeholder="请选择" style="width:160px;">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="部件数量:" prop="quantity" :rules="[{ type: 'number', message: '必须为数字值'}]">
							<el-input v-model.number="parts.quantity" style="width:160px;">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="9">
						<el-form-item label="部件规格:" prop="specs">
							<el-input v-model="parts.specs" style="width:160px;">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="部件型号:" prop="modle">
							<el-input v-model="parts.modle" placeholder="" style="width:160px"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="7">
						<el-form-item label="用途:" prop="ask">
							<el-input v-model="parts.ask" placeholder="" style="width:160px"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="9">
						<el-form-item label="是否外购:" prop="isBuy">
							<el-select v-model="parts.isBuy" placeholder="请选择" style="width:160px;" @change="change">
								<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7" >
						<el-form-item v-if="this.parts.isBuy =='是'" label="供应商:" prop="supplier">
							<el-select v-model="parts.supplier" placeholder="请选择" size="mini" clearable style="width:160px">
								<el-option v-for="item in selectInvTend" :key="item.cmName" :label="item.cmName" :value="item.cmName">
								</el-option>
							</el-select>
						</el-form-item>

					</el-col>
					<el-col :span="7" :offset="1">
						<el-form-item>
							<el-button type="success" size="mini" @click="saveSplit">保存</el-button>
							<el-button :size="size" @click.native="dialogVisible1 = false">{{$t('action.cancel')}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="tableData" style="width: 98%" @row-click = "deleteParts">
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column prop="name" label="部件名称" width="150"></el-table-column>
				<el-table-column prop="attribute" label="部件属性" width="150"></el-table-column>
				<el-table-column prop="quantity" label="部件数量" width="150"></el-table-column>
				<el-table-column prop="specs" label="部件规格" width="150"></el-table-column>
				<el-table-column prop="modle" label="部件型号" width="150"></el-table-column>
				<el-table-column prop="ask" label="用途" width="150"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import ChTable from "@/views/Core/ChTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			ChTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			var valiNumberPass1 = (rule, value, callback) => { //包含小数的数字
				let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
				if (!reg.test(value)) {
					callback(new Error('请输入数字'));
				} else {
					callback();
				}
			};
			return {
				sub1Rules: {

					hanCai: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
					cai: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
					reCh: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
					waiWei: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
					waiGou: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
					yunFei: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
					gongShi: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
					others: [{
						validator: valiNumberPass1,
						trigger: "blur"
					}],
				},
				selectInvTend: [],
				customerParam:{
					attribute:'供应商'
				},
				options: [{
					value: '通用件',
					label: '通用件'
				}, {
					value: '标准件',
					label: '标准件'
				},{
					value: '整体定制',
					label: '整体定制'
				}],
				options1: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],

				dynamicTags: [],
				inputVisible: false,
				inputValue: '',
				tableData: [],
				size: 'mini',
				filters: {
					mouldNm: ''
				},
				orderReg: {
					id: '',
					lotNo: '',
					custNm: '',
					mouldNm: '',
					quantity: '',
					company: '',
					dispatchNo: '',
					buyMaterial: '',
					remarks: ''
				},
				arr: {
					id: '',
					fId: '',
					hanCai: '',
					cai: '',
					reCh: '',
					waiWei: '',
					waiGou: '',
					yunFei: '',
					gongShi: '',
					others: ''
				},
				parts: {
					id: '',
					fId: '',
					name: '',
					attribute: '',
					quantity: '',
					specs: '',
					modle: '',
					ask: '',
					supplier:'',
					isBuy:'否',
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

			}
		},
		methods: {
			getSelectInvTend() {
				this.$api.customer.query(this.customerParam).then((res) => {
					this.selectInvTend = res.data
				})
			},
			change(val){
				if(val == '否'){
					this.parts.supplier = ''}
			},
			//查询部件信息
			queryParts() {
				this.$api.parts.queryParts(this.orderReg).then((res) => {
					this.tableData = res.data
				})
			},
			findPage: function(data) {
				if (data !== null) {
					this.pageRequest = data.pageRequest
				}
				this.pageRequest.columnFilters = {
					mouldNm: {
						name: 'mouldNm',
						value: this.filters.mouldNm
					}
				}
				this.$api.order.findPageAb(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},

			//保存预估成本费用
			save() {
				this.$confirm('是否执行本操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = Object.assign({}, this.arr)
					this.$api.check.save(params).then((res) => {
						if (res.code == 200) {
							//更改订单状态
							this.updateStsB()
						} else {
							this.$message({
								type: 'error',
								message: '删除失败!'
							});

						}

					})
				})
			},
			//保存分拆部件信息
			saveSplit() {
				this.$confirm('是否执行本操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = Object.assign({}, this.parts)
					this.$api.check.saveSplit(params).then((res) => {
						if (res.code == 200) {
							this.$message({
								message: '操作成功',
								type: 'success'
							})
							this.dialogVisible1 = false
							this.findPage(null)
						} else {
							this.$message({
								type: 'error',
								message: '删除失败!'
							});

						}

					})
				})
			},
			restParts(){
				this.$refs['parts'].resetFields()
			},
			//删除已拆部件
			deleteParts(row){
				this.$confirm('确定要删除该部件?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
				let part = Object.assign({},row)
				this.$api.parts.deleteParts(part).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.queryParts()
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!'
						});
				
					}
				
				})
				})
			},
			//更改订单状态，进入拆单环节
			updateStsB() {
				let params = Object.assign({}, this.orderReg)
				this.$api.order.updateSts(params).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.$refs['arr'].resetFields()
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
			//更改订单状态，进入生产环节
			updateStsC(params) {
				this.orderReg = Object.assign({}, params.row)

				this.$api.order.updateStsC(this.orderReg).then((res) => {
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
			trans(params) {
				this.$confirm('是否执行本操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.updateStsC(params)
				})
			},
			//显示拆单录入页面
			split: function(params) {
				this.dialogVisible1 = true
				this.orderReg = Object.assign({}, params.row)
				this.parts.fId = this.orderReg.id
				this.queryParts()
				this.getSelectInvTend()
			},
			// 显示费用预估界面
			handleEdit: function(params) {
				this.dialogVisible = true
				this.orderReg = Object.assign({}, params.row)
				this.arr.fId = this.orderReg.id
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
						minWidth: 80
					},
					{
						prop: "buyMaterial",
						label: "模具号",
						minWidth: 70
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
						prop: "remarks",
						label: "备注",
						minWidth: 180
					},
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
</style>
