

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
 * 弹框
 */
$(function(){
    initMessage(),
    window.alert = function(e) {
        message.info = e,
        showMsg(message)
    }
});

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

/**
 * 登录
 */
$(function(){
    //检测是否登录过,新版没有可删除
    // $.ajax({
    //     async: false,
    //     type: "POST",
    //     url: "/201405/checkusername.php?random=" + Math.random(),
    //     success: function(json) {
    //         if (json['login'] === "true") {
    //             window.location.href = "/newwap/usercenter/index.php";
    //         }
    //     }
    // });
    $('#loginPhone').get(0).onkeyup = phoneInputCheck;
        //点击登录按钮
    $('#login_menu').click(function() {
        var name = $.trim($('#loginPhone').val());
        var psw = $.trim($("#loginPwd").val());
        if (!$.YGG.regExp.cellPhone.test(name)) {          
            maskShow('请输入正确的手机号码');
            $('#loginPhone').focus();  
            return;      
        }
        if(psw == ''){
            maskShow('请输入密码');
            $("#loginPwd").focus();
            return;
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/newwap/user/userLogin",
            data: "username=" + name + "&password=" + psw,
            success: function(res) {
                if (res.isSuccess) {
                    window.location.href = '/newwap/usercenter/artwork_add.php';
                } else {
                    maskShow('您输入的账户名和密码不匹配');
                }
            }
        });
    });
})
/**
 * 注册
 */
$(function() {
    $('#registerBtn').click(function() {
        $('#login').hide();
        $('#register').show();

        $('#register').addClass('page-current');
        $('#login').removeClass('page-current');
    });
    $('#pleaseLogin,#registerCancel').click(function() {
        $('#login').show();
        $('#register').hide();

        $('#login').addClass('page-current');
        $('#register').removeClass('page-current');
    });

    $('#registerPhone').get(0).onkeyup = phoneInputCheck;

    //短信发送
    $('#get_mobile_code').click(function() {
        var mobile=$.trim($('#registerPhone').val());
        if (!$.YGG.regExp.cellPhone.test(mobile)) {
            maskShow('请输入正确的手机号码');
            return;
        }
        $.YGG.ajax({
            type: "POST",
            dataType: "json",
            url: "newwap/user/userExist?username=" +mobile,
            success: function(res) {
                if (res.isExist) { 
                    maskShow("此手机号已经注册");
                    $('#registerPhone').focus();
                }else{
                    $.YGG.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: "/newwap/message/sendVerificationCode?mobile=" + mobile,
                        success: function(res) {
                            if(res.isSuccess){
                                maskShow("验证码已发送至手机");
                                $('#get_mobile_code').val('已发送');
                            }else{
                                maskShow(res.message);
                            }
                            $("#mobile_code").focus();
                        }
                    });
                }
            }
        });
    });
    //点击立即注册按钮
    $('#register_menu').click(function() {
        var mobile=$.trim($('#registerPhone').val());
        var mobileCode=$.trim($('#mobile_code').val());
        var pwd=$.trim($("#pwd").val());
        var pwdAgain=$.trim($("#pwdAgain").val());
        if (!$.YGG.regExp.cellPhone.test(mobile)) {
            maskShow('请输入正确的手机号码');
            $('#registerPhone').focus();
            return;
        }
        if(pwd==''){
             maskShow('请输入密码');
             $("#pwd").focus();
             return;
        }
        if(pwd.length<6 || pwd.length>16){
            maskShow('密码长度为6-16位数字字母符号组合');
            $("#pwd").focus();
            return;
        }
        if(pwdAgain==''){
             maskShow('请再次输入密码');
             $("#pwdAgain").focus();
             return;
        }
        if(pwd!==pwdAgain){
            maskShow('密码输入不一致');
            $("#pwdAgain").focus();
            return;
        }
        if(mobileCode==""){
            maskShow('请输入验证码');
            $('#mobile_code').focus();
            return;
        }
        $.YGG.ajax({
            type: "POST",
            dataType: "json",
            url: "/newwap/message/verifyVerificationCode?verificationCode=" + mobileCode,
            success: function(res) {
                if (res.isSuccess) {
                     $.YGG.ajax({
                         type: "POST",
                         dataType: "json",
                         url: 'newwap/user/userSignup',
                         data: {
                             username: mobile,
                             password: pwdAgain,
                             verificationCode: mobileCode
                         },
                         success: function(res) {
                             if (res.isSuccess) {
                                  maskShow("注册成功");
                                 // window.location.href="/newwap/usercenter/index.php"; 
                             } else {
                                  maskShow("注册失败，请检查填写信息是否准确");
                             }
                         }
                     });
                }else{
                    maskShow(res.message);
                }  
            }
        });
    });


});


