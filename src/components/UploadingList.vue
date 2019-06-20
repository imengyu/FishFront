<template>
    <div class="upload-list">
        <div v-for="(item, index) in items" :key="index" class="upload-item">
            <h5>{{ item.text }} <br><span v-if="item.exception" class="text-danger">{{item.exception}}</span></h5>
            <el-progress :percentage="item.percentage" :status="item.status"></el-progress>
            <div class="upload-control">
                <el-button type="danger" icon="el-icon-delete" @click="onDelete(item)" circle size="mini"></el-button>
            </div>
        </div>
        <div v-if="nullText && (!items || items.length == 0)">
            <div class="text-secondary text-center mt-3 mb-3">{{ nullText }}</div>
        </div>
        <input type="file" :id="'upload-select-'+name" :accept="accept" style="display:none;" multiple="multiple" @change="fileChanged()" />
    </div>
</template>

<script>
export default {
    name: 'UploadingList',
    props: {
        items: {
            default: null
        },
        nullText:{
            default: "没有数据"
        }, 
        name: {
            default: 0
        },
        accept: {
            default: ''
        }
    },
    data() {
        return {
            clearIngFiles: false,
        }
    },
    methods: {
        selectFiles(){
            var file = document.getElementById('upload-select-'+this.name);
            if(file) file.click();
        },
        clearSelectFiles(){
            this.clearIngFiles = true;
            document.getElementById('upload-select-'+this.name).value = '';
        },
        fileChanged(){
            if(this.clearIngFiles){
                this.clearIngFiles = false;
                return;
            }
            this.$emit('select-file', document.getElementById('upload-select-' + this.name).files);
        },
        onDelete(item){
            this.$emit('delete', item);
        }
    },
}
</script>

<style scoped>
.upload-list{
    position: relative;
    padding: 15px;
}
.upload-list .upload-item{
    height: 110px;
    border-bottom: 1px solid #dadada;
    padding: 20px 5px;
}
.upload-list .upload-item h5{
    display: inline-block;
}
.upload-list .upload-item h5 span{
    font-size: 12px;
}  
.upload-list .upload-control{
    height: 28px;
    float: right;
    margin-top: -3px;
}
.upload-list .el-progress{
    width: calc(100% - 50px);
    display: inline-block;
}
</style>

