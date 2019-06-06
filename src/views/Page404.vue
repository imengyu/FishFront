<template>
    <section id="main" class="section bg-grey p-404-top">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-12 p-404 d-flex justify-content-end">
                    <img src="../assets/images/404_ufo.png" alt="404">
                </div>
                <div class="col-md-6 col-sm-12 p-404 p-404-text">
                    <div class="p-404-foot">
                        <h4>您要找的页面不见了</h4>
                        <p class="text-secondary">
                            它可能已经被删除并且不再提供<br>或者 请检查您的 <span class="text-primary">输入</span> 或 <span class="text-primary">拼写</span> 是否有误
                        </p>
                        <p class="h6">
                            如果您认为网站出现了问题导致页面丢失<br>请向我们反馈，感谢您的支持！
                        </p>
                        <div class="p-404-buttons">
                            <button class="flat-btn flat-btn-black flat-primary" onclick="location.href = '/'">返回主页</button>
                            <button class="flat-btn flat-btn-black ml-2" v-on:click="submitReply()">提交反馈</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

export default {
    name: "Page404",
    data() {
        return {};
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$store.dispatch('global/resetHeader');
            this.$store.dispatch('global/setFooterStyle', 'small');
        },
        submitReply(){
            location.href=this.Utils.getJumpRealUrl('/')
        },
    }
};
</script>

<style scoped>
    .p-404{display:block;width:100%;text-align:center;height:382px}.p-404 img{width:375px;height:auto;margin-right:30px}.p-404 .p-404-foot{margin-top:0;padding:10px;margin-bottom:10px;margin-left:30px}.p-404 .p-404-foot h4{font-size:30px;font-weight:600}.p-404-top{padding-top:100px}.p-404-text{display:flex;flex-direction:column;align-items:flex-start;justify-content:center}@media(max-width:425px){.p-404{height:306px}.p-404 img{width:300px;margin-right:0;margin:0 auto}.p-404-top{padding-top:20px}.p-404 .p-404-foot{margin-left:0}.p-404-text{align-items:center;height:auto;border-top:1px solid #ddd;padding:10px 0}}.p-404-buttons{margin-top:20px}
</style>