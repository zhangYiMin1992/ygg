/*
载入(艺术品)关注信息,查看当前用户是否关注，改变颜色
*/
var attention=function(){
$(".instro_ss").each(function(){

    var o=$(this),artid=o.find(".userslike").html();
  
   if(artid){
	$.ajax({
	  type:'GET', 
	  dataType:'html',
	  url:'/center/gethtml.php?type=getPicture&id='+artid+'&random='+Math.random(),
	  success:function(json){
		
	     if(json=='true'){
			//$(element).find("i").addClass('mylike');
			
			//$(this).find('.instro_ss').css('background-position',' 100% 100% ');
			o.css('background-position',' 100% 100% ');
			
		 }
	  }
	  
	});
  } 

});
}

/*
*	载入(艺术家)关注信息,查看当前用户是否关注，改变颜色
*/
function attention_artist(){
	$('.attent_artist').each(function(){
		var artist_id=$(this).find('.artist_id').val();
		var o=$(this);
		$.ajax({
			type:'POST',
			dataType:'json',
			url:'/201405/artist_attention.php?type=check_attention&artist_id='+encodeURI(artist_id),
			success:function(json){
				if(json.check==true){
					o.css('background-position',' 100% 100% ');
				}
				
			}
		});
	});
}

	var shop_id=shop_id;//店家gid

//jquery加载区域
$(function(){
/*
* 店家 内容页查询当前用户是否关注
*/

	if(shop_id){//店铺 GlobalID
		var atten_shop=$('.atten_shop');
		$.ajax({
			type:'POST',
			dataType:'json',
			url:'/201405/shop_attention.php?type=check_attention&shop_id='+encodeURI(shop_id),
			success:function(json){
				atten_shop.next('.zhishi1').html(json.atten_num);
				if(json.check==true){
					atten_shop.css('background','url(/img/201405/gunzhu_shop.jpg) no-repeat');
				}
			}
		});

	}
	
/*
*	店家 内容页点击关注事件
*/


$('.atten_shop').click(function(){
	var atten_shop=$('.atten_shop');
	
	$.ajax({
	    type:"POST",
	    dataType:"json",
	    url:"/center/checkusername.php?random="+Math.random(),
	    success:function(json){
			if(json['login']==="true"){
				$.ajax({
					type:'POST',
					dataType:'json',
					url:'/201405/shop_attention.php?type=add_atten&shop_id='+encodeURI(shop_id),
					success:function(json){
						//alert(json.message);
						if(json.is_atten==true){
							atten_shop.css('background','url(/img/201405/gunzhu_shop.jpg) no-repeat');
							atten_shop.next('.zhishi1').html(json.atten_num);
						}else{
							atten_shop.css('background','url(/img/201405/gunzhu_shop_1.jpg) no-repeat');
							atten_shop.next('.zhishi1').html(json.atten_num);
						}
					}
				});
			}else{
				atten_shop.next('.zhishi1').attr({"href":"/login.shtml"});
				atten_shop.next('.zhishi1').addClass("fancybox fancybox.iframe");
				atten_shop.next('.zhishi1').trigger("click");
			}
	   }
	});	
	
	
	
});

/*
载入 艺术家 关注信息
*/
attention_artist();

/*
*	(艺术家)点击关注事件 
*/
$('.attent_artist').live('click',function(){
	var obj=$(this).parent();
	var nowobj=$(this);
	var artist_id=$(this).find('.artist_id').val();
	
	$.ajax({
		type:"POST",
		dataType:'json',
		url:"/201405/artist_attention.php?type=add_atten&artist_id="+encodeURI(artist_id),
		success:function(json){
		
			if(json.is_atten==true){//关注成功
				nowobj.css('background-position',' 100% 100% ');
				nowobj.next('.zhishi1').html(json.atten_num);
			}else if(json.is_atten==false){//取消关注
				nowobj.css('background-position',' 0% 0% ');
				nowobj.next('.zhishi1').html(json.atten_num);
			}
		}
	});
});


/*
载入 艺术品 关注信息
*/
attention();
	
	
/*
  艺术品 关注点击事件
*/
$(".instro_ss").live('click',function(){//艺术品列表页
	
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
			  url:"/201405/addfocus.php?artsid="+artsid+"&name="+encodeURI(name)+"&random="+Math.random(),
			  success:function(data){
				  if(data['status']=='success'){
			        //nowobj.addClass("mylike");
					nowobj.css('background-position',' 100% 100% ');
					nowobj.next('.zhishi').html(data.count);
				  }
				  if(data['status']=='all'){
				    //nowobj.removeClass("mylike");
					nowobj.css('background-position',' 0% 0% ');
					nowobj.next('.zhishi').html(data.count);
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
$(".instro_ss1").click(function(){//艺术品内容页面点击关注事件
	var obj=$(this).parent();
	var nowobj=$(this);
	
    $.ajax({
	   type:"POST",
	   dataType:"json",
	   url:"/center/checkusername.php?random="+Math.random(),
	   success:function(json){
         if(json['login']==="true"){
            var artsid=obj.find(".instro_artid").val();
			var name=$("#name").html();
			
			$.ajax({
			  type:"POST",
			  dataType:"json",
			  url:"/201405/addfocus.php?artsid="+artsid+"&name="+encodeURI(name)+"&random="+Math.random(),
			  success:function(data){
				  if(data['status']=='success'){
			        //nowobj.addClass("mylike");
					nowobj.css('background-position',' 100% 100% ');
					nowobj.next('.zhishi1').html(data.count);
				  }
				  if(data['status']=='all'){
				    //nowobj.removeClass("mylike");
					nowobj.css('background-position',' 0% 0% ');
					nowobj.next('.zhishi1').html(data.count);
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

//艺术品列表页面跳页搜索
$('.select_input').click(function(){
	var page=$(this).parents('.page').find('.select_page').val();
	var param=$(this).parents('.page').find('.hidden_param').val();
	var page_href=$(this).parents('.page').find('.page_href').val();
	var url=" http://www.artgogo.com"+page_href+"?page="+page+param;
	
	window.location.href=url;
	
});

//艺术品内容页面查询当前用户是否关注
var obj_i1=$('.instro_ss1');
var i1_artid=obj_i1.parent().find(".instro_artid").val();

	if(i1_artid){
   
		$.ajax({
		  type:'GET', 
		  dataType:'html',
		  url:'/center/gethtml.php?type=getPicture&id='+i1_artid+'&random='+Math.random(),
		  success:function(json){
			 if(json=='true'){
				obj_i1.css('background-position',' 100% 100% ');
			 }
		  }
		});
	} 
//艺术品内容页面查询关注数  
	var artid_c=$(".instro_artid").val();
	if(artid_c){
		$.ajax({
		  type:'GET', 
		  dataType:'html',
		  url:'/201405/select_count.php?artid='+artid_c,
		  success:function(data){
			$('.zhishi1').html(data);
		  }
		});
	}
	
//头部搜索start------

//onfocus="if(this.value==this.defaultValue){this.value='';this.style.color='#000000';}" 
//onblur="if(this.value==''){this.value=this.defaultValue;this.style.color='#CDCDCD';}"


$('.sreach_button').click(function(){
	
	var search=$('#search_enter').val();
	
	var url="http://www.artgogo.com/yishupin?title="+search;
	window.location.href=url;
});

$('#search_enter').focus(function(){

	if($(this).val()=='Search....'){
		$(this).val('');
	}else{
		if($('#search_enter').val()!=''){
			$('.search_suoyin').show();
			var first=true;
		}
		
	}
	$(this).css('color','black');
	$(window).keydown(function(event){
	
		var search=$('#search_enter').val();
		if(search=='Search....') search='';
		var url="http://www.artgogo.com/yishupin?title="+search;
		
		if(event.keyCode==13){//点击回车，执行搜索
			window.location.href=url;
		}
		
		
	});
	var search=$('#search_enter').val();
	Int=setInterval(function(){
		
		if($('#search_enter').val()==''){
			$('.search_suoyin').hide();
			search=$('#search_enter').val();
		}else{
			if(search!=$('#search_enter').val() || first==true){
				$('.search_suoyin').show();
				first=false;
				search=$('#search_enter').val();
				$.ajax({
				  type:'GET', 
				  dataType:'html',
				  url:'/201405/search_ajax.php?title='+encodeURI(search),
				  success:function(data){
                                    $('.search_suoyin').html(data);
				  }
				});
			}
		}
		
		
		
	},1000);
	
	
});

$('#search_enter').blur(function(){
	clearInterval(Int);
	
	if($(this).val()==''){
		$(this).val('Search....');
		$(this).css('color','#ccc');
	}
	//$('.search_suoyin').hide();
});


$('body').live('click',function(event){
	//$(this).live('mousemove',function(event){
		//alert(event.clientX);
	//});
	if($('.search_suoyin').css('display')=='block'){
		var mouseX=event.clientX;//鼠标相对页面的位置
		var mouseY=event.clientY;
		var div_X=$('.search_suoyin').offset().left;//隐藏框相对页面的位置
		var div_Y=$('.search_suoyin').offset().top;
		var div_W=$('.search_suoyin').width();//隐藏框的宽度
		var div_H=$('.search_suoyin').height();
		var search_enter_W=$('#search_enter').width();//搜索输入框的宽度
		var search_enter_H=$('#search_enter').height();
		//alert(mouseY+'---'+div_Y+'---'+div_H); 
		//点击鼠标时，鼠标不在隐藏框区域和输入框区域就隐藏掉div
		//鼠标小于div的起始位置，同时鼠标大于div的结束位置
		if(mouseX<=div_X || mouseY<=(div_Y-search_enter_H) || mouseX>=(div_X+div_W) || mouseY>=(div_Y+div_H)){
			$('.search_suoyin').hide();
		}
	
		
	}
});
//头部搜索end-----

$('.quest').mouseover(function(){
	$('.quest_hide').show();
});
$('.quest').mouseout(function(){
	$('.quest_hide').hide();
});

});
