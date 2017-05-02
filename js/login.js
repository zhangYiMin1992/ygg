

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
        $('#leftSidebar dl dd').slideUp();
        $('#leftSidebar dl').removeClass('on'); 
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
            url: "newwap/user/userExist?username=" +mobile,
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
            url: "newwap/user/userExist?username=" +mobile,
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
                    url:"newwap/user/userFindPassword",
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
            }
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
            url:"/newwap/user/userreset=" + pwdAgain, 
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
//首页轮播
;(function($){
    var mobileMove=function(mobileMove)
    {
        this.mobileMove=mobileMove;
        this.imgList=mobileMove.find("[data-module='content']");
        this.imgA=this.imgList.find("a");

        this.nav=mobileMove.find("[data-module='nav']");
        this.navLi=this.nav.find("li");

        var first=this.imgA.first().clone(),
               last=this.imgA.last().clone();
        this.imgList.append(first);
        this.imgList.prepend(last);
        this.imgA=this.imgList.find("a");
        this.curIndex=1;
        this.length=this.imgA.length;

        this.setting={

        };
        $.extend(this.setting,this.getSettingValue());
        //console.log(this.CSS3({ "transform": "translate3d(" + 100 * 1 + "%, 0, 0)" }));
        //设置页面位置关系
        this.initPage();
        this.bindEvent();
    }
    mobileMove.init=function(mobileMoves)
    {
        var _this_=this;
        mobileMoves.each(function(){
            new _this_($(this));
        });
    }
    mobileMove.prototype= {
        getSettingValue:function()
        {
            var settingStr=this.mobileMove.attr("setting-value");
            if(settingStr&&""!=settingStr)
            {
                try{
                    return $.parseJSON(settingStr);
                }catch(ex){
                    console.log("配置参数错误！"+ex);
                    return {};
                }
            }else
            {
                return {};
            }
        },
        CSS3:function()//设置浏览器兼容
        {
            var o = {},
            output;
            var prefix = ["-webkit-", "-moz-", "-ms-", "-o-"];
            if (typeof arguments[0] == "string") {
                o[arguments[0]] = arguments[1]
            } else {
                o = arguments[0]
            }
            for (var k in o) {
                for (var i = 0, len = prefix.length; i < len; i++) {
                    o[prefix[i] + k] = o[k]
                }
            }
            return o;
        },
        loadImage: function($img, callback) {
            if (! ($img && $img.length)) return;
            var src = $img.attr("data-src");
            $img.attr("src", src).removeAttr("data-src");
            callback && ($img[0].onload = function() {
                callback();
                $img[0].onload = null
            })
        },
        initPage:function(){
            var that = this;
            that.imgA.each(function(k, v) {
                $(this).css(that.CSS3({
                    "transform": "translate3d(" + 100 * k + "%, 0, 0)"
                }))
            });
            this.setPagePos( - 100 * that.curIndex+"%",false);
        },
        setPagePos:function(pos,needTransition)
        {
            var that=this;
            that.loadImage(that.imgA.eq(that.curIndex).prev().find("img[data-src]"));
            that.loadImage(that.imgA.eq(that.curIndex).next().find("img[data-src]"));
             var ani = {};
             ani.transition = needTransition ? "all 0.4s ease": "all 0s ease";
             ani.transform = "translate3d(" +pos+ ", 0, 0)";
             that.imgList.css(this.CSS3(ani));
             that.navLi.removeClass("on").eq(that.curIndex - 1).addClass("on");
             setTimeout(function() {
                 if (that.curIndex <= 0) {
                     that.curIndex = that.length - 2;
                     that.setPagePos( - 100 * that.curIndex + "%", false);
                     return false
                 }
                 if (that.curIndex >= that.length - 1) {
                     that.curIndex = 1;
                     that.setPagePos( - 100 * that.curIndex + "%", false);
                     return false
                 }
             },
             400)
        },
        stop: function() {
            var that = this;
            window.clearInterval(that.interval)
        },
        play: function() {
            var that = this;
            that.stop();
            that.interval = window.setInterval(function() {
                that.curIndex++;
                that.setPagePos( - 100 * that.curIndex + "%", true)
            },
            4000)
        },
        bindEvent: function() {
            var that = this;
            var $el = that.imgList;
            var pos = {};
            var direction = "";
            $el[0].addEventListener("touchstart",
            function(ev) {
                direction = "";
               // that.stop();
                pos.x1 = ev.touches[0].pageX;
                pos.y1 = ev.touches[0].pageY;//touches[0]:获取手指列表中第一个元素
                return
            },
            false);
            
            $el[0].addEventListener("touchmove", 
            function(ev) {
                pos.x2 = ev.touches[0].pageX;
                pos.y2 = ev.touches[0].pageY;
                var x = pos.x2 - pos.x1;
                var y = pos.y2 - pos.y1; ! direction && (direction = Math.abs(y) > Math.abs(x) ? "vertical": "horizontal");
                if (direction == "vertical") {
                    return
                }
                var width = $el.width();
                that.setPagePos(x - that.curIndex * width + "px",false);
                ev.preventDefault();
                return false
            },
            false);    
            $el[0].addEventListener("touchend", 
            function(ev) {
                pos.x2 = ev.changedTouches[0].pageX;
                pos.y2 = ev.changedTouches[0].pageY;
                var x = pos.x2 - pos.x1;
                var y = pos.y2 - pos.y1;
                var width = $el.width();
                if (direction == "vertical" || Math.abs(x) < 30) {
                    return
                }
                if (x > 0) {
                    that.curIndex--
                } else {
                    that.curIndex++
                }
                that.setPagePos( - 100 * that.curIndex + "%", true);
                that.play();
                ev.preventDefault();
                return false
            },
            false)
        }
    }
    window["mobileMove"]=mobileMove;
 })(jQuery)
mobileMove.init($(".MobileMove"));


