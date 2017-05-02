//遮罩弹框提醒
var timer_dialog = null;
function maskShow(message) {
    clearTimeout(timer_dialog);
    timer_dialog = setTimeout(function() {
        $('.regist_phone_dialog span').html(message);
        $('.regist_phone_dialog,.km-dialog-mask').css('display', 'block');
        setTimeout(function() {
            $('.regist_phone_dialog,.km-dialog-mask').css('display', 'none');
        }, 2000);
    }, 100);
}

var phoneInputCheck=function(e){
    var e = event || window.event;
    var code=e.keyCode;
    var isInput=(code>=48 && code<=57) || (code>=96 && code <=105) || code==37 || code==39 || code==8;
    !isInput &&  (this.value = this.value.replace(/[^\d]+/g,''));
}
/**
 * 侧边栏 二级菜单
 */

$(function(){
    $(document).on("click",".open-panel",function(e){
        var panel = $(e.target).data('panel');
        $.openPanel(panel);
    })
    $(document).on("click", ".panel-overlay", function(e) {
        $.closePanel();
    });



    // 侧边栏菜单
    $('#leftSidebar .select dt').click(function(e) {
        if ($(this).parent().attr('class') != 'select on') {
            $(this).parent().addClass('on');
        } else {
            $(this).parent().removeClass('on');
        }
        var $dd = $(this).siblings();
        $dd.slideToggle(100);
    });
})
//找回密码
$(function(){
    $('#findPhone').get(0).onkeyup=phoneInputCheck;
});
