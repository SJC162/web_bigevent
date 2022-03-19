$(function () {
    // 去注册账号
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 去登录账号
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui获取form对象
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位'],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 形参拿到输入框的密码
            // 然后进行判断
            var pwd = $('.reg-box [name=password]').val()
            if (pwd != value) {
                return '两次密码不一致！'
            }
        }
    })

    var layer = layui.layer
    // 注册
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("注册成功");
                $('#link_login').click()
            }
        })
        // $.post('http://api-breakingnews-web.itheima.net/api/reguser',
        //     { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() },
        //     function (res) {
        //         if (res.status !== 0) {
        //             return res.message
        //         }
        //     })
    })
    // 登录
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: {
                username: $('#form_login [name=username]').val(),
                password: $('#form_login [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                // 保存登录状态保持  免登陆
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})