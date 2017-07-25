/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2012 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.7.2
 *
 */
(function($, window) {

    $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null
        };

        function update() {
            var counter = 0;
      
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit; 
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed; 
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function(event) {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {
                            $self
                                .hide()
                                .attr("src", $self.data(settings.data_attribute))
                                [settings.effect](settings.effect_speed);
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.data(settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function(event) {
            update();
        });

        /* Force initial check if images should appear. */
        update();
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $container.offset().top + $container.height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $container.offset().left + $container.width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $container.offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $container.offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && 
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0, container: window}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0, container: window}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0, container: window}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0, container: window}); },
        "in-viewport"    : function(a) { return !$.inviewport(a, {threshold : 0, container: window}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0, container: window}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0, container: window}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0, container: window}); }
    });

})(jQuery, window);


    $(function(){

        $('#tobh').live('click',function(){
            //window.location.href="/banhua/php/banhua_list.php?"+queryString;
            if( queryString ){
                window.open("/banhua/list.php?"+queryString);
            }else{
                window.open("/banhua/list.php");
            }
        });
        
        
        var pinlei='<!--{eval echo $pinlei}-->';    //pinlei全局参数
        var chushou='<!--{eval echo $chushou}-->';  //chushou全局参数
        var price='<!--{eval echo $price}-->';  //price全局参数
        var size='<!--{eval echo $size}-->';    //size全局参数
        var sort='<!--{eval echo $sort_param}-->';  //sort全局参数
        var tabtype='<!--{eval echo $tabtype}-->';  //默认或者推荐的参数
        var title='<!--{eval echo $title}-->';  //头部搜索title
        var page_href='<!--{eval echo $page_href}-->';
        var is_print='<!--{eval echo $is_print}-->';    //is_print全局参数
        var agg_channel='<!--{eval echo $agg_channel}-->';  //agg_channel全局参数

        $('#toysp').live('click',function(){
            if( !is_print ){
                var tourl=window.location.href;
                if( queryString ){
                    window.open(tourl+"&is_print=否");
                }else{
                    window.open(tourl+"?is_print=否");
                }
            }
        });


        
        //获取当前选择的排序方式,改变背景
        if(sort=='' || sort=='date_desc'){
            $('.sort_date').css('background-image','url(/img/201405/jiantouBg.png)');//最新
        }else if(sort=='date_asc'){
            $('.sort_date').css('background-image','url(/img/201405/jiantouBg_asc.png)');//最新
        }else if(sort=='atten_desc'){
            $('.sort_atten').css('background-image','url(/img/201405/jiantouBg.png)');//关注
        }else if(sort=='atten_asc'){
            $('.sort_atten').css('background-image','url(/img/201405/jiantouBg_asc.png)');//关注
        }else if(sort=='price_desc'){
            $('.sort_price').css('background-image','url(/img/201405/jiantouBg.png)');//成交量
        }else if(sort=='price_asc'){
            $('.sort_price').css('background-image','url(/img/201405/jiantouBg_asc.png)');//成交量
        }
        
        //判断当前选定的排序方式,加粗，加黑
        if((typeof(sort)=='undefined') || (sort=='')){//最新
            $('.sort_date').addClass('on');
        }else if(sort=='date_desc' || sort=='date_asc'){//最新
            $('.sort_date').addClass('on');
        }else if(sort=='atten_desc' || sort=='atten_asc'){//关注
            $('.sort_atten').addClass('on');
        }else if(sort=='price_desc' || sort=='price_asc'){//成交量
            $('.sort_price').addClass('on');
        }
        
        //载入所有的搜索条件，跳转查询
        function param(){//所有的搜索条件
            var page='';
            if((typeof(page) == 'undefined') || (page == '')){
                page=1;
            }
            
            var param='?page='+page;
            
            if((typeof(title) != 'undefined') && (title != '')){
                
                param=param+'&title='+title;
            }
            
            if((typeof(tabtype) != 'undefined') && (tabtype != '')){
                
                param=param+'&tabtype='+tabtype;
            }
            
            if((typeof(pinlei) != 'undefined') && (pinlei != '')){
                param=param+'&pinlei='+pinlei;
            }
            
            if((typeof(chushou) != 'undefined') && (chushou != '')){
                param=param+'&chushou='+chushou;
            }
            
            if((typeof(price) != 'undefined') && (price != '')){
                param=param+'&price='+price;
            }
            
            if((typeof(size) != 'undefined') && (size != '')){
                param=param+'&size='+size;
            }
            
            if((typeof(sort) !='undefined') && (sort != '')){
                param=param+'&sort='+sort;
            }
            // agg_channel
            if((typeof(agg_channel) !='undefined') && (agg_channel != '')){
                param=param+'&agg_channel='+agg_channel;
            }
            //alert(param);
            var url='http://www.artgogo.com'+page_href+param;
            window.location.href=url;
        }
        
        //获取出售当前选择的加粗，加黑
        $(".chushou li span").each(function(){
            var chushou_val=$(this).html();
            if(chushou_val==chushou){
                $(this).addClass('on');
            }
            if(chushou==''){    //未点击页面参数
                if(chushou_val=='全部'){//当first_word为空时‘全部’加粗
                    $(this).addClass('on');
                }
            }
            
            $(this).click(function(){
                
                if(chushou_val != '|'){
                    chushou=chushou_val;
                }
                if(chushou == '全部'){    chushou=''; }
                if(chushou != '可售'){
                    price='全部';//点击可售以外的状态时价格区间未全部
                    sort='date_desc';//点击可售以外的价格排序未默认发布时间
                }
                
                param();
            });
        });
        //获取品类当前选择的加粗，加黑
        $(".pinlei li span").each(function(){
            var pinlei_val=$(this).html();
            if(pinlei_val==pinlei){
                $(this).addClass('on');
            }
            if(pinlei==''){ //未点击页面参数
                if(pinlei_val=='全部'){//当pinlei_val为空时‘全部’加粗
                    $(this).addClass('on');
                }
            }
            $(this).click(function(){
                if(pinlei_val != '|'){
                    pinlei=pinlei_val;
                }
                if(pinlei == '全部'){ pinlei=''; }
                param();
            });
        });
        
        //获取价格当前选择的加粗，加黑
        $(".price li span").each(function(){
            var price_val=$(this).html();
            if(price_val==price){
                $(this).addClass('on');
            }
            if(price==''){  //未点击页面参数
                if(price_val=='全部'){//当pinlei_val为空时‘全部’加粗
                    $(this).addClass('on');
                }
            }
            $(this).click(function(){
                if(price_val != '|'){
                    price=price_val;
                    chushou='可售';//价格排序销售状态全都是‘可售’
                }
                if(price == '全部'){  price=''; }
                param();
            });
        });
        
        //获取尺寸当前选择的加粗，加黑
        $(".size li span").each(function(){
            var size_val=$(this).html();
            if(size_val==size){
                $(this).addClass('on');
            }
            if(size==''){   //未点击页面参数
                if(size_val=='全部'){//当size_val为空时‘全部’加粗
                    $(this).addClass('on');
                }
            }
            $(this).click(function(){
                if(size_val != '|'){
                    size=size_val;
                }
                if(size == '全部'){   size=''; }
                param();
            });
        });
        
        if(is_print=='否'){
            $('#tobanhuaall').removeClass('on');
            $('#toysp').attr('style','');
        }
        
        //按最新排序,给排序的参数赋值
        $('.sort_date').click(function(){
            if(sort=='' || sort=='date_desc'){
                sort='date_asc';
            }else{
                sort='date_desc';
            }
            param();
        });
        
        //按关注数排序，给排序参数赋值
        $('.sort_atten').click(function(){
            if(sort=='atten_desc'){
                sort='atten_asc';
            }else{
                sort='atten_desc';
            }
            param();
        });
        
        //按价格排序，给排序参数赋值
        $('.sort_price').click(function(){
            if(sort=='price_desc'){
                sort='price_asc';
            }else{
                sort='price_desc';
            }
            chushou='可售';//价格排序销售状态全都是‘可售’
            param();
        });
        
        //当鼠标经过默认排序或艺术家推荐时查询条件改变
        $('.moren').click(function(){//鼠标在默认时
            
            if(tabtype=='tuijian'){
                tabtype='moren';
                param();
            }
        });
        
        $('.tuijian').click(function(){// 鼠标在推荐时
        
            if(tabtype=='moren' || tabtype==''){
                tabtype='tuijian';
                param();
            }
            
        });
        if(tabtype=='' || tabtype=='moren'){
        
            $('.moren').addClass('on');
        }else if(tabtype=='tuijian'){
        
            $('.tuijian').addClass('on');
        }
        
        
        $('.ssbg').live('click',function(){
            var type_on=$(this).find('.type_click').val();
            //alert(type_on);
            if(type_on=='pinlei'){ pinlei=''; }
            if(type_on=='chushou'){ chushou=''; }
            if(type_on=='price'){ price=''; }
            if(type_on=='title'){ title=''; }
            if(type_on=='size'){ size=''; }
            param();
        });
        
        
        //搜索条件显示
        var condit_html='';
        function condit(type_on,condit_val){
            condit_html=condit_html+'<li class="ssbg"><span style="padding-left:13px;">'+condit_val+'<img style="margin-left: 6px;margin-top: -3px;vertical-align: middle;" src="/img/201405/ssbg1.jpg"></span><input class="type_click" type="hidden" value="'+type_on+'"></span></li>';
            
        }
        if(pinlei!=''&&pinlei!='全部'){ condit('pinlei',pinlei); }
        if(chushou!=''&&chushou!='全部'){ condit('chushou',chushou); }
        if(price!=''&&price!='全部'){ condit('price',price); }
        if(title!=''&&title!='全部'){ condit('title',title); }
        if(size!=''&&size!='全部'){ condit('size',size); }
        
        //chushou price print_cate title
        $('.conditions').html(condit_html);
});
