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

//// 简单的节流函数
function throttle(func, wait, mustRun) {
    var timeout,
            startTime = new Date();

    return function () {
        var context = this,
                args = arguments,
                curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
            func.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(func, wait);
        }
    };
}

//获取发送ajax条件的位置
function loading($el){
    return $(window).height()+$(window).scrollTop()>$el.offset().top
}

//首页轮播
;(function(w, $, undefined) {
    if (!$) {
        return
    }
    var CSS3 = function() {// $(this).css( CSS3({ "transform": "translate3d(" + 100 * k + "%, 0, 0)" }) )
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
        return o
    };
    var Banner = function(o) {
        o = o || {};
        this.o = $.extend({
            init: function() {},
            before: function() {},
            moving: function() {},
            after: function() {}
        },
        o);
        this.init()
    };
    Banner.prototype = {
        initData: function() {
            var that = this;
            that.touchLock = false;
            that.interval = null;
            that.$el = that.o.$el;
            
            that.content = that.$el.find("[data-module=content]");
            that.item = that.content.children();
            var first = that.item.first().clone();
            var last = that.item.last().clone();
            that.content.append(first);
            that.content.prepend(last);
            that.item = that.content.children();
            that.length = that.item.length;
            that.index = 1;
            that.nav = that.$el.find("[data-module=nav]")
        },
        initPage: function() {
            var that = this;
            that.item.each(function(k, v) {
                $(this).css(CSS3({
                    "transform": "translate3d(" + 100 * k + "%, 0, 0)"
                }))
            });
            that.setPos( - 100 * that.index + "%", false)
        },
        setPos: function(pos, needTransition) {
            var that = this;
            that.loadImage(that.item.eq(that.index).prev().find("img[data-src]"));
            that.loadImage(that.item.eq(that.index).next().find("img[data-src]"));
            var ani = {};
            ani.transition = needTransition ? "all 0.4s ease": "all 0s ease";
            ani.transform = "translate3d(" + pos + ", 0, 0)";
            that.content.css(CSS3(ani));
            that.nav.children().removeClass("on").eq(that.index - 1).addClass("on");
            setTimeout(function() {
                if (that.index <= 0) {
                    that.index = that.length - 2;
                    that.setPos( - 100 * that.index + "%", false);
                    return false
                }
                if (that.index >= that.length - 1) {
                    that.index = 1;
                    that.setPos( - 100 * that.index + "%", false);
                    return false
                }
            },
            400)
        },
        bindEvent: function() {
            var that = this;
            var $el = that.$el;
            var pos = {};
            var direction = "";
            $el[0].addEventListener("touchstart", 
            function(ev) {
                direction = "";
                that.stop();
                pos.x1 = ev.touches[0].pageX;
                pos.y1 = ev.touches[0].pageY;
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
                that.setPos(x - that.index * width + "px", false);
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
                    that.index--
                } else {
                    that.index++
                }
                that.setPos( - 100 * that.index + "%", true);
                that.play();
                ev.preventDefault();
                return false
            },
            false)
        },
        play: function() {
            var that = this;
            that.stop();
            that.interval = w.setInterval(function() {
                that.index++;
                that.setPos( - 100 * that.index + "%", true)
            },
            4000)
        },
        stop: function() {
            var that = this;
            w.clearInterval(that.interval)
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
        init: function() {
            var that = this;
            that.touchLock = false;
            that.interval = null;
            that.$el = that.o.$el;
            that.content = that.$el.find("[data-module=content]");
            that.item = that.content.children();
            that.length = that.item.length;
            if (that.length <= 1) return;
            that.loadImage(that.item.last().find("img[data-src]"), 
            function() {
                that.initData();
                that.initPage();
                that.bindEvent();
                that.play();
                that.o.init(that)
            })
        }
    };
    $.fn.Banner = function() {
        return this.each(function() {
            new Banner({
                $el: $(this)
            })
        })
    }
})(window, $);
$(function(){
    $("#benlai_banner").Banner()
})

;$(function(){
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
// 艺术品点赞
;$(function(){
    var onOff=true;
    var num=$(".praise font").html();
    $(".praise").click(function(){
        if(onOff){
            $(this).addClass("color");
            num++;
            $(".praise font").html(num);
            onOff=false;
        }else{
           $(this).removeClass("color");
            num--;
            $(".praise font").html(num);
            onOff=true;
        }
        });
     
    });
// header scroll
    ;(function($){
        var bindScroll=function(fn){
            var beforeScrollTop = document.body.scrollTop,
            fn = fn || function() {};
            window.addEventListener("scroll", function() {
                var afterScrollTop = document.body.scrollTop,
                    delta = afterScrollTop - beforeScrollTop;
                if( delta === 0 ) return false;
                fn( delta > 0 ? "down" : "up" );
                beforeScrollTop = afterScrollTop;
            }, false);
        }
        var Scroll=function($h){
            var num=200;
            bindScroll(function(direction) {
              if(direction=='down' && document.body.scrollTop>num){
                $h.fadeOut({height:'0%'},1500);
              }
              if(direction=='up'){
                  if($h.css('opacity')==1) return;
                  $h.fadeIn({height:'100%'},1500);
                  $h.css('opacity','1');
              }
              if(document.body.scrollTop==0){
                return;
              }
            });
        }
         $.fn.Scroll = function() {
            return this.each(function() {
                new Scroll($(this))
            })
        }
    })($);

    $(function(){
    $("[data-header=scroll]").Scroll()
});

    // 艺术家列表页滑动效果
 $(function(){
    $('body').on("touchstart","[data-module=hscroll] ul",function(t){
        var e = this;
        t = t.touches ? t.touches[0] : t;
        var i = t.pageX
          , a = e.scrollLeft
          , o = function(t) {
            var t = t.touches ? t.touches[0] : t;
            Math.abs(i - t.pageX) < 24 || (e.scrollLeft = a + (i - t.pageX))
        }
          , r = function(t) {
            $("body").off("touchmove", o).off("touchend", r)
        };
        $("body").on("touchmove", o).on("touchend", r)
    })
});

 //图片截取
 var LazyLoad = {
     IsShow: function($el) {
         return $(window).height() + $(window).scrollTop() > $el.offset().top
     },
     LoadImage: function(o) {
         var _self = this;
         var $imgs = $("img[lazyload]");
         if(o.tab){
            $imgs=$(o.tab+" img[lazyload]");
         }
         $imgs.each(function() {
             var $this = $(this);
             var $parent=$this.parent();
             if (_self.IsShow($this)) {
                 var src = $this.attr("lazyload");
                 $this.removeAttr("lazyload");
                 $this.attr("src", src);
                 $this.show();
             }
             if(!o.isImgCenter || !o){return}
             this.onload=function(){

                     var imgBoxW=$parent.width();
                     var imgBoxH=$parent.height();
                     var imgW=$this.width();
                     var imgH=$this.height();
                     var rate =imgBoxW / imgBoxH;
                     var ratio = imgW / imgH;
                     var sw, sh, sx, sy;
                     // console.log(imgBoxW);
                     // if (ratio > rate) {
                     //     sw = imgBoxW;
                     //     sh = imgBoxW/ratio;
                     //     sx = 0;
                     //     sy = (imgBoxH - sh)/ 2;
                     // } else {
                     //     sw = imgBoxH*ratio;
                     //     sh = imgBoxH;
                     //     sx = (imgBoxW-sw)/2;
                     //     sy = 0;
                     // }
                     if(ratio>rate){
                        sh=imgBoxH;
                        sw=ratio*imgBoxH;
                        sy=0;
                        sx=(imgBoxW-sw)/2;
                     }else{
                        sw=imgBoxW;
                        sh=imgBoxW/ratio;
                        sx=0;
                        sy=(imgBoxH-sh)/2;
                     }
                     $this.css({
                         position:'absolute',
                         left:sx+'px',
                         top:sy+'px',
                         width:sw+'px',
                         height:sh+'px'
                     });
                     this.onload=null;
                 }
         })
     },
     Run: function(o) {
         var _self = this;
         _self.LoadImage(o);
         if (_self.bind) return;
         $(window).bind("touchmove touchend scroll", 
         function() {
             _self.LoadImage(o)
         });
         _self.bind = true
     }
 };

//   var digitsRE = /(\d{3})(?=\d)/g;

//   function currency (value, currency, decimals) {
//     value = parseFloat(value)
//     if (!isFinite(value) || (!value && value !== 0)) return ''
//     currency = currency != null ? currency : '¥'
//     decimals = decimals != null ? decimals : 2
//     var stringified = Math.abs(value).toFixed(decimals)
//     var _int = decimals
//       ? stringified.slice(0, -1 - decimals)
//       : stringified
//     var i = _int.length % 3
//     var head = i > 0
//       ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
//       : ''
//     var _float = decimals
//       ? stringified.slice(-1 - decimals)
//       : ''
//     var sign = value < 0 ? '-' : ''
//     return sign + currency + head +
//       _int.slice(i).replace(digitsRE, '$1,') +
//       _float
//   }
//   undefined
//   currency(1000);
//   "¥1,000.00"
//   currency(20000);
//   "¥20,000.00"

//   var products=[{
//     price:100,
//     title:'111',
//     quantity:2
// },{
//     price:200,
//     title:'111',
//     quantity:1
// },{
//     price:300,
//     title:'111',
//     quantity:3
// }];
// products.reduce(function(total,p){
//     return total+p.price * p.quantity
// },0);
// 待付款订单状态显示
var change=function(){
    var $state=$('.state a');
    // console.log($state);
    for(var i=0;i<$state.length;i++){
        if($state.eq(i).html()=='待付款'){
            $state.eq(i).html('立即支付');
            $state.eq(i).parent().addClass('non_payment');
        }
    }
}

function getParam() {
    var t = location.search
      , e = new Object;
    if (-1 != t.indexOf("?")) {
        var n = t.substr(1);
        strs = n.split("&");
        for (var i = 0; i < strs.length; i++)
            e[strs[i].split("=")[0]] = strs[i].split("=")[1]
    }
    return e
}

//支付方式选择
$('.payment a').click(function(){
    if($(this).find('div').attr('class')!='chose'){
        $(this).find('div').addClass('chose');
        $(this).siblings().find('div').removeClass('chose');
    }
});

// 模拟选择器
   function __dealCssEvent(eventNameArr, callback) {
    var events = eventNameArr,
        i, dom = this; // jshint ignore:line

    function fireCallBack(e) {
        /*jshint validthis:true */
        if (e.target !== this) return;
        callback.call(this, e);
        for (i = 0; i < events.length; i++) {
            dom.off(events[i], fireCallBack);
        }
    }
    if (callback) {
        for (i = 0; i < events.length; i++) {
            dom.on(events[i], fireCallBack);
        }
    }
}

//动画结束事件兼容
$.fn.animationEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
    return this;
};
$.fn.transitionEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
    return this;
};
$(function(){
    var mPickerDefaults = {
        display: 'bottom',
        shadow: false,
        level: 1,
        rows: 4,
        Linkage: false,
        dataJson: '',
        height: 36,
        idDefault: false,
        splitStr: ' ',
        isshort : false,
        header: '<div class="mPicker-header"></div>',
        footer: '<div class="mPicker-footer"><a href="javascript:;" class="mPicker-confirm">确定</a><a href="javascript:;" class="mPicker-cancel">取消</a></div>',
        confirm: function() {},
        cancel: function() {}
    };

    var moveStartLock;

    var ulWidth = ['100%', '50%'];

    var $body = $('body');

    var $mask=$('<div class="mPicker-mask hide"></div>');

    var $mPicker=$('<div class="mPicker hide"></div>');

    var lock,timeTouchend;
    /**
     * 添加mPicker容器
     */
    if (!$('.mPicker').length) {
        $body.append($mPicker);
        $mPicker.append($mask);
    }
    /**
     * 阻止默认滚动
     */
    $body.on('touchmove', function(event) {
        if (lock) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
    /**
     * 禁止滚动－－防止滚动选择时页面滚动
     */
    $body.on({
        touchstart: function(event) {
            event.preventDefault();
            lock = 1;
        },
        touchmove: function(event) {
            event.preventDefault();
            //兼容部分手机有时候没有触发touchend
            clearTimeout(timeTouchend);
            timeTouchend = setTimeout(function() {
                lock = 0;
            }, 100);
        },
        touchend: function(event) {
            event.preventDefault();
            lock = 0;
        }
    }, '.mPicker-main');

    function MPicker(ele,options){
        console.log(options);
        if (!ele.length) {
            return false;
        }
        this.container=ele;
        this.mpicker=$('.mPicker');
        this.mask=this.mpicker.find('.mPicker-mask');
        this.options = $.extend({}, mPickerDefaults, options);
        this.init();
        this.event();
        this.container.data('mPicker', this);

    }


    MPicker.prototype={
        //初始化MPicker
        init:function(ele,options){

            /**
             * 根据行数计算居中的位置
             */
            this.middleRowIndex=parseInt(this.options.rows / 2.5);
            //展示方式
            this.disy = this.options.display === 'bottom' ? 'mPicker-bottom down' : 'mPicker-modal';

            this.container.attr('readonly',true);
        },
        //初始化mpicker,根据json渲染html结构,添加遮罩，边框等
        render:function(){
            /**
             *  初始化mpicker,根据json渲染html结构
             *  添加遮罩，边框等
             */
            var listStr;
            var jsonData = [];
            var mainStr;
            var self=this;
            /**
             * 添加 mPicker-main元素
             */
            jsonData.push(self.options.dataJson);
            if (self.options.level === 2) {
                var childStr = getChildJson(self.options.dataJson[0]);
                jsonData.push(childStr);
            }
            listStr = concatHtmlList.call(self,jsonData);
            mainStr = '<div class="mPicker-main '+ self.disy +'" data-pickerId="' + self.pickerId + '">' + self.options.header + '<div class="mPicker-content">' + listStr + '</div><div class="mPicker-shadow"></div>' + self.options.footer + '</div>';
            self.mpicker.append(mainStr);
            /**
             * 设置变量
             */
            self.mpickerMain = self.mpicker.find('.mPicker-main');
            //元素集合
            var $content=self.mpickerMain.find('.mPicker-content');
            var $list=self.mpickerMain.find('.mPicker-list');
            var $listUl=$list.find('ul');
            //var $itemOne=$listUl.eq(0);
            //var $itemTwo=self.options.level === 2?$listUl.eq(1):false;
            //设置多列宽度
            self.options.level > 1 ?$list.width(ulWidth[self.options.level - 1]):false;

            //添加选中的边框
            $list.append('<div class="mPicker-active-box"></div>');
            $list.find('.mPicker-active-box').height(self.options.height);
            /**
             * 设置选中的边框位置
             */
            var activeBoxMarginTop = self.options.rows % 2 === 0 ? -self.options.height - 2 + 'px' : -self.options.height * 0.5 - 2 + 'px';

            $content.find('.mPicker-active-box').css({
                'margin-top': activeBoxMarginTop
            });
            /**
             * 设置内容高度
             */
            $content.height(self.options.height * self.options.rows);
            $list.height(self.options.height * self.options.rows);

        },
        showPicker:function(){
            var self=this;
            self.mpicker.data('object',self);
            //元素集合
            //var $content=this.mpickerMain.find('.mPicker-content');

            //var $listUl=$list.find('ul');
            // var $itemOne=$listUl.eq(0);
            // var $itemTwo=this.options.level === 2?$listUl.eq(1):false;
            self.render();
            var $list=self.mpicker.find('.mPicker-list');
            self.container.focus();
            self.container.blur();
            self.mpicker.removeClass('hide');
            self.mask.removeClass('hide');

            clearTimeout(self.timer);
            self.timer=setTimeout(function() {
                self.mpickerMain.removeClass('down');
            }, 10);
            /**
             * 显示默认值(判断点击确定选择后不再获取默认值)
             */
            if (!self.noFirst && self.options.idDefault) {
                matchDefaultData.call(self);
            }
            /**
             * 获取input的data-id显示选中的元素
             */
            var id = [];
            setTransitionY(self.container, 0);
            $list.each(function(index, ele) {
                var dataVal = self.container.data('id' + (index + 1)) ? self.container.data('id' + (index + 1)) : 0;
                id.push(dataVal);
            });
            //获得选中的元素
            setItemMultiple.call(self,id);
        },
        hidePicker:function(callback){
            var self=this;
            self.mask.addClass('hide');

            if(self.options.display === 'bottom'){
                self.mpicker.find('.mPicker-main').addClass('down').transitionEnd(function() {
                    self.mpicker.addClass('hide');
                    self.mpicker.find('.mPicker-main').remove();
                    if (typeof(callback) === 'function') {
                        callback.call(self);
                    }
                });
                return false;
            }

            self.mpicker.addClass('hide');
            callback.call(self);
            self.mpicker.find('.mPicker-main').remove();
        },
        updateData:function(data){
            var self=this;
            if (!data.length) {
                return;
            }
            self.noFirst = false;
            for (var i = 0; i < self.options.level; i++) {
                self.container.data('id' + (i + 1), 0);
                self.container.data('value' + (i + 1), '');
            }
            self.options.dataJson = data;
            self.mpicker.find('.mPicker-main').remove();
        },
        confirm:function(){
            var self=this;
            var str = '';
            var $list=self.mpicker.find('.mPicker-main').find('.mPicker-list');
            var $listUl=$list.find('ul');
            self.noFirst = true;
            $.each($listUl, function(index, ele) {
                var $active = $(ele).find('.active');
                var splitStr = index === 0 ? '' : self.options.splitStr;
                if ($active.length > 0) {
                    index = index + 1;
                    self.container.data('value' + index, $active.data('value'));
                    self.container.data('id' + index, $active.data('id'));
                    str += splitStr + $active.text();
                }
            });
            self.container.val(str);
            self.hidePicker(self.options.confirm);

        },
        cancel:function(){
            var self=this;
            self.hidePicker(self.options.cancel);
        },
         /**
         *  事件
         *  取消，确定，点击遮罩，列表滑动事件
         */
        event : function() {
            /**
             * 点击打开选择
             */
            var self=this;
            this.container.off('touchstart.container click.container').on('touchstart.container click.container', function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.showPicker();
            });
            //点击确定
            this.mpicker.off('touchstart.confirm click.confirm').on('touchstart.confirm click.confirm','.mPicker-confirm', function(e) {
                e.preventDefault();
                var self=$('.mPicker').data('object');
                self.confirm();
            });

            //点击取消
            this.mpicker.off('touchstart.cancel click.cancel').on('touchstart.cancel click.cancel','.mPicker-cancel', function(e) {
                e.preventDefault();
                var self=$('.mPicker').data('object');
                self.cancel();
            });

            //点击遮罩取消
            this.mpicker.off('touchstart.mask click.mask').on('touchstart.mask click.mask','.mPicker-mask', function(e) {
                e.preventDefault();
                var self=$('.mPicker').data('object');
                if(self.options.shadow){
                    self.cancel();
                }
            });

            //遍历下拉列表
            var startY;
            var curY;
            var moveY;


            this.mpicker.off('touchstart.list mousedown.list').on('touchstart.list mousedown.list','.mPicker-list', function(event) {
                fnTouches(event);

                var $this = $(this).find('ul');

                var tranY = getTranslateY($this);

                startY = getTouches(event).y - tranY;

                changeTime(0, $this);

                moveStartLock=true;
            });

            this.mpicker.off('touchmove.list mousemove.list').on('touchmove.list mousemove.list', '.mPicker-list',function(event) {
                event.preventDefault();
                if(!moveStartLock){
                    return false;
                }
                var self=$('.mPicker').data('object');

                fnTouches(event);

                var translate;

                var $this = $(this).find('ul');

                var listHeight = $this.height();

                var itemHeight = self.options.height * self.options.rows;

                var transMaxY = itemHeight - listHeight - parseInt(self.options.rows / 2) * self.options.height;

                var transMinY = self.middleRowIndex * self.options.height;

                curY = getTouches(event).y;

                moveY = curY - startY;

                translate = Math.round(moveY);
                //过了
                translate = translate > transMinY ? transMinY : translate;
                translate = translate < transMaxY ? transMaxY : translate;
                // console.info(self.options.rows)
                setTransitionY($this, translate);
                //兼容部分手机有时候没有触发touchend
                clearTimeout(self.timeTouchend);
                self.timeTouchend = setTimeout(function() {
                    touchEndFn.call(self,$this);
                }, 100);
            });

            this.mpicker.off('touchend.list mouseup.list').on('touchend.list mouseup.list', '.mPicker-list',function(event) {
                event.preventDefault();
                var self=$('.mPicker').data('object');
                var $this = $(this).find('ul');
                touchEndFn.call(self,$this);

            });
        }
    }
    function getTouches(event) {
        if (event.touches !== undefined) {
            return {
                x : event.touches[0].pageX,
                y : event.touches[0].pageY
            };
        }

        if (event.touches === undefined) {
            if (event.pageX !== undefined) {
                return {
                    x : event.pageX,
                    y : event.pageY
                };
            }
            if (event.pageX === undefined) {
                return {
                    x : event.clientX,
                    y : event.clientY
                };
            }
        }
    }


    /**
     *  滑动结束执行函数
     *  ele:对应的list==>ul
     *  如果是联动，则更新相应的list html
     */
    function touchEndFn(ele) {
        clearTimeout(this.timeTouchend);
        var result = setActiveItem.call(this,ele);

        var resultId = result.target.data('id');

        var itemIndex = this.mpicker.find('.mPicker-list ul').index(ele);
        // this.lock=0;
        //点第一个联动
        if (this.options.Linkage && itemIndex === 0) {
            refreshItemTwo.call(this,resultId);
        }
        //回调函数
        // callbackFnName[itemIndex].call(ele, result);

        changeTime(400, ele);

        moveStartLock=false;
    }

    /**
     *  第一次打开匹配默认值
     */
    function matchDefaultData() {
        var self=this;
        var inputVal = this.container.val().split(this.options.splitStr);
        var defaultId = [];
        var defaultValue = [];
        var dataLevel2;
        var hasLevel2;
        //遍历获取id
        var nameEach = function(data, index) {
            $.each(data, function(key, val) {
                if (val.name == inputVal[index]) {
                    defaultId[index] = key;
                    defaultValue[index] = val.value;
                    self.container.data('value' + (index + 1), defaultValue[index]);
                    self.container.data('id' + (index + 1), defaultId[index]);
                    return false;
                }
            });
        };
        if (typeof(inputVal) !== 'object' || !inputVal.length || !self.mpicker.find('.mPicker-main')) {
            return;
        }

        //将name值默认匹配成id，一旦匹配就跳出循环，多个匹配取第一个
        //匹配一级
        nameEach(this.options.dataJson, 0);
        //匹配二级
        dataLevel2 = this.options.Linkage ? this.options.dataJson[defaultId[0]] : this.options.dataJson[0];

        if (this.options.Linkage && this.options.level === 2 && defaultId[0] && inputVal.length > 1) {
            hasLevel2 = 1;
        }

        if (!this.options.Linkage && this.options.level === 2 && inputVal.length > 1) {
            hasLevel2 = 1;
        }

        if (hasLevel2) {
            dataLevel2 = getChildJson(dataLevel2);
            nameEach(dataLevel2, 1);
        }

    }
    /**
     *  滑动结束，设置transtion值，返回当前选中的li index和元素
     *  obj:滑动的元素
     *  val:可有可没有。可传入data-id或不传
     */
    function setActiveItem(obj, val) {
        var result;
        var y = Math.round((getTranslateY(obj) / this.options.height));
        //得到选中的index
        var index = typeof(val) === 'number' ? obj.find('li').index(obj.find('li[data-id="' + val + '"]')) : this.middleRowIndex - y;

        var y2 = -this.options.height * (index - this.middleRowIndex);
        setTransitionY(obj, y2);
        //添加选中样式
        obj.find('li').eq(index).addClass('active').siblings('li').removeClass('active');

        result = {
            target: obj.find('li').eq(index),
            index: index
        };
        return result;
    }
    /**
     *  传入第一级index，更新第二级html（联动的情况下）
     */
    function refreshItemTwo(index) {
        //兼容不存在child
        var $itemTwo=this.mpicker.find('.mPicker-list ul').eq(1);
        var data = getChildJson(this.options.dataJson[index]);
        if (this.options.level === 2) {
            var str = concatHtmlItem.call(this,data);
            $itemTwo.html(str);
            setActiveItem.call(this,$itemTwo, 0);
        }
    }
    /**
     *  传入数组，设置多级html
     *  index:数组
     */
    function setItemMultiple(index) {
        var $item=this.mpicker.find('.mPicker-list ul');
        var index1 = index[0] ? index[0] : 0;
        var index2 = index[1] ? index[1] : 0;

        if (this.options.Linkage) {
            refreshItemTwo.call(this,index1);
        }
        setActiveItem.call(this,$item.eq(0), index1);

        if (this.options.level === 2) {
            setActiveItem.call(this,$item.eq(1), index2);
        }
    }

    /**
     *  传入json,判断返回json,child
     *  兼容不存在child报错的情况
     */
    function getChildJson(data) {
        if (!data) {
            return [];
        }
        var result = ({}).hasOwnProperty.call(data, 'child') ? data.child : [];
        return result;
    }
    /**
     *  传入json拼接html，只有li级别
     */
    function concatHtmlItem(data) {
        var str = '';
        var self=this;
        $.each(data, function(index, val) {
            var name = self.options.isshort ? val.shortName : val.name;
            str += '<li data-value="' + val.value + '" data-id="' + index + '">' + name + '</li>';
        });
        return str;
    }
    /**
     *  传入li html 拼接ul
     */
    function concatHtmlList(data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var itemStr = concatHtmlItem.call(this,data[i]);
            html += '<div class="mPicker-list"><ul>' + itemStr + '</ul></div>';
        }
        return html;
    }
    /**
     *  设置运动时间
     */
    function changeTime(times, obj) {
        obj.css({
            '-webkit-transition-duration': times + 'ms',
            'transition-duration': times + 'ms'
        });
    }
    /**
     *  touches兼容
     */
    function fnTouches(e) {
        if (!e.touches) {
            e.touches = e.originalEvent.touches;
        }
    }
    /**
     *  设置translateY
     */
    function setTransitionY(obj, y) {
        obj.css({
            "-webkit-transform": 'translateY(' + y + 'px)',
            transform: 'translateY(' + y + 'px)'
        });
    }
    /**
     *  获取translateY
     */
    function getTranslateY(obj) {
        var transZRegex = /\.*translateY\((.*)px\)/i;
        var result;
        if (obj[0].style.WebkitTransform) {
            result = parseInt(transZRegex.exec(obj[0].style.WebkitTransform)[1]);
        } else if (obj[0].style.transform) {
            result = parseInt(transZRegex.exec(obj[0].style.transforms)[1]);
        }
        return result;
    }

     $.fn.mPicker = function(options) {
       return this.each(function () {
            new MPicker($(this), options);
        });
    };

}());