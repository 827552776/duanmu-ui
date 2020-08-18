<template>
  <div>
    <el-tooltip content="导出" placement="top">
      <el-button icon="fa fa-file-excel-o" @click="leading"> 导出excel</el-button>
    </el-tooltip>
    <!--表格栏-->
    <el-table :data="data.content" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange"
          @current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')" :border="border" :stripe="stripe"
          :show-overflow-tooltip="showOverflowTooltip" :max-height="maxHeight" :height="height" :size="size" :align="align" style="width:100%;" :row-dblclick="handleEdit">
    <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column>
      <el-table-column type="index" width="40" ></el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center" show-overflow-tooltip	="true"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
        :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable">
      </el-table-column>
      <el-table-column :label="$t('action.operation')" width="185" fixed="right" v-if="showOperation" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button  size="mini"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button  size="mini"  @click="kaipiao(scope.$index, scope.row)">开票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">

      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="data.totalSize" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import Export2Excel from "../../excel/Export2Excel";
export default {
  name: 'KtTable',
  components:{
			KtButton
	},
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String,  // 编辑权限标识
    permsDelete: String,  // 删除权限标识
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
    align: {  // 文本对齐方式
      type: String,
      default: 'left'
    },
    maxHeight: {  // 表格最大高度
      type: Number,
      default: 5020
    },
    height: {  // 表格最大高度
      type: Number,
      default: 5020
    },
    showOperation: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    border: {  // 是否显示边框
      type: Boolean,
      default: false
    },
    stripe: {  // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {  // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {  // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {  // 是否显示操作组件
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      multipleSelection: [],
      excelData: [],
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 200
      },
      loading: false,  // 加载标识
      selections: []  // 列表选中列
    }
  },
  methods: {
    //选择导出数据
    selectionChange(val) {
      this.multipleSelection = val
    },
    leading() {
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
      const header = ["批号", "客户", "模具名称", "派工数量", "入库单号", "入库数量", "入库时间", "出库数量",
        "出库时间", "单位", "派工号", "属性", "开票时间", "发票号", "备注"] // 导出的表头名
      const filterVal = ["lotNo", "cust", "mouldNm", "quantity", "wareNo", "wareNum", "wareDate", "outNum",
        "outDate", "company", "dispatchNo", "shuxing", "kaipiaoTime", "billNo", "remarks"]
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.excelData.push(this.multipleSelection[i]);
      }
      const list = this.excelData
      const data = this.formatJson(filterVal, list)

      const filename = '已完成模具' + (new Date()).toLocaleDateString();
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
    // 分页查询
    findPage: function () {
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 选择切换
    // selectionChange: function (selections) {
    //   this.selections = selections
    //   this.$emit('selectionChange', {selections:selections})
    // },
    // 选择切换
    handleCurrentChange: function (val) {
      this.$emit('handleCurrentChange', {val:val})
    },
    // 换页刷新
		refreshPageRequest: function (pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 编辑
		handleEdit: function (index, row) {
      this.$emit('handleEdit', {index:index, row:row})
		},
		kaipiao: function (index, row) {
		this.$emit('kaipiao', {index:index, row:row})
				},
    // 删除
		handleDelete: function (index, row) {
			this.delete(row.id)
		},
		// 批量删除
		handleBatchDelete: function () {
			let ids = this.selections.map(item => item.id).toString()
			this.delete(ids)
		},
		// 删除操作
		delete: function (ids) {
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				let params = []
				let idArray = (ids+'').split(',')
				for(var i=0; i<idArray.length; i++) {
					params.push({'id':idArray[i]})
        }
        this.loading = true
        let callback = res => {
          if(res.code == 200) {
            this.$message({message: '删除成功', type: 'success'})
            this.findPage()
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
          this.loading = false
        }
        this.$emit('handleDelete', {params:params, callback:callback})
			}).catch(() => {
			})
		}
  },
  mounted() {
    this.refreshPageRequest(1)
  }
}
</script>

<style scoped>

</style>
