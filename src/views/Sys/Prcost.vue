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
		<rp-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete" :data="pageResult" :columns="filterColumns"
		 @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @xiangQing="xiangQing">
		</rp-table>
		<el-dialog :title="'模具详情'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false" >
			<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="焊材" name="first">
		<el-table :data="hanCai" style="width: 100%" >
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="name" label="焊材名称" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="model" label="型号" width="100">
			</el-table-column>
			<el-table-column prop="company" label="单位" width="100">
			</el-table-column>
			<el-table-column prop="number" label="领用数量" width="100">
			</el-table-column>
			<el-table-column prop="reNumber" label="退回数量" width="100">
			</el-table-column>
			<el-table-column prop="price" label="单价"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sumPrice" label="总价"  show-overflow-tooltip>
			</el-table-column>
		</el-table>
	</el-tab-pane>
    <el-tab-pane label="材料" name="second">
		<el-table :data="caiLiao" style="width: 100%" >
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="name" label="材料名称" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="texture" label="材质" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="company" label="单位" width="150">
			</el-table-column>
			<el-table-column prop="number" label="数量" width="150">
			</el-table-column>
			<el-table-column prop="price" label="单价"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sumPrice" label="总价"  show-overflow-tooltip>
			</el-table-column>
		</el-table>
	</el-tab-pane>
    <el-tab-pane label="模具外协" name="third">
		<el-table :data="moudelWaixie" style="width: 100%" >
			<el-table-column prop="work" label="具体业务" width="100" show-overflow-tooltip></el-table-column>
			<el-table-column prop="helpQuan" label="数量" width="80"></el-table-column>
			<el-table-column prop="helpNm" label="外协厂家" width="120" show-overflow-tooltip></el-table-column>
			<el-table-column prop="startDate" label="开始时间" width="130" :dateFormat="yyyy-MM-dd"></el-table-column>
			<el-table-column prop="endDate" label="结束时间" width="130" :dateFormat="yyyy-MM-dd"></el-table-column>
			<el-table-column prop="price" label="价格" width="80"></el-table-column>
			<el-table-column prop="payDate" label="付款时间" width="130" :dateFormat="yyyy-MM-dd"></el-table-column>
		</el-table>
	</el-tab-pane>
    <el-tab-pane label="材料外协" name="fourth">
		<el-table :data="caiLiaoWaixie" style="width: 100%">
			<el-table-column prop="name" label="材料名称" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="company" label="单位" width="80">
			</el-table-column>
			<el-table-column prop="wxNumber" label="数量" width="60">
			</el-table-column>
			<el-table-column prop="wxPrice" label="单价"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sumPrice" label="总价"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="waixie" label="外协厂家" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="wxTime" label="外协出库" width="120" :dateFormat="yyyy-MM-dd">
			</el-table-column>
			<el-table-column prop="wxInt" label="外协入库" width="120" :dateFormat="yyyy-MM-dd">
			</el-table-column>
		</el-table>
	</el-tab-pane>
	<el-tab-pane label="外购" name="fiveth">
		<el-table :data="waiGou" style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="name" label="标件名称" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="specs" label="规格" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="modle" label="型号" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="quantity" label="数量" width="80" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="partPrice" label="总价"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="supplier" label="供应商" width="120" show-overflow-tooltip>
			</el-table-column>
		</el-table>
	</el-tab-pane>
	<el-tab-pane label="运费" name="sixth">
		<el-table :data="yunFei" >
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="fareType" label="运费类型" width="120" show-overflow-tooltip></el-table-column>
			<el-table-column prop="descri" label="运费描述" width="140" show-overflow-tooltip></el-table-column>
			<el-table-column prop="logis" label="物流" width="140" show-overflow-tooltip></el-table-column>
			<el-table-column prop="delvDate" label="日期" width="150" :dateFormat="yyyy-MM-dd" ></el-table-column>
			<el-table-column prop="price" label="具体费用" width="120" show-overflow-tooltip>
			</el-table-column>
		</el-table>
	</el-tab-pane>
	<el-tab-pane label="返工费" name="seventh">
		<el-table :data="fanXiu">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="craft" label="返修工艺" width="120" show-overflow-tooltip></el-table-column>
			<el-table-column prop="unquCause" label="返修原因" width="140" show-overflow-tooltip></el-table-column>
			<el-table-column prop="liable" label="责任人" width="140"></el-table-column>
			<el-table-column prop="createTime" label="日期" width="150" :dateFormat="yyyy-MM-dd" ></el-table-column>
			<el-table-column prop="price" label="返修成本" width="120">
			</el-table-column>
		</el-table>
	</el-tab-pane>
  </el-tabs>
		</el-dialog>
	</div>

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import RpTable from "@/views/Core/RpTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			RpTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				fanXiu:[],
				yunFei:[],
				waiGou:[],
				caiLiaoWaixie:[],
				moudelWaixie:[],
				hanCai:[],
				caiLiao:[],
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
				activeName:'first',
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
			//成本核算报表
			handleEdit(params){
				window.open('http://123.56.123.34:8080/ugo/ureport/preview?_u=file:duanmu.ureport.xml' + '&id=' + params.row.id)
			},
			//详情
			xiangQing:function(params){
				this.dialogVisible = true
				this.orderReg = Object.assign({}, params.row)
				this.queryHanCai()
				this.queryCaiLiao()
				this.queryClwx()
				this.queryMwx()
				this.queryWaiGou()
				this.queryYunFei()
				this.queryFanXiu()
				},
			queryHanCai() {
				 this.$api.weldingInt.queryTogeter(this.orderReg).then((res) => {
					this.hanCai = res.data
				})
			},
			queryCaiLiao() {
				 this.$api.material.queryTogeter(this.orderReg).then((res) => {
					this.caiLiao = res.data
				})
			},
			queryClwx(){
				  this.$api.accessMaterial.queryTogeter(this.orderReg).then((res) => {
				 	this.caiLiaoWaixie = res.data
				 })
			},
			queryMwx(){
				  this.$api.help.queryTogeter(this.orderReg).then((res) => {
				 	this.moudelWaixie = res.data
				 })
			},
			queryWaiGou(){
				  this.$api.parts.queryTogeter(this.orderReg).then((res) => {
				 	this.waiGou = res.data
				 })
			},
			queryYunFei(){
				  this.$api.order.queryTogeter(this.orderReg).then((res) => {
				 	this.yunFei = res.data
				 })
			},
			queryFanXiu(){
				  this.$api.unqu.queryTogeter(this.orderReg).then((res) => {
				 	this.fanXiu = res.data
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
