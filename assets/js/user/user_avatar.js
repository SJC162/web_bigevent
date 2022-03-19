// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 上传按钮点击事件
$('#btnCloseImage').on('click', function () {
    $('#file').click()
})
$('#file').on('change', function (e) {
    console.log(e);
    console.log(e.target);
    var filelist = e.target.files
    if (filelist.length === 0) {
        return layer.mag("请选择文件")
    }


    // 1.拿到用户选择的文件
    // var files=e.target.files[0]
    // 2.将文件，转化为路径
    var imgURL = window.URL.createObjectURL(filelist[0])
    // 3.重新初始化裁剪区，将url给到img的src属性
    $image
        .cropper('destroy') // 销毁裁剪区的旧图
        .attr('src', imgURL) //重新修改裁剪区路径
        .cropper(options)   //重新初始化裁剪区域
})

$('#btnUpload').on('click', function () {
    var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg("更换头像失败")
            }
            layer.msg("更换头像成功")
            window.parent.getUserInfo()
        }
    })
})