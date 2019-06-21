<template>
    <div v-if="items && loadedStatus == 'loaded'" class="image-list">
        <div v-for="(item, index) in items" :key="index" class="image-item file-item" :style="'width:' + imageWidth">
            <img :src="getFileTypeIcon(item.resourcePath)" />
            <label>{{ item.title }}</label>
            <a href="javascript:;" v-on:click="onDel(item)" title="删除"><i class="fa fa-times"></i></a>
            <a href="javascript:;" v-on:click="onCopyLink(item)" title="复制外链"><i class="fa fa-link"></i></a>
        </div>
        <div v-if="nullText && (!items || items.length == 0) && loadedStatus == 'loaded'">
            <div class="text-secondary text-center mt-3 mb-3">{{ nullText }}</div>
        </div>
    </div>
    <div v-else-if="loadedStatus == 'loading'">
        <div class="simple-loading-center" style="display:none;height:250px;">
            <div class="simple-loading-container"><span class="simple-loading"></span></div>
        </div>
    </div>
</template>

<script>

import "../assets/lib/BigPicture/BigPicture.min.js";
import toast from "../assets/lib/toast/toast.simply.js";

export default {
    name: "ImageList",
    props: {
        items:{
            default: null,
        }, 
        nullText:{
            default: "没有数据"
        }, 
        loadedStatus: {
            default: 'notload'
        }, 
        imageWidth: {
            default: '405px'
        }, 
        imageHeight:{
            default: null
        }
    },
    data(){
        return {
        }
    },
    methods: {
        onDel(item){
            this.$emit('item-click', 'del', item);
        },
        onShow(index, item){
            window.open(item.resourcePath);
        },
        onCopyLink(item){
            this.$copyText(item.resourcePath).then((e) => {
                toast.toast('链接已复制','success');
            }, (e) => {
               this.$msgbox({
                title: '消息',
                message: h('p', null, [
                    h('span', null, '您的浏览器不支持复制功能，需要您手动复制 '),
                    h('i', { style: 'color: teal' }, item.resourcePath)
                ]),
                confirmButtonText: '确定'})
            })
        },
        getFileTypeIcon(filepath){
            let fileName = filepath.lastIndexOf(".");//取到文件名开始到最后一个点的长度
            let fileNameLength = filepath.length;//取到文件名长度
            let fileFormat = filepath.substring(fileName + 1, fileNameLength);//截
            var iconPath = '';
            if(fileFormat=='zip'||fileFormat=='rar'||fileFormat=='gz'||fileFormat=='tar'||fileFormat=='7z') iconPath = require('../assets/images/icon/file-icons/file.svg');
            else if(fileFormat=='wmv'||fileFormat=='asf'||fileFormat=='rm'||fileFormat=='rmvb'||fileFormat=='swf'||fileFormat=='avi'||fileFormat=='mp4'||fileFormat=='flv') iconPath = require('../assets/images/icon/file-icons/video.svg');
            else if(fileFormat=='mp3'||fileFormat=='wav'||fileFormat=='aac'||fileFormat=='ac3'||fileFormat=='flac') iconPath = require('../assets/images/icon/file-icons/music.svg');
            else if(fileFormat=='ppt'||fileFormat=='pptx'||fileFormat=='pptm') iconPath = require('../assets/images/icon/file-icons/ppt.svg');
            else if(fileFormat=='doc'||fileFormat=='docx'||fileFormat=='docm'||fileFormat=='dotx'||fileFormat=='dot') iconPath = require('../assets/images/icon/file-icons/word.svg');
            else if(fileFormat=='xls'||fileFormat=='xlsx'||fileFormat=='xlsm'||fileFormat=='xlsb'||fileFormat=='csv') iconPath = require('../assets/images/icon/file-icons/excel.svg');
            else if(fileFormat=='txt'||fileFormat=='json'||fileFormat=='htm'||fileFormat=='html'||fileFormat=='php') iconPath = require('../assets/images/icon/file-icons/text.svg');
            else if(fileFormat=='bmp'||fileFormat=='png'||fileFormat=='jpg'||fileFormat=='jpeg'||fileFormat=='gif') iconPath = filepath;
            else iconPath = require('../assets/images/icon/file-icons/file.svg');
            return iconPath;
        },
    },
}
</script>

<style scoped>
.file-item img{
    width: 32px;
    height: 32px;
}
.file-item label{
    position: absolute;
    overflow: hidden;
    text-overflow: ellipsis;
    top: 3px;
    bottom: 3px;
    left: 45px;
    right: 50px;
    margin: 0;
}
.file-item a{
    float: right;
    margin-right: 8px;
    margin-top: 3px;
}
</style>


