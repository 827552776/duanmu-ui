<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.source" placeholder="来源"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('入库')" perms="sys:dict:add" type="primary" @click="handleAdd" />
        </el-form-item>
<!--        <el-form-item>-->
<!--          <kt-button icon="fa fa-plus" :label="$t('刀具')" perms="sys:dict:add" type="primary" @click="handleAdd" />-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <kt-button icon="fa fa-plus" :label="$t('配件')" perms="sys:dict:add" type="primary" @click="handleAdd" />-->
<!--        </el-form-item>-->
      </el-form>
    </div>
    <!--表格内容栏-->
    <HanTable :height="500" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
              :data="pageResult" :columns="columns"
              @findPage="findPage" @handleEditIt="handleEditIt" @handleEditOut="handleEditOut" @handleEdit="handleEdit"  @handleDelete="handleDelete">
    </HanTable>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="90%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="5">
            <el-form-item label="焊材名称" prop="label">
              <el-input v-model="dataForm.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="焊材型号" prop="label">
              <el-input v-model="dataForm.model" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="焊材来源" prop="label">
              <el-input v-model="dataForm.source" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库存数量" prop="value">
              <el-input v-model="dataForm.number" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="单位" prop="type">
              <el-input v-model="dataForm.company" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="价格" prop="sort">
              <el-input v-model="dataForm.price" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="实盘数 " prop="description">
              <el-input v-model="dataForm.sureNumber" auto-complete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="差额 " prop="description">
              <el-input v-model="dataForm.difference" auto-complete="off" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="预警数量" prop="description">
              <el-input v-model="dataForm.typeNumber" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="5">-->
<!--            <el-form-item label="实盘数 " prop="description">-->
<!--              <el-input v-model="dataForm.sureNumber" auto-complete="off" ></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-form-item label="差额 " prop="description">-->
<!--              <el-input v-model="dataForm.difference" auto-complete="off"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
      </el-form>
        <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?true:false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" :disabled="operation?true:false">{{$t('action.submit')}}</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单" name="first" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input v-model="dataFormInt.name " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="来源" prop="label">
                  <el-input v-model="dataFormInt.source " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormInt.company " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!--    出库时显示        -->
                <el-form-item label="型号" prop="type">
                  <el-input v-model="dataFormInt.model " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
<!--                <el-form-item label="入库时间" prop="label">-->
<!--                  <el-input v-model="dataFormInt.intTime" auto-complete="off" disabled="false"/>-->
<!--                </el-form-item>-->
                <el-form-item label="入库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.intTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库数量" prop="label">
                  <el-input v-model="dataFormInt.number" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库价格" prop="value">
                  <el-input v-model="dataFormInt.price " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发票及备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisible = false" :disabled="operation?false:true">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitFormA" :loading="editLoading" :disabled="operation?false:true">{{$t('action.submit')}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 入库弹出界面   -->
    <el-dialog :title="operationStock?'入库':'出库'" width="90%" :visible.sync="editDialogVisibleIn" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="入库数量" prop="label">
          <el-input v-model="dataForm.intNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单" name="first" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input v-model="dataFormInt.name " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="来源" prop="label">
                  <el-input v-model="dataFormInt.source " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormInt.company " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!--    出库时显示        -->
                <el-form-item label="型号" prop="type">
                  <el-input v-model="dataFormInt.model " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <!--                <el-form-item label="入库时间" prop="label">-->
                <!--                  <el-input v-model="dataFormInt.intTime" auto-complete="off" disabled="false"/>-->
                <!--                </el-form-item>-->
                <el-form-item label="入库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.intTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库数量" prop="label">
                  <el-input v-model="dataFormInt.number" auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="入库价格" prop="value">
                  <el-input v-model="dataFormInt.price " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发票及备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisibleIn = false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm1" :loading="editLoading">{{$t('action.submit')}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 出库显示界面  -->
    <el-dialog :title="operationStock?'入库':'出库'" width="90%" :visible.sync="editDialogVisibleOut" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="出库数量" prop="label">
          <el-input v-model="dataForm.outNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="自用出库" name="first" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input v-model="dataFormInt.name " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="模具名称" prop="mouldName">
                   <el-select v-model="dataFormInt.mouldName" placeholder="请输入关键字"   filterable
                  remote :remote-method="remoteMethod" >
                        	<el-option v-for="item in options4"  :key="item.value"
                    :label="item.label"
                    :value="item.value">
                        	</el-option>
                        </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormInt.company " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!--    出库时显示        -->
                <el-form-item label="型号" prop="type">
                  <el-input v-model="dataFormInt.model " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="领用数" prop="label">
                  <el-input v-model="dataFormInt.number " auto-complete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="退回数" prop="label">
                  <el-input v-model="dataFormInt.reNumber " auto-complete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="使用数" prop="value">
                  <el-input v-model="dataFormInt.sNumber " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!--    出库时显示        -->
                <el-form-item label="班组" prop="type">
                  <el-input v-model="dataFormInt.zu " auto-complete="off" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <!--                <el-form-item label="入库时间" prop="label">-->
                <!--                  <el-input v-model="dataFormInt.intTime" auto-complete="off" disabled="false"/>-->
                <!--                </el-form-item>-->
                <el-form-item label="出库时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.outTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="价格" prop="value">
                  <el-input v-model="dataFormInt.price " auto-complete="off"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="总价" prop="value">
                  <el-input v-model="dataFormInt.sumPrice " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisibleOut = false" >{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm2" :loading="editLoading" >{{$t('action.submit')}}</el-button>
        </el-tab-pane>
        <el-tab-pane label="外售出库" name="second" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input v-model="dataFormInt.name " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="发货单位" prop="label">
                  <el-input v-model="dataFormInt.deCompany " auto-complete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormInt.company " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!--    出库时显示        -->
                <el-form-item label="型号" prop="type">
                  <el-input v-model="dataFormInt.model " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="发货数量" prop="label">
                  <el-input v-model="dataFormInt.deNumber " auto-complete="off"  disabled="false" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <!--                <el-form-item label="入库时间" prop="label">-->
                <!--                  <el-input v-model="dataFormInt.intTime" auto-complete="off" disabled="false"/>-->
                <!--                </el-form-item>-->
                <el-form-item label="发货时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.deTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="价格" prop="value">
                  <el-input v-model="dataFormInt.price " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisibleOut = false" >{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm3" :loading="editLoading" >{{$t('action.submit')}}</el-button>
        </el-tab-pane>
        <el-tab-pane label="调拨出库" name="third" >
          <el-form :model="dataFormInt" label-width="80px"  ref="dataFormInt" :size="size">
            <el-row>
              <el-col :span="5">
                <el-form-item label="材料名称" prop="label">
                  <el-input v-model="dataFormInt.name " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="调拨地点" prop="label">
                  <el-input v-model="dataFormInt.deCompany " auto-complete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单位" prop="value">
                  <el-input v-model="dataFormInt.company " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!--    出库时显示        -->
                <el-form-item label="型号" prop="type">
                  <el-input v-model="dataFormInt.model " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="发货数量" prop="label">
                  <el-input v-model="dataFormInt.deNumber " auto-complete="off"  disabled="false" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <!--                <el-form-item label="入库时间" prop="label">-->
                <!--                  <el-input v-model="dataFormInt.intTime" auto-complete="off" disabled="false"/>-->
                <!--                </el-form-item>-->
                <el-form-item label="发货时间" prop="sort">
                  <el-date-picker
                    v-model="dataFormInt.deTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="价格" prop="value">
                  <el-input v-model="dataFormInt.price " auto-complete="off" disabled="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="备注信息" prop="type">
                  <el-input v-model="dataFormInt.remarks " auto-complete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="来源" prop="type">
                  <el-input v-model="dataFormInt.source " auto-complete="off" disabled="false" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button :size="size" @click.native="editDialogVisibleOut = false" >{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm4" :loading="editLoading" >{{$t('action.submit')}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "../Core/KtButton";
  import KtTable from "../Core/KtTable";
  import { format } from "@/utils/datetime"
  import KfTable from "../Core/KfTable";
  import HanTable from "../Core/HanTable";
    export default {
        components:{
            KfTable,
            KtTable,
            KtButton,
            HanTable
        },
        data() {
            return {
                size: 'small',
                filters: {
                  name: '',
                  source:''
                },
                columns: [
                    {prop:"id", label:"ID", minWidth:50},
                    {prop:"name", label:"焊材名称", minWidth:100},
                    {prop:"model", label:"焊材型号", minWidth:100},
                    {prop:"source", label:"焊材来源", minWidth:100},
                    {prop:"number", label:"库存数量", minWidth:100},
                    {prop:"company", label:"单位", minWidth:80},
                    {prop:"price", label:"价格", minWidth:80},
                    // {prop:"outNumber", label:"出库数量", minWidth:120},
                    // {prop:"intNumber", label:"入库数量", minWidth:120},
                    // {prop:"type", label:"预警状态", minWidth:120},
                    {prop:"typeNumber", label:"预警数量", minWidth:120},
                    {prop:"sureNumber", label:"实盘数", minWidth:120},
                    {prop:"difference", label:"差额", minWidth:120},
                    {prop:"remarks", label:"备注", minWidth:120},
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
								loading:false,
								selectInvTend: [],
								list:[],
								options4: [],
                dataFrom1:{
                    price:''
                },
                // 新增编辑界面数据
                dataForm: {
                    id: 0,
                    name: '',
                    model: '',
                    source: '',
                    number: '',
                    company: '',
                    price: '',
                    outNumber: 0,
                    intNumber: 0,
                    type: 0,
                    typeNumber: '',
                    sureNumber: '',
                    remarks: '',
                    difference:''

                },
              dataFormInt: {
                id: 0,
                name: '',
                deTime :'',
                deCompany: '',
                source: '',
                model:'',
                deNumber: '',
                company: '',
                price: '',
                sumPrice:'',
                intTime:'',
                outTime:'',
                reNumber:'',
                number:'',
                sNumber:'',
                type: 0,
                mouldName:'',
                zu:'',
                remarks:''
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
									} else {
										this.$message({
											type: 'error',
											message: '查询失败!' + response.data.msg
										});
									}
								})
							},
          handleClick(tab, event) {
            console.log(tab, event);
          },
            // 获取分页数据
            findPage: function (data) {
                if(data !== null) {
                    this.pageRequest = data.pageRequest
                }
                this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name},source:{name:'source',value:this.filters.source}}
                this.$api.welding.findPage(this.pageRequest).then((res) => {
                    this.pageResult = res.data
                }).then(data!=null?data.callback:'')
            },
            // 批量删除
            handleDelete: function (data) {
                this.$api.welding.batchDelete(data.params).then(data!=null?data.callback:'')
            },
            // 显示新增界面
            handleAdd: function () {
                this.editDialogVisible = true
                this.operation = true
                this.dataForm = {
                    id: 0,
                    name: '',
                    model: '',
                    source: '',
                    number: '',
                    company: '',
                    price: '',
                    sumPrice:'',
                    outNumber: 0,
                    intNumber: 0,
                    type: 0,
                    typeNumber: '',
                    sureNumber: '',
                    remarks: '',
                    difference:''
                }
              this.dataFormInt={
                id: 0,
                  name: '',
                  deTime :'',
                  deCompany: '',
                  source: '',
                  model: '',
                  deNumber: '',
                  company: '',
                  price: '',
                  sumPrice:'',
                  intTime:'',
                  outTime:'',
                  reNumber:'',
                  number:'',
                  sNumber:'',
                  type: 0,
                  mouldName:'',
                  zu:'',
                  remarks:''
              }
            },
            //入库显示界面
            handleEditIt:function(params){
                this.editDialogVisibleIn = true
                this.operationStock = true
                this.dataForm = Object.assign({},params.row)
              this.dataFormInt={
                id: 0,
                name: '',
                deTime :'',
                deCompany: '',
                source: '',
                model: '',
                deNumber: '',
                company: '',
                price: '',
                sumPrice:'',
                intTime:'',
                outTime:'',
                reNumber:'',
                number:'',
                sNumber:'',
                type: 0,
                mouldName:'',
                zu:'',
                remarks:''
              }
            },
            //出库
            handleEditOut:function(params){
                this.editDialogVisibleOut =true
								this.list = this.selectInvTend.map(item => {
								  return { value: item, label: item };
								});
                this.operationStock = false
                this.dataForm = Object.assign({}, params.row)
              this.dataFormInt={
                id: 0,
                name: '',
                deTime :'',
                deCompany: '',
                source: '',
                model: '',
                deNumber: '',
                company: '',
                price: '',
                sumPrice:'',
                intTime:'',
                outTime:'',
                reNumber:'',
                number:'',
                sNumber:'',
                type: 1,
                mouldName:'',
                zu:'',
                remarks:''
              }

            },
            // 显示编辑界面
            handleEdit: function (params) {
                this.editDialogVisible = true
                this.operation = false
                this.dataForm = Object.assign({}, params.row)
              this.dataFormInt={
                id: 0,
                name: '',
                deTime :'',
                deCompany: '',
                source: '',
                model: '',
                deNumber: '',
                company: '',
                price: '',
                sumPrice:'',
                intTime:'',
                outTime:'',
                reNumber:'',
                number:'',
                sNumber:'',
                type: 0,
                mouldName:'',
                zu:'',
                remarks:''
              }
            },
            // 编辑
            submitForm: function () {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                            let params = Object.assign({}, this.dataForm)
                            this.$api.welding.save(params).then((res) => {
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
                  this.dataFormInt.model = this.dataForm.model
                  this.dataFormInt.company = this.dataForm.company
                  this.dataFormInt.source = this.dataForm.source
                  this.dataFormInt.price = this.dataForm.price
                  this.dataFormInt.number = this.dataForm.number
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.weldingInt.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    this.editDialogVisibleIn=true
                    this.editDialogVisibleOut = false
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.welding.save(params).then((res) => {
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
          submitFormA: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.name
                  this.dataFormInt.model = this.dataForm.model
                  this.dataFormInt.company = this.dataForm.company
                  this.dataFormInt.source = this.dataForm.source
                  this.dataFormInt.price = this.dataForm.price
                  this.dataFormInt.number = this.dataForm.number
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.weldingInt.save(params1).then((res) => {
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
                  let params = Object.assign({}, this.dataForm)
                  this.$api.welding.save(params).then((res) => {
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
          //自用出库点击事件
          submitForm2: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.name
                  this.dataFormInt.model = this.dataForm.model
                  this.dataFormInt.company = this.dataForm.company
                  this.dataFormInt.source = this.dataForm.source
                  this.dataFormInt.sNumber = this.dataFormInt.number - this.dataFormInt.reNumber
                  this.dataFormInt.sumPrice = this.dataFormInt.sNumber * this.dataFormInt.price
                  this.dataFormInt.type = 1
                  this.dataForm.outNumber = this.dataFormInt.sNumber
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.weldingInt.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = true
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.welding.save(params).then((res) => {
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
          //外售出库点击事件
          submitForm3: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.name
                  this.dataFormInt.model = this.dataForm.model
                  this.dataFormInt.company = this.dataForm.company
                  this.dataFormInt.price = this.dataForm.price
                  this.dataFormInt.deNumber = this.dataForm.outNumber
                  this.dataFormInt.source = this.dataForm.source
                  this.dataFormInt.type = 2
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.weldingInt.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = true
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.welding.save(params).then((res) => {
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
          //调拨出库点击事件
          submitForm4: function () {
            this.$refs.dataFormInt.validate((valid) => {
              if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                  this.editLoading = true
                  this.dataFormInt.name = this.dataForm.name
                  this.dataFormInt.model = this.dataForm.model
                  this.dataFormInt.company = this.dataForm.company
                  this.dataFormInt.price = this.dataForm.price
                  this.dataFormInt.deNumber = this.dataForm.outNumber
                  this.dataFormInt.source = this.dataForm.source
                  this.dataFormInt.type = 3
                  let params1 = Object.assign({}, this.dataFormInt)
                  // let params1 = Object.assign({},this.dataFormInt)
                  // this.$api.accessMaterial.save(params1)
                  this.$api.weldingInt.save(params1).then((res) => {
                    if(res.code == 200) {

                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                    }
                    this.editLoading = false
                    this.$refs['dataFormInt'].resetFields()
                    this.editDialogVisibleIn=false
                    this.editDialogVisibleOut = true
                  })
                  let params = Object.assign({}, this.dataForm)
                  this.$api.welding.save(params).then((res) => {
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
            // 时间格式化
            dateFormat: function (row, column, cellValue, index){
                return format(row[column.property])
            }
        },
        name: "StockManage"
    }
</script>

<style scoped>

</style>
