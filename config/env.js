/**
 * 配置编译环境和线上环境之间的切换
 * 
 * 
 * apiBaseUrl 后端接口地址
 * apiImgBaseUrl 后端图片服务器接口地址
 * routerMode
 * 
 */

let apiBaseUrl = '/api/v1/'; 
let apiImgBaseUrl = '//images.imyzc.com';

if (process.env.NODE_ENV == 'development') {
    

}else if(process.env.NODE_ENV == 'production'){
    
}

export {
	apiBaseUrl,
	apiImgBaseUrl,
	routerMode,
}