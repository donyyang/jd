// 本地导入页面
function LaodFile() {

}

LaodFile.prototype = new AddAndLocal();

LaodFile.prototype.init = function () {
	// 编码
	this.localCode = $("#codeStyle");
	// 选择文件
	this.localFile = $("#localFileIpt");
	// 存储数据
	 this.storeDatas = $(".localframe textarea");
	 //input table的名字
	this.tableName = $(".localdata-name");
	// 列的其他radio
	this.iptSymbol = $(".iptColSymbol");
	// 列的其他input
	this.colSymbolOther = $("#colSymbolOther");
	// $("#firstcolBtn")
	this.firstcolBtn = $(".colName");
	this.isColName = $(".isColName");
	this.notColName = $(".notColName");
	// $(".localTableHead"),
	this.localTableHead = $(".localTableHead");
	//  $(".localTableHeadHide")
	this.localTableHeadHide = $(".localTableHeadHide");
	// $(".localTableBody")
	this.localTableBody = $(".localTableBody");
	// $(".rowSymbol")
	this.rownotSymbols = $(".rowSymbol");
	// $(".colSymbol")
	this.colnotSymbols = $(".colSymbol");
	// $(".localType");
	this.localType = $(".localType");

	this.colBody = $(".colBody");
}
LaodFile.prototype.changeFile = function () {
	this.init();
	AddAndLocal.prototype.changeFile.apply(this,arguments);

	this.newAddColBtn(); 
	this.importbtn();
}

LaodFile.prototype.colStrs = function () {
	var colStr = '<tr>\
        			<td>\
        				<input class="form-control newColName" type = "text" placeholder = "请输入列名">\
        			</td>\
        			<td>\
        				<select class = "form-control localType">\
        					<option>string</option>\
        					<option>decimal</option>\
        					<option>bigint</option>\
        					<option>timestamp</option>\
        				</select>\
        			</td>\
        			<td>\
        				<input class = "form-control partionIpt" type = "text" placeholder = "请输入对应的值" disabled>\
        			</td>\
        			<td>\
        				<input class = "partiteBtn" type = "checkbox">\
        			</td>\
        			<td>\
        				<a class = "localColDel" href="#">删除</a>\
        			</td>\
        		</tr>';

        return colStr;
    }

LaodFile.prototype.addCol = function () {
	// 数据的tr
	var localTh = this.localTableHead,
		localTHeadHide = this.localTableHeadHide,
		colBody = this.colBody,
		hideTrStr = '',
		localCol = this.localTableBody.find("tr"),
		// localColTdLen = $(".localTableBody").find("tr").eq(0).find("td").length,
		//弹框里面的tr
		modalCol = colBody.find("tr"),
		newColName = $(".newColName"),
		partionIpt = $(".partionIpt"),
		colStrs = '',
		colThStrs = '',
		colStr = '',
		// 显示与不显示首行时
		firstcolBtn = this.firstcolBtn,
		isColName = this.isColName,
		notColName = this.notColName;

	$.each(modalCol,function (modalTIdx) {
		if(modalCol.eq(modalTIdx).find('.partiteBtn').is(':checked')) {
			var parVal = modalCol.eq(modalTIdx).find(".partionIpt").val();

			var parType = modalCol.eq(modalTIdx).find(".localType").val();
			
			colThStrs += '<th><input class = "ownColTh newColTh isPartite" name = "'+parType+'" index = "'+parVal+'" type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>';
			hideTrStr += '<th><input class = "isHidePartite" name = "'+parType+'" index = "'+parVal+'"  type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>'
		}else {
			colThStrs += '<th><input class = "ownColTh newColTh" type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>';
			hideTrStr += '<th><input type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>'
		}
	})

	localTHeadHide.append(hideTrStr);

	$.each(localCol,function (colIdx) {
		$.each(modalCol,function (modalIdx) {
			if(colIdx == 0) {
				colStr += '<td><select class = "form-control localType">\
        					<option>string</option>\
        					<option>decimal</option>\
        					<option>bigint</option>\
        					<option>timestamp</option>\
        				</select></td>'
			}else {
				 colStrs += '<td>'+partionIpt.eq(modalIdx).val()+'</td>'; 
			}
		})
		if(colIdx == 0) {
			localCol.eq(colIdx).append(colStr);
		}else {
			localCol.eq(colIdx).append(colStrs);
		}
		colStrs = '';
	});

	localTh.append(colThStrs);
	if(isColName.is(":checked")) {
		localTh.hide();
		localTHeadHide.show();
	}else if(notColName.is(":checked")){
		localTh.show();
		localTHeadHide.hide();
	}
}

// 弹框增加列
LaodFile.prototype.newAddColBtn = function () {
	var that = this;

	$("#addCol").on("click",function () {
		$("#addColModal").modal();
	})

	$(".newAddColBtn").on("click",function () {
		var colStr = that.colStrs();
		$(".colBody").append(colStr);
	});

	// 点击复选框inpu可填值,如果加上UED的原型，可能的改，涉及到了parent
	$("#addColModal").on("click",".partiteBtn",function () {
		var $this = $(this),
		    $thisIpt = $this.parent().prev().find(".partionIpt");

		if($this.is(":checked")) {
			$thisIpt.attr('disabled',false);
		}else {
			$thisIpt.attr('disabled',true);
		}
	});

	//删除
	$("#addColModal").on("click",".localColDel",function () {
		var $parent = $(this).parent().parent();

		$parent.remove();
	});

	// 点击确定增加上：
	$("#addColModal").on("click","#addColBtn",function () {
		var newColName = $(".newColName"),
			partiteBtn = $(".partiteBtn"),
			isBreak = true;
		
		$.each(newColName,function (idx) {
			if(newColName.eq(idx).val().trim() == '') {
				$('#prompTips .tipCont').html("名称不能为空");
				$('#prompTips').modal("show");
				isBreak = false;
				return false;
			}
		});

		$.each(partiteBtn,function (parIdx) {
			var eachPartiCheck = partiteBtn.eq(parIdx),
				eachPartiIpt = partiteBtn.eq(parIdx).parent().prev().find(".partionIpt");
			if(eachPartiCheck.is(":checked")) {
				if(eachPartiIpt.val().trim() == '') {
					$('#prompTips .tipCont').html("名称不能为空");
					$('#prompTips').modal("show");
					isBreak = false;
					return false;
				}
			}
		})

		if(isBreak) {
			that.addCol();
			$.each(newColName,function (idx) {
				newColName.eq(idx+1).parent().parent().remove();
			})
		}else {
			$.each(newColName,function (idx) {
				newColName.eq(idx+1).parent().parent().remove();
			})
			return;
		}
		
	})
}

LaodFile.prototype.importbtn = function () {
	var that = this;

	$("#localImportBtn").on("click",function () {
		
		// 判断列名是否重复
		var localTtr = $(".localTableHead").find("input"),
			localTHide = $(".localTableHeadHide").find("input"),
			isBreak = false;

		if($(".isColName").is(":checked")) {
			for(var i = 0,localLen = localTHide.length;i < localLen;i++) {
				for(var j = 0;j < i;j++) {
					if(localTHide.eq(j).val() == localTHide.eq(i).val()) {
						$('#prompTips .tipCont').html("类名不能重复");
						$('#prompTips').modal("show");
						isBreak = true;
						return;
					}
				}
			}
		}else if($(".notColName").is(":checked")) {
			for(var i = 0,localLen = localTtr.length;i < localLen;i++) {
				for(var j = 0;j < i;j++) {
					if(localTtr.eq(j).val() == localTtr.eq(i).val()) {
						$('#prompTips .tipCont').html("类名不能重复");
						$('#prompTips').modal("show");
						isBreak = true;
						return;
					}
				}
			}
		}
		
		if(isBreak) {
			return;
		}else {
			that.loadFileAjax('/upload/upload.do');
		}

		/*var uploadFileList = $("#localFileIpt").get(0).files,
			localdataName = $(".localdata-name").val(),
			colSymbolCheck = $(".colSymbol:checked").val(),
			rowSymbolCheck = $(".rowSymbol:checked").val(),
			fileEncoding = $("#codeStyle").val();

		$('#localFileIpt').fileupload('send',{
			files: uploadFileList,
        	replaceFileInput: false,
			url:'/upload/upload.do',
	        // dataType: 'json',
	        formData: {
	            localdataName: localdataName,
	            colSymbolCheck: colSymbolCheck,
	            rowSymbolCheck: rowSymbolCheck,
	            fileEncoding: fileEncoding,
	        },
	        done: function (e, data) {
	        }
	    });*/
		
		// that.addColAjax();
	})
}

LaodFile.prototype.loadFileAjax = function (url) {

	var localTtr = $(".localTableHead").find("input"),
		localTHide = $(".localTableHeadHide").find("input"),
		 localType = $(".localTableBody").find(".localType");
	var datas = [],
		partiteDatas = [];
	
	if($(".isColName").is(":checked")) {
		$.each(localTHide,function (idx) {
			var keyVal = {
				name:'',
				type:''
			}

			keyVal.name = localTHide.eq(idx).val();
			keyVal.type = localType.eq(idx).val();

			datas.push(keyVal);
		});
	}else if($(".notColName").is(":checked")){
		$.each(localTtr,function (idx) {
			var keyVal = {
				name:'',
				type:''
			}

			keyVal.name = localTtr.eq(idx).val();
			keyVal.type = localType.eq(idx).val();

			datas.push(keyVal);
		});
	}

	// 是否有分区列
	if($(".localTableHead").find("input").hasClass("isPartite")) {
		if($(".isColName").is(":checked")) {
			$.each($(".isHidePartite"),function (parIdx) {
				var parKeyVal = {
					name:'',
					type:'',
					parVal:''
				}

				parKeyVal.name = $(".isPartite").eq(parIdx).val();
				parKeyVal.type = $(".isPartite").eq(parIdx).attr("name");
				parKeyVal.parVal = $(".isPartite").eq(parIdx).attr("index");

				partiteDatas.push(parKeyVal);
			});
		}else if($(".notColName").is(":checked")){
			$.each($(".isPartite"),function (parIdx) {
				var parKeyVal = {
					name:'',
					type:'',
					parVal:''
				}

				parKeyVal.name = $(".isPartite").eq(parIdx).val();
				parKeyVal.type = $(".isPartite").eq(parIdx).attr("name");
				parKeyVal.parVal = $(".isPartite").eq(parIdx).attr("index");

				partiteDatas.push(parKeyVal);
			});
		}
	}

	var uploadFileList = $("#localFileIpt").get(0).files,
		localdataName = $(".localdata-name").val(),
		colSymbolCheck = $(".colSymbol:checked").val(),
		rowSymbolCheck = $(".rowSymbol:checked").val(),
		fileEncoding = $("#codeStyle").val(),
		isFirstCol = true;

	if(fileEncoding == 'UTF-8') {
		fileEncoding = "GBK";
	}

	if($(".isColName").is(":checked")) {
		isFirstCol = true;
	}else if($(".notColName").is(":checked")){
		isFirstCol = false;
	}

	// $('#localFileIpt').fileupload('option', 'progressall', progress);
	$(".mask").show();
	$('#localFileIpt').fileupload('send',{
        files: uploadFileList,
        replaceFileInput: false,
        //dataType: 'json',
        url: url,
        // 额外增加的字段
        formData: {
            tableLabel: localdataName,
            colSymbolCheck: colSymbolCheck,
            rowSymbolCheck: rowSymbolCheck,
            fileEncoding: fileEncoding,
            isFirstCol:isFirstCol,
            tableJson : JSON.stringify(datas),
            tablePartition : JSON.stringify(partiteDatas)
        }
    }).success(function (ret, textStatus, jqXHR) {
    	if (!ret.success) {
    		$(".mask").hide();
    		$('#prompTips .tipCont').html(ret.msg);
			$('#prompTips').modal("show");
    	}else {
    		$(".mask").hide();
	    	$('#prompTips .tipCont').html("上传成功");
			$('#prompTips').modal("show");
			setTimeout(function () {
				location.reload();
			},1000);
    	}
    }).error(function (jqXHR, textStatus, errorThrown) {
    	if (errorThrown === 'abort') {
    		$(".mask").hide();
    		$('#prompTips .tipCont').html("上传已取消");
			$('#prompTips').modal("show");
    	}else {
    		$(".mask").hide();
	    	$('#prompTips .tipCont').html("上传失败,请重试");
			$('#prompTips').modal("show");
    	}
    });
}

LaodFile.prototype.addColAjax = function () {
	/*var localTtr = $(".localTableHead").find("input"),
		localTHide = $(".localTableHeadHide").find("input"),
		 localType = $(".localTableBody").find(".localType");
	var datas = [],
		partiteDatas = [];
	
	if($(".isColName").is(":checked")) {
		$.each(localTHide,function (idx) {
			var keyVal = {
				name:'',
				type:''
			}

			keyVal.name = localTHide.eq(idx).val();
			keyVal.type = localType.eq(idx).val();

			datas.push(keyVal);
		});
	}else if($(".notColName").is(":checked")){
		$.each(localTtr,function (idx) {
			var keyVal = {
				name:'',
				type:''
			}

			keyVal.name = localTtr.eq(idx).val();
			keyVal.type = localType.eq(idx).val();

			datas.push(keyVal);
		});
	}

	// 是否有分区列
	if($(".localTableHead").find("input").hasClass("isPartite")) {
		if($(".isColName").is(":checked")) {
			$.each($(".isHidePartite"),function (parIdx) {
				var parKeyVal = {
					name:'',
					type:'',
					parVal:''
				}

				parKeyVal.name = $(".isPartite").eq(parIdx).val();
				parKeyVal.type = localType.eq(parIdx).val();
				parKeyVal.parVal = $(".isPartite").eq(parIdx).attr("index");

				partiteDatas.push(parKeyVal);
			});
		}else if($(".notColName").is(":checked")){
			$.each($(".isPartite"),function (parIdx) {
				var parKeyVal = {
					name:'',
					type:'',
					parVal:''
				}

				parKeyVal.name = $(".isPartite").eq(parIdx).val();
				parKeyVal.type = localType.eq(parIdx).val();
				parKeyVal.parVal = $(".isPartite").eq(parIdx).attr("index");

				partiteDatas.push(parKeyVal);
			});
		}
	}*/
}

