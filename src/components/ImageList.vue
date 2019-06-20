<template>
    <div v-if="items && loadedStatus == 'loaded'" class="image-list">
        <!--<div class="image-item add" title="添加图片" @click="onAddImage" :style="'width:' + (imageWidth?imageWidth:'auto') + ';height:' + (imageHeight?imageHeight:'auto')"> 
            <i class="fa fa-plus"></i>
        </div>-->
        <div v-for="(item, index) in items" :key="index" class="image-item">
            <div class="image-host" :style="'width:' + (imageWidth?imageWidth:'auto') + ';height:' + (imageHeight?imageHeight:'auto')"  v-on:click="onShowImage(index, item)"><img :id="'common-image-list-image-' + index" :src="item.resourcePath" /></div>
            <div class="image-box" :style="'width:' + (imageWidth?imageWidth:'auto') + ';'">
                <label>{{ item.title }} <span v-if="item.reading" class="text-info">正在处理中...</span></label>
                <a href="javascript:;" v-on:click="onDelImage(item)" title="删除该图片"><i class="fa fa-times"></i></a>
                <a href="javascript:;" v-on:click="onInsertImage(item)" title="插入到文章光标位置"><i class="fa fa-hand-o-up"></i></a>
                <a href="javascript:;" v-on:click="onCopyImageLink(item)" title="复制图片链接"><i class="fa fa-link"></i></a>
                <a href="javascript:;" v-on:click="onEditImage(item)" title="编辑"><i class="fa fa-pencil"></i></a>
            </div>
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
            default: '215px'
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
        onDelImage(item){
            this.$emit('item-click', 'del', item);
        },
        onAddImage(){
            this.$emit('item-click', 'add');
        },
        onInsertImage(item){
            this.$emit('item-click', 'insert', item);
        },
        onShowImage(index, item){
            var img = document.getElementById('common-image-list-image-'+index);
            BigPicture({
                el: img,
                imgSrc: img.getAttribute('src')
            });
        },
        onCopyImageLink(item){
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
        onEditImage(item){
            this.$emit('item-click', 'edit', item);
        },

    },
}
</script>

