$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()


    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                // if(res.status!==0)return layer.msg('获取列表失败')
                // layer.msg('获取列表成功')
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
                    // var htmlstr=''
                    // res.data.forEach(function(item){
                    //     htmlstr +='<tr><td>'+item.name +'</td><td>'+item.alias +'</td><td><button>删除</button></td></tr>'
                    // })

            }
        })
    }
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式。为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新添类别失败')
                }
                initArtCateList()
                layer.msg('新添类别成功')
                    //根据索引关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })


    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
            // 弹出一个修改文章分类信息的层
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            })
            var id = $(this).attr('data-id')
            console.log(id);

            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            })

        })
        // 通过代理的形式。为btn-edit绑定点击事件
    $('body').on("submit", "#form-edit", function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 删除数据
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            })



        })
    })














})