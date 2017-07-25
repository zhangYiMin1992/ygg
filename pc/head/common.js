//给导航增加当前样式
function set_class(li,cur,text){//选择器,加的样式 、文本
    var name=li;
    text=jQuery.trim(text);
    jQuery(name).each(function(){
        var li_text=jQuery.trim(jQuery(this).text()+"");
        if(li_text==text){
           jQuery(this).addClass(cur);
        }
    });
}
	
    /******标签切换*******/
//"id"为需要切换样式的层的id,与切换相对应的内容id命名规则为id_main_i."cur"为当前层的样式名字."s"为需要切换样式的每个容器的标签,如p、span、li等.
function tabs(id,cur,s){
    var content="_main_";
    if ( jQuery("#"+id).length){
        function closeContent(id,length){
            for(var i=1;i<=length;i++){
                jQuery("#"+id+content+i).hide();
            }
        }
        var obj=jQuery("#"+id+"  "+s);
        var length=obj.length;
        obj.each(function(i){
            jQuery(this).click(function(){
                obj.removeClass(cur);   
                closeContent(id,length);
                jQuery(this).addClass(cur);
                jQuery("#"+id+content+(i+1)).show();
            });
        });
    }//end length
}

/******标签切换*******/
//"id"为需要切换样式的层的id,与切换相对应的内容id命名规则为id_main_i."cur"为当前层的样式名字."s"为需要切换样式的每个容器的标签,如p、span、li等.
function tabs_hover(id,cur,s){
    var content="_main_";
    if ( jQuery("#"+id).length){
        function closeContent(id,length){
            for(var i=1;i<=length;i++){
                jQuery("#"+id+content+i).hide();
            }	
        }
        var length=jQuery("#"+id+"  "+s).length;
         jQuery("#"+id+"  "+s).each(function(i){
            jQuery(this).hover(function(){
                jQuery("#"+id+"  "+s).removeClass(cur);   
                closeContent(id,length);
                jQuery(this).addClass(cur);
                jQuery("#"+id+content+(i+1)).show();
            },function(){
            });						 
        });
    }//end length
}

function tabs_click(id,cur,s){
    var content="_main_";
    if ( jQuery("#"+id).length){
        function closeContent(id,length){
            for(var i=1;i<=length;i++){
                jQuery("#"+id+content+i).hide();
            }	
        }
        var length=jQuery("#"+id+"  "+s).length;
        jQuery("#"+id+"  "+s).each(function(i){
            jQuery(this).click(function(){
                jQuery("#"+id+"  "+s).removeClass(cur);   
                closeContent(id,length);
                jQuery(this).addClass(cur);
                jQuery("#"+id+content+(i+1)).show();
            },function(){
            });						 
        });
    }//end length
}


//幻灯切换
(function($) {// update by liyonghai 2010-07-02
$.fn.jCarouselLite = function(o) {
    o = $.extend({
        btnPrev:null,
        btnNext:null,
        btnGo:null,
        btnGoOver:false,
        mouseWheel:false,
        auto:null,
        speed:200,
        easing:null,
        vertical:false,
        circular:true,
        visible:3,
        start:0,
        scroll:1,
        stop:null,//鼠标悬停
		currClass:"on",
		timer:null,
        beforeStart:null,
        afterEnd:null
    }, o || {});

    return this.each(function() {                           // Returns the element collection. Chainable.

        var running = false, animCss=o.vertical?"top":"left", sizeCss=o.vertical?"height":"width";
        var div = $(this), ul = $("ul", div), tLi = $("li", ul), tl = tLi.size(), v = o.visible;

        if(o.circular) {
            ul.prepend(tLi.slice(tl-v-1+1).clone())
              .append(tLi.slice(0,v).clone());
            o.start += v;
        }

        var li = $("li", ul), itemLength = li.size(), curr = o.start;
        div.css("visibility", "visible");

        li.css({overflow: "hidden", float: o.vertical ? "none" : "left"});
        ul.css({margin: "0", padding: "0", position: "relative", "list-style-type": "none", "z-index": "1"});
        div.css({overflow: "hidden", position: "relative", "z-index": "2", left: "0px"});

        var liSize = o.vertical ? height(li) : width(li);   // Full li size(incl margin)-Used for animation
        var ulSize = liSize * itemLength;                   // size of full ul(total length, not just for the visible items)
        var divSize = liSize * v;                           // size of entire div(total length for just the visible items)

        li.css({width: li.width(), height: li.height()});
        ul.css(sizeCss, ulSize+"px").css(animCss, -(curr*liSize));

        div.css(sizeCss, divSize+"px");                     // Width of the DIV. length of visible images

        if(o.btnPrev)
            $(o.btnPrev).click(function() {
                return go(curr-o.scroll);
            });

        if(o.btnNext)
            $(o.btnNext).click(function() {
                return go(curr+o.scroll);
            });

        if(o.btnGo)
            o.btnGo.each(function(i, val) {
                $(this).click(function() {
                    if(o.timer)clearInterval(o.timer);
                    o.btnGo.removeClass(o.currClass);
                    $(this).addClass(o.currClass);
                    var g = o.circular ? o.visible*(i+1) : i;
                    //window.console.info("g:"+g+","+o.circular);
                    go(g);
                });
                if(o.btnGoOver){
                $(this).mouseover(function() {
                    running = false;
                    if(o.timer)clearInterval(o.timer);
                    var r = go(o.circular ? o.visible+i : i);
                    $.each(o.btnGo, function(i, val) {$(this).removeClass(o.currClass);});
                    //o.btnGo.removeClass(o.currClass);
		    $(this).addClass(o.currClass);
		    return r;
                });}
            });

        if(o.mouseWheel && div.mousewheel)
            div.mousewheel(function(e, d) {
                return d>0 ? go(curr-o.scroll) : go(curr+o.scroll);
            });

        if(o.auto){autoscroll();}

        if(o.stop){
            o.stop.mouseover(function(){
             if(o.timer)clearInterval(o.timer);
            }).mouseout(function(){
                    autoscroll();
            });
        }

        function autoscroll()
        {
            if(o.auto){
                o.timer = setInterval(function() {
                    go(curr+o.scroll);
                }, o.auto+o.speed);
            }
        };

        function vis() {
            return li.slice(curr).slice(0,v);
        };

        function go(to) {
            if(!running) {

                if(o.beforeStart)
                    o.beforeStart.call(this, vis());

                if(o.circular) {            // If circular we are in first or last, then goto the other end
                    if(to<=o.start-v-1) {           // If first, then goto last
                        ul.css(animCss, -((itemLength-(v*2))*liSize)+"px");
                        // If "scroll" > 1, then the "to" might not be equal to the condition; it can be lesser depending on the number of elements.
                        curr = to==o.start-v-1 ? itemLength-(v*2)-1 : itemLength-(v*2)-o.scroll;
                    } else if(to>=itemLength-v+1) { // If last, then goto first
                        ul.css(animCss, -( (v) * liSize ) + "px" );
                        // If "scroll" > 1, then the "to" might not be equal to the condition; it can be greater depending on the number of elements.
                        curr = to==itemLength-v+1 ? v+1 : v+o.scroll;
                    } else curr = to;
                } else {                    // If non-circular and to points to first or last, we just return.
                    if(to<0 || to>itemLength-v) return;
                    else curr = to;
                }                           // If neither overrides it, the curr will still be "to" and we can proceed.

                running = true;

                ul.stop().animate(
                    animCss == "left" ? { left: -(curr*liSize) } : { top: -(curr*liSize) } , o.speed, o.easing,
                    function() {
                        if(o.afterEnd)
                            o.afterEnd.call(this, vis());
                        if(o.btnGo)
                        {
                            $(o.btnGo).each(function(i,j){
                            //window.console.info(i+","+j);
                             $(j).removeClass(o.currClass); }); 
                            var index = curr;
                            var tlt = o.visible * o.btnGo.size();
                            //window.console.info("tlt:"+tlt);                        
                            if(index>tlt){index =1;}else{
                            if(index<=0){index=o.btnGo.size();}
                            else{index = index /o.visible;}
                            }
                            //window.console.info("v:"+v+","+tl+",curr:"+curr+","+index+","+o.btnGo[index-1]);
                            $(o.btnGo[index-1]).addClass(o.currClass);
                        }
                        running = false;
                    }
                );
                // Disable buttons when the carousel reaches the last/first, and enable when not
                if(!o.circular) {
                    $(o.btnPrev + "," + o.btnNext).removeClass("disabled");
                    $( (curr-o.scroll<0 && o.btnPrev)
                        ||
                       (curr+o.scroll > itemLength-v && o.btnNext)
                        ||
                       []
                     ).addClass("disabled");
                }

            }
            return false;
        };
    });
};

function css(el, prop) {
    return parseInt($.css(el[0], prop)) || 0;
};
function width(el) {
    return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
};
function height(el) {
    return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
};

})(jQuery);


function Login(){
    jQuery.ajax({
        type : "GET",
        url : "http://www.dvod.com.cn/sns/login.php?type=1&callback="+Math.random(),
        dataType : "jsonp",
        jsonp: 'callback',
        data: "cookietime="+encodeURIComponent(jQuery("#cookietime").val())+
            "&username="+encodeURIComponent(jQuery("#username").val())+
            "&password="+encodeURIComponent(jQuery("#password").val())+
            "&random="+Math.random(),
        success:function(json){
            if(json.status==0)
                alert(json.message);
            if(json.status==1){
                checklogin();
            }
        }
    });
}

$(document).ready(function(){
    $("#zhezhao").hide();
    var allHeight=$(document.body).height();
    var privateHeight=$("#big_ceng");
    privateHeight.css("height",allHeight);
    
    $(".close").click(function(){
        $("#zhezhao").hide();
        $("#zhezhao_kw").hide();
    });
    $(".a_rg").click(function(){
        $("#zhezhao").show();						  
    })
});


/*大小图切换*/
$(function(){
    $('.zuopin ul li').live('mouseover',function(){
       $(this).css("z-index","50");
       $(this).find('div.instro').show().css("z-index","15");
            });
       $('.zuopin ul li').live('mouseout',function(){
            $(this).css("z-index","1");
            $(this).find('div.instro').hide();
    })
    $('.art_hang').mouseover(function(){
       $(this).css("z-index","50");
       $(this).find('div.instro1').show().css("z-index","15");
            });
       $('.art_hang').mouseout(function(){
            $(this).css("z-index","1");
            $(this).find('div.instro1').hide();
    })
    $(".rz_flow li").hover(function(){
            $(this).find('div.tipsy1').show();
    },function(){
            $(this).find('div.tipsy1').hide();	
    })
});


jQuery(function($) {
   
    /*$('.zuopin ul li').hover(function(){
        $(this).css("z-index","50");
        $(this).find('div.instro').show().css("z-index","15");
        $(this).find('a.btn_like').show();
     },function(){
        $(this).css("z-index","1");
        $(this).find('div.instro').hide();
        $(this).find('a.btn_like').hide();
        });向上*/

    //提示信息
    jQuery(function($) {
        $(".tip_nry").hide();
        $(".tip1").click(function(){
            $(".tip2").show();
            $(this).hide();	
        });
        $(".tip2").click(function(){
            $(".tip_nry").show();
            $(this).hide();	
        });
    });
    /*
     关注点击事件
    */

    $(".backs").click(function(){
        var obj=$(this).parent();
        var nowobj=$(this);

        $.ajax({
            type:"POST",
            dataType:"json",
            url:"/center/checkusername.php?random="+Math.random(),
            success:function(json){
                if(json['login']==="true"){
                    var artsid=obj.find(".userslike").html();
                    var name=$("#name").html();

                    $.ajax({
                        type:"POST",
                        dataType:"json",
                        url:"/source/addfocus.php?artsid="+artsid+"&name="+
                            encodeURI(name)+"&random="+Math.random(),
                        success:function(data){
                            if(data['status']=='success'){
                                nowobj.addClass("mylike");
                            }
                            if(data['status']=='all'){
                                nowobj.removeClass("mylike");
                            }
                        }
                    });
                }else{
                    obj.attr({"href":"/login.shtml"});
                    obj.addClass("fancybox fancybox.iframe");
                    obj.trigger("click");
                }
            }
        });
    });
    /*
    截入关注信息
    */
    $.each($(".zuopin ul li"),function(index,element){
        var o=$(this),artid=o.find(".userslike").html();
        if(artid){
            $.ajax({
                type:'GET', 
                dataType:'html',
                url:'/center/gethtml.php?type=getPicture&id='+artid+'&random='+Math.random(),
                success:function(json){
                    if(json=='true')$(element).find("i").addClass('mylike');
                }
            });
        }
    });
});

function loadLeader(href){
    setTimeout(function(){
        window.location.href="/yishupinyd_content1.html?href="+href;
    },2000);
}

//艺术品搜索带代码
function art_search_common(){
    var title=$("input[name='title']").val();
    title=$.trim(title.replace("#", ""));
    if(title){
        var url='http://www.artgogo.com/yishupinsearch.php?title='+title;
        window.location.href=url;
    }
}

//pay
$(document).ready(function(){
    $("input[name='pay_bk1']").bind("click",function(){
        if( $(this).attr( "checked" ) ){
            $(".bk_person_infor").hide();
            $(this).parent().parent().next().show();
        }
   });

   $(".clk_enter").click(function(){
        $(".popup_box").show();	
        $(this).hide();
   });        
})

//mod_menu
$(document).ready(function(){
    $(".quickview").children('li').hover(
        function(){
            if( !$(this).hasClass('nav_li') ){
                $(this).addClass('nav_li');
                $(this).find("div[attr='bd']").hide();
                $(this).find("div[attr='bd']").css('display','list-item');
            }
        },
        function(){
            $(this).removeClass('nav_li');
            $(this).find("div[attr='bd']").hide();
        }
    );
    
    $("#d_menu").click(function(){
        $(".mod_menu_box").toggle();	
    });
    var mod_menu=$(".mod-menu");//导航模块区
    var menu=function(){
        var menuItem=$(".menu-item li"),menuItemBG = menuItem;
        menuItem.mouseenter(function(){
            var myId = $(this).attr( "liID" );
            $(this).addClass("mouse-bg").siblings().removeClass("mouse-bg");
            $(".menu-cont-list").hide();
            $(".menu-cont-list[liID='"+myId+"']").show();
            if( $(".menu-cont-list[liID='"+myId+"']").length ==0 ){
                $(this).css("background-image","none");
                $(".menu-cont").hide();
            }else{
                $(".menu-cont").show();	
            }
        })
        $(".mod-menu").mouseleave(function(){
            $(".menu-cont-list").hide();
            menuItem.removeClass("mouse-bg");
        })
    }//展开二级菜单	
    menu();//执行展开二级菜单函
});

//添加千分位
function  addmicrometer(num){  
    num  =  num+"";  
    var  re=/(-?\d+)(\d{3})/  
    while(re.test(num)){  
        num=num.replace(re,"$1,$2")  
    }  
    return  num;
} 


function load_user(){
   $.ajax({
     type:'GET',
	 dataType:'json',
	 url:'/center/checkload.php?random='+Math.random(),
	 success:function(data){
	   if(data['status']=="false"&&data['look']=="false"){
              window.location.href="/artgogo/index_bainian.shtml";
	   }
	 }
   });
}

//百年的相关
function bainian_relation(){
    $.ajax({
        type:'GET',
        dataType:'json',
        url:'/auction/bn_content_relation.php?random='+Math.random(),
        success:function(json){
            if(json['html']!="")$("#relation_bainian").html(json['html']);
            else $("#relation_bainian").html("暂时无相关作品");
            if(json['count']<6){
              $(".c1_tabs_prev").css("display","none");
              $(".c1_tabs_next").css("display","none");
            }else{
                jQuery("#index_tabs1").jCarouselLite({
                    btnNext: ".c1_tabs_next",
                    btnPrev: ".c1_tabs_prev",
                    speed:300,
                    visible:6,
                    scroll:3
                });	
            }
       }
    });
}

function flashLoad(photo){
    $("#contents").show();
    var photo=$("#"+photo).parent().find(".flashUp").attr("id");
    var path=arguments[1]?arguments[1]:"images";
    $.ajax({
        type:"GET",
        dataType:"HTML",
        url:"/upflash/flash.php?photo="+photo+"&path="+path+"&random="+Math.random(),
        success:function(data){
            $("#pw_main").html(data);
            $("#close").click(function(){
                $("#contents").hide();
                $("#pw_main").html("");
            });
        }
    });
}

jQuery(document).ready(function($) {
    $(".next-menu").hover(function() {
        $('body').css('background', 'red');
    }, function() {
        $(this).hide();
    });
});

//地图切换
$(document).ready(function() {
    var infor= {"北京":"tab_city_infor1", "上海":"tab_city_infor2","台湾":"tab_city_infor3",};  
    $("#tab_city").bind("change", function(){ 
        var divId = infor[this.value];  
        $("#"+divId).show().siblings().hide();  
    });  
});