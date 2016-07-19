// allDatas.js
function AllDatas() {}

AllDatas.prototype = {
	consturctor:AllDatas,
	allDataInit:function () { 
		this.catalogData();  
		this.database();
		this.dataTable(); 
		this.previewTable();
		this.slideHide();
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
	catalogDataHandle:function (data) {
		var catalogStr = '',
			localStr = '';
		$.each(data,function (idx) {
			if(idx == 0) {
				localStr += '<li>\
								<a class = "allDataList commonData" index = "'+data[idx].id+'" href="#menu_'+data[idx].id+'"><i class="iconfont2"></i><span class = "dataName">'+data[idx].label+'</span></a>\
		                        <ul class = "dataBaseNav" id="menu_'+data[idx].label+'_'+data[idx].id+'">\
		                        </ul>\
	                        </li>';
			}else{
				catalogStr += '<li>\
                        <a class = "allDataList commonData" index = "'+data[idx].id+'" href="#menu_'+data[idx].id+'"><i class="iconfont2"></i><span class = "dataName">'+data[idx].label+'</span></a>\
                        <ul class = "dataBaseNav" id="menu_'+data[idx].label+'_'+data[idx].id+'">\
                        </ul>\
                    </li>'
			}
			
		});
		$(".localDatas").html(localStr);
		$(".allData").html(catalogStr);
	},
	// 获取三个数据
	catalogData:function () {
		var that = this;
		$(".mask").show();
		var catalogName = DatasourceNewStore.catalogData();

		that.ajaxStore(catalogName, function(response){
			var datas = response.data;
			that.catalogDataHandle(datas);
		});
	},
	dataBaseHandle:function (data) {
		var dataBaseStr = '';

		$.each(data,function (idx) {
			dataBaseStr += '<li>\
                                <a class = "dataBaseList commonData" href="#dataBase_'+data[idx].id+'" index = "'+data[idx].id+'"><i class="iconfont2"></i><span class = "dataBaseName">'+data[idx].label+'</span></a>\
                                <ul  class = "dataBaseNav" id="dataBase_'+data[idx].label+'_'+data[idx].id+'">\
                                </ul>\
                            </li>'
		});

		return dataBaseStr;
	},
	// 获取数据库
	database:function () {
		var that = this;
		// 本地的
		$(".localDatas").on("click",".allDataList", function () {

			var menuIndex = $(this).attr("index");
			var dataName = $(this).find(".dataName").html();

			if($('#menu_'+dataName+'_'+menuIndex).html().trim() != '') {
				return;
			}

			$(".mask").show();
			var dataAjaxName = DatasourceNewStore.database(dataName);

			that.ajaxStore(dataAjaxName, function(response){
				var datas = response.data;
				var dataBase = that.dataBaseHandle(datas);
				
				$('#menu_'+dataName+'_'+menuIndex).html(dataBase);
			});
		})
		// 其他的
		$(".allData").on("click",".allDataList", function () {

			var menuIndex = $(this).attr("index");
			var dataName = $(this).find(".dataName").html();

			if($('#menu_'+dataName+'_'+menuIndex).html().trim() != '') {
				return;
			}
			$(".mask").show();
			var dataAjaxName = DatasourceNewStore.database(dataName);

			that.ajaxStore(dataAjaxName, function(response){
				var datas = response.data;
				var dataBase = that.dataBaseHandle(datas);
				
				$('#menu_'+dataName+'_'+menuIndex).html(dataBase);
			});
		})
	},
	// 其他获取表的
	dataTableHandle:function (data) {
		var dataTableStr = '';
		$.each(data,function (idx) {
			dataTableStr += '<li><a class = "tableData" tableName = "'+data[idx].label+'" dbBaseName = "'+data[idx].database.label+'" href="javascript:void(0)">'+data[idx].label+'</a></li>';
		});

		return dataTableStr;
		
	},
	// 本地获取表的
	localDataTableHandle:function (data) {
		var dataTableStr = '';
		$.each(data,function (idx) {
			dataTableStr += '<li><a class = "localTableData" tableName = "'+data[idx].label+'" dbBaseName = "'+data[idx].database.label+'" href="javascript:void(0)">'+data[idx].label+'</a></li>';
		});

		return dataTableStr;
		
	},
	// 获取表
	dataTable:function () {
		var that = this;
		// 获取本地的
		$(".localDatas").on("click",".dataBaseList",function () {
			
			var tableId = $(this).attr("index");
			var tableName = $(this).find(".dataBaseName").html();

			if($("#dataBase_"+tableName+'_'+tableId).html().trim() != '') {
				return;
			}
			$(".mask").show();

			
			var tableAjaxName = DatasourceNewStore.dataTable(tableName);

			that.ajaxStore(tableAjaxName, function(response){
				var datas = response.data;
				var dataTable = that.localDataTableHandle(datas);
				
				$("#dataBase_"+tableName+'_'+tableId).html(dataTable);
			});
		})
		// 获取其他的
		$(".allData").on("click",".dataBaseList",function () {
			
			var tableId = $(this).attr("index");
			var tableName = $(this).find(".dataBaseName").html();
			if($("#dataBase_"+tableName+'_'+tableId).html().trim() != '') {
				return;
			}
			$(".mask").show();


			var tableAjaxName = DatasourceNewStore.dataTable(tableName);

			that.ajaxStore(tableAjaxName, function(response){
				var datas = response.data;
				var dataTable = that.dataTableHandle(datas);
				
				$("#dataBase_"+tableName+'_'+tableId).html(dataTable);
			});
		})
	},

	// 预览表结构函数
	previewTableHandle:function (data,metaData) {
		var previewThStr = '',
			previewTBStr = '';

		previewThStr += '<tr>';
		$.each(metaData,function (metaIdx) {
			previewThStr += '<th>'+metaData[metaIdx]+'</th>'
		})
		previewThStr += '</tr>';
		
		$(".dataTh").html(previewThStr);
		// 有的data为null,有的长度为0
		if(data == null) {
			$(".dataTbody").html('<tr><td colspan = '+metaData.length+'>没有数据</tr>');
			return;
		}

		$.each(data,function (idx) {
			previewTBStr += '<tr>';
			$.each(data[idx],function (tdIdx) {
				previewTBStr += '<td>'+data[idx][tdIdx]+'</td>';
			})
			previewTBStr += '</tr>';
		});

		$(".dataTbody").html(previewTBStr);
	},

	// 预览表结构
	previewTable:function () {
		var that = this;
		// 其他预览表结构
		$(".allData").on("click",".tableData",function () {
			var tableName = $(this).attr("tableName");
			var dbBaseName = $(this).attr("dbBaseName");
			$(".mask").show();

			$(".jsonName").html(tableName);
			$("#addDatas").attr("dbbasename",dbBaseName);
			$("#addDatas").attr("tablename",tableName);

			$("#createTable").attr("dbbasename",dbBaseName);
			$("#createTable").attr("tablename",tableName);

			$("#createModel").attr("dbbasename",dbBaseName);
			$("#createModel").attr("tablename",tableName);

			var previewName = DatasourceNewStore.getTableData(dbBaseName, tableName);

			that.ajaxStore(previewName, function(response){
				var datas = response.data,
					metaData = response.metadata;

				var dataBase = that.previewTableHandle(datas, metaData);
			});
		});
		// 本地预览表结构
		$(".localDatas").on("click",".localTableData",function () {
			
			var tableName = $(this).attr("tableName");
			var dbBaseName = $(this).attr("dbBaseName");
			$(".mask").show();

			$(".jsonName").html(tableName);
			$("#addDatas").attr("dbbasename",dbBaseName);
			$("#addDatas").attr("tablename",tableName);

			$("#createTable").attr("dbbasename",dbBaseName);
			$("#createTable").attr("tablename",tableName);

			$("#createModel").attr("dbbasename",dbBaseName);
			$("#createModel").attr("tablename",tableName);

			var previewName = DatasourceNewStore.localPreview(dbBaseName, tableName);

			that.ajaxStore(previewName, function(response){
				var datas = response.data,
					metaData = response.metadata;
					
				var dataBase = that.previewTableHandle(datas, metaData);
			});
		})
	},

	// 左边隐藏和消失
	slideHide:function () {
		$(".localAllDatas").on("click",".commonData",function () {
			var dataBaseNav = $(this).siblings(".dataBaseNav");
			if(dataBaseNav.html().trim() == '') {
				return;
			}
			$(this).siblings(".dataBaseNav").slideToggle(100);
			$(this).find("i").toggleClass("turnLeft");
		})
	}

}