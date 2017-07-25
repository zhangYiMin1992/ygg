$(function(){
    function top_qq(){
        javascript:window.open('http://b.qq.com/webc.htm?new=0&sid=4008566108&eid=218808P8z8p8p8P8p8R8y&o=http://www.artgogo.com&q=7&ref='+document.location, '_blank', 'height=544, width=644,toolbar=no,scrollbars=no,menubar=no,status=no');
    };
});
jQuery(function($){
    $(document).ready(function(){
        $.ajax({
            //async:false,
            type:"POST",
            dataType:"json",
            url:"/201405/checkusername.php?random="+Math.random(),
            success:function(json){
                if(json['login']==="true"){//已登录
                    var ustr="<ul><li><img src='/img/201405/header_06.png'>"+
                        "<a href='/center/main.php'>"+json.Title+"</a></li><li>|</li>"+
                        "<li><a href='/center/logout.php'>退出</a></li></ul>";
                    if(json['look']=='true'){//专家系统
                        $(".top_2_left").html(ustr);
                    }else{//普通用户
                        $(".top_2_left").html(ustr);
                    }
                    if( json['num_cart'] ){
                        $('.head_cart').html(json['num_cart']);
                    }else{
                        $('.head_cart').html(0);
                    }
                    /*$.ajax({
                        async:false,
                        type:"GET",
                        url:"/auction/canusercenter.php?random="+Math.random(),
                        success:function(json){
                            if(json=="success"){
                                $("#name").hide();
                            }
                        }
                     });*/
                }else{//没有登录
                    var ustr="<ul><li><img src='/img/201405/header_06.png'>"+
                        "<a class='fancybox fancybox.iframe' href='/login.shtml'>"+
                        "登录</a></li><li>|</li>"+
                        "<li><a href='/center/register.php'>快速注册</a></li></ul>";
                    $(".top_2_left").html(ustr);
                    $('.head_cart').html(0);
                    
                    //上传作品按钮处理
                    $('#top_up_click').attr({"href":"/login.shtml"});
                    $('#top_up_click').addClass("fancybox fancybox.iframe");
                    
                }
            }
        });
    });
});
