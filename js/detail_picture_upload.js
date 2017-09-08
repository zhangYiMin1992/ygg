function DetailUploader(){}

DetailUploader.prototype.preview_div = null;
DetailUploader.prototype.unloaded_pictures = null;
DetailUploader.prototype.MAXWIDTH = 100;
DetailUploader.prototype.MAXHEIGHT =100;
// DetailUploader.prototype.BORDER = "1px solid #ebebeb";
DetailUploader.prototype.FLOAT = "left";
DetailUploader.prototype.MARGIN = 6;
DetailUploader.prototype.OVERFLOW = "hidden";
DetailUploader.prototype.SIZE = 4;
DetailUploader.prototype.LOADURL = "/center/seller_manage/editArt/loadImg";
DetailUploader.prototype.UPLOADURL = "/center/seller_manage/editArt/addImg";
DetailUploader.prototype.closeImg = {
    before: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAPISURBVHja1JpPaBtHFMZ/u2tLxLZkY1kxVoOgyGkVXwz9Q3LxITn5YKXpuSGHPdSkxdAcwkJDe2jpJZDWYN8DxeTiq88OxpeEJE4LxnVxTaAHm8QRIZJWRralyWFnFUm1Le1qJXU/eIfdfTP7vZ2defPeGwVvcBa4DFwCksCHQBTolc9NYA94AWwCj4CHwCs6iAhwC3gClADhUEqy7S3ZV9swAtwDci5InyQmMAfEWkm8C7gNZD0kXitZ+Y5ur8mfB9ZaSLxWngNjXpH/AnjbRvKVo3GtWfJfA0cdIG/LkeTgCjc7SLxWbjolf7XDX/64kbjaKPkLLV5pmpkTF2rJKjXX3dK5jDsZrmQyydTUFJqm1dUtFossLS2xubnp5rf+E/gcOLRvqDUK3zklDxCPxxsiD6BpGvF43O28HJeeu8o52YgBPzazZG1sbLC6unri84mJCcbGml7efwAWgJ1aA74H+k5rGQ6HGRkZQVGq/7yBgQFrcxSJMD5+8gBGIpGyfjKZrHomhGB3d5dMJlPPgD7gDvBt5RwYAv4FzpzWcmZmhp6enpbtVfL5PHNzc42o7gNx4LU9AtfrkQfK5LPZLMVi0TPimqYRCoWcfJwzkvNspQENY3Fxkb29Pc8MiEaj6LrutNlXwKwqg5FP8B8+BWJdwJVj/MGpiMVi9Pb2esakv7/fTTMFuNwFXHTacnJy8v8yCp91yRi2IayvrzM6OoqqqgQCAYQQFAoFy4V3WzHI4aHlJBVFIRgMUigUEEIcqxMMBlEUhYODA0qlEtvb204N+Bhgy+m+JJFICMMwhK7r5XupVEqkUqnydTQaFYZhiHA4fKKOruvCMAyRSCTc7o+2VGAY/2JYBUI+NiCk4m8cqHKf7VdkVeCljw14owL/+NiALVXmKv2Kv1XgsY8NeKZiZYmFD8kLYNmexGs+NGAN2LH9wIIPDXhQmZVYkGGaa2QyGUzTfB/z7e9jmmZ54wZgmmaVThPYB36vDOpfA/eBb9z2uLKyUnWdy+WYn5+vure8vOzV178vOVdlJX4BbtTLTNTGsnZGwm0s7AI5yfU/eaEd4CfgbqM9DQ4OMj093e5//2c7J1Q5B2zMYhUXTkU6nSafz3uWSkmn042qPwd+q6d0ns4UNOpJBvioUUt9nV634esChw1fl5hsXKNzRb4vvVq62l1m/QMPy6w2Algp+HwLieexUueBVjqSD4Bf8f6owTxwrp0ecQir3PMU94c9nso+htySUDwyZhjruM1FrEqifdymr2L/Yh+3+UtGgQ+9SCi8GwB34/3WpqddxAAAAABJRU5ErkJggg==",  
    after:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAPISURBVHja1JpPaBtHFMZ/u2tLxLZkY1kxVoOgyGkVXwz9Q3LxITn5YKXpuSGHPdSkxdAcwkJDe2jpJZDWYN8DxeTiq88OxpeEJE4LxnVxTaAHm8QRIZJWRralyWFnFUm1Le1qJXU/eIfdfTP7vZ2defPeGwVvcBa4DFwCksCHQBTolc9NYA94AWwCj4CHwCs6iAhwC3gClADhUEqy7S3ZV9swAtwDci5InyQmMAfEWkm8C7gNZD0kXitZ+Y5ur8mfB9ZaSLxWngNjXpH/AnjbRvKVo3GtWfJfA0cdIG/LkeTgCjc7SLxWbjolf7XDX/64kbjaKPkLLV5pmpkTF2rJKjXX3dK5jDsZrmQyydTUFJqm1dUtFossLS2xubnp5rf+E/gcOLRvqDUK3zklDxCPxxsiD6BpGvF43O28HJeeu8o52YgBPzazZG1sbLC6unri84mJCcbGml7efwAWgJ1aA74H+k5rGQ6HGRkZQVGq/7yBgQFrcxSJMD5+8gBGIpGyfjKZrHomhGB3d5dMJlPPgD7gDvBt5RwYAv4FzpzWcmZmhp6enpbtVfL5PHNzc42o7gNx4LU9AtfrkQfK5LPZLMVi0TPimqYRCoWcfJwzkvNspQENY3Fxkb29Pc8MiEaj6LrutNlXwKwqg5FP8B8+BWJdwJVj/MGpiMVi9Pb2esakv7/fTTMFuNwFXHTacnJy8v8yCp91yRi2IayvrzM6OoqqqgQCAYQQFAoFy4V3WzHI4aHlJBVFIRgMUigUEEIcqxMMBlEUhYODA0qlEtvb204N+Bhgy+m+JJFICMMwhK7r5XupVEqkUqnydTQaFYZhiHA4fKKOruvCMAyRSCTc7o+2VGAY/2JYBUI+NiCk4m8cqHKf7VdkVeCljw14owL/+NiALVXmKv2Kv1XgsY8NeKZiZYmFD8kLYNmexGs+NGAN2LH9wIIPDXhQmZVYkGGaa2QyGUzTfB/z7e9jmmZ54wZgmmaVThPYB36vDOpfA/eBb9z2uLKyUnWdy+WYn5+vure8vOzV178vOVdlJX4BbtTLTNTGsnZGwm0s7AI5yfU/eaEd4CfgbqM9DQ4OMj093e5//2c7J1Q5B2zMYhUXTkU6nSafz3uWSkmn042qPwd+q6d0ns4UNOpJBvioUUt9nV634esChw1fl5hsXKNzRb4vvVq62l1m/QMPy6w2Algp+HwLieexUueBVjqSD4Bf8f6owTxwrp0ecQir3PMU94c9nso+htySUDwyZhjruM1FrEqifdymr2L/Yh+3+UtGgQ+9SCi8GwB34/3WpqddxAAAAABJRU5ErkJggg=="};

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
            // Init:function(uploader){
            //     if(unloaded_pictures!=null && unloaded_pictures.length > 0)
            //         that.addUnloadedPicture(uploader, unloaded_pictures);
            // },
            FilesAdded: function(upload, files) {
                console.log(upload.files.length);
                if(upload.files.length <= that.SIZE){
                    for(var i=0;i<files.length;i++) {
                        that.previewImage(files[i], function(imgsrc, file){
                            // console.log(imgsrc);
                            var div = document.createElement("div");
                            var img = document.createElement("img");
                            div.style.width = that.MAXWIDTH + "px";
                            div.style.height = that.MAXHEIGHT + "px";
                            // div.style.border = that.BORDER;
                            div.style.float = that.FLOAT;
                            div.style.marginRight = that.MARGIN + "px";
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
                                img.style.position = 'absolute';
                                // img.style.marginTop = rect.top + 'px';
                                img.style.top = rect.top + 'px';
                                img.style.left = rect.left + 'px';
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
                            // div.style.border = that.BORDER;
                            div.style.float = that.FLOAT;
                            div.style.marginRight = that.MARGIN + "px";
                            div.style.overflow = that.OVERFLOW;
                            div.appendChild(img);
                            $(that.preview_div).before(div);
                            img.src = imgsrc;
                            img.style.visibility = "hidden";
                            img.onload = function () {
                                var rect = that.clacImgZoomParam(that.MAXWIDTH, that.MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                                img.style.width = rect.width + 'px';
                                img.style.height = rect.height + 'px';
                                // img.style.marginLeft = rect.left + 'px';
                                // img.style.marginTop = rect.top + 'px';
                                img.style.position = 'absolute';
                                img.style.top = rect.top + 'px';
                                img.style.left = rect.left + 'px';
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
            // FileUploaded: function(upload, file, info) {
            //     var rs=eval('('+info.response+')');
            //     if( rs['suc'] ){
            //         file.name = rs['img'];
            //         // 清空图片地址
            //         for(var i=0;i<that.SIZE;i++){
            //             $(that.preview_div).find("[name='detailPicture"+(i+1)+"[]']").val("");
            //         }
            //         // 写入图片地址
            //         for(var i=0;i<uploader.files.length;i++){
            //             $(that.preview_div).find("[name='detailPicture"+(i+1)+"[]']").val(uploader.files[i].name);
            //         }
            //     }else{
            //         if( rs['errorno']===1 ){
            //             uploader.stop();
            //             window.location.href='/center/';//login
            //         }else{
            //             alert(rs['msg']);
            //         }
            //     }
            // }
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
//按比例居中
DetailUploader.prototype.clacImgZoomParam = function (maxWidth, maxHeight, width, height) {
    var param = { width: width, height: height };
    var rate=maxWidth/maxHeight;
    var ratio=width/height;
    var sx,sy;
    if(ratio>rate){
        param.height=maxHeight;
        param.width=ratio*maxHeight;
        sy=0;
        sx=(maxWidth-param.width)/2;
    }else{
        param.width=maxWidth;
        param.height=maxWidth/ratio;
        sx=0;
        sy=(maxHeight-param.height)/2;
    }
    param.left = Math.round(sx);
    param.top = Math.round(sy);
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
// DetailUploader.prototype.addUnloadedPicture = function(uploader, unloaded_pictures){
//     // 修改url为加载图片路径
//     uploader.url = this.LOADURL;
//     var getFileBlob = function (url, callback) {
//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", url);
//         xhr.responseType = "blob";
//         xhr.addEventListener('load', function() {
//             callback(xhr.response);
//         });
//         xhr.send();
//     };

//     var blobToFile = function (blob, name) {
//             blob.lastModifiedDate = new Date();
//             blob.name = name;
//             return blob;
//     };

//     var getFileObject = function(filePathOrUrl, callback) {
//            getFileBlob(filePathOrUrl, function (blob) {
//               callback(blobToFile(blob, 'test.jpg'));
//            });
//     };
    
//     for(var i=0;i<unloaded_pictures.length;i++) {
//         if(i==(unloaded_pictures.length-1)) {
//             getFileObject(unloaded_pictures[i], function (fileObject) {
//                  uploader.addFile(fileObject);
//                  uploader.url = this.UPLOADURL;
//             });
//         } else {
//             getFileObject(unloaded_pictures[i], function (fileObject) {
//                  uploader.addFile(fileObject);
//             });
//         }
//     }
// };
