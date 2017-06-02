
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

// $(function(){
//     $("#album").Banner()
// })


/**
 * 侧边栏 二级菜单
 */

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


 // 支付方式选择
// $(function(){
  
//     $('.payment a').click(function(){
//         if($(this).find('div').attr('class')!='chose'){
//             $(this).find('div').addClass('chose');
//             $(this).siblings().find('div').removeClass('chose');
//         }
//     });

//  // 购物车页面订单全选功能
//     $('.chose_all a').click(function(){

//         if($(this).attr('class')!='chose'){
//             $(this).addClass('chose');
//             $('.buy_car_chose a').addClass('chose');
//         }else{
//             $(this).removeClass('chose');
//             $('.buy_car_chose a').removeClass('chose');
//         }
//         $('.pic_number').html($('.buy_car_chose .chose').length);
//      });

//     $('.buy_car_list').on('click','.buy_car_chose',function(){
//         var $a=$(this).children();
//         if($a.attr('class')!='chose'){
//             $a.addClass('chose');
//         }else{
//             $a.removeClass('chose');
//         }
    
//         if($('.buy_car_chose .chose').length==$('.buy_car_chose a').length){
//             $('.chose_all a').addClass('chose');
//         }else{
//             $('.chose_all a').removeClass('chose');
//         }
//         $('.pic_number').html($('.buy_car_chose .chose').length);
//     });

// });


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