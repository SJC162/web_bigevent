$(function () {
    getUserInfo()
    // 退出操作
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('是否退出', { icon: 3, title: '提示' }, function (index) {
            // 清除本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'


            layer.close(index)
        })
    })
})
// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        // complete: function (res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
    // 2.显示用户名称
    $('#weclome').html('欢迎&nbsp&nbsp   ' + name)
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}

