<template>
  <div>
    <el-button v-text="name1" @click="fandAllName"> </el-button>
    <el-button v-text="name2" @click="fandAllName1"> </el-button>
    <el-select v-model="dataForm.trRemarks"> </el-select>
  </div>

</template>

<script>
    export default {
        data() {
            return {
                name1:"/A",
                name2:"/B",
                dataForm:{
                    trRemarks:''
                }
            }
        },
        methods:{
            fandAllName:function () {
                this.dataForm.trRemarks = this.dataForm.trRemarks+this.name2;
            },
            fandAllName1:function () {
                this.dataForm.trRemarks = this.dataForm.trRemarks+this.name1;
            },
        },
        name: "Technology"
    }
</script>

<style scoped>

</style>
