<template>
	<div>
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
			<el-form :inline="true" :model="filters" :size="size">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="部件名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.mouldNm" placeholder="模具名称"></el-input>
				</el-form-item>
				<el-button type="primary" icon="fa fa-search" size="mini" @click="findPage(null)">查询</el-button>
			</el-form>
		</div>
		<div class="toolbar" style="float:left;padding-top:10px;padding-left:25px;">
			<el-form :inline="true" :size="size">
				<el-form-item>
					<el-button-group>
						<el-tooltip content="刷新" placement="top">
							<el-button icon="fa fa-refresh" @click="findPage(null)"></el-button>
						</el-tooltip>
						<el-tooltip content="导出" placement="top">
							<el-button icon="fa fa-file-excel-o" size="mini" @click="leading"> 导出excel</el-button>
						</el-tooltip>
					</el-button-group>
				</el-form-item>
			</el-form>
			<!--表格显示列界面-->
			<table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" @handleFilterColumns="handleFilterColumns">
			</table-column-filter-dialog>
		</div>
		<!--表格内容栏-->
		<!-- 	<pp-table :height="350" :data="pageResult" :columns="filterColumns" @findPage="findPage">
		</pp-table> -->
		<el-table :data="pageResult" style="width: 100%" :row-dblclick="selectCraft" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="50" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="cust" label="客户名称" width="120">
			</el-table-column>
			<el-table-column prop="lotNo" label="批号" width="120">
			</el-table-column>
			<el-table-column prop="dispatchNo" label="派工号" width="150">
			</el-table-column>
			<el-table-column prop="name" label="部件名称" width="120">
			</el-table-column>
			<el-table-column prop="modle" label="部件型号" width="150">
			</el-table-column>
			<el-table-column prop="st" label="生产进程" width="150">
			</el-table-column>
			<el-table-column prop="flow" label="工艺编制"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="inputValue" label="工艺进程"  show-overflow-tooltip>
			</el-table-column>
		</el-table>

		<el-dialog :title="''" width="50%" :visible.sync="dialogVisible1" :close-on-click-modal="false">
		</el-dialog>
	</div>
</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput"
	import PpTable from "@/views/Core/PpTable"
	import KtButton from "@/views/Core/KtButton"
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
	import Export2Excel from '../../excel/Export2Excel.js';
	import {
		format
	} from "@/utils/datetime"
	export default {
		components: {
			PopupTreeInput,
			PpTable,
			KtButton,
			TableColumnFilterDialog
		},
		data() {
			return {
				multipleSelection: [],
				excelData: [],
				tableData: [],
				size: 'mini',
				filters: {
					name: '',
					mouldNm: ''
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
				pageResult: [],
				operation: false,
				editLoading: false,

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
				const header = ["模具名称", "模具号", "派工号", "部件名称", "部件型号", "生产进程", "工艺编制", "工艺进程"] // 导出的表头名
				const filterVal = ["mouldNm", "buyMaterial", "dispatchNo", "name", "modle", "st", "flow","inputValue"]
				for (let i = 0; i < this.multipleSelection.length; i++) {
					this.excelData.push(this.multipleSelection[i]);
				}
				const list = this.excelData
				const data = this.formatJson(filterVal, list)
			
				const filename = '生产进程' + (new Date()).toLocaleDateString();
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
			//已购，更改生产状态，进入质检状态
			isok(params) {
				this.parts = Object.assign({}, params.row)
				this.$api.parts.updateStsB(this.parts).then((res) => {
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
			findPage: function() {
				let params = Object.assign({}, this.filters)
				this.$api.parts.findPagePp(params).then((res) => {
					this.pageResult = res.data
				}).then(data != null ? data.callback : '')
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
						prop: "mouldNm",
						label: "模具名称",
						minWidth: 120
					},
					{
						prop: "buyMaterial",
						label: "模具号",
						minWidth: 80
					}, {
						prop: "dispatchNo",
						label: "派工号",
						minWidth: 100
					}, {
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
						prop: "sts",
						label: "生产进程",
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
			this.findPage()
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
