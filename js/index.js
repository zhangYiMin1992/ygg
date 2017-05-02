$(function() {
    $(document).on("click", ".open-panel", function(e) {
        var panel = $(e.target).data('panel');
        $.openPanel(panel);
    })
    $(document).on("click", ".panel-overlay", function(e) {
        $.closePanel();
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

