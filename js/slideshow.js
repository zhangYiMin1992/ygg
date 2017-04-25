$(function(){
    $(document).on("click",".open-panel",function(e){
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
