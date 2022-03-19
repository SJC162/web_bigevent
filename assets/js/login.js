$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        //自定义了一个叫做pwd校验规则,不能包含空格,在6~12位之间
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function(value) {
            //形参是确认密码框的值
            var pwd = $('.reg-box [name = password]').val()
            if (pwd != value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            // console.log('注册成功');
            layer.msg('注册成功，请登录！')
                //模拟人的点击行为
            $('#link_login').click()
        })
    })

    //监听登录表单的事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单数据
            data: {
                username: $('#form_login [name=username]').val(),
                password: $('#form_login [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res.message);
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                console.log(res.token);
                //将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = '/index.html'
            }

        })
    })

})