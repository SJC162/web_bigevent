$(function() {
    var layer = layui.layer
    var form = layui.form
        // 定义加载文章费雷的方法
    initCate()
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取类别失败')
                }
                // console.log(res);

                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }



    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面的按钮，
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function(e) {
        // e.preventDefault()
        var files = e.target.files
        if (files === 0) { return }
        var newImageUrl = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImageUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })



    $("#form-pub").on('submit', function(e) {
        e.preventDefault()
            // 基于form表单，快速创建一个formData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        fd.forEach(function(v, k) {
            console.log(v, k);
        })
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败')
                }
                layer.msg('发表文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})