$(function () {
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()

    function initUserInfo() {
        var form = layui.form
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户失败')
                }
    
                console.log(res);
                // 调用form.val()快速复制
                form.val('formUserInfo',res.data)
            }
        })
    }
    
    // 重置表单
    $('#btnReset').on('click',function(e){
        // 阻止表单默认重置事件
        e.preventDefault()
        initUserInfo()
    })
    

    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法，重新渲染用户的头像
                window.parent.getUserInfo()
            }
        })
    })
})
