import net from '../../constants/const.js'
import serverConsts from '../../constants/serverConsts.js'

export default
  {
    clone,
    cloneValue,
    isNullOrEmpty,
    isNumber,
    isJSON,
    isArray,
    isBase64,
    mergeJSON,
    mergeJsonArray,
    getInputCursorPosition,
    setCookie,
    getCookie,
    delCookie,
    getJumpRealUrl,
    jump,
    getPostRealUrl,
    getClassRealUrl,
    getCurrentFullHost,
    getPostPrefix,
    getPostStatusString,
    getUserHasPrivilege,
    swapItems,
    upData,
    downData
  }

// 对象操作
//================

/**
 * 克隆对象
 * @param {Object} obj 要克隆对象
 */
function clone(obj) {
  let temp = null;
  if (obj instanceof Array) {
    temp = obj.concat();
  } else if (obj instanceof Function) {
    //函数是共享的是无所谓的，js也没有什么办法可以在定义后再修改函数内容
    temp = obj;
  } else {
    temp = new Object();
    for (let item in obj) {
      let val = obj[item];
      temp[item] = typeof val == 'object' ? clone(val) : val; //这里也没有判断是否为函数，因为对于函数，我们将它和一般值一样处理
    }
  }
  return temp;
}
/**
 * 将源对象每个属性都复制到目标对象
 * @param {*} setObj 
 * @param {*} sourceObj 
 */
function cloneValue(setObj, sourceObj){
  if(!setObj || !sourceObj) return;
  Object.keys(setObj).forEach(function(key){
    if(typeof sourceObj[key] != 'undefined') {
      if(isJSON(setObj[key])) cloneValue(setObj[key], sourceObj[key]);
      else setObj[key] = sourceObj[key];
    }
  });
}


function mergeJSON(minor, main) {
  for (var key in minor) {
    if (main[key] === undefined) { // 不冲突的，直接赋值 
      main[key] = minor[key];
      continue;
    }
    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以（minor）为准为主，
    if (isJSON(minor[key]) || isArray(minor[key])) { // arguments.callee 递归调用，并且与函数名解耦 
      main[key] = mergeJSON(minor[key], main[key]);
    } else {
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
/**
 * 混合两个 JsonArray
 * @param {*} a 
 * @param {*} b 
 */
function mergeJsonArray(a, b) {
  var r = {};
  var i = 0;
  for (var key in a) {
    r[i] = a[key];
    i++;
  }
  for (var key in b) {
    r[i] = b[key];
    i++;
  }
  return r;
}

// 字符串操作
//================


/**
 * 判断一个字符串是否为空
 * @param {*} str 要判断的字符串
 */
function isNullOrEmpty(str) {
  if (typeof str == 'undefined') return true;
  if (str == null || str == '') return true;
  return false;
}
/**
* 判断字符串是否是 Base64 编码
* @param {String} str 
*/
function isBase64(str) {
  return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(str);
}
/**
 * 检测字符串是否是一串数字
 * @param {String} val 
 */
function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
/**
 * 数字补0
 */
function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
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
Date.prototype.format = function (formatStr) {
  var str = formatStr;
  //var Week = ['日','一','二','三','四','五','六'];   
  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/MM/, pad(this.getMonth() + 1, 2));
  str = str.replace(/dd|DD/, pad(this.getDate(), 2));
  str = str.replace(/HH/, pad(this.getHours(), 2));
  str = str.replace(/hh/, pad(this.getHours() > 12 ? this.getHours() - 12 : this.getHours(), 2));
  str = str.replace(/mm/, pad(this.getMinutes(), 2));
  str = str.replace(/ii/, pad(this.getMinutes(), 2));
  str = str.replace(/ss/, pad(this.getSeconds(), 2));
  return str;
}

// 应用操作数据前缀处理
//================

//textare getCursorPosition
function getInputCursorPosition(input) {
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
function getPostRealUrl(post) {
  return getJumpRealUrl(serverConsts.PartPositions.viewPost + (post.urlName ? post.urlName.replace(/\+/g, ' ') : post.id) + '/')
}
function getClassRealUrl(post) {
  return getJumpRealUrl(serverConsts.PartPositions.viewClass + (post.urlName ? post.urlName.replace(/\+/g, ' ') : post.id) + '/')
}
function getCurrentFullHost() {
  return location.protocol + '//' + location.host;
}
function getPostPrefix(prefixId) {
  switch (prefixId) {
    case serverConsts.PostPrefix.none: return '';
    case serverConsts.PostPrefix.original: return '<span class="tag-post-prefix original">原创</span>';
    case serverConsts.PostPrefix.reprint: return '<span class="tag-post-prefix reprint">转载</span>';
    case serverConsts.PostPrefix.album: return '<span class="tag-post-prefix album">视频</span>';
    case serverConsts.PostPrefix.video: return '<span class="tag-post-prefix video">相册</span>';
  }
  return '';
}
function getPostStatusString(statusString) {
  switch (statusString) {
    case serverConsts.ArchiveStatus.PUBLISH: return '公开文章';
    case serverConsts.ArchiveStatus.PRIVATE: return '私有文章';
    case serverConsts.ArchiveStatus.DRAFT: return '文章草稿';
  }
  return '';
}
function getUserHasPrivilege(userData, privilege){
  if(!userData) return false;
  return (userData.privilege & privilege) != 0;
}

// Cookie 操作
//================

/**
 * 设置 Cookie
 * @param {String} name Cookie 名称
 * @param {*} value 
 */
function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
/**
 * 读取 Cookie
 * @param {String} name Cookie 名称
 */ 
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

  if (arr = document.cookie.match(reg))

    return unescape(arr[2]);
  else
    return null;
}
/**
 * 删除 Cookie
 * @param {String} name Cookie 名称
 */ 
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//
//Jumps

function getJumpRealUrl(link) {
  return net.URL_PREFIX + link;
}
function jump(link) {
  location.href = getJumpRealUrl(link)
}


//数组操作
//================

function swapItems(arr, index1, index2){
  　arr[index1] = arr.splice(index2,1,arr[index1])[0]
  　return arr
}
function upData (arr, index) {
  　if (arr.length > 1 && index !== 0)
  　　　return swapItems(arr, index, index - 1)
}
function downData (arr, index) {
  　if (arr.length > 1 && index !== (arr.length - 1))
    　　return swapItems(arr, index, index + 1)
}
