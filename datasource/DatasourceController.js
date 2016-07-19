/**********************************************************

create by zhangzhicheng  
date          2016-5-12

数据库表页面js
    

**********************************************************/



var $j = window.$j || {};
parent.setCurMenu&&parent.setCurMenu(3);
(function() {

    /* 
     *
     * ************************数据源页面控制类*****************************
     *
     *
     */
    function dataorigin() {
        this.switchDB = new switchDB();
        this.tablelist = new tablelist();
        this.search = new search();
        this.page = new page();
        this.layer = new layer();
        // this.createModel = new $j.createModel();
    }

    dataorigin.getIns = function() {
        if (dataorigin.instance) {
            return dataorigin.instance;
        } else {
            return dataorigin.instance = new dataorigin();
        }
    }
    dataorigin.prototype.getswitchDB = function() {
        return this.switchDB;
    };
    dataorigin.prototype.gettablelist = function() {
        return this.tablelist;
    };
    dataorigin.prototype.getlayer = function() {
        return this.layer;
    };
    dataorigin.prototype.getsearch = function() {
        return this.search;
    };

    dataorigin.prototype.getpage = function() {
        return this.page;
    };

    dataorigin.prototype.getcreateModel = function() {
        return this.createModel;
    };


    /* 
     *
     * ************************数据库切换控制类*****************************
     *
     *
     */

    //下拉切换数据库类
    function switchDB() {
        this.currentDB = '';
        this.dblist = null;
        this.init();
    }

    switchDB.prototype.getCurrentDB = function() {
        return this.currentDB;
    }

    switchDB.prototype.init = function() {
        var me = this;
        $.ajax({
           type: "get",
           url: AbstractStore.APP_URL+"db/getAllDBs.do",
           dataType:"json"
        }).done(function(msg){
            if(msg.success){
               var str = '';
               var dblist = me.dblist = msg.data;
               $.each(dblist,function(a,b){
                   if(a == 0){
                       me.currentDB = b;
                   }
                   str += '<option>' + b + '</option>';
               })
               $("#dblist").html(str);
               $j.dataorigin.getIns().gettablelist().getjson();
            }else{
                alert(msg.message)
            }
        });

        $("#dblist").change(function(event) {
            me.currentDB = $(this).find("option:selected").text();
            $j.dataorigin.getIns().gettablelist().getjson();
        });

    };


    /* 
     *
     * ************************弹出层控制类*****************************
     *
     *
     */

    function layer() {

    }

    layer.prototype.init = function() {

    }

    layer.prototype.showmodal1 = function(data) {
        var table = $("#data10");
        var str = '';
        if (data.data.length) {
            var ttlist = data.metadata,
                dlist = data.data;
            if (ttlist) {
                str += '<tr>';
                $.each(ttlist, function(a, b) {
                    str += '<td>' + b[0] + '</td>'
                })
                str += '</tr>';
            }
            $.each(dlist, function(a, b) {
                str += '<tr>';
                $.each(b, function(c, d) {
                    str += '<td>' + d + '</td>';
                })
                str += '</tr>';
            });
        } else {
            str = '<tr><td>没有数据</td></tr>'
        }
        table.html(str);
        $("#modal1").modal('show');
    }

    layer.prototype.showmodal2 = function(v) {
        $('#prompTips .tipCont').html(v);
        $("#prompTips").modal('show');
    }


    /* 
     *
     * ************************搜索控制类*****************************
     *
     *
     */

    function search() {
        this.init();
    }
    search.prototype.init = function() {
        function search() {
            var value = $.trim($("#search").val());
            var db = $j.dataorigin.getIns().gettablelist();
            db.settableNameFilter(value);
            db.getjson();
        }

        $("#searchbtn").click(function(event) {
            search();
        });

        $("#search").keyup(function(event) {
            if (event.keyCode == 13) {
                search();
            }
        });
    }


    /* 
     *
     * ************************分页控制类*****************************
     *
     *
     */

    function page() {
        this.paginator = null;
        this.init();
    }
    page.prototype.init = function() {

    }

    page.prototype.create = function(total) {
        var currentPage = $j.dataorigin.getIns().gettablelist().getpageIndex();
        if (this.paginator) {
            $('#paginator').bootstrapPaginator('setOptions',{currentPage: currentPage, totalPages: total});
        } else {
            this.paginator = true;
            var total = total;
            $('#paginator').bootstrapPaginator({
                bootstrapMajorVersion: 3, //版本
                currentPage: currentPage, //当前页数
                totalPages: total, //总页数
                numberOfPages: 5,
                shouldShowPage: true,
                tooltipTitles: function(type, page, current) {
                    switch (type) {
                        case "first":
                            return "";
                        case "prev":
                            return "";
                        case "next":
                            return "";
                        case "last":
                            return "";
                        case "page":
                            return "";
                    }
                },
                itemTexts: function(type, page, current) {
                    switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                    }
                }, //点击事件，用于通过Ajax来刷新整个list列表
                onPageChanged: function(event, oldPage, newPage) {
                    $j.dataorigin.getIns().gettablelist().setpageIndex(newPage);
                    $j.dataorigin.getIns().gettablelist().getjson();
                }
            })
        }
    }

    /* 
     *
     * ************************数据表切换控制类*****************************
     *
     *
     */

    function tablelist() {
        this.notlink = 'item-disabled';
        this.status = "ALL";
        this.pageIndex = '1';
        this.pageSize = '10';
        this.tableNameFilter = '';
        this.init();
    };

    tablelist.prototype.setstatus = function(v) {
        this.status = v;
        this.setpageIndex('1');
    }

    tablelist.prototype.setpageIndex = function(v) {
        this.pageIndex = v;
    }

    tablelist.prototype.getpageIndex = function() {
        return this.pageIndex;
    }

    tablelist.prototype.settableNameFilter = function(v) {
        this.tableNameFilter = v;
        this.setpageIndex('1');
    }



    tablelist.prototype.init = function() {
        var me = this;
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            me.setstatus($(e.target).attr("data-status"));
            me.getjson();
        })

        $("#zcnewmodel").click(function(e) {
            var cheboxs = $("#table" + me.status + " .zcck:checked");
            if (cheboxs.length == 1) {
                var tablename = cheboxs.closest('tr').attr("data-table");

                cheboxs.closest('tr').find('.newmodel').hasClass(me.notlink)
                //看是否有权限进行新建模型
                if (cheboxs.closest('tr').find('.newmodel').hasClass(me.notlink)) {
                    alert("没有权限");
                    return false;
                }

                // 看是否已经连接
                if(cheboxs.closest('tr').children('td').eq(1).attr('data-status') == "UNLINK"){
                    $j.dataorigin.getIns().getlayer().showmodal2('请先连接');
                    return false;
                }
                $j.dataorigin.getIns().getcreateModel().createModel(tablename)
            } else {
                $j.dataorigin.getIns().getlayer().showmodal2('请选择表且一次只能新建一个');
            }

        })

        $("#tablelist").on('click', '.linkall', function() {

            var cheboxs = $("#table" + me.status + " .zcck:checked");
            if (cheboxs.length) {
                var db = $j.dataorigin.getIns().getswitchDB().getCurrentDB();
                var tablelist = [];
                $.each(cheboxs, function(a, b) {
                    tablelist.push($(b).closest('tr').attr("data-table"))
                })
                tablelist[0] = db + "." + tablelist[0];
                var data = tablelist.join("," + db + ".");

                var url = AbstractStore.APP_URL+'tables/connection.do';
                // $j.dataorigin.getIns().getlayer().showmodal2();
                $.loadingAjax({
                   type: "post",
                   url: url,
                   data:{tables:data},
                   dataType:"json"
                },function(msg){
                    cheboxs.each(function(index, el) {
                        $(this).closest('tr').children('td').eq(1).attr("data-status",'LINKED').html("已连接");
                    });
                    $j.dataorigin.getIns().getlayer().showmodal2('操作成功');
                })
            }

        })

        function ck () {
              var selectboxs = $("#table" + me.status + " .zcck");
              var cheboxs = $("#table" + me.status + " .zcck:checked");

              var all = $("#table" + me.status + " .checkAll");

              if (selectboxs.length == cheboxs.length && !all.prop('checked')) {
                  all.prop('checked', true);
              } else if (selectboxs.length != cheboxs.length && all.prop('checked')) {
                  all.prop('checked', false);
              }
        }
        $("#tablelist").on('click', '.zcck', function(e) {
            ck();
            e.stopPropagation();
        })

        $("#tablelist").on('click', 'tr', function() {
            var $input = $(this).children('td').eq(0).find('input');
            $input.prop('checked', !$input.prop('checked'));
            ck();
        })


        $("#tablelist").on('click', '.checkAll', function() {
            $("#table" + me.status + " .zcck").prop('checked', $(this).prop('checked'));
        })

        $("#tablelist").on("click", '.data10', function(e) {
            e.stopPropagation(); 
            var self = $(this);
            if (self.hasClass(me.notlink)) {
                return false;
            }
            var db = $j.dataorigin.getIns().getswitchDB().getCurrentDB();
            var table = self.closest('tr').attr("data-table");
            var url = AbstractStore.APP_URL + db + '/tables/' + table + '/rows.do';
            // $j.dataorigin.getIns().getlayer().showmodal1(DatasourceStore.data10);

            $.loadingAjax({
               type: "get",
               url: url,
               dataType:"json"
            },function(msg){
                $j.dataorigin.getIns().getlayer().showmodal1(msg);
            })

        })

        $("#tablelist").on("click", '.struct', function(e) {
            e.stopPropagation(); 
            var self = $(this);
            if (self.hasClass(me.notlink)) {
                return false;
            }
            var db = $j.dataorigin.getIns().getswitchDB().getCurrentDB();
            var table = self.closest('tr').attr("data-table");
            var url = AbstractStore.APP_URL + db + '/tables/' + table + '/schema.do';

            $.loadingAjax({
               type: "get",
               url: url,
               dataType:"json"
            },function(msg){
                $j.dataorigin.getIns().getlayer().showmodal1(msg);
            })

        })

        // 使用use
        $("#tablelist").on("click", '.use', function(e) {
            e.stopPropagation(); 
            var self = $(this);
            if (self.hasClass(me.notlink)) {
                return false;
            }
            var db = encodeURI($j.dataorigin.getIns().getswitchDB().getCurrentDB());
            var table = encodeURI(self.closest('tr').attr("data-table"));
            
            $(this).prop("href","../worktable/app/index.html?type=hive&&name="+db+'.'+table);
        })

        $("#tablelist").on("click", '.link', function(e) {
            e.stopPropagation(); 
            var self = $(this);
            if (self.hasClass(me.notlink)) {
                return false;
            }

            var db = $j.dataorigin.getIns().getswitchDB().getCurrentDB();
            var table = self.closest('tr').attr("data-table");
            var url = AbstractStore.APP_URL+'tables/connection.do';


            $.loadingAjax({
                type: "post",
                url: url,
                data:{tables:db+"."+table},
               dataType:"json"
            },function(msg){
                self.closest('tr').children('td').eq(1).attr("data-status",'LINKED').html("已连接");
                $j.dataorigin.getIns().getlayer().showmodal2('操作成功');
            })
        })

        $("#tablelist").on("click", '.newmodel', function(e) {
            e.stopPropagation(); 
            var self = $(this);
            if (self.hasClass(me.notlink)) {
                return false;
            }
            var tablename = $(this).closest('tr').attr("data-table");

            // 看是否已经连接
            if($(this).closest('tr').children('td').eq(1).attr('data-status') == "UNLINK"){
                $j.dataorigin.getIns().getlayer().showmodal2('请先连接');
                return false;
            }
            $j.dataorigin.getIns().getcreateModel().createModel(tablename)
        })
    };
    tablelist.prototype.getjson = function(db) {
        var me = this;
        var db = $j.dataorigin.getIns().getswitchDB().getCurrentDB();
        var url = AbstractStore.APP_URL+ db + '/tables.do';
        var data = {
                status: me.status,
                pageIndex: me.pageIndex,
                pageSize: me.pageSize,
                tableNameFilter: me.tableNameFilter
            }

        $.loadingAjax({
           type: "get",
           url: url,
           data: data,
           dataType:"json"
        },function(msg){
            me.render(msg);
            var p = Math.ceil(msg.total / 10);
            if(p){
                $("#paginator").show();
                $j.dataorigin.getIns().getpage().create(p);
            }else{
                $("#paginator").hide();
            }
        },'#loading');    
    };

    tablelist.prototype.biaowei = function() {
        return '<tr>' +
            '<td><lable><input type="checkbox" class="checkAll"></lable></td>' +
            '<td><button class="btn btn-default linkall">批量连接</button></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>';
    }

    tablelist.prototype.content = function(data) {
        var me = this;
        var str = "";
        $.each(data.data, function(a, b) {
            var mask = b.mask;
            var ac = '',
                bc = '',
                cc = '',
                dc = '';
            if (mask != 16) {
                if ((mask & 64) == 0) {
                    ac = me.notlink;
                }
                if ((mask & 128) == 0) {
                    bc = me.notlink;
                }
                if ((mask & 32) == 0) {
                    cc = me.notlink;
                }
                if ((mask & 4) == 0) {
                    cc = me.notlink;
                }
            }

            var status = b.tableType == "UNLINK" ? "未连接" : "已连接";

            str +=  
                '<tr data-table="' + b.tableName + '">' +
                    '<td><lable><input type="checkbox" class="zcck"></lable></td>' +
                    '<td data-status="'+b.tableType+'">' + status + '</td>' +
                    '<td>' + b.tableName + '</td>' +
                    '<td>'+
                    '    <a href="javascript:;"  class="link ' + cc + '" title="连接">'+
                    '        <i class="gficon44"></i>'+
                    '    </a>'+
                    '    <a href="javascript:;" class="data10 ' + ac + '" title="预览数据">'+
                    '        <i class="gficon41"></i>'+
                    '    </a>'+
                    '    <a href="javascript:;" class="struct ' + bc + '" title="表结构" >'+
                    '        <i class="gficon45"></i>'+
                    '    </a>'+
                    '    <a href="javascript:;" class="use '+ bc + '" title="使用" >'+
                    '        <i class="gficon47"></i>'+
                    '    </a>'+
                    '    <a href="javascript:;" class="newmodel ' + dc + '" title="新建模型">'+
                    '        <i class="gficon43"></i>'+
                    '    </a>'+
                    '</td>';    
                '</tr>';
        })
        return str;
    }
    tablelist.prototype.render = function(data) {
        var me = this;
        var str = "";
        if (data.total) {
            str += me.content(data);
            str += me.biaowei();
        } else {
            str += "<tr><td colspan=5>没有数据</td></tr>";
        }
        $('#table' + me.status).html(str);
    };

    $j.dataorigin = dataorigin;
})()


$(function() {

    $j.dataorigin.getIns();



});