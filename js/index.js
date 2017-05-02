// $(function() {
//     $(document).on("click", ".open-panel", function(e) {
//         var panel = $(e.target).data('panel');
//         $.openPanel(panel);
//     })
//     $(document).on("click", ".panel-overlay", function(e) {
//         $.closePanel();
//     });



//     // 侧边栏菜单
//     $('#leftSidebar .select dt').click(function(e) {
//         if ($(this).parent().attr('class') != 'select on') {
//             $(this).parent().addClass('on');
//         } else {
//             $(this).parent().removeClass('on');
//         }
//         var $dd = $(this).siblings();
//         $dd.slideToggle(100);
//     });
// })
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
