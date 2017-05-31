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
    // $('#loginPhone').get(0).onkeyup = phoneInputCheck;
        //点击登录按钮
    $('#login_menu').click(function() {
        var name = $.trim($('#loginPhone').val());
        var psw = $.trim($("#loginPwd").val());
        if (!$.YGG.regExp.cellPhone.test(name)) {          
            maskShow('请输入正确的手机号码');  
            return;      
        }
        if(psw == ''){
            maskShow('请输入密码');
            return;
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/newwap/user/userLogin",
            data: "username=" + name + "&password=" + MD5(psw),
            success: function(res) {
                if (res.isSuccess) {
                    alert("登录成功");
                    //window.location.href = '/newwap/usercenter/artwork_add.php';
                    
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

    // $('#registerPhone').get(0).onkeyup = phoneInputCheck;

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
            url: "/newwap/user/userExist?username=" +mobile,
            success: function(res) {
                if (res.isExist) { 
                    maskShow("此手机号已经注册");
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
            return;
        }
        if(pwd==''){
             maskShow('请输入密码');
             return;
        }
        if(pwd.length<6 || pwd.length>16){
            maskShow('密码长度为6-16位数字字母符号组合');
            return;
        }
        if(pwdAgain==''){
             maskShow('请再次输入密码');
             return;
        }
        if(pwd!==pwdAgain){
            maskShow('密码输入不一致');
            return;
        }
        if(mobileCode==""){
            maskShow('请输入验证码');
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
                         url: '/newwap/user/userSignup',
                         data: {
                             username: mobile,
                             password: MD5(pwdAgain),
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

    // 找回密码
    //验证码发送
    $('#forgot_get_mobile_code').click(function() {
        var mobile=$.trim($('#findPhone').val());
        if (!$.YGG.regExp.cellPhone.test(mobile)) {
            maskShow('请输入正确的手机号码');
            return;
        }
        $.YGG.ajax({
            type: "POST",
            dataType: "json",
            url: "/newwap/user/userExist?username=" +mobile,
            success: function(res) {
                if (res.isExist) {
                    $.YGG.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: "/newwap/message/sendVerificationCode?mobile=" + mobile,
                        success: function(res) {
                            if(res.isSuccess){
                                maskShow("验证码已发送至手机");
                                $('#forgot_get_mobile_code').val('已发送');
                            }else{
                                maskShow(res.message);
                            }
                        }
                    }); 
                }else{
                    maskShow("此手机号没有注册");
                }
            }
        });
    });
    // 点击找回密码按钮
    $('#find_menu').click(function(){
        var mobile=$.trim($('#findPhone').val());
        var mobileCode=$.trim($('#forgot_get_mobile_code').val());
        if (!$.YGG.regExp.cellPhone.test(mobile)) {
            maskShow('请输入正确的手机号码');
            return;
        }
        if(mobileCode==""){
            maskShow('请输入验证码');
            return;
        }
        $.YGG.ajax({
           type:"POST" ,
           dataType:"json",
           url:"/newwap/message/verifyVerificationCode?verificationCode=" + mobileCode,
           success:function(res){
            if(res.isSuccess){
                $.YGG.ajax({
                    type:"POST",
                    dataType:"json",
                    url:"/newwap/user/userFindPassword",
                    data:{
                        username: mobile,
                        verificationCode: mobileCode
                    } ,
                    success:function(res){
                        if(res.isSuccess){
                            maskShow("验证成功");
                            //跳转到重置页面
                           // window.location.href="/newwap/usercenter/index.php";  
                        }else{
                            maskShow("请检查填写信息是否准确");
                        }
                    }
                });
            }s
           }
        });
    });
    // 重置密码
    $('#reset_menu').click(function(){
        var pwd=$.trim($("#password").val());
        var pwdAgain=$.trim($("#passwordAgain").val());
        if(pwd.length<6 || pwd.length>16){
           maskShow('密码长度为6-16位数字字母符号组合');
           return; 
        }
        if(pwdAgain==''){
             maskShow('请再次输入密码');
             return;
        }
        if(pwd!==pwdAgain){
            maskShow('密码输入不一致');
            return;
        }
        $.YGG.ajax({
            type:"POST",
            dataType:"json",
            url:"/newwap/user/userreset=" + MD5(pwdAgain), 
            success:function(res){
                if(res.isSuccess){
                    maskShow("修改成功");
                }else{
                    maskShow("修改失败，请检查填写密码是否准确");
                }
            }
        });
    });

});



