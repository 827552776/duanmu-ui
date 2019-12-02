<template>
	<div>
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form :inline="true" :model="filters" :size="size">
				 <el-form-item>
					<el-input v-model="filters.dispatchNo" placeholder="派工单号"></el-input>
				</el-form-item> 
				<el-form-item>
					<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
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
			<table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns"
				@handleFilterColumns="handleFilterColumns">
			</table-column-filter-dialog>
		</div>
		<!--表格内容栏-->
		<kt-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete"
			:data="pageResult" :columns="filterColumns"
			@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
		</kt-table>
		
		
		
		
		<el-dialog :title="operation?'新增':'编辑'" width="90%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :inline="true" :model="orderReg" label-position="right" label-width="80px" size="mini" ref="orderReg" >
			<el-form-item label="ID" v-if="isShow" prop="id">
				<el-input v-model="orderReg.id"></el-input>
			</el-form-item>
			<el-row>
				<el-col :span="4">
					<el-form-item label="产品批号:" prop="lotNo">
						<el-input v-model="orderReg.lotNo" style="width:150px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="客户名称:" prop="custNm">
						<el-input v-model="orderReg.custNm" style="width:150px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="模具名称:" prop="mouldNm">
						<el-input v-model="orderReg.mouldNm" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
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
				<el-col :span="4">
					<el-form-item label="派工号:" prop="dispatchNo">
						<el-input v-model="orderReg.dispatchNo" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="购置新料:" prop="buyMaterial">
						<el-input v-model="orderReg.buyMaterial" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="备注:" prop="remarks">
						<el-input v-model="orderReg.remarks" type="textarea" autosize style="width:455px"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="5">
					<el-form-item>
						<el-button type="success" size="mini" @click="save">保存</el-button>
						<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
						<!-- <el-button type="success" size="mini" @click="resetForm('refname')">清空</el-button> -->
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
					<el-row>
						<el-col :span="4">
							<el-form-item label="派工单号:" prop="dispatchNo">
								<el-input v-model="dispa.dispatchNo" style="width:150px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="派工号:" prop="dispaNo">
								<el-input v-model="dispa.dispaNo" style="width:150px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="工装类别:" prop="category">
								<el-input v-model="dispa.category" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="供应商:" prop="supplier">
								<el-input v-model="dispa.supplier" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="合同号:" prop="conrtactNo">
								<el-input v-model="dispa.contractNo" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4">
							<el-form-item label="制单时间:" prop="dispaMakeTime">
								<el-date-picker style="width: 140px;" v-model="dispa.dispaMakeTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="使用单位:" prop="useUnit">
								<el-input v-model="dispa.useUnit" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="产品编号及名称:" label-width="115px" prop="productNo">
								<el-input v-model="dispa.productNo" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
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
						<el-col :span="4">
							<el-form-item label="工装名称:" prop="frockNm">
								<el-input v-model="dispa.frockNm" style="width:150px"></el-input>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="计量单位:" prop="units">
								<el-input v-model="dispa.units" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="派工数量:" prop="dispaQuantity">
								<el-input v-model="dispa.dispaQuantity" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
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
						<el-col :span="4">
							<el-form-item label="交付日期:" prop="delvDate">
								<el-date-picker style="width: 140px;" v-model="dispa.delvDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="技术条件:" prop="techCon">
								<el-input v-model="dispa.techCon" placeholder="" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="质量要求:" prop="quality">
								<el-input v-model="dispa.quality" placeholder="" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
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
						<el-col :span="4">
							<el-form-item label="完成数量:" prop="completeQuan">
								<el-input v-model="dispa.completeQuan" placeholder="" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="10">
							<el-form-item label="派工单备注:" label-width="100px" prop="dispaRemarks">
								<el-input v-model="dispa.dispaRemarks" type="textarea" autosize style="width:455px"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="附件" name="second">上传附件</el-tab-pane>
		</el-tabs>
		</el-dialog>
	</div>

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import KtTable from "@/views/Core/KtTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import { format } from "@/utils/datetime"
	export default {
		components:{
			PopupTreeInput,
			KtTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				size: 'mini',
				filters: {
					lotNo: '',
					custNm:'',
					dispatchNo:''
				},
				columns: [],
				filterColumns: [],
				pageRequest: { pageNum: 1, pageSize: 5 },
				pageResult: {},
				dialogVisible: false,
				operation:false,
				editLoading: false,
				dataFormRules: {
					name: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					]
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
				dispa: {
					id: '',
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

			}
		},
		methods: {
			// 批量删除
			handleDelete: function (data) {
				this.$api.order.deleteOrd(data.params).then(data!=null?data.callback:'')
			},
			findPage: function (data) {
				if(data !== null) {
					this.pageRequest = data.pageRequest
				}
				this.pageRequest.columnFilters = {dispatchNo:{name:'dispatchNo',value:this.filters.dispatchNo}}
				this.$api.order.findPage(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data!=null?data.callback:'')
			},
			// 显示编辑界面
			handleEdit: function (params) {
				this.dialogVisible = true
				this.operation = false
				this.orderReg = Object.assign({}, params.row)
			},
			// 显示新增界面
			handleAdd: function () {
				this.dialogVisible = true
				this.operation = true
				this.orderReg = {
					id: '',
					lotNo: '',
					custNm: '',
					mouldNm: '',
					quantity: '',
					company: '',
					dispatchNo: '',
					buyMaterial: '',
					remarks: ''
				}
			},
			//保存按钮
			saveButton() {
				if (this.orderReg.dispatchNo === '') {
					alert('派工单号不能为空')
				} else if(this.dispa.dispatchNo === ''){
					alert('派工单号不能为空')	
					}else{ this.save()
				}
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
						this.$refs['orderReg'].resetFields()
						this.$refs['dispa'].resetFields()
						
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!' + response.data.msg
						});

					}

				})
			},
			// 处理表格列过滤显示
			      	displayFilterColumnsDialog: function () {
						this.$refs.tableColumnFilterDialog.setDialogVisible(true)
			      	},
			// 处理表格列过滤显示
			      	handleFilterColumns: function (data) {
						this.filterColumns = data.filterColumns
						this.$refs.tableColumnFilterDialog.setDialogVisible(false)
			      	},
			// 处理表格列过滤显示
			      	initColumns: function () {
						this.columns = [
							{prop:"lotNo", label:"产品批号", minWidth:100},                             
							{prop:"custNm", label:"客户名称", minWidth:100},
							{prop:"mouldNm", label:"模具名称", minWidth:80},
							{prop:"quantity", label:"数量", minWidth:80},
							{prop:"company", label:"单位", minWidth:80},
							{prop:"dispatchNo", label:"派工单号", minWidth:100},
							{prop:"buyMaterial", label:"购置新料", minWidth:70},
							 {prop:"remarks", label:"备注", minWidth:180},
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

<style scoped>

</style>
