<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.mName" placeholder="模具名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('入库')" perms="sys:dict:add" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kf-table :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage" @handleEditIt="handleEditIt" @handleEditOut="handleEditOut" @handleEdit="handleEdit"  @handleDelete="handleDelete">
    </kf-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'入库':'编辑'" width="90%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="5">
            <el-form-item label="材料名称" prop="label">
              <el-input  v-model="dataForm.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="模具名称" prop="label">
             <el-select v-model="dataForm.mName" placeholder="请输入关键字"   filterable
             remote :remote-method="remoteMethod" >
                   	<el-option v-for="item in options4"  :key="item.value"
               :label="item.label"
               :value="item.value">
                   	</el-option>
                   </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="入库数量" prop="value">
              <el-input v-model="dataForm.number" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="尺寸" prop="type">
              <el-input v-model="dataForm.size" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="价格" prop="sort">
              <el-input v-model="dataForm.price" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="对账状态 " prop="description">
              <el-input v-model="dataForm.state" auto-complete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="预警数量 " prop="description">
              <el-input v-model="dataForm.typeNumber" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票信息" prop="description">
              <el-input v-model="dataForm.invoice" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="单位(克/件/公斤)" prop="description">
              <el-input v-model="dataForm.company" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="材质" prop="description">
              <el-input v-model="dataForm.texture" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
      <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单" name="first" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input  v-model="dataFormInt.name " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="材质" prop="label">
                  <el-input  v-model="dataFormInt.texture " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormInt.company " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模具名称" prop="type">
                  <el-input v-model="dataFormInt.mName " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="入库数量" prop="label">
                  <el-input  v-model="dataFormInt.intNumber " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.intTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库价格" prop="value">
                  <el-input v-model="dataFormInt.wxPrice " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注" prop="type">
                  <el-input v-model="dataFormInt.remarks" auto-complete="off" type="textarea"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?false:true">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click="submitForm1" :disabled="operation?false:true">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!-- 入库弹出界面   -->
    <el-dialog :title="operationStock?'入库':'出库'" width="84%" :visible.sync="editDialogVisibleIn" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="入库数量" prop="label">
          <el-input v-model="dataForm.intNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
      <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单" name="first">
          <el-form :model="dataFormInt" label-width="80px" :rules="dataFormRules" ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input  v-model="dataFormInt.name " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="材质" prop="label">
                  <el-input  v-model="dataFormInt.texture " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormInt.company " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模具名称" prop="type">
                  <el-input v-model="dataFormInt.mName " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="入库数量" prop="label">
                  <el-input  v-model="dataFormInt.intNumber " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.intTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库价格" prop="value">
                  <el-input v-model="dataFormInt.wxPrice " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注" prop="type">
                  <el-input v-model="dataFormInt.remarks" auto-complete="off" type="textarea"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm4" :loading="editLoading">{{$t('action.submit')}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--  出库弹出界面  -->
    <el-dialog :title="operationStock?'入库':'出库'" width="90%" :visible.sync="editDialogVisibleOut" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="出库数量" prop="label">
          <el-input v-model="dataForm.outNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="自用出库表单" name="first">
            <el-form :model="dataFormOut" label-width="80px" :rules="dataFormRules" ref="dataFormOut" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input  v-model="dataFormOut.name " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="材质" prop="label">
                  <el-input  v-model="dataFormOut.texture " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormOut.company " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模具名称" prop="type">
                  <el-input v-model="dataFormOut.mName " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="派工号" prop="label">
                  <el-input  v-model="dataFormOut.dispatch " auto-complete="off" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="批号" prop="label">
                  <el-input  v-model="dataFormOut.batch " auto-complete="off" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="模具自用数" prop="value">
                  <el-input v-model="dataFormOut.number " auto-complete="off" disabled="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="自用出库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormOut.trTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="备注" prop="type">
                  <el-input v-model="dataFormOut.remarks" auto-complete="off" type="textarea"/>
                </el-form-item>
              </el-col>
            </el-row>
            </el-form>
              <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitForm2" :loading="editLoading">{{$t('action.submit')}}</el-button>
          </el-tab-pane>
          <el-tab-pane label="外协出库表单" name="second">
            <el-form :model="dataFormOut" label-width="80px" :rules="dataFormRules" ref="dataFormOut" :size="size">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="材料名称" prop="label">
                    <el-input  v-model="dataFormOut.name " auto-complete="off" disabled="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="材质" prop="label">
                    <el-input  v-model="dataFormOut.texture " auto-complete="off" disabled="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="单位" prop="value">
                    <el-input v-model="dataFormOut.company " auto-complete="off" disabled="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="模具名称" prop="type">
                    <el-input v-model="dataFormOut.mName " auto-complete="off" disabled="false"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item label="派工号" prop="label">
                    <el-input  v-model="dataFormOut.dispatch " auto-complete="off" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="批号" prop="label">
                    <el-input  v-model="dataFormOut.batch " auto-complete="off" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="外协数量" prop="value">
                    <el-input v-model="dataFormOut.wxNumber " auto-complete="off" disabled="false"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="外协时间" prop="sort">
                    <el-date-picker
                      v-model="dataFormOut.wxTime"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item label="外协单位" prop="label">
                    <el-input  v-model="dataFormOut.waixie " auto-complete="off" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="外协入库时间" prop="sort">
                    <el-date-picker
                      v-model="dataForm.wxInt"
                      type="date"
                      placeholder="选择日期"
                      disabled="false" >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="外协价格" prop="value">
                    <el-input v-model="dataFormOut.wxPrice " auto-complete="off" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="备注" prop="type">
                    <el-input v-model="dataFormOut.remarks" auto-complete="off" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="submitForm3" :loading="editLoading">{{$t('action.submit')}}</el-button>
          </el-tab-pane>

      </el-tabs>

    </el-dialog>
  </div>
</template>

<script>
    import PopupTreeInput from "@/components/PopupTreeInput"
  import KtButton from "../Core/KtButton";
  import { format } from "@/utils/datetime";
  import KfTable from "../Core/KfTable";
    export default {
        components:{
            KfTable,
            KtButton,
            PopupTreeInput
        },
        data() {
            return {
                size: 'small',
              restaurants: [],
                filters: {
                    name: '',
                    mName:''
                },
              // 新增编辑界面数据
              dataFormInt: {
                id: 0,
                company:'',
                texture:'',
                mName:'',
                name: '',
                intTime: '',
                intNumber: '',
                number: '',
                trTime: '',
                waixie: '',
                wxTime:'',
                type:2,
                wxInt:'',
                wxNumber:'',
                wxPrice:'',
                remarks:''
              },
							loading:false,
							selectInvTend: [],
							list:[],
							options4: [],
              dataFormOut: {
                id: 0,
                name: '',
                company:'',
                texture:'',
                dispatch:'',
                batch:'',
                mName:'',
                intTime: '',
                intNumber: '',
                number: '',
                trTime: '',
                waixie: '',
                wxTime:'',
                type:0,
                wxInt:'',
                wxNumber:'',
                wxPrice:'',
                remarks:''
              },
                columns: [
                    {prop:"id", label:"ID", minWidth:50},
                    {prop:"mName", label:"模具名称", minWidth:100},
                    {prop:"name", label:"名称", minWidth:100},
                    {prop:"number", label:"数量", minWidth:100},
                  {prop:"texture", label:"材质", minWidth:100},
                    {prop:"company", label:"单位", minWidth:100},
                    {prop:"size", label:"尺寸", minWidth:200},
                    {prop:"price", label:"价格", minWidth:80},
                    {prop:"state", label:"对账状态", minWidth:120},
                    // {prop:"outNumber", label:"出库数量", minWidth:120},
                    // {prop:"intNumber", label:"入库数量", minWidth:120},
                    // {prop:"type", label:"预警状态", minWidth:120},
                    {prop:"typeNumber", label:"预警数量", minWidth:120},
                    {prop:"invoice", label:"发票信息", minWidth:120},
                    {prop:"remarks", label:"备注", minWidth:120},
                    {prop:"createBy", label:"创建人", minWidth:100},
                    {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
                    // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
                    // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
                ],
                pageRequest: { pageNum: 1, pageSize: 50 },
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
                // 新增编辑界面数据
                dataForm: {
                    id: 0,
                    name: '',
                    company:'',
                    texture:'',
                    mName:'',
                    number: '',
                    size: '',
                    price: '',
                    outNumber: 0,
                    intNumber: 0,
                    type: 0,
                    typeNumber: '',
                    state: '',
                    remarks: '',
                    invoice:''

                }
            }
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
									} else {
										this.$message({
											type: 'error',
											message: '查询失败!' + response.data.msg
										});
									}
								})
							},
            // //导出Excel
            // exportExcel:function (params){
            //     // this.params = params
            //     this.$api.material.exportExcel(params)
            //         .then((res) =>{
            //         if(res.code == 200){
            //             this.$message({ message: '导出成功', type: 'success' })
            //         }else{
            //             this.$message({message: '操作失败, ' + res.msg, type: 'error'})
            //         }
            //     })
            // },
          handleClick(tab, event) {
            console.log(tab, event);
          },
          querySearch(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
          loadAll() {
            return [
              { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" }
            ];
          },
          handleSelect(item) {
            console.log(item);
          },
          //模糊查询输入的材料名称
          findAll:function() {
            return this.$api.materialZi.findAll()
          },
            // 获取分页数据
            findPage: function (data) {
                if(data !== null) {
                    this.pageRequest = data.pageRequest
                }
                this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name},mName:{name:'mName',value:this.filters.mName}}
                this.$api.material.findPage(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.material.batchDelete(data.params).then(data!=null?data.callback:'')
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
                    name: '',
                    mName:'',
                    company:'',
                    texture:'',
                    number: '',
                    size: '',
                    price: '',
                    outNumber: 0,
                    intNumber: 0,
                    type: '',
                    typeNumber: '',
                    state: '',
                    remarks: '',
                    invoice:''
                }
                this.dataFormInt={
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
                  wxInt:'',
                  wxNumber:'',
                  wxPrice:'',
                  remarks:''
                }
            },
            //入库显示界面
            handleEditIt:function(params){
                this.editDialogVisibleIn = true
                this.operationStock = true
                this.dataForm = Object.assign({},params.row)
            },
            //出库
            handleEditOut:function(params){
                this.editDialogVisibleOut =true
                this.operationStock = false
                this.dataForm = Object.assign({}, params.row)
              this.dataFormOut =   {
                  id: 0,
                  name: '',
                  company:'',
                  texture:'',
                  dispatch:'',
                  batch:'',
                  mName:'',
                  intTime: '',
                  intNumber: '',
                  number: '',
                  trTime: '',
                  waixie: '',
                  wxTime:'',
                  type:0,
                  wxInt:'',
                  wxNumber:'',
                  wxPrice:'',
                  remarks:''
              }

            },
            // 显示编辑界面
            handleEdit: function (params) {
                this.editDialogVisible = true
                this.operation = false
                this.dataForm = Object.assign({}, params.row)
            },
            // 编辑
            submitForm: function () {
            this.$refs.dataForm.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  let params = Object.assign({}, this.dataForm)
                  this.$api.material.save(params).then((res) => {
                    if(res.code == 200) {
                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataForm'].resetFields()
                    this.editDialogVisible = false
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = false
                    this.findPage(null)
                  })
                })
              }
            })
          },
          //入库单点击事件
          submitForm1: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.name
                  this.dataFormInt.texture = this.dataForm.texture
                  this.dataFormInt.company = this.dataForm.company
                  this.dataFormInt.mName = this.dataForm.mName
                  this.dataFormInt.intNumber = this.dataForm.number
                  this.dataFormInt.wxPrice = this.dataForm.price
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.accessMaterial.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = false
                  })
                })
              }
            })
          },
          //入库单点击事件
          submitForm4: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.name
                  this.dataFormInt.texture = this.dataForm.texture
                  this.dataFormInt.company = this.dataForm.company
                  this.dataFormInt.mName = this.dataForm.mName
                  this.dataFormInt.intNumber = this.dataForm.intNumber
                  this.dataFormInt.wxPrice = this.dataForm.price
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.accessMaterial.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    // this.editDialogVisibleIn=false
                    // this.editDialogVisibleOut = false
                  })
                })
              }
            })
          },
          //自用出库单点击事件
          submitForm2: function () {
            this.$refs.dataFormOut.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormOut.name = this.dataForm.name
                  this.dataFormOut.texture = this.dataForm.texture
                  this.dataFormOut.company = this.dataForm.company
                  this.dataFormOut.mName = this.dataForm.mName
                  this.dataFormOut.number = this.dataForm.outNumber
                  this.dataFormOut.type = 0
                  let params1 = Object.assign({}, this.dataFormOut)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.accessMaterial.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormOut'].resetFields()
                  })
                })
              }
            })
          },
          //外协出库单点击事件
          submitForm3: function () {
            this.$refs.dataFormOut.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormOut.name = this.dataForm.name
                  this.dataFormOut.texture = this.dataForm.texture
                  this.dataFormOut.company = this.dataForm.company
                  this.dataFormOut.mName = this.dataForm.mName
                  this.dataFormOut.wxNumber = this.dataForm.outNumber
                  this.dataFormOut.type = 1
                  let params1 = Object.assign({}, this.dataFormOut)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.accessMaterial.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormOut'].resetFields()
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
      mounted() {
				this.getSelectInvTend()
        this.restaurants = this.loadAll();
      },
        name: "StockManage"
    }
</script>

<style scoped>

</style>
