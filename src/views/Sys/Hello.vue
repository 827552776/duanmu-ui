<template>
  <div>
   	<el-form :inline="true" :model="orderReg" label-position="right" label-width="120px" size="small" ref="refname" class="demo-form-inline">
   	<el-form-item label="ID" prop="id" v-if="isShow">
   		<el-input v-model="orderReg.id"></el-input>
   	</el-form-item>
   	
   	<el-form-item label="产品批号" >
   		<el-input v-model="orderReg.agentCd" style="width:140px;">
   		</el-input>
   	</el-form-item>
   	<el-form-item label="客户名称">
   		<el-input v-model="orderReg.custNm" style="width:120px;" >
   		</el-input>
   	</el-form-item>
   	<el-form-item label="模具名称:">
   		<el-input v-model="orderReg.custTel" placeholder="" style="width:120px" ></el-input>
   	</el-form-item>
   	<el-form-item label="数量:" prop="custAddr">
   		<el-input v-model="orderReg.custAddr" placeholder="" style="width:230px" ></el-input>
   	</el-form-item>
			<el-form-item label="单位:" prop="custAddr">
			<el-input v-model="orderReg.custAddr" placeholder="" style="width:230px" ></el-input>
		</el-form-item>
			<el-form-item label="入库时间:" prop="custAddr">
			<el-input v-model="orderReg.custAddr" placeholder="" style="width:230px" ></el-input>
		</el-form-item>
			<el-form-item label="入库人:" prop="custAddr">
			<el-input v-model="orderReg.custAddr" placeholder="" style="width:230px" ></el-input>
		</el-form-item>
			<el-form-item label="出库时间:" prop="custAddr">
			<el-input v-model="orderReg.custAddr" placeholder="" style="width:230px" ></el-input>
		</el-form-item>
			<el-form-item label="出库人:" prop="custAddr">
			<el-input v-model="orderReg.custAddr" placeholder="" style="width:230px" ></el-input>
		</el-form-item>
   	<el-form-item label="期望交期:" prop="expDelvDate">
   		<el-date-picker style="width: 140px;" v-model="orderReg.expDelvDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
   		</el-date-picker>
   	</el-form-item>
   	<el-form-item label="订单属性:" prop="urgentYn">
   		<el-select v-model="orderReg.urgentYn" placeholder="请选择" style="width:120px">
   			<el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
   			</el-option>
   		</el-select>
   	</el-form-item>
   	<el-form-item label="订单总价:" prop="total">
   		<el-input v-model="orderReg.total" placeholder="" style="width:120px"></el-input>
   	</el-form-item>
   	<el-form-item label="派工号:" prop="instAddr">
   		<el-input v-model="orderReg.instAddr" placeholder="" style="width:465px"></el-input>
   	</el-form-item>
			<el-form-item label="外协/购置新料:" prop="instAddr">
			<el-input v-model="orderReg.instAddr" placeholder="" style="width:465px"></el-input>
		</el-form-item>
			<el-form-item label="加工方式:" prop="instAddr">
			<el-input v-model="orderReg.instAddr" placeholder="" style="width:465px"></el-input>
		</el-form-item>
			<el-form-item label="数控工时:" prop="instAddr">
			<el-input v-model="orderReg.instAddr" placeholder="" style="width:465px"></el-input>
		</el-form-item>
			<el-form-item label="焊材用量:" prop="instAddr">
			<el-input v-model="orderReg.instAddr" placeholder="" style="width:465px"></el-input>
		</el-form-item>
   	<el-form-item label="备注:" prop="remarks">
   		<el-input v-model="orderReg.remarks" type="textarea" autosize style="width:375px"></el-input>
   	</el-form-item>
   
   	<el-form-item>
   		<el-button type="success" size="mini" @click="saveMain">保存</el-button>
   		<el-button type="danger" size="mini" @click="deleteMain(id)">删除</el-button>
   		<!-- <el-button type="success" size="mini" @click="resetForm('refname')">清空</el-button> -->
   	</el-form-item>
   
   
   </el-form>
  </div>

</template>

<script>
    export default {
        name: "helloWord",
					data() {
					 return {
					
						orderReg: {
							id: '',
							custId: '',
							dsgnNm: '',
							dsgnTel: '',
							saleNm: '',
							saleTel: '',
							agentCd: '',
							custNm: '',
							custTel: '',
							custAddr: '',
							ordNo: '',
						    ordTy: '普通订单',
							urgentYn: '',
							expDelvDate: '',
							total: '',
							instAddr: '',
							remarks: '',
						},
						isShow: false,
						
						}
    }
		}
	
			
		
</script>

<style scoped>

</style>
