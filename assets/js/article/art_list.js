$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {

            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 查询参数对象，请求数据，交给服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每个页面最多显示多少条
        cate_id: '', // 文章的id
        state: '' //文章的状态 已发表，未发表
    }

    intoTable()

    function intoTable() {

        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取列表失败")
                }


                // 模板引擎渲染页面
                console.log(res);

                var htmlstr = template('list-add', res)
                $('tbody').html(htmlstr)
                    // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 筛选表单绑定submint事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单的值
        var cate_id = $('[name = cate_id]').val()
        var state = $('[name = state]').val()
            // 把重新获取到的值，给到q重新查询符合条件的数据
        q.cate_id = cate_id
        q.state = state
            // 重新渲染页面
        intoTable()
    })


    // 渲染分页的数据
    function renderPage(total) {
        console.log(total);
        laypage.render({
            elem: 'pageBox', //容器id
            count: total, //数据总条数
            limit: q.pagesize, //每页做多显示的数据
            curr: q.pagenum, //默认第几页被选中
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [5, 10, 15, 20, 25],
            // 调用了layoage.render方法，就会发生死循环
            jump: function(obj, first) {
                // console.log(obj);

                q.pagesize = obj.limit

                q.pagenum = obj.curr
                    // 根据最新的q页面，并重新渲染页面
                    //会出现一个死循环，为啥？？？？？？？？？？？？？？？？？？？
                if (!first) {
                    intoTable()
                }
            }
        })
    }


    // 通过代理，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')

                    // 当数据删除完之后，需要判断当前这一页面，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1之后
                    // 再重新调用initTable
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数据
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    intoTable()
                }
            })
            layer.close(index)
        })
    })




})