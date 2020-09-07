<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.mName" placeholder="模具"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.remarks" placeholder="来料/外协回来"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.rkType" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.com" placeholder="材料来源"></el-input>
        </el-form-item>
        <el-form-item label="" prop="sort">
          <el-date-picker
            v-model="filters.qianTime"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="sort">
          <el-date-picker
            v-model="filters.houTime"
            type="date"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <kt-button icon="fa fa-plus" :label="$t('出库录入')" perms="sys:dict:add" type="primary" @click="handleAdd" />-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
    <!--表格内容栏-->
    <Cai-liao-ru-table :height="700" permsEdit="sys:dict:edit" permsDelete="sys:accessMaterial:delete"
                       :data="pageResult" :columns="columns"
                       @findPage="findPage"  @handleEditOut="handleEditOut" @handleEdit="handleEdit"  @handleDelete="handleDelete">
    </Cai-liao-ru-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="30%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="材料名称" prop="label">
          <el-input v-model="dataForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="材质" prop="label">
          <el-input v-model="dataForm.texture" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="单位" prop="label">
          <el-input v-model="dataForm.company" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="来料单位" prop="label">
          <el-input v-model="dataForm.com" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="模具名称" prop="label">
          <el-select v-model="dataForm.mName" placeholder="请输入关键字"   filterable
                     remote :remote-method="remoteMethod" >
            <el-option v-for="item in options4"  :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" prop="value">
          <el-input v-model="dataForm.intNumber" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="尺寸" prop="value">
          <el-input v-model="dataForm.size" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="入库时间" prop="sort">
          <el-date-picker
            v-model="dataForm.intTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库类型" prop="rkType">
          <el-select v-model="dataForm.rkType" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="外协单位" prop="type">-->
        <!--          <el-input v-model="dataForm.waixie" auto-complete="off"></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="外协时间" prop="sort">-->
        <!--          <el-date-picker-->
        <!--            v-model="dataForm.wxTime"-->
        <!--            type="date"-->
        <!--            placeholder="选择日期">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="外协入库时间" prop="sort">-->
        <!--          <el-date-picker-->
        <!--            v-model="dataForm.wxInt"-->
        <!--            type="date"-->
        <!--            placeholder="选择日期">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="外协数量 " prop="description">-->
        <!--          <el-input v-model="dataForm.wxNumber" auto-complete="off" type="textarea"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="入库价格 " prop="description">
          <el-input v-model="dataForm.wxPrice" auto-complete="off" type="textarea"/>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="确认" width="40%" :visible.sync="editDialogVisible1" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <h1>确认</h1>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible1 = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitFormConfirm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "../Core/KtButton";
  import KtTable from "../Core/KtTable";
  import { format } from "@/utils/datetime"
  import CaiLiaoRuTable from "../Core/CaiLiaoRuTable";
  import {formatWithSeperator} from "../../utils/datetime";
  export default {
    components:{
      KtTable,
      KtButton,
      CaiLiaoRuTable,
    },
    data() {
      return {
        size: 'small',
        filters: {
          name: '',
          mName:'',
          remarks:'',
          rkType: '',
          com:'',
          qianTime:'',
          houTime:''
        },
        options: [{
          label: '来料',
          value: '来料'
        }, {
          label: '外协回来',
          value: '外协回来'
        }],
        columns: [
          {prop:"id", label:"ID", minWidth:70},
          {prop:"intTime", label:"入库时间", minWidth:100,formatter:this.dateFormat},
          {prop:"com", label:"材料来源", minWidth:100},
          {prop:"name", label:"材料名称", minWidth:100},
          {prop:"texture", label:"材质", minWidth:100},
          {prop:"size", label:"尺寸", minWidth:200},
          {prop:"intNumber", label:"入库数量", minWidth:120},
          {prop:"wxPrice", label:"入库价格", minWidth:120},
          {prop:"company", label:"单位", minWidth:100},
          {prop:"mName", label:"模具名称", minWidth:100},
          // {prop:"number", label:"模具自用数", minWidth:100},
          // {prop:"trTime", label:"自用出库时间", minWidth:100,formatter:this.dateFormat},
          // {prop:"waixie", label:"外协单位", minWidth:100},
          // {prop:"wxTime", label:"外协时间", minWidth:100,formatter:this.dateFormat},
          // {prop:"wxInt", label:"外协入库时间", minWidth:100,formatter:this.dateFormat},
          // {prop:"wxNumber", label:"外协数量", minWidth:80},
          // {prop:"type", label:"状态", minWidth:80},
          {prop:"rkType", label:"入库类型", minWidth:120},
          {prop:"remarks", label:"备注", minWidth:120},
          {prop:"createBy", label:"创建人", minWidth:100},
          {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
          // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
          // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ],
        pageRequest: { pageNum: 1, pageSize: 200 },
        pageResult: {},
        operation: false, // true:新增, false:编辑
        editDialogVisible: false, // 新增编辑界面是否显示
        editDialogVisible1: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          trName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        loading:false,
        selectInvTend: [],
        list:[],
        options4: [],
        // 新增编辑界面数据
        dataForm: {
          id: 0,
          company:'',
          texture:'',
          mName:'',
          name: '',
          com:'',
          intTime: '',
          intNumber: '',
          number: '',
          trTime: '',
          waixie: '',
          wxTime:'',
          type:2,
          size:'',
          wxInt:'',
          wxNumber:'',
          wxPrice:'',
          remarks:'',
          rkType: ''
        }
      }
    },
    mounted() {
      this.getSelectInvTend()
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options4 = [];
        }

      },


      getSelectInvTend(){
        this.$api.order.queryMoudles().then((res) => {
          if (res.code == 200) {
            this.selectInvTend = res.data

            // this.list = this.selectInvTend.map(item => {
            //     return {value: item.mName, label: item.mName};
            // })
          } else {
            this.$message({
              type: 'error',
              message: '查询失败!' + response.data.msg
            });
          }
        })
      },
      // 获取分页数据
      findPage: function (data) {
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {
          name: {name:'name', value:this.filters.name},
          mName: {name:'mName', value:this.filters.mName},
          remarks: {name:'remarks', value:this.filters.remarks},
          rkType: {name:'rkType', value:this.filters.rkType},
          com: {name:'com', value:this.filters.com},
          qianTime: {name:'qianTime', value:this.filters.qianTime},
          houTime: {name:'houTime', value:this.filters.houTime}}
        this.$api.accessMaterial.findPageA(this.pageRequest).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')
      },
      // 批量删除
      handleDelete: function (data) {
        this.$api.accessMaterial.batchDelete(data.params).then(data!=null?data.callback:'')
      },
      // 显示新增界面
      handleAdd: function () {
        this.editDialogVisible = true

        this.list = this.selectInvTend.map(item => {
          return { value: item, label: item };
        });
        this.operation = true
        this.dataForm = {
          id: 0,
          mName:'',
          company:'',
          texture:'',
          name: '',
          intTime: '',
          intNumber: '',
          number: '',
          trTime: '',
          waixie: '',
          wxTime:'',
          type:2,
          size:'',
          wxInt:'',
          wxNumber:'',
          wxPrice:'',
          remarks:''
        }
      },
      //确认
      handleEditOut: function (params) {
        this.editDialogVisible1 = true
        this.operation = false
        this.dataForm = Object.assign({}, params.row)
      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.editDialogVisible = true
        this.dataForm = Object.assign({}, params.row)
      },
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              this.$api.accessMaterial.save(params).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.editDialogVisible = false
                this.findPage(null)
              })
            })
          }
        })
      },
      // 编辑
      submitFormAll: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认入库？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              this.$api.accessMaterial.save(params).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.editDialogVisible = false
                this.findPage(null)
              })
            })
          }
        })
      },
      // 编辑
      submitFormConfirm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              this.$api.accessMaterial.saveConfirmInt(params).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.editDialogVisible1 = false
                this.findPage(null)
              })
            })
          }
        })
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      }
    },
    name: "AccessStock"
  }
</script>

<style scoped>

</style>
