function DetailUploader(){}

DetailUploader.prototype.preview_div = null;
DetailUploader.prototype.unloaded_pictures = null;
DetailUploader.prototype.MAXWIDTH = 100;
DetailUploader.prototype.MAXHEIGHT = 100;
DetailUploader.prototype.BORDER = "1px solid #ebebeb";
DetailUploader.prototype.FLOAT = "left";
DetailUploader.prototype.MARGIN = 2;
DetailUploader.prototype.OVERFLOW = "hidden";
DetailUploader.prototype.SIZE = 4;
DetailUploader.prototype.LOADURL = "/center/seller_manage/editArt/loadImg";
DetailUploader.prototype.UPLOADURL = "/center/seller_manage/editArt/addImg";
DetailUploader.prototype.closeImg = {
    before: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOVSURBVHjaYtTUdGdAA4K/fv3U+Pv3rw+QLfT//3+Gf//+vWNiYtjCwsJyAyj2HiT2//8/sGKAAGJB1gkU9Pj581eNnJyctaamMgM/Py8DIyMDw+fPXxlu3rxfdfPmjaPMzIwtTEzMO2B6AAKIBaH5fw4LC1tHeHgQt7u7PYOOjhIDNzcb2IBfv/4x3LjxiGHr1n3WK1duXPPx45sKJiamKSB9AAHECPIC0GZ3ZmbWzQkJkazu7rYMLCyMDD9//gYZCzWcgYGVlRUozsxw9Oh5hv7+Gb8/fXrnC+TvBAggZhERZb7fv3/PdnCwV7C3twT69w+DlpYcw5s3HxkeP34FdP53IPsDg6qqNAMXFxvQIA4GoGXMFy9eVgK6eg1AADH9/ftbW0hIxEpFRQms0MBAlYGDg51BQ0OegZ2dneH58zdAMRUGKSlhBnFxQYY7dx4CvfSHQVBQyAqkFyCAmIWEFDOlpaVtgQHH8O7dB4aXLz8wqKjIMHBysoE1SUqKMCgoSIC90te3lGHNmu0MDx8+Yfjx4xvQmz9eAgQQCzAwhBiBIfX69RugwC+GR4+eAl3yliEx0Y+Bl5eDQU5ODBwG3d0LGdau3QH0AjMwLFiBruQEBjCTEEAAsYBC+du3HwxPnjxnAMY90JCfoLBlePXqLdAAabDNX778AHvl37+/QP9DYubfP0haAAggJlAi+fr1M8Pbt2+Bml4z8PBwMxQURDMoK0uDbf78+QfYJY2N2Qy2thZA//8CGsIMtOg70MI/7wACiAkYkluAfmH48+cPMOHwMbS1FTJoaspB/bwYqHE6w4cP3xn4+DgYWltzgAGqywCMNbABQBdsAQggJmAsX/3+/esxkPNAoX7jxgNQomKYMWMtw65dRxkuXLjGMHHiEobv338x3Lv3DEhDLAO6+hjQq1cBAohRWdkOqOGvOwcHz2Z1dU1WcXEJBgkJYYbbtx+AExIogH/9+s2gra0KDOgPwLTxmOHKlfO/v3z55AtM0jsBAggYjfKg0Lz769eP958/f7FnZ2djAyYUBhERQWBUcgLDhItBWFiY4f37j8AYeshw/frVr1++fCwFal4O8iZAAIENAKdpRoZTwLg99/Llc8VPnz7JffnyFWQwMAa+Mdy/fw+YmW4w3Lp1/eiPH19zgJqXwfIQQACBvQDNiaBsC/K/IDCQNICKfNjYWIVAYQNMH++AIb4FGPrg7IycgwECDADIUZC5UWvTuwAAAABJRU5ErkJggg==",  
    after: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1wwbFhkQHxvdFgAAArpJREFUeNplz1to1QUAx/HP/3/O2c7OrudsR8vmamOL2hw5LaQHgxKCLvQSRVgPFhJKo4cyMsmxKNQgfOuhfKxICQTpocvAIFhai/WSTNIcnK3pbu12tnO2cwsfbZ+H3+MXfgGbfURDgn0xHgiIFskUuPgOE/7njsBxahsYqAnDN1p3765N9/QIYzGL4+Myw8PlbC53fp23j5HZFBhgSxPft27f3tfX36+ure2O+sbKiitnzrg2MjK/xjNH+RUCeJbo41xsSyb3PtR/WLQuLhIGVAJKlEsUSyUBrp8966+xsdkl+o7zTwiP8mqSvffu6ZMLs+565YAVWRvL1xSWrpufvmHr/v3y1dVu30pHIuk4pxCEiCQ4nIyEYk15heakmm3bdR06Zrq0LjM3ruPNI+o7O8V7uy1NTkjV10vw4ns0Rw6Q7uCTdLwS1LfMyM+Mytxa0r73aVse2adp52Oau7pd/eGCq4MHNUxPKc4sy1dEylwOt3FPNUH09gTrWhILSr+d9N3pQfGGpHRXjz9/+tHoqRe0t8yqasyK1lKNKlrDdYpVCEqUixRLLBZTep98DkD7zofFO3pVGqlqJlJDDDEK4TkmQlbXc+QWGZ9P2TMwpHXHLpnL541+dVRtMuWp00NmGncpxCkUCLDGWDjJWp6LG0XmJtn6xOu2PrjLzUvn3fr6JdVXP3btmyNqGlN2vHbC/Dxry5SZ+pTfIyh3MN3Jyxt54cKVYYXVKZPn3peIFkTK5G5ckp34W+bLE7IjeWGOOT78gp8DQPwzBtt5dymkkqTmbuIpYnUEAblZsldIrLLB0AGeX2QlAEDD5xy7n7eWia2GlKsREhaIb9CEZS58wKFRplGJAGD9W36JMXwf9cmKdF1RIlGgrmS1zOU/GDjIyZv8iwoENguRQKqblnqiI8yUWUAWJQD4D4Cg/5i7WltRAAAAAElFTkSuQmCC"  
};

DetailUploader.prototype.initListen = function(browse_button, preview_widget, container, pictures){
    if( browse_button!==null && browse_button!=='' && preview_widget!=null && preview_widget!==''){
        if (preview_widget.nodeType && preview_widget.nodeType === 1) {
            this.preview_div = preview_widget;
        } else {
            this.preview_div = document.getElementById(preview_widget);
        }
        unloaded_pictures = pictures;
        this.detailPlupload(browse_button, container);
    }
};
DetailUploader.prototype.detailPlupload = function(browse_button, container){
    var that = this;
    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button :browse_button,//params
        container : container,
        url :that.UPLOADURL,//params
        flash_swf_url : '/common/extension/plupload/js/Moxie.swf',
        silverlight_xap_url : '/common/extension/plupload/js/Moxie.xap',
        // flash_swf_url : './Moxie.swf',
        // silverlight_xap_url : './Moxie.xap',

        filters : {
            max_file_size : '5mb',
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png"}
            ]
        },
        
        init : {
            Init:function(uploader){
                if(unloaded_pictures!=null && unloaded_pictures.length > 0)
                    that.addUnloadedPicture(uploader, unloaded_pictures);
            },
            FilesAdded: function(upload, files) {
                if(upload.files.length <= that.SIZE){
                    for(var i=0;i<files.length;i++) {
                        that.previewImage(files[i], function(imgsrc, file){
                            var div = document.createElement("div");
                            var img = document.createElement("img");
                            div.style.width = that.MAXWIDTH + "px";
                            div.style.height = that.MAXHEIGHT + "px";
                            div.style.border = that.BORDER;
                            div.style.float = that.FLOAT;
                            div.style.margin = that.MARGIN + "px";
                            div.style.overflow = that.OVERFLOW;
                            div.style.position = "relative";
                            div.appendChild(img);
                            $(that.preview_div).before(div);
                            img.src = imgsrc;
                            img.style.visibility = "hidden";
                            img.onload = function () {
                                var rect = that.clacImgZoomParam(that.MAXWIDTH, that.MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                                img.style.width = rect.width + 'px';
                                img.style.height = rect.height + 'px';
                                img.style.marginLeft = rect.left + 'px';
                                img.style.marginTop = rect.top + 'px';
                                img.style.visibility = "visible";
                                that.createCloseButton(div, rect.width, rect.height, file, uploader);
                            }
                        });
                    }
                } else if((that.SIZE-(upload.files.length-files.length)) >= 0) {
                    for(var i=0;i<(that.SIZE-(upload.files.length-files.length));i++) {
                        that.previewImage(files[i], function(imgsrc, file){
                            var div = document.createElement("div");
                            var img = document.createElement("img");
                            div.style.position = "relative";
                            div.style.width = that.MAXWIDTH + "px";
                            div.style.height = that.MAXHEIGHT + "px";
                            div.style.border = that.BORDER;
                            div.style.float = that.FLOAT;
                            div.style.margin = that.MARGIN + "px";
                            div.style.overflow = that.OVERFLOW;
                            div.appendChild(img);
                            $(that.preview_div).before(div);
                            img.src = imgsrc;
                            img.style.visibility = "hidden";
                            img.onload = function () {
                                var rect = that.clacImgZoomParam(that.MAXWIDTH, that.MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                                img.style.width = rect.width + 'px';
                                img.style.height = rect.height + 'px';
                                img.style.marginLeft = rect.left + 'px';
                                img.style.marginTop = rect.top + 'px';
                                img.style.visibility = "visible";
                                that.createCloseButton(div, rect.width, rect.height, file, uploader);
                            }
                        });
                    }
                    // 删除超出范围的图片
                    for(var i=(that.SIZE-(upload.files.length-files.length));i<files.length;i++){
                        uploader.removeFile(files[i]);
                    }
                }
                if(upload.files.length >= that.SIZE) {
                    that.preview_div.style.display = "none";
                }
                uploader.start(); // 启动上传
                return true;
            },
            FileUploaded: function(upload, file, info) {
                var rs=eval('('+info.response+')');
                if( rs['suc'] ){
                    file.name = rs['img'];
                    // 清空图片地址
                    for(var i=0;i<that.SIZE;i++){
                        $(that.preview_div).find("[name='detailPicture"+(i+1)+"[]']").val("");
                    }
                    // 写入图片地址
                    for(var i=0;i<uploader.files.length;i++){
                        $(that.preview_div).find("[name='detailPicture"+(i+1)+"[]']").val(uploader.files[i].name);
                    }
                }else{
                    if( rs['errorno']===1 ){
                        uploader.stop();
                        window.location.href='/center/';//login
                    }else{
                        alert(rs['msg']);
                    }
                }
            }
        }
    });
    uploader.init();
};
DetailUploader.prototype.previewImage = function (file, callback) {
    if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        var fr = new mOxie.FileReader();
        fr.onload = function () {
            callback(fr.result, file);
            fr.destroy();
            fr = null;
        }
        fr.readAsDataURL(file.getSource());
    } else {
        var preloader = new mOxie.Image();
        preloader.onload = function () {
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback(imgsrc, file);
            preloader.destroy();
            preloader = null;
        };
        preloader.load(file.getSource());
    }
};
//按比例缩放图片  
DetailUploader.prototype.clacImgZoomParam = function (maxWidth, maxHeight, width, height) {
    var param = { width: width, height: height };
    if (width > maxWidth || height > maxHeight) {
        var rateWidth = width / maxWidth;
        var rateHeight = height / maxHeight;

        if (rateWidth > rateHeight) {
            param.width = maxWidth;
            param.height = Math.round(height / rateWidth);
        } else {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
};
DetailUploader.prototype.createCloseButton = function (main, imageWidth, imageHeight, file, uploader) {
    var that = this;
    var top = (100 - imageHeight)/2 - 100;
    var right = - 80;
    var close = document.createElement("img");
    close.src = this.closeImg.before;
    close.style.position = "absolute";
    close.style.top = "0px";
    close.style.right = "0px";
    close.style.cursor = "pointer";
    
    $(close).click(function(){
        uploader.removeFile(file);
        $(this).parent().remove();
        that.preview_div.style.display = "inline";
    });
    
    main.appendChild(close);
};
DetailUploader.prototype.addUnloadedPicture = function(uploader, unloaded_pictures){
    // 修改url为加载图片路径
    uploader.url = this.LOADURL;
    var getFileBlob = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            callback(xhr.response);
        });
        xhr.send();
    };

    var blobToFile = function (blob, name) {
            blob.lastModifiedDate = new Date();
            blob.name = name;
            return blob;
    };

    var getFileObject = function(filePathOrUrl, callback) {
           getFileBlob(filePathOrUrl, function (blob) {
              callback(blobToFile(blob, 'test.jpg'));
           });
    };
    
    for(var i=0;i<unloaded_pictures.length;i++) {
        if(i==(unloaded_pictures.length-1)) {
            getFileObject(unloaded_pictures[i], function (fileObject) {
                 uploader.addFile(fileObject);
                 uploader.url = this.UPLOADURL;
            });
        } else {
            getFileObject(unloaded_pictures[i], function (fileObject) {
                 uploader.addFile(fileObject);
            });
        }
    }
};
