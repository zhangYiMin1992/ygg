var imgplupload={
    plu:function(uri,maxnum,filelist,console){
        if( filelist ==='' || filelist ===null ){
            filelist='filelists';
        }
        if( console ==='' || console ===null ){
            console='console';
        }
        var uploader = new plupload.Uploader({
            runtimes : 'html5,flash,silverlight,html4',
            browse_button : 'pickfiles',//params
            container: document.getElementById('container'),//params
            url :uri,//params
            flash_swf_url : '/common/extension/plupload/js/Moxie.swf',
            silverlight_xap_url : '/common/extension/plupload/js/Moxie.xap',

            filters : {
                max_file_size : '5mb',
                mime_types: [
                    {title : "Image files", extensions : "jpg,gif,png"},
                    {title : "Zip files", extensions : "zip"}
                ]
            },

            init: {                
                FilesAdded: function(up, files) {
                    var count=files.length;
                    if( maxnum<count ){
                        uploader.splice(maxnum,count-maxnum);
                    }
                    uploader.start();
                    return false;
                },
                
                FileUploaded: function(uploader,file,responseObject) {
                    //uploader.stop();
                    var rs=eval('('+responseObject.response+')');
                    if( rs['errorno']===1 ){
                        uploader.stop();
                        window.location.href='/center/';//login
                    }
                },
                
                UploadComplete: function(uploader,files) {
                    window.location.href=imgplupload.UpCompleteUri;
                },

                UploadProgress: function(uploader,file) {
                    $('#file_percent').html(file.name+" 上传进度："+file.percent + "%");
                },

                Error: function(up, err) {
                    var msg="\nError #" + err.code + ": " + err.message;
                    $('#'+console).html(msg);
                }
            }
        });
        uploader.init();
    },
    
    UpCompleteUri:'/center/seller_manage/publish/filefs',
    ds_caizhi:new Array(),
    fds_caizhi:new Array(),
    caizhi_type:new Array(),
    //regPrice:/^([1-9]\d{0,8}|[1-9]\d{0,8}\.\d{1,2})$/,
    regNum:/^[1-9]\d{0,2}$/,
    regSize:/^[1-9]\d{0,3}$/,
    regYear:/^[1-2]{1}\d{3}$/,
    borderRed:'border-red',
    maxBlocks:20,
    serviceRate:0.15,
    serviceRateD_Z:0.25,
    editchk:function(){
        $("input[name='Title[]']").live('blur',function(){
            var Title=$(this).val();
            var msg='';
            if( Title===null || Title==='' ){
                msg="请录入作品名称";
            }else if( 100<Title.length ){
                $(this).val('');
                msg="名称不能超过30字";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        $("input[name='name[]']").live('blur',function(){
            var name=$(this).val();
            var msg='';
            if( name===null || name==='' ){
                msg="请录入艺术家";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        $('.addartist').live('click',function(){
            $(this).parent().next().show();
        });
        
        $('.addartist2').live('click',function(){
            //window.open('/center/seller_manage/add_artist.php');
            var name=$(this).prevAll('.new_artist').first().val();
            var brief=$(this).prevAll('.artist_brief').first().val();
            if( name===null || name==='' ){
                var msg="请录入艺术家名称";
                $(this).prev('.new_artist').prop('placeholder',msg);
                if( msg!=='' && msg!==null ){
                    $(this).addClass(imgplupload.borderRed);
                }else{
                    if( $(this).hasClass(imgplupload.borderRed) ){
                        $(this).removeClass(imgplupload.borderRed);
                    }
                }
            }else{
                var Obj=$(this);
                $.ajax({
                    dataType:'json',
                    type:'post',
                    url:'/center/seller_manage/publish/cArtist',
                    data:{
                        name:name,
                        brief:brief
                    },
                    success:function(rs){
                        if( rs['suc'] ){
                            var Title=rs['data']['Title'];
                            Obj.parents('.scjianli').first().prev().
                                    children('.ajaxSearch').val(Title);
                            Obj.parents('.scjianli').first().hide();
                        }else{
                            if( rs['errorno']===1 ){
                                window.location.href='/center/';//login
                            }else{
                                alert(rs['msg']);
                            }
                        }
                    }
                });
            }
        });
        
        $('.clsaddartist').live('click',function(){
            $(this).parents('.scjianli').first().hide();
        });
        
        $("select[name='pinlei[]']").live('change',function(){
            var pinlei=$(this).val();
            var caizhi=null;
            var curBlock=$(this).parents('.sc_5').first();
            var curbid=curBlock.find('.block_id').val();
            if( typeof(imgplupload.caizhi_type[curbid])!=='undefined' ){
                var curct=imgplupload.caizhi_type[curbid];
                if( pinlei==='ds' && 'ds' !==curct ){
                    imgplupload.caizhi_type[curbid]='ds';
                    caizhi=imgplupload.ds_caizhi;
                    $(this).parents('.sc_5').first().find('.gao_none').show();
                }else if( pinlei==='zz' && 'zz' !==curct ){
                    imgplupload.caizhi_type[curbid]='zz';
                    var tmp=new Array();
                    for(var pro in imgplupload.fds_caizhi){
                        tmp[pro]=imgplupload.fds_caizhi[pro];
                    }
                    for(var pro in imgplupload.ds_caizhi){
                        tmp[pro]=imgplupload.ds_caizhi[pro];
                    }
                    var caizhi=new Array();
                    for(var pro in tmp){
                        if( pro!=='qt' ){
                            caizhi[pro]=tmp[pro];
                        }
                    }
                    caizhi['qt']=tmp['qt'];
                    $(this).parents('.sc_5').first().find('.gao_none').show();
                }else if( 'fds' !==curct ){
                    imgplupload.caizhi_type[curbid]='fds';
                    caizhi=imgplupload.fds_caizhi;
                    $(this).parents('.sc_5').first().find('.gao_none').hide();
                }
            }else{
                if( pinlei==='ds' ){
                    imgplupload.caizhi_type[curbid]='ds';
                    caizhi=imgplupload.ds_caizhi;
                    $(this).parents('.sc_5').first().find('.gao_none').show();
                }else if( pinlei==='zz' ){
                    imgplupload.caizhi_type[curbid]='zz';
                    var tmp=new Array();
                    for(var pro in imgplupload.fds_caizhi){
                        tmp[pro]=imgplupload.fds_caizhi[pro];
                    }
                    for(var pro in imgplupload.ds_caizhi){
                        tmp[pro]=imgplupload.ds_caizhi[pro];
                    }
                    var caizhi=new Array();
                    for(var pro in tmp){
                        if( pro!=='qt' ){
                            caizhi[pro]=tmp[pro];
                        }
                    }
                    caizhi['qt']=tmp['qt'];
                    $(this).parents('.sc_5').first().find('.gao_none').show();
                }else{
                    imgplupload.caizhi_type[curbid]='fds';
                    caizhi=imgplupload.fds_caizhi;
                    $(this).parents('.sc_5').first().find('.gao_none').hide();
                }
            }
            servicePriceCalc(curBlock);
            if( caizhi!==null ){
                var rs="<option value=''>请选择材质</option>";
                for(var pro in caizhi){
                    rs +="<option value='"+pro+"'>"+caizhi[pro]+"</option>";
                }
                if( rs !=='' ){
                    $(this).parents('.sc_5').first().
                            find("select[name='caizhi[]']").html(rs);
                }
            }            
        });
        
        $("input[name*='is_print[']").live('click',function(){
            var is_print=$(this).val();
            if( is_print==='是' ){
                $(this).parents('.sc_4_main_5').first().next().show();
            }else{
                $(this).parents('.sc_4_main_5').first().next().hide();
            }
        });
        
        $("input[name='print_count[]']").live('blur',function(){
            var print_count=$(this).val();
            var msg='';
            if( print_count===null || print_count==='' ){
                msg="请录入版画张数";
            }else if( !imgplupload.regNum.test(print_count) ){
                $(this).val('');
                msg="版画张数在1-1000之间";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        $("input[name='print_number[]']").live('blur',function(){
            var print_number=parseInt($(this).val());
            var print_count=parseInt($(this).nextAll("input[name='print_count[]']").val());
            var msg='';
            if( print_number===null || print_number==='' ){
                msg="请录入版画号码";
            }else if( !imgplupload.regNum.test(print_number) ){
                $(this).val('');
                msg="版画号码在1-1000之间";
            }else if( print_count!=='' && print_count!==0 && print_count!=='0' ){
                if( print_count < print_number ){
                    $(this).val('');
                    msg="版画号码不能大于版画张数";
                }
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        $('.addbhs').live('click',function(){
            var block_id=$(this).parents('.sc_5').first().find('.block_id').val();
            $.ajax({
                dataType:'json',
                type:'post',
                url:'/center/seller_manage/publish/addBhs',
                data:{
                    block_id:block_id
                },
                success:function(rs){
                    if( rs['suc'] ){
                        var openUri='/center/seller_manage/publish/addBhs';
                        window.showModalDialog(openUri,'addbhwin',"dialogWidth:800px;status:No;dialogHide:yes;");
                        //window.open(openUri);
                    }else{
                        if( rs['errorno']===1 ){
                            window.location.href='/center/';//login
                        }else{
                            if( rs['msg'] ){
                                alert(rs['msg']);
                            }else{
                                alert('未知操作，请刷新重试');
                            }
                        }
                    }
                }
            });
        });
        
        $("input[name='price[]']").live('blur',function(){
            var price=$(this).val();
            var curBlock=$(this).parents('.sc_5').first();
            var service_price_obj=curBlock.find('.service_price');
            var msg='';
            if( !Utils.isSignlessInteger(price) ){
                $(this).val('');
                msg="请录入作品价格";
            }else if( 200000 < price || price < 0 ){
                $(this).val('');
                msg="价格在1-200000之间";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                service_price_obj.html('_');
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( !iswrz && curBlock.find('.taxprice').html()!=price){
                    curBlock.find('.jiage').val(price);
                    servicePriceCalc(curBlock);
                    //在价格中算入增值税
                    price=parseFloat(price);
                    if( 10000 < price ){
                        price=Math.floor(price/83)*100;
                    }else{
                        price=Math.floor(price*10/83)*10;
                    }
                    $(this).val(price);
                }
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
                curBlock.find('.taxprice').html(price);
            }
        });
        
        var servicePriceCalc=function(curBlock){
            var service_price_obj=curBlock.find('.service_price');
            var curbid=curBlock.find('.block_id').val();
            var price=curBlock.find('.jiage').val();
            var serviceRate=0;
            if( imgplupload.caizhi_type[curbid]!='undefined' ){
                if( imgplupload.caizhi_type[curbid]=='fds' ){
                    serviceRate=imgplupload.serviceRate;
                }else{
                    serviceRate=imgplupload.serviceRateD_Z;
                }
            }
            var service_price=Math.round(parseFloat(serviceRate*price));
            service_price_obj.html(service_price);
        };
        
        $("input[name='length[]']").live('blur',function(){
            var length=$(this).val();
            var msg='';
            if( length===null || length==='' ){
                msg="请录入长度";
            }else if( !imgplupload.regSize.test(length) ){
                $(this).val('');
                msg="长度无效";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        $("input[name='width[]']").live('blur',function(){
            var width=$(this).val();
            var msg='';
            if( width===null || width==='' ){
                msg="请录入宽度";
            }else if( !imgplupload.regSize.test(width) ){
                $(this).val('');
                msg="宽度无效";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        $("input[name='height[]']").live('blur',function(){
            var height=$(this).val();
            var msg='';
            if( height===null || height==='' ){
                msg="请录入高度";
            }else if( !imgplupload.regSize.test(height) ){
                $(this).val('');
                msg="高度无效";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        /*$("input[type='radio'][name*='chushou[']").live('click',function(){
            var chushou=$(this).val();
            if( chushou==='shi' ){
                $(this).parents('.chushou').first().nextAll('.chushoujia').show();
            }else{
                $(this).parents('.chushou').first().nextAll('.chushoujia').hide();
            }
        });*/
        
        /*$("input[name='czsj[]']").live('blur',function(){
            var czsj=$(this).val();
            if( czsj!==null && czsj!=='' ){
                var msg='';
                if( !imgplupload.regYear.test(czsj) ){
                    $(this).val('');
                    msg="请录入正确的创作年份";
                }
                $(this).prop('placeholder',msg);
                if( msg!=='' && msg!==null ){
                    $(this).addClass(imgplupload.borderRed);
                }else{
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });*/
        
        $('.zengzhi').live('click',function(){
            $(this).parent().next('.zengzhifuwu').show();
        });

        $('.showExplain').live('click',function(){
            $(this).parent().next('.explain').show();
        });

        $('.cancelExplain').live('click',function(){
            $(this).parent().parent().hide();
        });
        
        $("input[name='jinggoujia[]']").live('blur',function(){
            var price=$(this).val();
            var msg='';
            if( !Utils.isSignlessInteger(price) ){
                $(this).val('');
                msg="请录入竞购价格";
            }else if( 200000 < price || price < 0 ){
                $(this).val('');
                msg="价格在1-200000之间";
            }
            $(this).prop('placeholder',msg);
            if( msg!=='' && msg!==null ){
                $(this).addClass(imgplupload.borderRed);
            }else{
                if( $(this).hasClass(imgplupload.borderRed) ){
                    $(this).removeClass(imgplupload.borderRed);
                }
            }
        });
        
        $('.shanchu').live('click',function(){
            if( confirm('删除之后数据会随之丢失，是否继续？') ){
                var obj=$(this).parents('.sc_5').first();
                var id=obj.find('.block_id').val();
                var img=obj.find('.artworkimg').attr('src');
                $.ajax({
                    dataType:'json',
                    type:'post',
                    url:'/center/seller_manage/publish/rmBlock',
                    data:{
                        block_id:id,
                        img:img
                    },
                    success:function(rs){
                        if( rs['suc'] ){
                            obj.remove();
                            var block_num=$(document).find('.sc_5').length;
                            if( block_num===0 ){
                                var uri='/center/seller_manage/publish/';
                                window.location.href=uri;
                            }
                        }else{
                            if( rs['errorno']===1 ){
                                window.location.href='/center/';//login
                            }else{
                                if( rs['msg'] ){
                                    alert(rs['msg']);
                                }else{
                                    alert('未知操作，请刷新重试');
                                }
                            }
                        }
                    }
                });
            }
        });
        
        $('.cancelzzfw').live('click',function(){
            var curP=$(this).parents('.zengzhifuwu').first();
            
            var chuzu=curP.find("input[name='chuzu1[]']").val();
            var jinggou=curP.find("input[name='jinggou1[]']").val();
            var jinggoujia=curP.find("input[name='jinggoujia1[]']").val();
            if( chuzu==='' || chuzu===null ){
                curP.find("input[type='radio'][name*='chuzu[']").each(function(){
                    $(this).prop('checked',false);
                });
            }else{
                curP.find("input[type='radio'][name*='chuzu[']").each(function(){
                    if( $(this).val()===chuzu ){
                        chuzu=$(this).prop('checked',true);
                    }
                });
            }
            
            if( jinggou==='' || jinggou===null ){
                curP.find("input[type='radio'][name*='jinggou[']").each(function(){
                    $(this).prop('checked',false);
                });
            }else{
                curP.find("input[type='radio'][name*='jinggou[']").each(function(){
                    if( $(this).val()===jinggou ){
                        chuzu=$(this).prop('checked',true);
                    }
                });
            }
            curP.find("input[name='jinggoujia[]']").val(jinggoujia);
            
            curP.hide();
        });
        
        $('.zzfwbtn').live('click',function(){
            var curP=$(this).parents('.zengzhifuwu').first();
            var chuzu=jinggou=false;
            var jinggoujia='';
            curP.find("input[type='radio'][name*='chuzu[']").each(function(){
                if( $(this).prop('checked') ){
                    chuzu=$(this).val();
                }
            });
            curP.find("input[type='radio'][name*='jinggou[']").each(function(){
                if( $(this).prop('checked') ){
                    jinggou=$(this).val();
                }
            });
            jinggoujia=curP.find("input[name='jinggoujia[]']").val();
            
            curP.find("input[name='chuzu1[]']").val(chuzu);
            curP.find("input[name='jinggou1[]']").val(jinggou);
            curP.find("input[name='jinggoujia1[]']").val(jinggoujia);
            
            curP.hide();
        });
        
        //submit form
        $('#publishform').live('submit',function(){
            var blocks=new Array();
            $(this).children('.sc_5').each(function(index){
                blocks[index]=$(this);
            });
            if( imgplupload.maxBlocks < blocks.length ){
                alert('每次最多支持'+imgplupload.maxBlocks+'件作品同时上传');
                return false;
            }
            var blockChk=function(obj){
                var Title=obj.find("input[name='Title[]']").val();
                var name=obj.find("input[name='name[]']").val();
                var name_id=obj.find("input[name='name[]']").attr('data-id');
                var pinlei=obj.find("select[name='pinlei[]']").val();
                var caizhi=obj.find("select[name='caizhi[]']").val();
                var zhuti=obj.find("select[name*='zhuti_']").val();
                var fengge=obj.find("select[name*='fengge_']").val();
                var length=obj.find("input[name='length[]']").val();
                var width=obj.find("input[name='width[]']").val();
                var height=obj.find("input[name='height[]']").val();
                var czsj=obj.find("input[name='czsj[]']").val();
                var zpms=obj.find("input[name='zpms[]']").val();
                var jinggoujia=obj.find("input[name='jinggoujia[]']").val();
                var price=obj.find("input[name='price[]']").val();
                var print_count=obj.find("input[name='print_count[]']").val();
                var print_number=obj.find("input[name='print_number[]']").val();
                var print_cate=obj.find("select[name='print_cate[]']").val();
                
                var msg='';
                var chushou=yijia=jinggou=is_print=teshuban=false;
                obj.find("input[type='radio'][name*='chushou[']").each(function(){
                    if( $(this).prop('checked') ){
                        chushou=$(this).val();
                    }
                });
                
                obj.find("input[type='radio'][name*='jinggou[']").each(function(){
                    if( $(this).prop('checked') ){
                        jinggou=$(this).val();
                    }
                });
                
                obj.find("input[type='radio'][name*='is_print[']").each(function(){
                    if( $(this).prop('checked') ){
                        is_print=$(this).val();
                    }
                });
                
                teshuban=obj.find("input[type='radio'][name='teshuban[]']").prop('checked');
                
                var curObj=obj.find("input[name='Title[]']");
                if( Title===null || Title==='' ){
                    msg="请录入作品名称";
                }else if( 30<Title.length ){
                    msg="名称不能超过30字："+Title;
                }
                if( msg!=='' && msg!==null ){
                    curObj.val('');
                    curObj.prop('placeholder',msg);
                    curObj.addClass(imgplupload.borderRed);
                    alert(msg);
                    return false;
                }else{
                    if( curObj.hasClass(imgplupload.borderRed) ){
                        curObj.removeClass(imgplupload.borderRed);
                    }
                }
                
                var curObj=obj.find("input[name='name[]']");
                if( name===null || name==='' || name_id=='' || name_id==0 || name_id==null ){
                    msg="艺术家不存在，请重新选择";
                }
                if( msg!=='' && msg!==null ){
                    curObj.prop('placeholder',msg);
                    curObj.addClass(imgplupload.borderRed);
                    alert(msg);
                    return false;
                }else{
                    if( curObj.hasClass(imgplupload.borderRed) ){
                        curObj.removeClass(imgplupload.borderRed);
                    }
                }
                
                if( pinlei===null || pinlei==='' ){
                    msg="请选择作品品类";
                }
                if( msg!=='' && msg!==null ){
                    alert(msg);
                    return false;
                }
                
                if( caizhi===null || caizhi==='' ){
                    msg="请选择作品材质";
                }
                if( msg!=='' && msg!==null ){
                    alert(msg);
                    return false;
                }
                
                if( zhuti===null || zhuti==='' ){
                    msg="请选择作品主题";
                }
                if( msg!=='' && msg!==null ){
                    alert(msg);
                    return false;
                }
                
                if( fengge===null || fengge==='' ){
                    msg="请选择作品风格";
                }
                if( msg!=='' && msg!==null ){
                    alert(msg);
                    return false;
                }
                
                if( is_print==='是' ){
                    if( print_cate===null || print_cate==='' ){
                        msg="请选择版画类型";
                    }
                    if( msg!=='' && msg!==null ){
                        alert(msg);
                        return false;
                    }
                    
                    if( teshuban===false ){
                        var curObj=obj.find("input[name='print_count[]']");
                        if( print_count===null || print_count==='' ){
                            msg="请录入版画张数";
                        }else if( !imgplupload.regNum.test(print_count) ){
                            msg="版画张数在1-1000之间";
                        }
                        if( msg!=='' && msg!==null ){
                            curObj.val('');
                            curObj.prop('placeholder',msg);
                            curObj.addClass(imgplupload.borderRed);
                            alert(msg);
                            return false;
                        }else{
                            if( curObj.hasClass(imgplupload.borderRed) ){
                                curObj.removeClass(imgplupload.borderRed);
                            }
                        }

                        var curObj=obj.find("input[name='print_number[]']");
                        if( print_number===null || print_number==='' ){
                            msg="请录入版号";
                        }else if( !imgplupload.regNum.test(print_number) ){
                            msg="版号在1-1000之间";
                        }else if( print_count < print_number ){
                            msg="版画号码不能大于版画张数";
                        }
                        if( msg!=='' && msg!==null ){
                            curObj.val('');
                            curObj.prop('placeholder',msg);
                            curObj.addClass(imgplupload.borderRed);
                            alert(msg);
                            return false;
                        }else{
                            if( curObj.hasClass(imgplupload.borderRed) ){
                                curObj.removeClass(imgplupload.borderRed);
                            }
                        }
                    }
                }
                
                if( pinlei==='ds' ){
                    var curObj=obj.find("input[name='length[]']");
                    if( length===null || length==='' ){
                        msg="请录入长度";
                    }else if( !imgplupload.regSize.test(length) ){
                        msg="长度无效";
                    }
                    if( msg!=='' && msg!==null ){
                        curObj.val('');
                        curObj.prop('placeholder',msg);
                        curObj.addClass(imgplupload.borderRed);
                        alert(msg);
                        return false;
                    }else{
                        if( curObj.hasClass(imgplupload.borderRed) ){
                            curObj.removeClass(imgplupload.borderRed);
                        }
                    }
                }
                
                var curObj=obj.find("input[name='width[]']");
                if( width===null || width==='' ){
                    msg="请录入宽度";
                }else if( !imgplupload.regSize.test(width) ){
                    msg="宽度无效";
                }
                if( msg!=='' && msg!==null ){
                    curObj.val('');
                    curObj.prop('placeholder',msg);
                    curObj.addClass(imgplupload.borderRed);
                    alert(msg);
                    return false;
                }else{
                    if( curObj.hasClass(imgplupload.borderRed) ){
                        curObj.removeClass(imgplupload.borderRed);
                    }
                }
                
                var curObj=obj.find("input[name='height[]']");
                if( height===null || height==='' ){
                    msg="请录入高度";
                }else if( !imgplupload.regSize.test(height) ){
                    msg="高度无效";
                }
                if( msg!=='' && msg!==null ){
                    curObj.val('');
                    curObj.prop('placeholder',msg);
                    curObj.addClass(imgplupload.borderRed);
                    alert(msg);
                    return false;
                }else{
                    if( curObj.hasClass(imgplupload.borderRed) ){
                        curObj.removeClass(imgplupload.borderRed);
                    }
                }
                
                if( czsj!==null || czsj!=='' ){
                    var curObj=obj.find("input[name='czsj[]']");
                    if( !imgplupload.regSize.test(height) ){
                        msg="请录入正确的创作年份";
                        curObj.val('');
                        curObj.prop('placeholder',msg);
                        curObj.addClass(imgplupload.borderRed);
                        alert(msg);
                        return false;
                    }else{
                        if( curObj.hasClass(imgplupload.borderRed) ){
                            curObj.removeClass(imgplupload.borderRed);
                        }
                    }
                }
                
                if( chushou===false ){
                    msg="请选择是否出售";
                    alert(msg);
                    return false;
                }
                
                var curObj=obj.find("input[name='price[]']");
                if( chushou==='shi' || (price!==null && price!=='') ){
                    if( !Utils.isSignlessInteger(price) ){
                        msg="请录入作品价格";
                    }else if( 200000 < price || price < 0 ){
                        msg="价格在1-200000之间";
                    }
                    if( msg!=='' && msg!==null ){
                        curObj.val('');
                        curObj.prop('placeholder',msg);
                        curObj.addClass(imgplupload.borderRed);
                        alert(msg);
                        return false;
                    }else{
                        if( curObj.hasClass(imgplupload.borderRed) ){
                            curObj.removeClass(imgplupload.borderRed);
                        }
                    }
                }
                
                if( jinggou ==='是' || (jinggoujia!==null && jinggoujia!=='') ){
                    var curObj=obj.find("input[name='jinggoujia[]']");
                    if( !Utils.isSignlessInteger(jinggoujia) ){
                        msg="请录入竞购价格";
                    }else if( jinggoujia < 0 || 200000 < jinggoujia ){
                        msg="价格在1-200000之间";
                    }
                    if( msg!=='' && msg!==null ){
                        curObj.val('');
                        curObj.prop('placeholder',msg);
                        curObj.addClass(imgplupload.borderRed);
                        alert(msg);
                        return false;
                    }else{
                        if( curObj.hasClass(imgplupload.borderRed) ){
                            curObj.removeClass(imgplupload.borderRed);
                        }
                    }
                }
                return true;
            }
            
            for(var pro in blocks){
                var bchked=blockChk(blocks[pro]);
                if( bchked===false ){
                    return false;
                }
            }
            var subObj=$('#publishform').find("input[type='submit']");
            subObj.val('作品上传中请等待');
            return true;
        });
    }
};
