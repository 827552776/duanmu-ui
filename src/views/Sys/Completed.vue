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
        <el-form-item label="" prop="sort">
          <el-date-picker
            v-model="filters.qianTime"
            type="date"
            placeholder="入库日期（前）">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="sort">
          <el-date-picker
            v-model="filters.houTime"
            type="date"
            placeholder="入库日期（后）">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:user:view" type="primary" @click="findPage(null)" />
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
    <co-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete" :data="pageResult" :columns="filterColumns"
              @findPage="findPage" @handleEdit="handleEdit" @kaipiao="kaipiao" @handleDelete="handleDelete">
    </co-table>
    <el-dialog :title="'输入开票信息'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false">
      <el-form :inline="true" :model="orderReg" label-position="right" label-width="100px" size="mini" ref="orderReg">
        <el-form-item label="ID" v-if="isShow" prop="id">
          <el-input v-model="orderReg.id"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票时间:" prop="kaipiaoTime">
              <el-date-picker style="width: 160px;" v-model="orderReg.kaipiaoTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票号:" prop="billNo" >
              <el-input v-model="orderReg.billNo" style="width:160px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注:"prop="remarks" >
              <el-input v-model="orderReg.remarks" style="width:160px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="7" :offset="16">
            <el-form-item>
              <el-button type="success" size="mini" @click="save">保存</el-button>
              <el-button :size="size" @click="off">{{$t('action.cancel')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :title="'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false" :show-close="false">
      <el-form :inline="true" :model="modify" label-position="right" label-width="100px" size="mini" ref="modify">
        <el-form-item label="ID" prop="id" v-if="isShow">
          <el-input v-model="modify.id"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入库单号" prop="wareNo">
              <el-input style="width: 160px;" v-model="modify.wareNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="派工号" prop="dispatchNo">
              <el-input style="width: 160px;" v-model="modify.dispatchNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" :offset="16">
            <el-form-item>
              <el-button type="success" size="mini" @click="saveM">保存</el-button>
              <el-button :size="size" @click="offM">{{$t('action.cancel')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import CoTable from "@/views/Core/CoTable"
  import KtButton from "@/views/Core/KtButton"
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
  import {
    format
  } from "@/utils/datetime"
  export default {
    components: {
      PopupTreeInput,
      CoTable,
      KtButton,
      TableColumnFilterDialog
    },
    data() {
      return {
        size: 'mini',
        filters: {
          cust: '',
          mouldNm: '',
          qianTime:'',
          houTime:''
        },
        columns: [],
        filterColumns: [],
        pageRequest: {
          pageNum: 1,
          pageSize: 10
        },
        pageResult: {},
        dialogVisible: false,
        editDialogVisible: false,
        operation: false,
        editLoading: false,
        dataFormRules: {
          name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }]
        },
        //开票
        orderReg: {
          id: '',
          shuxing:'',
          lotNo: '',
          cust: '',
          mouldNm: '',
          wareDate:'',
          wareNum:'',
          quantity: '',
          company: '',
          dispatchNo: '',
          // buyMaterial: '',
          remarks: '',
          kaipiaoTime:'',
          billNo:''
        },
        //编辑
        modify: {
          id: '',
          wareNo: '',
          dispatchNo: ''
        },
        activeName: 'first',
        isShow: false,
        selectInvTend: [],
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
          },
          qianTime: {
            name: 'qianTime',
            value: this.filters.qianTime
          },
          houTime: {
            name: 'houTime',
            value: this.filters.houTime
          }
        }
        this.$api.order.findPageCom(this.pageRequest).then((res) => {
          this.pageResult = res.data
        }).then(data != null ? data.callback : '')
      },
      off(){
        this.dialogVisible = false
      },
      offM(){
        this.editDialogVisible = false
      },
      //保存编辑
      saveM() {
        this.$confirm('是否执行本操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = Object.assign({}, this.modify)
          this.$api.order.save(params).then((res) => {
            if (res.code == 200) {
              this.editDialogVisible = false
              this.findPage(null)
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!' + response.data.msg
              });
            }
          })
        })
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
              this.dialogVisible = false
              this.findPage(null)
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!' + response.data.msg
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
          label: "批号",
          minWidth: 80
        },
          {
            prop: "cust",
            label: "客户",
            minWidth: 80
          },
          {
            prop: "mouldNm",
            label: "模具名称",
            minWidth: 100
          },
          // 					{
          // 						prop: "buyMaterial",
          // 						label: "模具号",
          // 						minWidth: 80
          // 					},
          {
            prop: "quantity",
            label: "派工数量",
            minWidth: 100
          },
          {
            prop: "wareNo",
            label: "入库单号",
            minWidth: 100
          },
          {
            prop: "wareNum",
            label: "入库数量",
            minWidth: 100
          },
          {
            prop: "wareDate",
            label: "入库时间",
            minWidth: 100,
          },
          {
            prop: "outNum",
            label: "出库数量",
            minWidth: 100
          },
          {
            prop: "outDate",
            label: "出库时间",
            minWidth: 100,
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
          {
            prop: "kaipiaoTime",
            label: "开票时间",
            minWidth: 100
          },
          {
            prop: "billNo",
            label: "发票号",
            minWidth: 100
          },
          {
            prop: "remarks",
            label: "备注",
            minWidth: 80
          },
          // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
          // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
          // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ]
        this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      },
      // //显示派工单
      // handleEdit: function(params) {
      // 	window.open('http://123.56.123.34:80/ugo/ureport/preview?_u=file:URforkitty.ureport.xml' + '&id=' + params.row.id)
      // 	},
      //编辑
      handleEdit: function(params) {
        this.editDialogVisible = true
        this.modify = Object.assign({}, params.row)
      },
      kaipiao:function(params){
        this.dialogVisible = true
        this.orderReg = Object.assign({}, params.row)
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
