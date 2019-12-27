<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.trName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kf-y-table :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage" @handleEditIt="handleEditIt" @handleEditOut="handleEditOut"@handleEdit="handleEdit"  @handleDelete="handleDelete">
    </kf-y-table>
  </div>
</template>

<script>
  import KtButton from "../Core/KtButton";
  import { format } from "@/utils/datetime"
  import KfYTable from "../Core/KfYTable";
    export default {
        components:{
            KfYTable,
            KtButton
        },
        data() {
            return {
                size: 'small',
                filters: {
                    trName: ''
                },
                columns: [
                    {prop:"id", label:"ID", minWidth:50},
                    {prop:"trName", label:"名称", minWidth:100},
                    {prop:"trType", label:"类型", minWidth:100},
                    {prop:"trSubdivide", label:"细分", minWidth:80},
                    {prop:"trNumber", label:"数量", minWidth:80},
                    {prop:"trPrice", label:"价格", minWidth:120},
                    {prop:"type", label:"预警状态", minWidth:120},
                    {prop:"typeNumber", label:"预警数量", minWidth:120},
                    {prop:"trRemarks", label:"备注", minWidth:120},
                    {prop:"createBy", label:"创建人", minWidth:100},
                    {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
                    // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
                    // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
                ],
                pageRequest: { pageNum: 1, pageSize: 10 },
                pageResult: {},

                operation: false, // true:新增, false:编辑
                operationStock: false,//true入库，false出库
                editDialogVisible: false, // 新增编辑界面是否显示
                editDialogVisibleIn:false,//入库界面是否显示
                editDialogVisibleOut:false,//出库显示界面是否显示
                editLoading: false,
                dataFormRules: {
                    trName: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                dataFrom1:{
                    price:''
                },
            }
        },
        methods: {
            // 获取分页数据
            findPage: function (data) {
                if(data !== null) {
                    this.pageRequest = data.pageRequest
                }
                this.pageRequest.columnFilters = {trName: {name:'trName', value:this.filters.trName}}
                this.$api.stock.findPage(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.dict.batchDelete(data.params).then(data!=null?data.callback:'')
            },
            // 时间格式化
            dateFormat: function (row, column, cellValue, index){
                return format(row[column.property])
            }
        },
        name: "StockManageY"
    }
</script>

<style scoped>

</style>
