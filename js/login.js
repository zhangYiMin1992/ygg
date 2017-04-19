// 动画兼容处理
var transitionEnd=function(style){
            var transEndEventNames = {
              WebkitTransition : 'webkitTransitionEnd',
              MozTransition    : 'transitionend',
              OTransition      : 'oTransitionEnd otransitionend',
              transition       : 'transitionend'
            }
            for(var name in transEndEventNames){
                if(typeof style[name] === "string"){
                    return transEndEventNames[name]
                }
            }
        };

  $(function(){
    $('#registerBtn').click(function(){
      $('#login').hide();
      $('#register').show();
    });
    $('#pleaseLogin,#registerCancel').click(function(){
      $('#login').show();
      $('#register').hide();
    });
    
  //点击菜单键
   $('.top_menu').click(function(){
      $('body').addClass('with-panel-left-reveal');
      $('.left_sidebar').css('display','block');
      $('.left_sidebar').addClass('active');
   });
   // 点击隐藏左侧边栏
  $('.panel-overlay').click(function () {
    $('.left_sidebar').removeClass('active');
    $('body').removeClass('with-panel-left-reveal').addClass('panel-closing');
  });
  var siderbar=function(){
    if($('.left_sidebar').hasClass('active')) {
      $('.panel-overlay').css('display','block');
      return;
    }
      $('.left_sidebar,.panel-overlay').css('display','none');
      $('body').removeClass('panel-closing');
  }
  //监听动画是否完成
    $(".page").get(0).addEventListener(transitionEnd($('.page').get(0).style),siderbar);
    $(".page").get(1).addEventListener(transitionEnd($('.page').get(1).style),siderbar);

  // 侧边栏菜单
  $('#leftSidebar .select dt').click(function(){
     if($(this).parent().attr('class')!='select on'){
        $(this).parent().addClass('on');
      }else{
        $(this).parent().removeClass('on');
      }
       var $dd=$(this).siblings();
       $dd.slideToggle(100);
  });
  //验证输入是否为数字
  function isPhoneNum(event){
    event=event||window.event;
    if(event.keyCode>57||event.keyCode<48){
      this.value=''; 
    }
  }
   //遮罩弹框提醒
   function maskShow(obj){
        timer_dialog=setTimeout(function(){
           obj.css('display','block');
          setTimeout(function(){
          obj.css('display','none');
          // _this_.value='';
          },2000);
        },100);
   }
  //注册页面手机号码验证
  var timer_dialog=null;
  var phoneNum=$('#registerPhone').val();
  var isarray=[false,false,false,false];
  var onOff=true;
 
  $('#registerPhone').get(0).onkeyup=isPhoneNum;
  //验证号码格式是否错误
  $('#registerPhone').get(0).onblur=function(){
       var _this_=this;
       if(!$.YGG.regExp.cellPhone.test(this.value)){
        var dialog1=$('.km-dialog-mask,.regist_phone_dialog1');
        maskShow(dialog1);
        isarray[0]=false;
        onOff=false;
        return false;
       }else{
        $.ajax({
          type:"POST",
          dataType:"json",
          url:"?username ="+phoneNum+"&type=username&random="+Math.random(),
          success:function(userSignup ){
            if(userSignup['status']=="false"){
                
                var dialog2=$('.km-dialog-mask,.regist_phone_dialog2');
                maskShow(dialog2);
                 isarray[0]=false;
                 return false;
             }else if(userSignup['status']=="true"){
               isarray[0]=true;
               $('#get_mobile_code').addClass('available').attr("disabled", true); 
               onOff=true;
             }
          }
        });
       }
  }
 //短信发送
  $('#get_mobile_code').click(function(){
    if(onOff){
      var mobile=$('#registerPhone').val();
      if(mobile){
        $.ajax({
                type:'GET',
                dataType:'json',
                // url:,
                success:function(sendVerificationCode){
                        if(sendVerificationCode['status']==true){
                          setTimeout(function(){
                                $('#get_mobile_code').val('已发送');
                                    setTimeout(function(){
                                    $('#get_mobile_code').val('获取验证码');
                                    },1800000);
                                  },100);
                              var dialog4=$('.km-dialog-mask,.regist_phone_dialog4');
                              maskShow(dialog4);
                        }else if(sendVerificationCode['status']==false){
                               var dialog3=$('.km-dialog-mask,.regist_phone_dialog3');
                               maskShow(dialog3);
                        }
                }
        });
      }
    }
  });
//验证密码
 var pwd=$('#pwd').val();
 var pwdAgain=$('#pwdAgain').val();
     pwd=$.trim(pwd);
     pwdAgain=$.trim(pwdAgain);
   $('#pwd').get(0).onblur=function(){
     if(!pwd==''&&pwd.length>16 || pwd.length<6){//有问题
      // &&pwd.length>16 || pwd.length<6
      console.log('1');
        var dialog5=$('.km-dialog-mask,.regist_phone_dialog5');
        maskShow(dialog5);
        isarray[1]=false;
        return false;
     }else{
        isarray[1]=true;
        return false;
     }
   }
   //验证密码是否一致
    $('#pwdAgain').get(0).onblur=function(){
      if(!pwd===pwdAgain){
           var dialog6=$('.km-dialog-mask,.regist_phone_dialog6');
           maskShow(dialog6);
           isarray[2]=false;
           return false;
        }else{
           isarray[2]=true;
           return false;
        }
      }
    //验证验证码
    $('#mobile_code').get(0).onblur=function(){
    var mobile_code=$('#mobile_code').val();
        mobile_code=$.trim(mobile_code);
        if(mobile_code==''){
          var dialog7=$('.km-dialog-mask,.regist_phone_dialog7');
          maskShow(dialog7);
          isarray[3]=false;
           return false;
        }else{
        $.ajax({
          type:"POST",
          dataType:"json",
          url:"?username ="+phoneNum+"&type=username&random="+Math.random(),
          success:function( verificationCode ){
            if( verificationCode ['status']=="false"){
                
                var dialog8=$('.km-dialog-mask,.regist_phone_dialog8');
                maskShow(dialog8);
                 isarray[3]=false;
                 return false;
             }else if( verificationCode ['status']=="true"){
               isarray[3]=true;
             }
          }
        });
      }
    }
    // 检查是否同意协议
    $('#agree').click(function(){
      if($(this).attr('class')!='agree_img'){
       $(this).addClass('agree_img');
       $('#register .login_menu').addClass('on');
       isarray[4]=true;
      }else{
       $(this).removeAttr('class');
       $('#register .login_menu').removeClass('on');
       isarray[4]=false;
      }
    });
    //点击立即注册按钮
    $('#register_menu').click(function(){
      if(isarray[0]===isarray[1]===isarray[2]===isarray[4]===isarray[4]===true){
        $.ajax({
               type:"POST",
               dataType:"json",
               url:"/center/register.php?random="+Math.random(),
               data:{
                   mobile:mobile,
                   pass:password,
                   mobile_code:mobile_code,
                   _2bind:_2bind
               },
               success:function(json){}
        });
      }
   });
    //登录页面验证
    //验证是否登录
    /*$.ajax({
      async:false,
      type:"POST",
      dataType:"josn",
      url:"?random="+Math.random(),
      success:function(true){
        if(true){
          window.location.href="/newwap/usercenter/index.php";
        }
      }
    });*/

      // 验证登陆页面输入号码是否为数字
    $('#loginPhone').get(0).onkeyup=isPhoneNum;
    var loginPhone=$('#loginPhone').val();
    var loginPwd=$('#loginPwd').val();
    loginPhone=$.trim(loginPhone);
    loginPwd=$.trim(loginPwd);
    $('#loginPwd,#loginPhone').get(0).onblur=function(){
      
       if(loginPwd==''&&loginPhone==''){//这个条件要取反
       $('#loginBox .login_menu').addClass('on');
       }
    }
    
     //点击登录按钮
    $('#login_menu').click(function(){
        var rsa_n="DEF1F0446302D3F53875A97062335A7C392005174775B3F2879A97F4F2E2648C549882D379FE48E0B4A6FC795318959D729F2782AC97B793AFEC97E458A01CBF63C273DBBE773E30D91DF6D977907198D3420353167A9CDDB186844C666E00FF1D0388FB917EF9325678CFD4674EF6C7CA5F4047570C44B1C1C4FE4EA31BEE67";
              setMaxDigits(131); //131 => n的十六进制位数/2+3
              var key      = new RSAKeyPair("010001", '', rsa_n);//010001 => e的十六进制
              var password = encryptedString(key,psw);//不支持汉字
       $.ajax({
        type:"POST",
              url:'/newwap/usercenter/login_ajax.php',
              data:"login_username="+name+"&login_pass="+password+"&type=login&randowm="+Math.random()+"&rember="+rember,
              dataType:'json',
              success:function(data){
                if(data['data']=="true"){
                  window.location.href='/newwap/usercenter/artwork_add.php';
                }else{
                  $('.km-dialog-mask,.km-dialog').css('display','block');
                }
               }
                   
       });
    });
    //隐藏弹出层
    $('.km-dialog-buttons span').click(function(){
       $('.km-dialog-mask,.km-dialog').css('display','none');
    });
});
