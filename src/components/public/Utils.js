import net from '../../constants/const.js'
import serverConsts from '../../constants/serverConsts.js'

export default
{
    isNullOrEmpty,
    isNumber,
    isJSON,
    isArray,
    mergeJSON,
    mergeJsonArray,
    getInputCursorPosition,
    getImageUrlFormHash,
    getImageUrlFormHashWithType,
    setCookie,
    getCookie,
    delCookie,
    getJumpRealUrl,
    jump,
    getPostRealUrl,
    getClassRealUrl,
    getCurrentFullHost,
    getPostPrefix,
}

function mergeJSON(minor, main) {
    for(var key in minor) {
        if(main[key] === undefined) { // 不冲突的，直接赋值 
            main[key] = minor[key];
            continue;
        }
        // 冲突了，如果是Object，看看有么有不冲突的属性
        // 不是Object 则以（minor）为准为主，
        if(isJSON(minor[key])||isArray(minor[key])) { // arguments.callee 递归调用，并且与函数名解耦 
          main[key] = mergeJSON(minor[key], main[key]);
        }else{
          main[key] = minor[key];
        }
    }
    return main;
  }
  function isJSON(target) {
    return typeof target == "object" && target.constructor == Object;
  }
  function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
  }
  function mergeJsonArray(a, b){
    var r = {};
    var i = 0;
    for(var key in a){ 
      r[i] = a[key];
      i++;
    }
    for(var key in b){ 
      r[i] = b[key];
      i++;
    }
    return r;
  }
/**
 * 判断一个字符串是否为空
 * @param {*} str 要判断的字符串
 */
function isNullOrEmpty(str){
    if(typeof str == 'undefined') return true;
    if(str==null || str=='')return true;
    return false;
  }
  function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
        return true;
        } else {
        return false;
        }
  }
  function pad(num, n) {
    var len = num.toString().length;
    while(len < n) {
      num = "0" + num;
      len++;
    }
    return num;
  }
  
  /**  
   * 日期格式化（原型扩展或重载）  
   * 格式 YYYY/yyyy/ 表示年份  
   * MM/M 月份  
   * dd/DD/d/D 日期  
   * @param {formatStr} 格式模版  
   * @type string  
   * @returns 日期字符串  
   */  
  Date.prototype.format = function(formatStr){   
    var str = formatStr;   
    //var Week = ['日','一','二','三','四','五','六'];   
    str=str.replace(/yyyy|YYYY/,this.getFullYear());  
    str=str.replace(/MM/,pad(this.getMonth() + 1, 2));   
    str=str.replace(/dd|DD/, pad(this.getDate(), 2));   
    str=str.replace(/HH/,pad(this.getHours(), 2));   
    str=str.replace(/hh/,pad(this.getHours()>12?this.getHours()-12:this.getHours(), 2));   
    str=str.replace(/mm/,pad(this.getMinutes(), 2));
    str=str.replace(/ii/,pad(this.getMinutes(), 2));
    str=str.replace(/ss/,pad(this.getSeconds(), 2));
   return str;   
  } 
  
  //textare getCursorPosition
  function getInputCursorPosition(input){
    var el = $(input).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
    } else if ('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
  }
  function getImageUrlFormHash(str){
    if(str && str.indexOf('http') == 0) return str;
    else if(str) return net.IMAGES_URL + '/' + str + ".jpg";
    else return str;
  }
  function getImageUrlFormHashWithType(hash, type){
    var ftype = type ? type : 'jpg';
    if(hash && hash.indexOf('http') == 0) return hash;
    else if(hash) return net.IMAGES_URL + '/' + hash + "." + ftype;
    else return hash;
  }
  function getPostRealUrl(post){
    return getJumpRealUrl(serverConsts.PartPositions.viewPost + (post.urlName ? post.urlName.replace(/\+/g, ' ') : post.id) + '/')
  }
  function getClassRealUrl(post){
    return getJumpRealUrl(serverConsts.PartPositions.viewClass + (post.urlName ? post.urlName.replace(/\+/g, ' ') : post.id) + '/')
  }
  function getCurrentFullHost(){
    return location.protocol + '//' + location.host;
  }
  function getPostPrefix(prefixId){
    switch(prefixId)
    {
      case serverConsts.PostPrefix.none: return '';
      case serverConsts.PostPrefix.original: return '<span class="tag-post-prefix original">原创</span>';
      case serverConsts.PostPrefix.reprint: return '<span class="tag-post-prefix reprint">转载</span>';
      case serverConsts.PostPrefix.album: return '<span class="tag-post-prefix album">视频</span>';
      case serverConsts.PostPrefix.video: return '<span class="tag-post-prefix video">相册</span>';
    }
    return '';
  }

//
//Cookies

function setCookie(name,value) 
{ 
    var Days = 30; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 

//读取cookies 
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 

//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 


//
//Jumps

function getJumpRealUrl(link){
  return net.URL_PREFIX + link;
}
function jump(link){
  location.href=getJumpRealUrl(link)
}
