//Toasts
//=====================================
import jQuery from "jquery";

export default {
    toast,
    toastCloseById,
    toastClose
}

var $ = jQuery;
var toasts = [];
var toastCurrentTop = 15;
var toastCount = 0;
var toast_overlay;
var uidz = 0;

function toastTypeToIcon(type){
    switch(type){
        case 'error':
            return '<i class="toast-icon fa fa-times-circle-o text-danger"></i>';
        case 'warning':
            return '<i class="toast-icon fa fa-exclamation-triangle text-warning"></i>';
        case 'info':
            return '<i class="toast-icon fa fa-info-circle text-primary"></i>';
        case 'success':
            return '<i class="toast-icon fa fa-check-circle-o text-success"></i>';
        case 'loading':
            return '<i class="toast-icon spinner-grow text-primary" style="width:26px;height:26px" role="status"></i>';
    }
}
function toastRemove(toast, $alert){
    if(toastCurrentTop>15) toastCurrentTop -= $alert.height() + 36;  
    else toastCurrentTop = 15;  

    $alert.remove();

    for(var i = toasts.length - 1, start = toasts.indexOf(toast); i > start; i--)
        toasts[i].top = toasts[i - 1].top;
    for(var i = toasts.indexOf(toast), size = toasts.length; i < size-1; i++) {
        toasts[i] = toasts[i + 1];
        toasts[i].alert.css('top', toasts[i].top);
    }
    toasts.pop(toasts[toasts.length-1]);
    toastCount--;
}
/**
 * 通过ID关闭 Tosat
 * @param {*} uidz 
 */
function toastCloseById(uidz){
    for(var k in toasts){
        if(toasts[k].uidz == uidz){
            toastClose(toasts[k]);
            break;
        }
    }
}
/**
 * 关闭 Tosat
 * @param {*} toast 
 * @param {*} anim 
 */
function toastClose(toast, anim){
    if(!toast.closed){
        var $alert = toast.alert;
        toast.closed = true;
        if(anim=='slide') $alert.slideUp(300, function(){ toastRemove(toast, $(this)) });
        else $alert.fadeOut(600, function(){ toastRemove(toast, $(this)) });
    }
}
function toastClear(time, toast){
    setTimeout(function(){toastClose(toast)},time)
}
/**
 * 显示 Tosat
 * @param {String} str 文字
 * @param {String} type 类型
 * @param {*} time 时间（秒）
 * @param {boolean} noclose 是否取消关闭
 */
function toast(str, type, time, noclose){
    uidz += parseInt(Math.random() * 10);
    if(!time) time = 2500;
    if(time == -1 || time < 2500) noclose = true;

    var top = toastCurrentTop;

    var $toast_overlay = $('#toast-overlay');
    if($toast_overlay.length == 0){
        toast_overlay = document.createElement('div');
        toast_overlay.setAttribute('id', 'toast-overlay');
        toast_overlay.setAttribute('class', 'toast-overlay-wrapper position-fixed');
        document.body.appendChild(toast_overlay);
        $toast_overlay = $('#toast-overlay');
    }
    var alertId = 'toast-' + uidz;
    var $newAlert = $('<div class="toast-alert" id="' + alertId + '">' + toastTypeToIcon(type) + 
        '<div class="toast-text" style="' +(noclose?'padding-right:20px':'')+'">' +  str + '</div>' +
        (noclose ? '' : '<a class="toast-close" href="javascript:;"></a>') + '</div>')
    $('#' + alertId).click(function(){ toastCloseById(' + uidz + ') });
    $toast_overlay.append($newAlert);
    $newAlert.css('top', top + 'px');
    $newAlert.css('left', ($(window).width() / 2 - $newAlert.width() / 2) + 'px');

    toastCurrentTop += $newAlert.height() + 36;
    var toast = {
        uidz: uidz,
        alert: $newAlert,
        top: top,
        closed: false
    };
    toasts[toastCount] = toast;
    toastCount++;

    if(time!=-1) toastClear(time, toast);
    return toast;
}