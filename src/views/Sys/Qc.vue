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
		<qc-table :height="350"  :data="pageResult" :columns="filterColumns"
		 @findPage="findPage" @isok="isok" @again="again" @retrn="retrn">
		</qc-table>

		<el-dialog :title="'不合格标件退回'" width="30%" :visible.sync="dialogVisible1" :close-on-click-modal="false">
			 <div style="text-align: left;">需要退回的不合格标件数量：</div>
			  <el-input-number v-model="num" :min="1"  ></el-input-number>
			  <el-row>
			  	<el-col :span="8" :offset="17">
			  			<el-button type="success" size="mini" @click="fixRetrn">确定</el-button>
			  			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			  	</el-col>
			  </el-row>
		</el-dialog>
	</div>
</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import QcTable from "@/views/Core/QcTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			QcTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				num:'',
				jisuan:'',
				tableData: [],
				size: 'mini',
				filters: {
					name: ''
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
			isok(params){
				this.parts = Object.assign({},params.row)
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
			fixRetrn(){
				this.jisuan = this.parts.quantity - this.num
			    this.parts.quantity	= this.num
				this.$api.parts.fixRetrn(this.parts).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.fix()
					} else {
						this.$message({
							type: 'error',
							message: '删除失败!'
						});
				
					}
				
				})
				},
				fix(){
				    this.parts.quantity	= this.jisuan
					this.$api.parts.fix(this.parts).then((res) => {
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
					},
			//更改生产状态,不合格通件返工
			handleEdit(params){
				this.parts = Object.assign({}, params.row)
				this.$api.parts.updateStsA(this.parts).then((res) => {
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
				this.$api.parts.findPageQc(this.pageRequest).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
			},
			
			
			again(params) {
				this.$confirm('确定要重新排产?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.handleEdit(params)
				})
			},
			retrn(params) {
				this.dialogVisible1 = true
				this.parts = Object.assign({}, params.row)
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
						prop: "quantity",
						label: "数量",
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
					{
						prop: "attribute",
						label: "部件属性",
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
