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
		<bz-table :height="350"  :data="pageResult" :columns="filterColumns"
		 @findPage="findPage" @split="split" @trans="trans" @helpShow="helpShow">
		</bz-table>

		<el-dialog :title="'流程控制'" width="50%" :visible.sync="dialogVisible1" :close-on-click-modal="false" :before-close="saveCraft">
			<div>
				<el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="true" :hit="true" @close="handleClose(tag)">
					{{tag}}
				</el-tag>
				<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" style="width: 80px;"
				 @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
				</el-input>
				<!-- <el-button v-else class="button-new-tag" size="small" @click="showInput"><i class="el-icon-circle-plus"></i></el-button> -->
			</div>
		</el-dialog>
			<el-dialog :title="'外协信息'" width="60%" :visible.sync="dialogVisible2" :close-on-click-modal="false" 
			:show-close="false">
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
						<el-form-item label="外协厂家:" prop="helpNm">
							<el-select v-model="help.helpNm" placeholder="请选择" style="width:160px;">
								<el-option v-for="item in selectInvTend" :key="item.cmName" :label="item.cmName" :value="item.cmName">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="开始时间:" prop="startDate">
							<el-date-picker style="width: 160px;" v-model="help.startDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="9">
						<el-form-item label="结束时间:" prop="endDate">
									<el-date-picker style="width: 160px;" v-model="help.endDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="价格:" prop="price" :rules="[{ type: 'number', message: '必须为数字值'}]">
							<el-input v-model.number="help.price" placeholder="" style="width:160px"></el-input>
						</el-form-item>
					</el-col>
			
					<el-col :span="7">
						<el-form-item label="外协备注:" prop="helpRemarks" >
							<el-input v-model="help.helpRemarks" placeholder="" style="width:160px"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
				
					<el-col :span="7" :offset="17">
						<el-form-item>
							<el-button type="success" size="mini" @click="saveHelp">保存</el-button>
							<el-button :size="size" @click="off">{{$t('action.cancel')}}</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="tableData" style="width: 98%" @row-click = "deleteParts">
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column prop="work" label="具体业务" width="140"></el-table-column>
				<el-table-column prop="helpNm" label="外协厂家" width="130"></el-table-column>
				<el-table-column prop="startDate" label="开始时间" width="130"  :formatter="dateFormat"></el-table-column>
				<el-table-column prop="endDate" label="结束时间" width="130"  :formatter="dateFormat"></el-table-column>
				<el-table-column prop="price" label="价格" width="80"></el-table-column>
				<el-table-column prop="helpRemarks" label="备注" width="120"></el-table-column>
				<el-table-column label="操作" width="100">
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
	import BzTable from "@/views/Core/BzTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			BzTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				dynamicTags: [],
				inputVisible: false,
				inputValue: '',
				tableData: [],
				size: 'mini',
				filters: {
					name: ''
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
				help: {
					id: '',
					fId: '',
					work: '',
					helpNm: '',
					startDate: '',
					endDate: '',
					price: '',
					helpRemarks: ''
				},
				parts: {
					id: '',
					fId: '',
					name: '',
					specs: '',
					modle: '',
					ask: '',
					inputValue: ''
				},
				dialogVisible1: false,
				dialogVisible2: false,
				columns: [],
				filterColumns: [],
				pageRequest: {
					pageNum: 1,
					pageSize: 5
				},
				pageResult: {},
				operation: false,
				editLoading: false,
				customerParam:{
					attribute:'外协厂家'
				},
				selectInvTend: []

			}
		},
		methods: {
			getSelectInvTend() {
					this.$api.customer.query(this.customerParam).then((res) => {
						this.selectInvTend = res.data
					})
			},
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			//更改生产状态，进入质检状态
			handleEdit(params){
				this.parts = Object.assign({}, params.row)
				this.$api.parts.updateStsC(this.parts).then((res) => {
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
				this.$api.parts.findPage1(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},
			//列出工艺流程
			queryTags() {

				this.$api.parts.queryTags(this.parts).then((res) => {
					var m = res.msg
					if (m == ""||m == null) {
						this.dynamicTags = []
					} else {
						this.dynamicTags = m.split(",")
					}

				})
			},
			//保存工艺编制
			saveCraft() {
					this.parts.inputValue = this.dynamicTags.join()
					let params = Object.assign({}, this.parts)
					this.$api.parts.saveCraft(params).then((res) => {
						if (res.code == 200) {
							this.dialogVisible1 = false
						} else {
							this.$message({
								type: 'error',
								message: '删除失败!'
							});

						}

					})
				
			},
				off(){
				 this.$refs['help'].resetFields()
				 this.dialogVisible2 = false
				},
				saveHelp(){
					this.$confirm('确定要保存外协信息吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.saveHel()
					})
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
				this.$api.help.queryHelp(this.parts).then((res) => {
					this.tableData = res.data
				})
			},
			edit(row){
				this.help = row
			},
			trans(params) {
				this.$confirm('确定要完成生产，进入质检程序?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.handleEdit(params)
				})
			},
			//显示工艺编制页面
			split: function(params) {
				this.dialogVisible1 = true
				this.parts = Object.assign({}, params.row)
				this.queryTags()
			},
				// 时间格式化
			dateFormat: function (row, column, cellValue, index){
			  return format(row[column.property])
			},
			//显示外协信息页面
			helpShow: function(params) {
				this.dialogVisible2 = true
				this.parts = Object.assign({}, params.row)
				this.help.fId = this.parts.id
				this.queryHelp()
				this.getSelectInvTend()
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
						label: "技术要求",
						minWidth: 100
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
