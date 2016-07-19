$(function () {
	$("#addLocalFileIpt").fileupload({
		replaceFileInput: false,
        sequentialUploads: true,
        autoUpload: false,
        // dataType: 'json',
        url:"/upload/upload.do"
    });
	function AddLocalData() {
		this.addChangeFile.apply(this,arguments);
	}

	AddLocalData.prototype = new AddAndLocal();

	AddLocalData.prototype.addInit = function () {
		// 编码
		this.localCode = $("#addCodeStyle");
		// 选择文件
		this.localFile = $("#addLocalFileIpt");
		// 存储数据
		 this.storeDatas = $(".addFile textarea");
		 //input table的名字
		// this.tableName = $(".localdata-name");
		// 列的其他radio
		this.iptSymbol = $(".addIptColSymbol");
		// 列的其他input
		this.colSymbolOther = $("#addColSymbolOther");
		// $("#firstcolBtn")
		this.firstcolBtn = $(".addColName");
		this.isColName = $(".addIsColName");
		this.notColName = $(".addNotColName");
		// $(".localTableHead"),
		this.localTableHead = $(".addLocalTableHead");
		//  $(".localTableHeadHide")
		this.localTableHeadHide = $(".addLocalTableHeadHide");
		// $(".localTableBody")
		this.localTableBody = $(".addLocalTableBody");
		// $(".rowSymbol")
		this.rownotSymbols = $(".addRowSymbol");
		// $(".colSymbol")
		this.colnotSymbols = $(".addColSymbol");
		// $(".localType");
		this.localType = $(".addLocalType");

		this.colBody = $(".addColBody");
	}

	AddLocalData.prototype.addChangeFile = function () {
		this.addInit();
		AddAndLocal.prototype.changeFile.apply(this,arguments);

		this.addNewAddColBtn();
		this.addGetJson(); 
		this.addMatchClick();
		this.addImportbtn();
	}

	AddLocalData.prototype.addColStrs = function () {
		var colStr = '<tr>\
	        			<td>\
	        				<input class="addNewColName" type = "text" placeholder = "请输入列名">\
	        			</td>\
	        			<td>\
	        				<select class = "form-control addLocalType">\
	        					<option>string</option>\
	        					<option>decimal</option>\
	        					<option>bigint</option>\
	        					<option>timestamp</option>\
	        				</select>\
	        			</td>\
	        			<td>\
	        				<input class = "addPartionIpt" type = "text" placeholder = "请输入对应的值" disabled>\
	        			</td>\
	        			<td>\
	        				<input class = "form-control addPartiteBtn" type = "checkbox">\
	        			</td>\
	        			<td>\
	        				<a class = "addLocalColDel" href="#">删除</a>\
	        			</td>\
	        		</tr>';

	        return colStr;
	    }

	AddLocalData.prototype.adAaddCol = function () {
		// 数据的tr
		var localTh = this.localTableHead,
			localTHeadHide = this.localTableHeadHide,
			colBody = this.colBody,
			hideTrStr = '',
			localCol = this.localTableBody.find("tr"),
			// localColTdLen = $(".localTableBody").find("tr").eq(0).find("td").length,
			//弹框里面的tr
			modalCol = colBody.find("tr"),
			newColName = $(".addNewColName"),
			partionIpt = $(".addPartionIpt"),
			colStrs = '',
			colThStrs = '',
			colStr = '',
			// 显示与不显示首行时
			firstcolBtn = this.firstcolBtn,
			isColName = this.isColName,
			notColName = this.notColName;

		$.each(modalCol,function (modalTIdx) {
			if(modalCol.eq(modalTIdx).find('.addPartiteBtn').is(':checked')) {
				var parVal = modalCol.eq(modalTIdx).find(".addPartionIpt").val();
				var parType = modalCol.eq(modalTIdx).find(".localType").val();
				
				colThStrs += '<th><input class = "form-control newColTh addIsPartite" name = "'+parType+'" index = "'+parVal+'" type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>';
				hideTrStr += '<th><input class = "addIsHidePartite" name = "'+parType+'" index = "'+parVal+'"  type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>'
			}else {
				colThStrs += '<th><input class = "form-control newColTh" type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>';
				hideTrStr += '<th><input type="text" value = "'+newColName.eq(modalTIdx).val()+'"/>'
			}
		})

		localTHeadHide.append(hideTrStr);

		$.each(localCol,function (colIdx) {
			$.each(modalCol,function (modalIdx) {
				if(colIdx == 0) {
					colStr += '<td><select class = " form-control addLocalType">\
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
	AddLocalData.prototype.addNewAddColBtn = function () {
		var that = this;
		
		$("#modifyAddCol").on("click",function () {
			$("#fAddColModal").modal();
		})

		$(".addNewAddColBtn").on("click",function () {
			var colStr = that.addColStrs();
			$(".addColBody").append(colStr);
		});

		// 点击复选框inpu可填值,如果加上UED的原型，可能的改，涉及到了parent
		$("#fAddColModal").on("click",".addPartiteBtn",function () {
			var $this = $(this),
			    $thisIpt = $this.parent().prev().find(".addPartionIpt");

			if($this.is(":checked")) {
				$thisIpt.attr('disabled',false);
			}else {
				$thisIpt.attr('disabled',true);
			}
		});

		//删除
		$("#fAddColModal").on("click",".addLocalColDel",function () {
			var $parent = $(this).parent().parent();

			$parent.remove();
		});

		// 点击确定增加上,分区也判断，还没看是否正确
		$("#fAddColModal").on("click","#fAddColBtn",function () {
			var newColName = $(".addNewColName"),
				partiteBtn = $(".addPartiteBtn"),
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
				that.adAaddCol();
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
	AddLocalData.prototype.addGetJsonHandle = function (data) {
		var getPartiteStr = '',
			dataPartite = [];

		$.each(data,function (parIdx) {
			if(data[parIdx].isPartition != undefined) {
				dataPartite.push(data[parIdx]);
			}
		})
		
		$.each(dataPartite,function (idx) {
			getPartiteStr += '<tr>\
                            <td>第'+(idx+1)+'级分区：'+dataPartite[idx].name+'('+dataPartite[idx].dataType+')</td>\
                            <td>\
                                <input class = "partiteIpts form-control" type="text" parName = '+dataPartite[idx].name+' parType = '+dataPartite[idx].dataType+' value />\
                            </td>\
                        </tr>'
		});

		$(".partiteBody").html(getPartiteStr);
	}
	// 获取后台json及跳转
	AddLocalData.prototype.addGetJson = function () {
		var that = this;

		var addName = window.opener.location.search,
			addSplit = addName.indexOf('&'),
			tableName = addName.substring(1,addSplit),
			dbBaseName = addName.substring(addSplit+1);

		// var	dbBaseName = window.opener.location.search.substring(1),
		// 	tableName = window.opener.location.hash.substring(1);
		
		$(".mask").show();
		var store = DatasourceNewStore.addDataJson(dbBaseName, tableName);
		// var store = DatasourceNewStore.addDataJson();
			if(store){
				store.complete(function(){
					$(".mask").hide();
					store.success(function (response){
						if(response.success){
							var datas = response.data;
							
							that.addGetJsonHandle(datas);
							that.addMatchHandle(datas);
						}
					})
				})
			}
	}

	// 得到不是分区的data
	AddLocalData.prototype.addMatchHandle = function (data) {
		var getAddStr = '',
			dataAddStr = [];

		$.each(data,function (notparIdx) {
			if(data[notparIdx].isPartition == undefined) {
				dataAddStr.push(data[notparIdx]);
			}
		});
		
		$.each(dataAddStr,function (idx) {
			getAddStr += ' <tr>\
				                <td class = "parColumn">'+dataAddStr[idx].column+'</td>\
				                <td class = "parDataType">'+dataAddStr[idx].dataType+'</td>\
				                <td class = "parName">'+dataAddStr[idx].name+'</td>\
				                <td class = "parType">'+dataAddStr[idx].type+'</td>\
				            </tr>'
		})

		$(".notPartiteTable").html(getAddStr);
	}

	AddLocalData.prototype.addMatch = function () {
		var partiteName = $(".parName"),
			partiteLen = partiteName.length,
			addLocalTableHead = $(".addLocalTableHead").find("input"),
			addLocalTableHeadHide = $(".addLocalTableHeadHide").find("input"),
			tableHeadLen = addLocalTableHead.length;

		var parStr = '';

		if($(".addIsColName").is(":checked")) {
			/*if(partiteLen > tableHeadLen) {
				$.each(partiteName,function (parIdx) {
					parStr += '<tr><td>'+partiteName.eq(parIdx).html()+'</td></tr>'
				})
			}else {
				$.each(addLocalTableHeadHide,function (localIdx) {
					parStr += '<tr><td></td><td><select name="" id="">'

					$.each(addLocalTableHeadHide,function (localIdxs) {
						parStr += '<option>'+addLocalTableHeadHide.eq(localIdxs).val()+'</option>'
					})

					parStr += '</select></td></tr>'
				})
			}*/

			$.each(addLocalTableHeadHide,function (localIdx) {
				parStr += '<tr><td class = "parTd">'

				// $.each(partiteName,function (parIdx) {
					parStr += partiteName.eq(localIdx).html();
				// })

				parStr += '</td><td><select class = "form-control localSelect" name="" id="">'

				$.each(addLocalTableHeadHide,function (localIdxs) {
					parStr += '<option value = '+localIdxs+'>'+addLocalTableHeadHide.eq(localIdxs).val()+'</option>'
				})

				parStr += '</select></td></tr>'
			})

		}else if($(".addNotColName").is(":checked")) {
			// 判断谁大谁小
			/*if(partiteLen > tableHeadLen) {
				$.each(partiteName,function (parIdx) {
					parStr += '<tr><td>'+partiteName.eq(parIdx).html()+'</td></tr>'
				})
			}else {
				$.each(addLocalTableHead,function (localIdx) {
					parStr += '<tr><td></td><td><select class = "localSelect" name="" id="">'

					$.each(addLocalTableHead,function (localIdxs) {
						parStr += '<option>'+addLocalTableHead.eq(localIdxs).val()+'</option>'
					})

					parStr += '</select></td></tr>'
				})
			}*/

			$.each(addLocalTableHead,function (localIdx) {
				parStr += '<tr><td class = "parTd">'

				parStr += partiteName.eq(localIdx).html();

				parStr += '</td><td><select class = "form-control localSelect" name="" id="">'

				$.each(addLocalTableHead,function (localIdxs) {
					parStr += '<option value = '+localIdxs+'>'+addLocalTableHead.eq(localIdxs).val()+'</option>'
				})

				parStr += '</select></td></tr>'
			})
		}

		$(".matchParLocal").html(parStr);

		var undefindeTd = $(".matchParLocal").find('td');
		$.each(undefindeTd,function (undefinedIdx) {
			var undefindeTdVal = undefindeTd.eq(undefinedIdx);

			if(undefindeTdVal.html() == 'undefined') {
				undefindeTdVal.html('');
			}
		})

		// 按位置匹配时选中各个位置的索引
		// if($(".addNotColName").is(":checked")) {
			var localSelect = $(".localSelect");
			$.each(localSelect,function (localLen) {
				localSelect.eq(localLen)[0].selectedIndex = localLen;
			})
		// };

	}

	// 按名称匹配
	AddLocalData.prototype.addMatchNameHandle = function () {
		var parTd = $(".parTd"),
			parTdLen = parTd.length,
			localTd = $(".localSelect"),
			localTdLen = localTd.length;

		if(parTdLen > localTdLen) {
			// 先得到最短的那个长度
			$.each(localTd,function (locIdx) {
				// 只循环的最短长度的那个位置
				$.each(parTd,function () {
					var prrTdVal = parTd.eq(locIdx).html();
					// 再循环每一个selected的值匹配praTd
					$.each(localTd,function (locLen) {
						var localTdVal = localTd.eq(locIdx).find("option").eq(locLen).val();
						if(prrTdVal == localTdVal) {
							localTd.eq(locIdx)[0].selectedIndex = locLen;
						}
					})
				})
			})
		}else {
			// 先得到最短的那个长度
			$.each(parTd,function (parIdx) {
				// 只循环的最短长度的那个位置
				$.each(localTd,function () {
					var parTdVal = parTd.eq(parIdx).html();
					$.each(localTd,function (parLen) {
						var localTdVal = localTd.eq(parIdx).find("option").eq(parLen).val();
						if(parTdVal == localTdVal) {
							localTd.eq(parIdx)[0].selectedIndex = parLen;
						}
					})
				})
			})
		}
	}

	AddLocalData.prototype.addMatchClick = function () {
		var that = this;

		$("#seeConfir").on("click",function (e) {
			that.addMatch();

			if(e.stopPropagation){
				e.stopPropagation();
			}else {
				e.cancleBubble = true;
			}

			// $(".matchMask").show();
			$("#table-1").show();
            $("#table-2").hide();
		});
		// 预览的出来
		$("#seePreview").on("click",function(){
			// $(".matchMask").hide();
            $("#table-1").hide();

            $("#table-2").show();
        });

        // 点击其他地方匹配的隐藏
    	$(document).on("click",function (e) {
    		if(e.stopPropagation){
				e.stopPropagation();
			}else {
				e.cancleBubble = true;
			}
			if(!$("#table-1").is(e.target) && $("#table-1").has(e.target).length == 0) {
				$(".matchMask").hide();
				$("#table-1").hide();

				$("#table-2").show();
			}
    	})
        

        // 按名称匹配的按钮
        $("#nameMath").on("click",function () {
        	that.addMatchNameHandle();
        })
        // 按位置匹配的按钮
        $("#nameMath").on("click",function () {
        	var localSelect = $(".localSelect");
			$.each(localSelect,function (localLen) {
				localSelect.eq(localLen)[0].selectedIndex = localLen;
			})
        });
        // 当没有分区列时，隐藏表头
        if($(".partiteBody").html().trim() == '') {
        	$(".partiteHead").hide();
        }
        
	}

	AddLocalData.prototype.addImportbtn = function () {
		var that = this;

		$("#addLocalImportBtn").on("click",function () {

			var partiteIpts = $(".partiteIpts"),
				isBreak = false;

			$.each(partiteIpts,function (parLens) {
				if(partiteIpts.eq(parLens).val().trim() == '') {
					$('#prompTips .tipCont').html("分区名称不能为空");
					$('#prompTips').modal("show");
					isBreak = true;

					return false;
				}
			})

			if(isBreak) {
				return;
			}else {
				that.addLoadFileAjax('/upload/upload.do');
			}

			// that.addColAjax();
		})
	}

	AddLocalData.prototype.addLoadFileAjax = function (url) {
		// 分区
		var partiteIpts = $(".partiteIpts"),
			partiteDatas = [];

		$.each(partiteIpts,function (parIdxs) {

			var parKeyVal = {
				name:'',
				type:'',
				parVal:''
			}

			parKeyVal.name = partiteIpts.eq(parIdxs).attr("parName");
			parKeyVal.type = partiteIpts.eq(parIdxs).attr("parType");
			parKeyVal.parVal = partiteIpts.eq(parIdxs).val();

			partiteDatas.push(parKeyVal);
		})

		// 匹配后的select
		var localSelect = $(".localSelect"),
			selectArr = [];

		$.each(localSelect,function (selIdx) {
			selectArr.push(localSelect.eq(selIdx).val());
		})

		var selectStr = selectArr.join(",");
		// 与打开他的父元素不同的url部分
		var addName = window.opener.location.search,
			addSplit = addName.indexOf('&'),
			tableName = addName.substring(1,addSplit),
			dbBaseName = addName.substring(addSplit+1);
			
		var uploadFileList = $("#addLocalFileIpt").get(0).files,
			colSymbolCheck = $(".addColSymbol:checked").val(),
			rowSymbolCheck = $(".addRowSymbol:checked").val(),
			fileEncoding = $("#addCodeStyle").val(),
			isCoverData = true,
			isFirstCol = true;

		// 將utf-8的編碼轉換為GBK
		if(fileEncoding == 'UTF-8') {
			fileEncoding = "GBK";
		}

		if($("#coverDataBtn").is(":checked")) {
			isCoverData = true;
		}else {
			isCoverData = false;
		}

		if($(".addIsColName").is(":checked")) {
			isFirstCol = true;
		}else if($(".addNotColName").is(":checked")){
			isFirstCol = false;
		}
		$(".mask").show();
		// $('#localFileIpt').fileupload('option', 'progressall', progress);
		$('#addLocalFileIpt').fileupload('send',{
	        files: uploadFileList,
	        replaceFileInput: false,
	        //dataType: 'json',
	        url: url,
	        // 额外增加的字段
	        formData: {
	            colSymbolCheck: colSymbolCheck,
	            rowSymbolCheck: rowSymbolCheck,
	            fileEncoding: fileEncoding,
	            isFirstCol:isFirstCol,
	            isCoverData:isCoverData,
	            dbBaseName:dbBaseName,
	            tableName:tableName,
	            columnsOrder:selectStr,
	            tablePartition:JSON.stringify(partiteDatas)
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
					location.href = './datasource_new.html';
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

	/*AddLocalData.prototype.addColAjax = function () {
		var localTtr = $(".localTableHead").find("input"),
			localTHide = $(".localTableHeadHide").find("input"),
			 localType = $(".localTableBody").find(".localType");
		var datas = [];
		
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
	}*/

	new AddLocalData();
})





