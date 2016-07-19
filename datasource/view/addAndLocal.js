function AddAndLocal() {

}

AddAndLocal.prototype = {
	constructors:AddAndLocal,
	// 貌似没用，可以删掉
	init:function () {
		// 编码
		this.localCode;
		// 选择文件
		this.localFile;
		// 存储数据
		 this.storeDatas;
		 //input table的名字
		this.tableName;
		// // 行选择符，被选择上的
		// this.rowSymbol;
		// // 列选择符，被选择上的
		// this.colSymbol;
		// 列的其他radio
		this.iptSymbol;
		// 列的其他input
		this.colSymbolOther;
		// $("#firstcolBtn")
		this.firstcolBtn;
		// $(".localTableHead"),
		this.localTableHead;
		//  $(".localTableHeadHide")
		this.localTableHeadHide;
		// $(".localTableBody")
		this.localTableBody;
		// $(".rowSymbol")
		this.rownotSymbols;
		// $(".colSymbol")
		this.colnotSymbols;
		// $(".localType");
		this.localType;

		this.colBody;

	},
	changeFile:function () {
		var that =this;

		this.init();
		// this.localIptJson();
		this.getJson();
		this.colblur();
		this.loadJson();
		this.changeCode();
		// this.importbtn();
		this.firstColHandle();
		// 增加列
		// this.newAddColBtn();
		this.colblur();
	},
	// 查浏览器是否支持File Api
	checkApi:function () {
		//检查浏览器是否支持File Api提供的所有功能，如果你只需要部分功能，可以省略其它部分的检查.
	    //IE	Firefox	Chrome	Safari	Opera
	    //10+	3.6+	6.0+	6.0+	11.1+
	    if (window.File && window.FileReader && window.FileList && window.Blob) {
	        //全部支持
	        return true;
	    } else {
	        showErrorMsg('该浏览器不全部支持File APIs的功能');
	        return false;
	    }
	},

	localData:function (localCode, localFile, storeDatas, tableName) {
		localCode = this.localCode;
		localFile = this.localFile;
		storeDatas = this.storeDatas;
		tableName = this.tableName;

		var codeStyle = localCode.val();
		
		var files = localFile[0].files[0];

		var fileSize = files.size / (1024 * 1024);
		if(fileSize > 10) {
			$('#prompTips .tipCont').html("文件大小不能超过10M");
			$('#prompTips').modal("show");
			return;
		}

		if(files.type != 'application/vnd.ms-excel' && files.type != 'text/plain') {
			$('#prompTips .tipCont').html("只支持csv格式和txt格式");
			$('#prompTips').modal("show");
			return;
		}
		
		var reader = new FileReader();
		
		if(tableName != undefined) {
			var tableNameIpt = tableName.val();
			var filesName = files.name.split("."),
				filesNameLen = filesName.length,
				filsesName = filesName.splice(0,filesNameLen-1).toString();
			// 将表名添加上去
			if(tableNameIpt == '') {
				tableName.val(filsesName);
			}
		}

		reader.onload = function (e) {
			var datas = e.target.result;
			storeDatas.html(datas);
		}

		if(codeStyle == "UTF-8") {
			codeStyle = "GBK";
		}
		
		reader.readAsText(files,codeStyle);
	},
	
	// 切换编码时
	changeCode:function () {
		var that = this,
			rowSymbols = this.rownotSymbols,
			colSymbols = this.colnotSymbols,
			codeStyle = this.localCode,
			localFile = this.localFile,
			storeDatas =  this.storeDatas;

		codeStyle.on("change",function () {
			if(localFile.val().trim() == '') {
				$('#prompTips .tipCont').html("请选择文件");
				$('#prompTips').modal("show");
				// location.href = './datasource_new.html';
				return;
			}

			that.localData();

			var rowSymbolVal,colSymbolVal;

			$.each(colSymbols,function (idx) {
				if(colSymbols.eq(idx).is(":checked")) {
					colSymbolVal = colSymbols.eq(idx).val();
				}
			});

			$.each(rowSymbols,function (idx) {
				if(rowSymbols.eq(idx).is(":checked")) {
					rowSymbolVal = rowSymbols.eq(idx).val();
				}
			})

			// 切换编码也同样的延迟100ms，不然取到的还是原来的数据
			setTimeout(function () {
				var datas = storeDatas.html();

				if(rowSymbolVal == '\\n') {
					that.defaultJson(datas, '\n', colSymbolVal);
				}else if(rowSymbolVal == '\\r') {
					that.defaultJson(datas, '\r', colSymbolVal);
				}else if(rowSymbolVal == '\\r\\n') {
					that.defaultJson(datas, '\n', colSymbolVal);
				}

				that.fistCol();
			},100);
			
 		})
	},

	// 列的其他那个选项
	colblur:function () {
		var iptSymbol = this.iptSymbol,
			rowSymbols = this.rownotSymbols,
			colSymbolOther = this.colSymbolOther,
			storeDatas = this.storeDatas,
			that = this;

		colSymbolOther.on("blur",function () {
			var $thisVal = $(this).val();
			iptSymbol.val($thisVal);

			var datas = storeDatas.html(),
				rowSymbolVal;

			$.each(rowSymbols,function (idx) {
				if(rowSymbols.eq(idx).is(":checked")) {
					rowSymbolVal = rowSymbols.eq(idx).val();
				}
			})

			if(iptSymbol.is(":checked")) {
				if(rowSymbolVal == '\\n') {
					that.defaultJson(datas, '\n', $thisVal);
				}else if(rowSymbolVal == '\\r') {
					that.defaultJson(datas, '\r', $thisVal);
				}else if(rowSymbolVal == '\\r\\n') {
					that.defaultJson(datas, '\n', $thisVal);
				}
			}
		})
	},

	//点击input时选择文件 隔100s取得data数据，要不然娶不到
	getJson:function () {
		var that = this,
			localCode = this.localCode,
			localFile = this.localFile,
			storeDatas = this.storeDatas,
			tableName = this.tableName;

		localFile.on("change",function () {

			that.localData(localCode, localFile, storeDatas, tableName);

			setTimeout(function () {
				var getData = storeDatas.html();
				that.defaultJson(getData, '\n', ',');
			},100)
		})
	},

	firstColHandle:function () {
		var that = this,
			firstcolBtn = this.firstcolBtn,
			localFile = this.localFile;

		firstcolBtn.on("click",function () {

			if(localFile.val().trim() == '') {
				$('#prompTips .tipCont').html("请选择文件");
				$('#prompTips').modal("show");
				// location.href = './datasource_new.html';
				return;
			}
			
			that.fistCol();
		})
	},
	// 文件首行是否是列名
	/*fistCol:function() {
		var localTableHead = this.localTableHead,
			locaTablelTh = localTableHead.find("input"),
			localTableHeadHide = this.localTableHeadHide,
			hideHead = '',
			localTableRow = this.localTableBody.find("tr").eq(1),
			localTableTr = localTableRow.find("td"),
			firstcolBtn = this.firstcolBtn;
		// 将第一行的内容到一个隐藏的head中
		$.each(localTableTr,function (hideIdx) {
			var localIpt = localTableTr.eq(hideIdx).html();
			hideHead += '<th><input type="text" value = '+localIpt+'></th>';
		})

		localTableHeadHide.html(hideHead);
		// 隐藏和显示；内容就可以了
		if(firstcolBtn.is(":checked")) {
			localTableHeadHide.show();
			localTableHead.hide();
			localTableRow.addClass("colHide");
		}else {
			localTableHead.show();
			localTableHeadHide.hide();
			localTableRow.removeClass("colHide");
		}

		this.getType();
	},*/
	// 新增的列名不修改 	    
	fistCol:function() {
		var localTableHead = this.localTableHead,
			newTableTh = localTableHead.find(".newColTh"),
			localTableHeadHide = this.localTableHeadHide,
			hideHead = '',
			localTableRow = this.localTableBody.find("tr").eq(1),
			localTableTr = localTableRow.find(".row_0"),
			firstcolBtn = this.firstcolBtn,
			isColName = this.isColName,
			notColName = this.notColName;
		// 将第一行的内容到一个隐藏的head中
		$.each(localTableTr,function (hideIdx) {
			var localIpt = localTableTr.eq(hideIdx).html();
			hideHead += '<th><input type="text" value = '+localIpt+'></th>';
		})

		$.each(newTableTh,function (newHideIdx) {
			var newLocalIpt = newTableTh.eq(newHideIdx).val();
			hideHead += '<th><input type="text" value = '+newLocalIpt+'></th>';
		})

		localTableHeadHide.html(hideHead);
		// 隐藏和显示；内容就可以了
		
		if(isColName.is(":checked")) {
			localTableHeadHide.show();
			localTableHead.hide();
			localTableRow.addClass("colHide");
		}else if(notColName.is(":checked")){
			localTableHead.show();
			localTableHeadHide.hide();
			localTableRow.removeClass("colHide");
		}

		this.getType();
	},
	// 点击列和行符号时改变数据
	loadJson:function () {
		var that = this,
			localFile = this.localFile;
			rowSymbols = this.rownotSymbols,
			colSymbols = this.colnotSymbols,
			storeDatas = this.storeDatas;

		rowSymbols.on("click",function () {
			debugger;
			if(localFile.val().trim() == '') {
				$('#prompTips .tipCont').html("请选择文件");
				$('#prompTips').modal("show");
				// location.href = './datasource_new.html';
				return;
			}

			var $this = $(this),
				$thisIdx = $this.attr("index"),
				datas = storeDatas.html(),
				colSymbolVal;

			$.each(colSymbols,function (idx) {
				if(colSymbols.eq(idx).is(":checked")) {
					colSymbolVal = colSymbols.eq(idx).val();
				}
			})

			switch($thisIdx) {
				case "0":
					that.defaultJson(datas, '\n', colSymbolVal);
					break;
				case "1":
					that.defaultJson(datas, '\r', colSymbolVal);
					break;
				case "2":
					that.defaultJson(datas, '\n', colSymbolVal);
					break;
 			}

 			that.fistCol();
		});

		colSymbols.on("click",function () {
			if(localFile.val().trim() == '') {
				$('#prompTips .tipCont').html("请选择文件");
				$('#prompTips').modal("show");
				// location.href = './datasource_new.html';
				return;
			}

			var $this = $(this),
				$thisIdx = $this.attr("index"),
				$thisVal = $this.val(),
				datas = storeDatas.html(),
				rowSymbolVal;

			$.each(rowSymbols,function (idx) {
				if(rowSymbols.eq(idx).is(":checked")) {
					rowSymbolVal = rowSymbols.eq(idx).val();
				}
			})

			switch($thisIdx) {
				case "0":
					if(rowSymbolVal == '\\n') {
						that.defaultJson(datas, '\n', ',');
					}else if(rowSymbolVal == '\\r') {
						that.defaultJson(datas, '\r', ',');
					}else if(rowSymbolVal == '\\r\\n') {

						that.defaultJson(datas, '\n', ',');
					}
					break;
				case "1":
					if(rowSymbolVal == '\\n') {
						that.defaultJson(datas, '\n', ';');
					}else if(rowSymbolVal == '\\r') {
						that.defaultJson(datas, '\r', ';');
					}else if(rowSymbolVal == '\\r\\n') {
						that.defaultJson(datas, '\n', ';');
					}
					break;
				case "2":
					if(rowSymbolVal == '\\n') {
						that.defaultJson(datas, '\n', ' ');
					}else if(rowSymbolVal == '\\r') {
						that.defaultJson(datas, '\r', ' ');
					}else if(rowSymbolVal == '\\r\\n') {
						that.defaultJson(datas, '\n', ' ');
					}
					break;
				case "3":
					if(rowSymbolVal == '\\n') {
						that.defaultJson(datas, '\n', '\t');
					}else if(rowSymbolVal == '\\r') {
						that.defaultJson(datas, '\r', '\t');
					}else if(rowSymbolVal == '\\r\\n') {
						that.defaultJson(datas, '\n', '\t');
					}
					break;
				case "4":
					if(rowSymbolVal == '\\n') {
						that.defaultJson(datas, '\n', $thisVal);
					}else if(rowSymbolVal == '\\r') {
						that.defaultJson(datas, '\r', $thisVal);
					}else if(rowSymbolVal == '\\r\\n') {
						that.defaultJson(datas, '\n', $thisVal);
					}
					break;
 			}

 			that.fistCol();
		})
	},
	// 增加列的内容
	/*colStrs:function () {
		var colStr = '<tr>\
            			<td>\
            				<input class="newColName" type = "text" placeholder = "请输入列名">\
            			</td>\
            			<td>\
            				<select class = "form-control mgb-15 localType">\
            					<option>varchar(256)</option>\
            					<option>string</option>\
            					<option>number</option>\
            					<option>decimal</option>\
            					<option>bigint</option>\
            					<option>timestamp</option>\
            				</select>\
            			</td>\
            			<td>\
            				<input class = "form-control partionIpt" type = "text" placeholder = "请输入对应的值" disabled>\
            			</td>\
            			<td>\
            				<input class = "form-control partiteBtn" type = "checkbox">\
            			</td>\
            			<td>\
            				<a class = "localColDel" href="#">删除</a>\
            			</td>\
            		</tr>';

        return colStr;
	},*/
	// 弹框增加列
	/*newAddColBtn:function () {
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
				isBreak = true;
			
			$.each(newColName,function (idx) {
				if(newColName.eq(idx).val().trim() == '') {
					alert("名称不能为空");
					isBreak = false;
					return false;
				}
			});

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
	},*/
	// 增加列
	/*addCol:function () {
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
				colThStrs += '<th><input class = "form-control newColTh isPartite" index = "'+parVal+'" type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>';
				hideTrStr += '<th><input class = "isHidePartite" index = "'+parVal+'"  type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>'
			}else {
				colThStrs += '<th><input class = "form-control newColTh" type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>';
				hideTrStr += '<th><input type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>'
			}
		})

		localTHeadHide.append(hideTrStr);

		$.each(localCol,function (colIdx) {
			$.each(modalCol,function (modalIdx) {
				if(colIdx == 0) {
					colStr += '<td><select class = " form-control localType">\
            					<option selected>varchar(256)</option>\
            					<option>string</option>\
            					<option>number</option>\
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
			
		});

		localTh.append(colThStrs);
		if(isColName.is(":checked")) {
			localTh.hide();
			localTHeadHide.show();
		}else if(notColName.is(":checked")){
			localTh.show();
			localTHeadHide.hide();
		}
		
	},*/
	// 选择行列分隔符
	defaultJson:function (datas, rowSymbol, colSymbol) {
		var localTableHead = this.localTableHead,
			localTableBody = this.localTableBody;
		//先存储到二维数组中，为了截取前10行
		var datas = datas.toString();
		var rowColdata = [];

		var rowDatas = datas.split(rowSymbol);

		$.each(rowDatas,function (rowidxsLens) {
			if($.trim(rowDatas[rowidxsLens]) == '') {
				rowDatas.splice(rowidxsLens,1);
			}
		});

		for (var i = 0,localRowLen = rowDatas.length; i < localRowLen; i++) {
			rowColdata[i] = [];
			var colDatas = rowDatas[i].split(colSymbol);
			for (var j = 0,localColLen = colDatas.length; j < localColLen; j++) {
				rowColdata[i][j] = colDatas[j];
			};
		}

		// 判断是否大于10行
		if(rowColdata.length > 15) {
			rowColdata.length = 15
		}

		var localStrs = '',
			localStrsHead = '',
			localStrsTd = '';

		// 又给localStrsTd新增了selected
		localStrsTd += '<tr>';
		var colDatas = rowDatas[0].split(colSymbol);
		$.each(colDatas,function (rowIdx) {
			localStrsHead += '<th><input class = "ownColTh" type="text" value = "columns'+rowIdx+'"/></th>';
			localStrsTd += '<td><select class = "form-control localType">\
	            					<option>string</option>\
	            					<option>decimal</option>\
	            					<option>bigint</option>\
	            					<option>timestamp</option>\
                				</select></td>'
		});
		
		localStrsTd += '</tr>';

		$.each(rowColdata,function (rowIdx) {

			localStrsTd += '<tr>';
			$.each(rowColdata[rowIdx],function (colIdx) {
				localStrsTd += '<td class = "row_'+(rowIdx)+' col_'+(colIdx)+'">'+rowColdata[rowIdx][colIdx]+'</td>'
			})
			localStrsTd += '</tr>'
		});

		localTableHead.html(localStrsHead);
		localTableBody.html(localStrsTd);

		// 获取10行
		var localTr = $(".localTableBody").find("tr"),
			localTrLen = localTr.length;
		if(localTrLen > 11) {
			for(var trLen = 12;trLen < localTrLen; trLen++) {
				localTr.eq(trLen).hide();
			}
		}
		this.getType();
		// 全部的插入了td中，将后面的隐藏了
		/*var datas = datas.toString();
		var rowDatas = datas.split(rowSymbol);

		var localStrs = '',
			localStrsHead = '',
			localStrsTd = '';

		// 又给localStrsTd新增了selected
		localStrsTd += '<tr>';
		var singleColDatas = rowDatas[0].split(colSymbol);
		$.each(singleColDatas,function (rowIdx) {
			localStrsHead += '<th><input type="text" value = "colmuns'+rowIdx+'"/></th>';
			localStrsTd += '<td><select class = "localType">\
                					<option>varchar(256)</option>\
	            					<option>string</option>\
	            					<option>number</option>\
	            					<option>decimal</option>\
	            					<option>bigint</option>\
	            					<option>timestamp</option>\
                				</select></td>'
		});
		
		localStrsTd += '</tr>';

		$.each(rowDatas,function (rowIdx) {
			localStrsTd += '<tr>';
			var colDatas = rowDatas[rowIdx].split(colSymbol);

			$.each(colDatas,function (colIdx) {
				localStrsTd += '<td class = "row_'+rowIdx+' col_'+colIdx+'">'+colDatas[colIdx]+'</td>'
			})
			localStrsTd += '</tr>'
		});

		this.localTableHead.html(localStrsHead);
		this.localTableBody.html(localStrsTd);

		// 隐藏10行以后的tr
		var localTr = this.localTableBody.find("tr"),
			localTrLen = localTr.length;
		if(localTrLen > 11) {
			for(var trLen = 12;trLen < localTrLen; trLen++) {
				localTr.eq(trLen).hide();
			}
		}
		this.getType();*/
	},
	// 根据列来判断去哪种类型
	getType:function () {
		var localTableBody = this.localTableBody,
			typeColtr = localTableBody.find("tr").eq(1),
			typeColLen = localTableBody.find("tr").eq(0).find("td").length,
			typeRowLen = localTableBody.find("tr").length,
			localType = localTableBody.find(".localType");
		
		var string = [],dec = [],big = [],times = [],
			stringLEn,decLen,bigLen,timesLen;
		for(var n = 0;n < typeColLen;n++) {
			for(var m = 0;m < typeRowLen-1;m++) {

				if(m == 0 && typeColtr.hasClass("colHide")) {
					continue;
				}

				var colType = localTableBody.find(".col_"+n).eq(m).html();
				
				//判断是否是数字，因为返回的都是String
				var partInt = /^-?\d+$/ig;
				var partfloat = /^(-?\d+)(\.\d+)?$/ig;

				if(partInt.test(colType) || partfloat.test(colType)) {
					colType = Number(colType);
				}
				
				if(typeof colType === 'string') {
					string.push(colType);
				}else if(typeof colType === 'number'){
					if(colType <= 2147483647) {
						if(colType.toString().indexOf(".")!=-1) {
							dec.push(colType);
						}else {
							big.push(colType);
						}
					}else {
						times.push(colType);
					}
				}
			}
			stringLEn = string.length;
			decLen = dec.length;
			bigLen = big.length;
			timesLen = times.length;
			
			var maxLen = Math.max(stringLEn,decLen,bigLen,timesLen),
				curLocalType = localType.eq(n)[0];

			switch(maxLen) {
				case stringLEn:
					curLocalType.selectedIndex = 0;
					break;
				case decLen:
					curLocalType.selectedIndex = 1;
					break;
				case bigLen:
					curLocalType.selectedIndex = 2;
					break;
				case timesLen:
					curLocalType.selectedIndex = 3;
					break;
			}
			
			// 再变为空
			string = [],dec = [],big = [],times = [];
			
		}
	},




	// 导入文件
	/*importbtn:function () {
		var that = this;
		$("#localImportBtn").on("click",function () {
			// that.loadFileAjax('/upload/upload.do');
			debugger;
			console.log(123);
			that.addColAjax();
		})
	},
	// 导入要传的函数
	loadFileAjax:function (url) {
		var uploadFile = $("#localFileIpt").val();
		var uploadFileList = $("#localFileIpt").get(0).files,
			localdataName = $(".localdata-name").val(),
			colSymbolCheck = $(".colSymbol:checked").val(),
			rowSymbolCheck = $(".rowSymbol:checked").val(),
			fileEncoding = $("#codeStyle").val();
		// $('#localFileIpt').fileupload('option', 'progressall', progress);
		$('#localFileIpt').fileupload({
	        files: uploadFileList,
	        replaceFileInput: false,
	        dataType: 'json',
	        url: url,
	        // 额外增加的字段
	        formData: {
	            localdataName: localdataName,
	            colSymbolCheck: colSymbolCheck,
	            rowSymbolCheck: rowSymbolCheck,
	            fileEncoding: fileEncoding,
	        }
	    });
	},

	// 增加列的函数
	addColAjax:function () {
		var localTtr = $(".localTableHead").find("input"),
			localTHide = $(".localTableHeadHide").find("input"),
			 localType = $(".localTableBody").find(".localType");
		var datas = [];
		
		if($("#firstcolBtn").is(":checked")) {
			$.each(localTHide,function (idx) {
				var keyVal = {
					name:'',
					type:''
				}

				keyVal.name = localTHide.eq(idx).val();
				keyVal.type = localType.eq(idx).val();

				datas.push(keyVal);
			});
		}else {
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
	},*/
}
