function weiXin(url,title,img){
    // var itemid=<!--{eval echo $artwork[id];}-->;
    $(function(){
        //微信分享
        var weixin_url=window.location.href;
      //var weixin_url='http://m.artgogo.com/artwork.php?id='+itemid;
        $.ajax({
            type:'POST',
            dataType:'json',
            async:false,
            // url:'/newwap/weixin_share/ajax_share.php?url='+weixin_url,
            url:url,
            success:function(data){
                appId=data.appId;
                timestamp=data.timestamp;
                nonceStr=data.nonceStr;
                signature=data.signature;
                url=data.url;
            }
        });


        wx.config({
            debug: false,
            appId: appId,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
                'onMenuShareAppMessage',
                'onMenuShareTimeline'
            ]
        });



        wx.ready(function () {
        // 在这里调用 API
            var wx_fx_title=$("title").html();
            var desc=title;
            // var desc="我有空间，你有作品，刚好办个展。";
           // var link='http://m.artgogo.com/artwork.php?id='+itemid;
            var link=window.location.href;
            var imgUrl=img;
            //获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                title: wx_fx_title, // 分享标题
                desc: title, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    alert('分享成功');
                },
                cancel: function () { 
                    // 用户取消分享后执行的回调函数
                },
                fail:function(res){
                    alert(res);
                }
            });

            //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                title: desc, // 分享标题
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () { 
                    // 用户确认分享后执行的回调函数
                     alert('分享成功');
                },
                cancel: function () { 
                    // 用户取消分享后执行的回调函数
                }
            });
        });
        //微信分享end
        <!--微信结束-->
    });
}