$(function () {
	function DcsDatas() {
		this.dcsInit.apply(this,arguments);
	}

	DcsDatas.prototype = {
		constructor:DcsDatas,
		dcsInit:function () {
			this.getDBs();   
			this.getDBTables();
			this.tableCheck();
		},
		
		// 公共的Ajax
		ajaxStore:function (name, callback) {
			var that = this;
				
			if(name) {
				name.complete(function () {
					$(".mask").hide();
					name.success(function (response) {
						if(response.success) {
							if(callback){
								callback(response);
							}
						}else {
							$('#prompTips .tipCont').html(response.message);
							$('#prompTips').modal("show");
						}
					});

				})
			}
		},
		// 数据库的操作
		getDBsHandle:function (datas) {
			var DBsStr = '';
			$.each(datas,function (idx) {
				DBsStr += '<li><a class = "dbslist" href = "javascript:void(0);">'+datas[idx]+'</li>'
			})
			$(".dcsDBs").html(DBsStr);

			$(".dbslist").eq(0).addClass("addShow");
		},
		// 获取表列的结构
		getDBTablesHandle:function (datas) {
			if($(".dbTableCheckAll").is(":checked")) {
				$(".dbTableCheckAll").attr("checked",false);
			}
			
			var dbTablesStr = '';

			if(datas.length == 0) {
				$(".dbsTables").html('<tr><td colspan="4">没有数据</td></tr>');
				$(".pageCont").hide();
				return;
			}else {
				$(".pageCont").show();
			}
			dbTablesStr += ''
			$.each(datas,function (idx) {
				dbTablesStr += '<tr>\
	                            <td><div class="checkbox">\
	                                <label>\
	                                    <input class = "tableNameCheck" type="checkbox" value="">\
	                                    <span class = "tableName">'+datas[idx].tableName+'</span>\
	                                </label>\
	                            </div></td>\
	                            <td class="text-red">'
	             if(datas[idx].tableType == 'UNLINK') {
		        	dbTablesStr += '未导入';
		        }else if(datas[idx].tableType == 'LINKED') {
		        	dbTablesStr += '已导入';
		        }             
	            dbTablesStr += '</td>\
	                            <td><a href="javascript:void(0);" class="text-blue dbTableStru">结构预览</a> <a href="javascript:void(0);" class="text-blue dbTabledata">数据预览</a></td>\
	                        </tr>';
			})
				
			$(".dbsTables").html(dbTablesStr);
		},
		// 只是获取的第一个数据库的列表
		paginator:function (total) {
			var that = this,
				eachCount = 10,
			    pages = Math.ceil(total/eachCount);
			
			var options = {
				bootstrapMajorVersion: 3, 
				currentPages:1,
				totalPages:pages,
				 shouldShowPage: true,
				alignment:"center",
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
	            	$(".mask").show();
	            	var fTableName = $(".dcsDBs li").eq(0).html();
	                var getFirstTable = DatasourceNewStore.getDBTables(fTableName,newPage);

					that.ajaxStore(getFirstTable, function(response){
						var datas = response.data;
						that.getDBTablesHandle(datas);
					});
	            }
			}
			$("#dcsPagate").bootstrapPaginator(options);
		},
		// 获取数据库的
		getDBs:function () {
			var that = this;
			// 获取数据库
			$(".mask").show();
			var getDBsName = DatasourceNewStore.getDBs();

			that.ajaxStore(getDBsName, function(response){
				var datas = response.data;
				that.getDBsHandle(datas);

				var fTableName = $(".dbslist").eq(0).html();
				
				// 获取第一个数据库的表,先示范一个，还得改回原来的
				var getFirstTable = DatasourceNewStore.getDBTables(fTableName,1);

				that.ajaxStore(getFirstTable, function(response){
					var datas = response.data,
						total = response.total;
					that.getDBTablesHandle(datas);
					that.paginator(total);
				});
			});

			
		},
		// 结构预览的Str
		structHandle:function (datas) {
			var strucStr = '';

			$.each(datas,function (idx) {
				strucStr += '<tr>';
				var dataCol = datas[idx];
	            $.each(datas[idx],function (colIdx) {
	            	strucStr += '<td>'+dataCol[colIdx]+'</td>'
	            })            
	            strucStr += '</tr>'
			})
			$(".DCSdataHead").html("");
			$(".dataBody").html(strucStr);
		},

		// 数据预览
		datasHandle:function (datas,metas) {
			var dataStrs = '',
				metaDataStr = '',
				metasLen = metas.length;

			metaDataStr += '<tr>';
			$.each(metas,function (metaIdx) {
				metaDataStr += '<td>'+metas[metaIdx]+'</td>'
			})
			metaDataStr += '</tr>';

			$(".DCSdataHead").html(metaDataStr);

			if(datas.length == 0) {
				$(".dataBody").html('<tr><td colspan = "'+metasLen+'">没有数据</td></tr>');
				return;
			}

			$.each(datas,function (idx) {
				dataStrs += '<tr>';
				var datasCol = datas[idx];
	            $.each(datas[idx],function (colIdx) {
	            	dataStrs += '<td>'+datasCol[colIdx]+'</td>'
	            })            
	            dataStrs += '</tr>';
			})
			
			$(".dataBody").html(dataStrs);
		},

		// 数据连接,加上样式后选择名称时也需要修改
		connectDBs:function () {
			var dbName = $(".addShow").html(),
				tableNameCheck = $(".tableNameCheck:checked"),
				tableCheckLen = tableNameCheck.length,
				connectDB = '';

			$.each(tableNameCheck,function (idx) {
				// 需要修改的
				var	connectName = tableNameCheck.eq(idx).next(".tableName").html(),
					completeName = dbName+'.'+connectName;

				connectDB += completeName + ',';
			});
			connectDB = connectDB.substr(0,connectDB.length - 1);

			return connectDB;
		},
		// 传了一个名称
		eachPaginator:function (total, thisName) {
			var that = this,
				eachCount = 10,
			    pages = Math.ceil(total/eachCount);
			
			var options = {
				bootstrapMajorVersion: 3, 
				currentPages:1,
				totalPages:pages,
				 shouldShowPage: true,
				alignment:"center",
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
	            	$(".mask").show();
	            	var fTableName = $(".dcsDBs li").eq(0).html();
	                var getFirstTable = DatasourceNewStore.getDBTables(thisName,newPage);

					that.ajaxStore(getFirstTable, function(response){
						var datas = response.data;
						that.getDBTablesHandle(datas);
					});
	            }
			}
			$("#dcsPagate").bootstrapPaginator(options);
		},
		// 点击每个数据库获取到列表及表结构，预览结构
		getDBTables:function () {
			var that = this;
			$(".dcsDataWrapper").on("click", ".dbslist",function () {
				var $this = $(this),
					$thisName = $this.html(),
					dbslist = $(".dbslist");
				// 先判断是否存在此类，才有用
				if($this.hasClass("addShow")) {
					return;
				}

				$.each(dbslist,function () {
					dbslist.removeClass("addShow");
				})
				$this.addClass("addShow");
				$(".mask").show();
				var getFirstTable = DatasourceNewStore.getDBTables($thisName,1);

				that.ajaxStore(getFirstTable, function(response){
					var datas = response.data,
						total = response.total;

					

					that.getDBTablesHandle(datas);

					that.eachPaginator(total,$thisName);
				});
			})

			// 结构预览
			$(".dcsDataWrapper").on("click", ".dbTableStru", function () {
				$("#reviewData").modal();

				var dbName = $(".addShow").html(),
					//结构改变可能需要更改 
					tableName = $(this).parents("tr").find(".tableName").html();

				$(".mask").show();
				var tableStru = DatasourceNewStore.getTableStru(dbName,tableName);

				that.ajaxStore(tableStru, function(response){
					var datas = response.data;
					that.structHandle(datas);
				});
			})
			// 数据预览
			$(".dcsDataWrapper").on("click", ".dbTabledata", function () {
				$("#reviewData").modal();

				var dbName = $(".addShow").html(),
					//结构改变可能需要更改
					tableName = $(this).parents("tr").find(".tableName").html();

				$(".mask").show();

				var tableData = DatasourceNewStore.getTableData(dbName,tableName);

				that.ajaxStore(tableData, function(response){
					var datas = response.data;
					var metas = response.metadata;

					that.datasHandle(datas,metas);
				});
			}),
			
			// 数据连接
			$("#dataImport").on("click",function () {

				var connectDBs = that.connectDBs();
				console.log(typeof connectDBs);
				if(connectDBs == 0) {
					$('#prompTips .tipCont').html("请选择至少一个数据");
					$('#prompTips').modal("show");
					return;
				}

				$(".mask").show();

				var connectData = DatasourceNewStore.connectDBs(connectDBs);

				that.ajaxStore(connectData, function(response){
					if(response.success) {
						$('#prompTips .tipCont').html("导入成功");
						$('#prompTips').modal("show");
						setTimeout(function () {
							location.reload();
						},1000);
					}else {
						$('#prompTips .tipCont').html(response.message);
						$('#prompTips').modal("show");
					}
				});
			})
		},
		// 全选表名
		tableCheck:function () {

			$(".dbTableCheckAll").on("click",function () {

				var eachName = $(".tableNameCheck");

				if($(this).is(":checked")) {
					eachName.prop("checked",true);
				}else {
					eachName.prop("checked",false);
				}
			});

			$(".dcsDataWrapper").on("click",".tableNameCheck", function () {
				var tabName = $(".tableNameCheck"),
					tabNameLen = tabName.length,
					tabCheckName = $(".tableNameCheck:checked"),
					tabCheckLen = tabCheckName.length;

				if(tabNameLen == tabCheckLen) {
					$(".dbTableCheckAll").prop("checked",true);
				}else {
					$(".dbTableCheckAll").prop("checked",false);
				}
			});
		},
	}

	new DcsDatas();
})

