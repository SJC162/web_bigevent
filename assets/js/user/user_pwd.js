$(function () {
    var form = layui.form
    form.verify({
        newPwd: [/^[\S]{6,16}$/, '密码格式不正确'],
        somePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新密码和原密码一致"
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次密码不一致"
            }
        }
    })

})
$('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: {
            oldPwd: $('#oldpwd').val(),
            newPwd: $('#newpwd').val()
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('更改密码失败')
            }
            layer.msg('更改密码成功')
            // console.log(res);
        }
        
    })
})
$('#btnReset').on('click', function (e) {
    e.preventDefault()
    $('#oldpwd').val('')
    $('#newpwd').val('')
    $('#repwd').val('')
})

