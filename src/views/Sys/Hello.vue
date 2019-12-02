<template>
	<div>
		<el-form :inline="true" :model="orderReg" label-position="right" label-width="80px" size="small" >
			<el-form-item label="ID" v-if="isShow">
				<el-input v-model="orderReg.id"></el-input>
			</el-form-item>
			<el-row>
				<el-col :span="4">
					<el-form-item label="产品批号:">
						<el-input v-model="orderReg.lotNo" style="width:150px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="客户名称:">
						<el-input v-model="orderReg.custNm" style="width:150px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="模具名称:">
						<el-input v-model="orderReg.mouldNm" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="数量:">
						<el-input v-model="orderReg.quantity" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="单位:" >
						<el-input v-model="orderReg.company" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="4">
					<el-form-item label="派工号:" >
						<el-input v-model="orderReg.dispatchNo" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="购置新料:" >
						<el-input v-model="orderReg.buyMaterial" placeholder="" style="width:150px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="备注:" >
						<el-input v-model="orderReg.remarks" type="textarea" autosize style="width:455px"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="5" >
					<el-form-item>
						<el-button type="success" size="mini" @click="save">保存</el-button>
						<el-button type="danger" size="mini" @click="delate">删除</el-button>
						<!-- <el-button type="success" size="mini" @click="resetForm('refname')">清空</el-button> -->
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-tabs v-model="activeName" >
			<el-tab-pane label="派工单" name="first">
				<el-form :inline="true" :model="dispa" label-position="right" label-width="80px" size="small" >
					<el-form-item label="ID" prop="id" v-if="isShow">
						<el-input v-model="dispa.id"></el-input>
					</el-form-item>
					<el-row>
						<el-col :span="4">
							<el-form-item label="派工单号:">
								<el-input v-model="dispa.dispatchNo" style="width:150px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="派工号:">
								<el-input v-model="dispa.dispaNo" style="width:150px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="工装类别:">
								<el-input v-model="dispa.category"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="供应商:" >
								<el-input v-model="dispa.supplier"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="合同号:" >
								<el-input v-model="dispa.contractNo"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4">
							<el-form-item label="制单时间:" >
								<el-date-picker style="width: 140px;" v-model="dispa.dispaMakeTime" type="date" placeholder="选择日期"
								 value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="使用单位:" >
								<el-input v-model="dispa.useUnit"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="产品编号及名称:"  label-width="115px">
								<el-input v-model="dispa.productNo"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="标识号:" >
								<el-input v-model="dispa.markNo"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="工装编号:">
								<el-input v-model="dispa.frockNo"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4">
							<el-form-item label="工装名称:" >
								<el-input v-model="dispa.frockNm"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="计量单位:" >
								<el-input v-model="dispa.units"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="派工数量:" >
								<el-input v-model="dispa.dispaQuantity"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="派工内容:" >
								<el-input v-model="dispa.dispaContent"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="派工依据:">
								<el-input v-model="dispa.dispaBasis"  style="width:150px"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4">
							<el-form-item label="交付日期:" >
								<el-date-picker style="width: 140px;" v-model="dispa.delvDate" type="date" placeholder="选择日期"
								 value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="技术条件:">
								<el-input v-model="dispa.techCon" placeholder="" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="质量要求:" >
								<el-input v-model="dispa.quality" placeholder="" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="单元(元):">
								<el-input v-model="dispa.rmb" placeholder="" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="模具定额:" >
								<el-input v-model="dispa.mouldQuota" placeholder="" style="width:150px"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4">
							<el-form-item label="完成数量:" >
								<el-input v-model="dispa.completeQuan" placeholder="" style="width:150px"></el-input>
							</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item label="派工单备注:"  label-width="100px">
									<el-input v-model="dispa.dispaRemarks" type="textarea"  autosize style="width:455px"></el-input>
								</el-form-item>
								</el-col>
						</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="附件" name="second">上传附件</el-tab-pane>
		</el-tabs>
	</div>

</template>

<script>
	export default {
		name: "helloWord",
		data() {
			return {
				orderReg: {
					id: '',
					lotNo:'',
					custNm: '',
					mouldNm: '',
					quantity: '',
					company: '',
					dispatchNo: '',
					buyMaterial: '',
					remarks: ''
				},
				dispa:{
					id:'',
					dispatchNo:'',
					dispaNo:'',
					category:'',
					supplier:'',
					contractNo:'',
					dispaMakeTime:'',
					useUnit:'',
					productNo:'',
					markNo:'',
					frockNo:'',
					frockNm:'',
					units:'',
					dispaQuantity:'',
					dispaContent:'',
					dispaBasis:'',
					delvDate:'',
					techCon:'',
					quality:'',
					rmb:'',
					mouldQuota:'',
					completeQuan:'',
					dispaRemarks:''
				},
				 activeName: 'first',
				isShow: false,

			}
		},
		methods: {
		  //保存订单
		  save(){
			this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
						let params = Object.assign({}, this.orderReg)
						this.$api.order.save(params).then((res) => {

							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.saveDispa()

								} else {
							this.$message({
								type: 'error',
								message: '删除失败!' + response.data.msg
							});

						}

						})
					})


		},
		//保存派工单
		saveDispa(){
			let params = Object.assign({}, this.dispa)
			this.$api.order.saveDispa(params).then((res) => {

				if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
					} else {
				this.$message({
					type: 'error',
					message: '删除失败!' + response.data.msg
				});

			}

			})
		}
		},
	}
</script>

<style scoped>

</style>
