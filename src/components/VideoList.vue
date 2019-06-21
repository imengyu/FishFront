<template>
    <div v-if="items && loadedStatus == 'loaded'" class="image-list">
        <div v-for="(item, index) in items" :key="index" class="image-item">
            <div class="image-host" :style="'width:' + (imageWidth?imageWidth:'auto') + ';height:' + (imageHeight?imageHeight:'auto')" v-on:click="onShowVideo(index, item)">
                <i class="image-video-play fa fa-play-circle-o"></i>
                <img :src="item.resourcePreviewImage" />
            </div>
            <div class="image-box" :style="'width:' + (imageWidth?imageWidth:'auto') + ';'">
                <label>{{ item.title }}</label>
                <a href="javascript:;" v-on:click="onDelVideo(item)" title="删除该视频"><i class="fa fa-times"></i></a>
                <a href="javascript:;" v-on:click="onInsertVideo(item)" title="插入视频到文章光标位置"><i class="fa fa-hand-o-up"></i></a>
                <a href="javascript:;" v-on:click="onEditVideo(item)" title="编辑"><i class="fa fa-pencil"></i></a>
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
    name: "VideoList",
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
            default: '300px'
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
        onDelVideo(item){
            this.$emit('item-click', 'del', item);
        },
        onAddVideo(){
            this.$emit('item-click', 'add');
        },
        onInsertVideo(item){
            this.$emit('item-click', 'insert', item);
        },
        onShowVideo(index, item){
            window.open(item.resourcePath);            
        },
        onEditVideo(item){
            this.$emit('item-click', 'edit', item);
        },

    },
}
</script>

