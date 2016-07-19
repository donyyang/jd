$(function () {
	(function () {
		function HandleData() {
			this.init.apply(this,arguments);
			parent.setCurMenu&&parent.setCurMenu(4);
		}

		HandleData.prototype = {
			constructor:HandleData,
			init:function () {
				this.modifyDime();
				this.clickTypes();
			},
			// 新增和修改根据url不同分开
			modifyDime:function () {
				var currentUrl = window.location.href;
				var currentModalName = currentUrl.split("?edit=")[1];

				if(currentUrl.indexOf("?edit=") == -1) {
					$(".mulDataModelWrapper").hide();
					$(".linkModelWrpaper").show();

					this.insertDb();
				}else {
					$(".mulDataModelWrapper").show();
					$(".linkModelWrpaper").hide();

					this.modifyName(currentModalName);
					$("#mulDataIpt").prop("disabled",true);
				}
			},
			changeDate:function (date) {
				var y = date.getFullYear();  
			    var m = date.getMonth() + 1;  
			    m = m < 10 ? ('0' + m) : m;  
			    var d = date.getDate();  
			    d = d < 10 ? ('0' + d) : d;  
			    var h = date.getHours();  
			    var minute = date.getMinutes();  
			    minute = minute < 10 ? ('0' + minute) : minute;  
			    var second = date.getSeconds();
			    second = second < 10 ? ('0' + second) : second;
			    return y + '-' + m + '-' + d+' '+h+':'+minute+ ':'+second;  
			},
			modelsStr:function (datas) {
				var htmls = '',dimenHtmls = '',modifyArr = [],addMulArr = [],delArr = [],useArr = [],that = this;

				for (var i = 0,datasLen = datas.length; i < datasLen; i++) {
					var firstD = datas[i],mask = datas[i].mask;
					
					modifyArr.push(that.maskNum(2,mask)); 
					addMulArr.push(that.maskNum(4,mask)); 
					delArr.push(that.maskNum(8,mask)); 
					useArr.push(that.maskNum(32,mask)); 

					htmls += '<tr>\
						<input class = "dbIptHide" type="hidden" value = "'+i+'" currentName = "'+firstD.name+'"/>\
	                    <td  class = "text-left collapsed dbOpen dbName_'+i+'" data-toggle="collapse" href="#model_'+i+'"><i class="gficon51"></i><span>'+firstD.name+'</span></td>\
	                    <td>'
	                var dates = that.changeDate(new Date(firstD.last_modified));
	                
	                htmls += dates;
	                htmls += '</td>\
	                    <td class = "factName_'+i+'">'+firstD.fact_table+'</td>\
	                    <td>\
	                    	<a class = "d_dimensions" href="javascript:void(0);" data-toggle="draggable" data-target="#draggable_'+i+'" title="表结构"><i class="gficon45"></i></a>\
	                    	<a class = "d_modify" href="javascript:void(0);" title="修改"><i class="gficon30"></i></a>\
	                    	<a class = "d_delete" href="javascript:void(0);" title="删除"><i class="gficon39"></i></a>\
	                    	<a class = "d_use" href="javascript:void(0);" title="立即使用"><i class="gficon47"></i></a>\
	                    	<a class = "d_addMul" href="javascript:void(0);" title="添加多维数据集"><i class="gficon46"></i></a>\
	                		<div class="panel dimensions_wrapper dimensions_'+i+'">\
								<div class="dimen_wrapper dime_'+i+'">\
									<div class="text-left panel-heading dim_head">  模型结构\
	        							<a href="javascript:;" class="pull-right mgl-15 closeMeasure" title="关闭"> <i class="iconfont2"></i> </a>\
	    							</div>\
	    							<div class = "panel">\
									<div class = "text-left panel-heading">维度</div>'
									for (var h = 0,dimenLen = firstD.dimensions.length; h < dimenLen; h++) {
										var dimens = firstD.dimensions[h];
										htmls += '<div class = "menu menu2 text-left"><p class = "dimes_table"><i class="iconfont2"></i>'+dimens.table+'</p>\
												  <ul class = "dimes_cols">'
										
										for (var g = 0,dimenColLen = dimens.columns.length; g < dimenColLen; g++) {
											htmls += '<li>'+dimens.columns[g]+'</li>'
										}
										htmls += '</ul></div>'
									}
							
								htmls += '</div></div>\
								<div class="panel metrics_wrapper_'+i+' adjust">\
									<div class="text-left panel-heading">计量</div>'
									htmls += '<ul class = "menu menu2 text-left">'
									for (var m = 0,metricLen = firstD.metrics.length; m < metricLen; m++) {
										htmls += '<li>'+firstD.metrics[m]+'</li>'
									}
								htmls += '</ul></div>\
							</div>\
	                	</td>\
	                </tr>\
	                <tr class="dbInfos collapse dbInfos_'+i+'" id="model_'+i+'">\
	                    <td colspan="8" class="pdl-35">\
	                        <div class="row text-left">\
	                             <div class="col-sm-6">事实表名称：<span>'+firstD.fact_table+'</span></div>\
	                             <div class="col-sm-6 text-right">分区字段：<span class = "partition_file_'+i+'">';

	                         var Partition_column = firstD.partition_desc;
							if(Partition_column && Partition_column.partition_date_column){
								htmls +=  Partition_column.partition_date_column;
							}else {
								htmls +=  "";
							}

	                    htmls += '</span></div>\
	                        </div>\
	                        <div class="each_dime_table_'+i+' panel table-responsive panel-default">\
	                            <ul class="nav nav-tabs nav-gongfang">\
	                                <li class="active"><a href="#home" data-toggle="tab">维度表</a></li>\
	                            </ul>\
	                            <div class="tab-content">\
	                                <div role="tabpanel" class="tab-pane active" id="home">\
	                                    <table class="table table-striped mg-none dimeMeas_table_'+i+'">\
	                                        <colgroup>\
	                                            <col width="10%">\
	                                            <col width="25%">\
	                                            <col width="25%">\
	                                            <col width="25%">\
	                                        </colgroup>\
	                                        <thead>\
	                                        <tr class="active">\
	                                            <th></th>\
	                                            <th>事实表字段</th>\
	                                            <th>关联类型</th>\
	                                            <th>维度表名</th>\
	                                            <th>维度表字段</th>\
	                                        </tr>\
	                                        </thead>\
	                                        <tbody>'
	                            for (var j = 0,lookupsLen = firstD.lookups.length; j < lookupsLen; j++) {

	                            	var secondLookups = firstD.lookups[j];
	                            	for (var k = 0,foreignLen = secondLookups.join.foreign_key.length; k < foreignLen; k++) {

	                            		var thirdForeign = secondLookups.join.foreign_key[k];
										var thirdPrimary = secondLookups.join.primary_key[k];
	                            		
	                            		htmls += '<tr>\
	                            				<input class = "primaryKey" type="hidden" value = "'+thirdPrimary+'"/>\
												<input class = "foreignKey" type="hidden" value = "'+thirdForeign+'"/>\
	                                            <td>'+(j+(k+1))+'</td>\
	                                            <td><div class = "text-hidden" data-toggle="tooltip" data-placement="top" title="'+firstD.fact_table+'.'+thirdForeign+'">'+firstD.fact_table+'.'+thirdForeign+'</div></td>\
	                                            <td><div>'+secondLookups.join.type+'</td>\
	                                            <td class = "dimeName_'+i+'_'+(j+(k+1))+'"><div class = "text-hidden"  data-toggle="tooltip" data-placement="top" title="'+secondLookups.table+'">'+secondLookups.table+'</div></td>\
	                                            <td><div class = "text-hidden" data-toggle="tooltip" data-placement="top" title="'+secondLookups.table+'.'+thirdPrimary+'">'+secondLookups.table+'.'+thirdPrimary+'</div></td>\
	                                        </tr>'
	                            	}
	                            	
	                            }
	                                
	                            htmls += '</tbody>\
	                                    </table>\
	                                </div>\
	                            </div>\
	                        </div>\
	                    </td>\
	                </tr>';
				}
				
				$(".dbHandle").html(htmls);
				// dim头部固定
				this.fixTitle();
				// 修改
				for (var idx = 0,modifyArrLen = modifyArr.length; idx < modifyArrLen; idx++) {
					var modifyNum = modifyArr[idx];
					 if(modifyNum) {
	                	$(".d_modify").eq(idx).addClass("disableModify");
	                }else {
	                	$(".d_modify").eq(idx).addClass("item-disabled");
	                }
				}
				// 添加
				for (var Aidx = 0,addMulArrLen = addMulArr.length; Aidx < addMulArrLen; Aidx++) {
					var addMulNum = addMulArr[Aidx];
					 if(addMulNum) {
	                	$(".d_addMul").eq(Aidx).addClass("disableaddMul");
	                }else {
	                	$(".d_addMul").eq(Aidx).addClass("item-disabled");
	                }
				}
				// 删除
				for (var Didx = 0,delArrLen = delArr.length; Didx < delArrLen; Didx++) {
					var delArrNum = delArr[Didx];
					 if(delArrNum) {
	                	$(".d_delete").eq(Didx).addClass("disabledel");
	                }else {
	                	$(".d_delete").eq(Didx).addClass("item-disabled");
	                }
				}
				// 使用
				for (var Uidx = 0,useArrLen = useArr.length; Uidx < useArrLen; Uidx++) {
					var useArrNum = useArr[Uidx];
					 if(useArrNum) {
	                	$(".d_use").eq(Uidx).addClass("disableuse");
	                }else {
	                	$(".d_use").eq(Uidx).addClass("item-disabled");
	                }
				}

				// 修改操作
				$(".linkModelWrpaper").on("click",".d_modify",function () {
					var $this = $(this),
						$thisName = $this.parent().siblings('.dbIptHide').attr("currentname");

					if($this.hasClass("disableModify")) {
						$this.prop('href','../datasource/datasource.html?edit='+$thisName);
					}else {
						return;
					}
				})

				// 使用操作
				$(".linkModelWrpaper").on("click",".d_use",function () {
					var $this = $(this),
						$thisName = encodeURI($this.parent().siblings('.dbIptHide').attr("currentname"));
					
					if($this.hasClass("disableuse")) {
						$this.prop('href','../worktable/app/index.html?type=model&&name='+$thisName);
					}else {
						return;
					}
				})
			},
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
	                    var newDatas = DatamodelStore.getModels(newPage);
	                    if(newDatas) {
	                    	newDatas.complete(function () {
	                    		$(".mask").hide();
	                    		newDatas.success(function (response) {
	                    			if(response.success) {
	                    				var datas = response.data;
	                    				that.modelsStr(datas);
	                    			}
	                    		})
	                    	})
	                    }
	                }
				}
				$("#example").bootstrapPaginator(options);
			},
			maskNum:function (acl, mask) {
				if ((mask & 16) != 0 || (acl & mask) != 0 ) {
			        //有权限
			        return true;
			    } else {
			        //无权限	
			        return false;
			    }
			},
			// 插入表名称等：
			insertDb:function () {
				var that = this;
				$(".mulDataModelWrapper").hide();
				$(".mask").show();
				var store = DatamodelStore.getModels(1);
				if(store){
					store.complete(function(){
						$(".mask").hide();
						store.success(function (response){
							if(response.success){
								var datas = response.data,datasLen = datas.length,total = response.total;
								
								that.modelsStr(datas);
								that.paginator(total);
							}
						})
					})
				}
			},
			// 修改每个模型名称,从url上面截取
			modifyName:function (singleDimeName) {
				$(".linkModelWrpaper").hide();

				var modifyEachDime = DatamodelStore.getEachDime(singleDimeName),
					that = this;

				if(modifyEachDime) {
					modifyEachDime.complete(function () {
						modifyEachDime.success(function (response) {
							var datas = response.data;
							var isOne = true,isTwo = true;

							// 获取名称
							$("#linkName").val(datas['model_name']);
							$("#mulDataIpt").val(datas['name']);
							
							if(datas['description'] == null) {
								$(".mulDescript").text("");
							}else {
								$(".mulDescript").text(datas['description']);
							}

							// 只有第一次点击时才加载
							$(".nextBtn").on("click",function () {
								if(isOne && isTwo) {
									if($(".diemsWrapper").html().trim() == "") {
										$(".mask").show();
										var modelName = datas['model_name'];

										var modifyDimeModel = DatamodelStore.getSingleModel(modelName);
										if(modifyDimeModel) {

											var dimensionsName = [],dimensionFileName = [],factFileName = [];
											var dimeListHtml = '',factListHtml = '',factFileHtmlWrapper = '',dimesionsFileHtml = '';
						                    
						                    modifyDimeModel.complete(function(){
						                    	$(".mask").hide();
						                        modifyDimeModel.success(function(response){
						                            if(response.success){
						                                var cubeDatas = response.data;
						                                var metadata = response.metadata;
						                                var factIndex,reserveNum = [];

						                                $("#linkName").val(cubeDatas['name']);
						                                // 事实表名称
						                                var factTableName = cubeDatas['fact_table'];

						                                // 只取dimes就行
						                                for (var i = 0,dimesLens = cubeDatas.dimensions.length; i < dimesLens; i++) {
						                                    var dimesLists = cubeDatas.dimensions[i];
						                                    if(cubeDatas.dimensions[0].table.toLowerCase() == cubeDatas['fact_table'].toLowerCase()) {
						                                    	if(dimesLists.table.toLowerCase() == cubeDatas['fact_table'].toLowerCase()) {
							                                        factListHtml += '<a class="list-group-item bd-none" href="#fact">'+dimesLists.table+'</a>';
							                                        for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
							                                            factFileName +='<li class="list-group-item clearfix">\
							                                                                <div class="row">\
							                                                                    <div class="checkbox col-xs-6">\
							                                                                        <label class = "labelBlock">\
							                                                                            <input class = "factChecked" type="checkbox" value="">\
							                                                                            <span class = "factNames">'+dimesLists.columns[k]+'</span>\
							                                                                        </label>\
							                                                                    </div>\
							                                                                    <div class=" col-xs-2">\
							                                                                        <div class="input-group">\
							                                                                            <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
							                                                                            <span class="input-group-addon">\
							                                                                                <i class="iconfont2 fs-18">&#xe63d;</i>\
							                                                                                <span class="add-ok modifyBtn">确定</span>\
							                                                                            </span>\
							                                                                        </div>\
							                                                                    </div>\
							                                                                </div>\
							                                                            </li>';
							                                        }
							                                    }else {
							                                        dimeListHtml += '<a class="list-group-item bd-none" href="#dime_'+(i-1)+'">'+dimesLists.table+'</a>';
							                                        dimesionsFileHtml += '<div id="dime_'+(i-1)+'" class="panel border-radius panel-default">'
							                                        dimesionsFileHtml += '<div class="panel-heading bg-grey">\
							                                                                <div class="checkbox"><label class = "labelBlock"><input type="hidden" value = "'+(i-1)+'" /><input class = "allDimeChecked allDimeChecked_'+(i-1)+'" type="checkbox" value=""><span class = "dimeTableName">'+dimesLists.table+'</span></label></div>\
							                                                              </div><ul class="list-group dimestionTable dimestionTable_'+(i-1)+'" index = "'+(i-1)+'">';
							                                        for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
							                                            dimesionsFileHtml += ' <li class="list-group-item clearfix">\
							                                                                        <div class="row">\
							                                                                            <div class="checkbox col-xs-6">\
							                                                                                 <label  class = "labelBlock"><input class = "dimeChecked dimeChecked_'+(i-1)+'" index = "'+(i-1)+'" type="checkbox" value=""><span class = "dimeNames">'+dimesLists.columns[k]+'</span></label>\
							                                                                            </div>\
							                                                                            <div class=" col-xs-2">\
							                                                                                <div class="input-group">\
							                                                                                    <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
							                                                                                    <span class="input-group-addon">\
							                                                                                        <i class="iconfont2 fs-18">&#xe63d;</i>\
							                                                                                        <span class="add-ok">确定</span>\
							                                                                                    </span>\
							                                                                                </div>\
							                                                                            </div>\
							                                                                        </div>\
							                                                                    </li>';
							                                        }
							                                        dimesionsFileHtml += '</ul></div>';
							                                    }
						                                    }else {
						                                    	if(dimesLists.table.toLowerCase() == cubeDatas['fact_table'].toLowerCase()) {
							                                        factListHtml += '<a class="list-group-item bd-none" href="#fact">'+dimesLists.table+'</a>';
							                                        for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
							                                            factFileName +='<li class="list-group-item clearfix">\
							                                                                <div class="row">\
							                                                                    <div class="checkbox col-xs-6">\
							                                                                        <label class = "labelBlock">\
							                                                                            <input class = "factChecked" type="checkbox" value="">\
							                                                                            <span class = "factNames">'+dimesLists.columns[k]+'</span>\
							                                                                        </label>\
							                                                                    </div>\
							                                                                    <div class=" col-xs-2">\
							                                                                        <div class="input-group">\
							                                                                            <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
							                                                                            <span class="input-group-addon">\
							                                                                                <i class="iconfont2 fs-18">&#xe63d;</i>\
							                                                                                <span class="add-ok modifyBtn">确定</span>\
							                                                                            </span>\
							                                                                        </div>\
							                                                                    </div>\
							                                                                </div>\
							                                                            </li>';
							                                        }
							                                    }else {
							                                        dimeListHtml += '<a class="list-group-item bd-none" href="#dime_'+i+'">'+dimesLists.table+'</a>';
							                                        dimesionsFileHtml += '<div id="dime_'+i+'" class="panel border-radius panel-default">'
							                                        dimesionsFileHtml += '<div class="panel-heading bg-grey">\
							                                                                <div class="checkbox"><label class = "labelBlock"><input type="hidden" value = "'+i+'" /><input class = "allDimeChecked allDimeChecked_'+i+'" type="checkbox" value=""><span class = "dimeTableName">'+dimesLists.table+'</span></label></div>\
							                                                              </div><ul class="list-group dimestionTable dimestionTable_'+i+'" index = "'+i+'">';
							                                        for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
							                                            dimesionsFileHtml += ' <li class="list-group-item clearfix">\
							                                                                        <div class="row">\
							                                                                            <div class="checkbox col-xs-6">\
							                                                                                 <label  class = "labelBlock"><input class = "dimeChecked dimeChecked_'+i+'" index = "'+i+'" type="checkbox" value=""><span class = "dimeNames">'+dimesLists.columns[k]+'</span></label>\
							                                                                            </div>\
							                                                                            <div class=" col-xs-2">\
							                                                                                <div class="input-group">\
							                                                                                    <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
							                                                                                    <span class="input-group-addon">\
							                                                                                        <i class="iconfont2 fs-18">&#xe63d;</i>\
							                                                                                        <span class="add-ok">确定</span>\
							                                                                                    </span>\
							                                                                                </div>\
							                                                                            </div>\
							                                                                        </div>\
							                                                                    </li>';
							                                        }
							                                        dimesionsFileHtml += '</ul></div>';
							                                    }
						                                    }
						                                }
						                                // 填充数据表
						                                $(".factList").html(factListHtml);
						                                $(".dimeList").html(dimeListHtml);
						                                // 维度
						                                $(".diemsWrapper").html(dimesionsFileHtml);

						                                // 事实表字段tou
						                                $(".factTableName").html(factTableName);
						                                $(".factTable").html(factFileName);

						                                // 获取名称添加到度量上
						                                $(".measureName").html();

						                               // 判断
														var cubeDimes = datas.dimensions,
															factCheckedList = $(".factChecked"),
															factNameLists = $(".factNames"),
															dimeCheckedList = $(".dimeChecked "),
															dimeNameLists = $(".dimeNames"),
															dimeTableLists = $(".dimestionTable"),
															factNum = 0,
															dimeNum = 0;
														$(".mulDescript").text(datas.description);
														for(var y = 0,cubeDimesLen = cubeDimes.length;y < cubeDimesLen;y++) {
															if(cubeDimes[y].derived == null) {
																$.each(factNameLists,function (u) {
																	if(cubeDimes[y].column == factNameLists.eq(u).html()) {
																		var factName = cubeDimes[y].name,
																			factCurrentName = factNameLists.eq(u).closest(".row").find(".modifyName");
																		factCheckedList.eq(u).prop("checked",true);
																		factCheckedList.eq(u).closest(".list-group-item").addClass("checkColor");
																		factCurrentName.val(factName);
																		factNum++;
																	}
																})
															}else {
																var dimeDerived = cubeDimes[y].derived,
																	dimeGetNames =  cubeDimes[y].name.split(","),
																    dimeDerivedLen = dimeDerived.length;

																$.each(dimeNameLists,function (o) {
																	for(var p = 0;p < dimeDerivedLen;p++) {
																		if(dimeDerived[p] == dimeNameLists.eq(o).html()){
																			var dimeName = dimeGetNames[p],
																				dimedefaultName = dimeNameLists.eq(o).closest(".row").find(".modifyName");
																			
																			dimeCheckedList.eq(o).prop("checked",true);
																			dimeCheckedList.eq(o).closest(".list-group-item").addClass("checkColor");
																			dimedefaultName.val(dimeName);
																		}
																	}
																})
																
															}
														}
														// 如果子checkbox全选，父checkbox也选上
														if(factNum == factCheckedList.length) {
															$("#allFactChecked").prop("checked",true);
														}else {
															$("#allFactChecked").prop("checked",false);
														}

														$.each(dimeTableLists,function (b) {
															var dimecheck = dimeTableLists.eq(b),
																dimeCheckBtns = dimecheck.find(".dimeChecked:checked").length,
																dimeBtns = dimecheck.find(".dimeChecked").length;
																
															if(dimeCheckBtns == dimeBtns) {
																$(".allDimeChecked_"+b).prop("checked",true);
															}else {
																$(".allDimeChecked_"+b).prop("checked",false);
															}
														})

						                                // 新增度量
						                                var metricsHtml = '';
						                                for(var n = 0,metricsLen = cubeDatas.metrics.length;n < metricsLen;n++) {
						                                    metricsHtml += '<option value="">'+cubeDatas.metrics[n]+'</option>'
						                                }
						                                
						                                $(".cubeMeasureFiled").html(metricsHtml);

														// 取得默认返回值类型
						                                var measureSelectHtml = $(".cubeMeasureFiled option:selected").html().toUpperCase();
						                                
						                                for(var r = 0,metaDataLen = metadata.length;r < metaDataLen;r++) {
						                                    var metas = metadata[r];

						                                    if(cubeDatas.fact_table.toUpperCase() == metas.name.toUpperCase()) {
						                                        for(var t = 0,metacolLen = metas.columns.length;t<metacolLen;t++) {
						                                            if(measureSelectHtml == metas.columns[t].name) {
						                                                $(".measureNumber").val(metas.columns[t].dataType);
						                                            }
						                                        }
						                                    }
						                                }

						                                // 得到默认的返回值类型
						                                var defaultType = $(".measureNumber").val();

						                                // 获取名称添加到度量上
														$(".measureName").val('MIN_'+measureSelectHtml+'');	

						                                $("#measureType").on("change",function () {
															var oneMeaType = $("#measureType option:selected").text(),
																oneMeadFiled = $("#measureFiled option:selected").text(),
																measureNumber = $(".measureNumber"),
																returnType = measureNumber.val();
															
															$(".measureName").val(oneMeaType+'_'+oneMeadFiled);

															switch(oneMeaType){
																case "SUM":
																  if(defaultType==="smallint"||defaultType==="int"||defaultType==="bigint"||defaultType==="integer"){
																    returnType= 'bigint';
																  }else{
																    if(defaultType.indexOf('decimal')!=-1){
																      returnType= defaultType;
																    }else{
																      returnType= 'decimal';
																    }
																  }
																  break;
																case "MIN":
																case "MAX":
																  returnType = defaultType;
																  break;
																default:
																  returnType = defaultType;
																  break;
																}

															measureNumber.val(returnType);
														})
														// 返回值类型 ,新建度量的
														$("#measureFiled").on("change",function () {
															var oneMeaType = $("#measureType option:selected").text(),
																oneMeadFiled = $("#measureFiled option:selected").text(),
																measureNumber = $(".measureNumber"),
																returnType = measureNumber.val();

															$(".measureName").val(oneMeaType+'_'+oneMeadFiled);

															switch(oneMeaType){
																case "SUM":
																  if(defaultType==="smallint"||defaultType==="int"||defaultType==="bigint"||defaultType==="integer"){
																    returnType= 'bigint';
																  }else{
																    if(defaultType.indexOf('decimal')!=-1){
																      returnType= defaultType;
																    }else{
																      returnType= 'decimal';
																    }
																  }
																  break;
																case "MIN":
																case "MAX":
																  returnType = defaultType;
																  break;
																default:
																  returnType = defaultType;
																  break;
																}
																measureNumber.val(returnType);
														})
														
														// 混合添加的度量值
														$(".thirdProgress").on("change",".mixMeasureFiled",function () {
															var oneMeaType = $(this).parents(".modal-body").find(".mixMeasureType option:selected").text();
															var oneMeaFiled = $(this).parents(".modal-body").find(".mixMeasureFiled option:selected").text();
															var measureNumber = $(this).parents(".modal-body").find(".f_measureNumber");
															var oneMeaName = $(this).parents(".modal-body").find(".allMea");
															var returnType = measureNumber.val();
															
															oneMeaName.val(oneMeaType+'_'+oneMeaFiled);

															switch(oneMeaType){
																case "SUM":
																  if(defaultType==="smallint"||defaultType==="int"||defaultType==="bigint"||defaultType==="integer"){
																    returnType= 'bigint';
																  }else{
																    if(defaultType.indexOf('decimal')!=-1){
																      returnType= defaultType;
																    }else{
																      returnType= 'decimal';
																    }
																  }
																  break;
																case "MIN":
																case "MAX":
																  returnType = defaultType;
																  break;
																default:
																  returnType = defaultType;
																  break;
																}
																measureNumber.val(returnType);
														})
														$(".thirdProgress").on("change",".mixMeasureType",function () {
															var oneMeaType = $(this).find('option:selected').text();
															var oneMeaFiled = $(this).parents(".modal-body").find(".mixMeasureFiled option:selected").text();
															var measureNumber = $(this).parents(".modal-body").find(".f_measureNumber"),
																returnType = measureNumber.val();
															var oneMeaName = $(this).parents(".modal-body").find(".allMea");

															oneMeaName.val(oneMeaType+'_'+oneMeaFiled);

															switch(oneMeaType){
																case "SUM":
																  if(defaultType==="smallint"||defaultType==="int"||defaultType==="bigint"||defaultType==="integer"){
																    returnType= 'bigint';
																  }else{
																    if(defaultType.indexOf('decimal')!=-1){
																      returnType= defaultType;
																    }else{
																      returnType= 'decimal';
																    }
																  }
																  break;
																case "MIN":
																case "MAX":
																  returnType = defaultType;
																  break;
																default:
																  returnType = defaultType;
																  break;
																}
																measureNumber.val(returnType);
														})

														// 添加新建的tr
														var cubeMeasures = datas.measures;
														var newMeasureFiledOptions = $(".cubeMeasureFiled option");
														var delteMeasures = [];
														var measureHtml = '';
														for(var f = 0,cubeMeasuresLen = cubeMeasures.length;f < cubeMeasuresLen;f++) {
															// 跳出默认的类型值
															if(cubeMeasures[f].function.expression == "COUNT" && cubeMeasures[f].function.parameter.value == "1") {
																continue;
															}
															delteMeasures.push(cubeMeasures[f]);
														}
														for(var s = 0,delteMeasuresLen = delteMeasures.length;s < delteMeasuresLen;s++) {
															measureHtml +='<tr class = "allMeasureList cube_measureList">\
															                <td class = "allMeasureName cube_new_messureName_'+s+'">'+delteMeasures[s].name+'</td>\
															                <td class = "allMeasureCount cube_new_messureCount_'+s+'">'+delteMeasures[s].function.expression+'</td class = "f_messureFile_td new_messureFile_1">\
															                <td class="allMeasureFile cube_new_messureFile_'+s+'">'+delteMeasures[s].function.parameter.value+'</td>\
															                <td class="allMeasureType cube_new_messureType_'+s+'">'+delteMeasures[s].function.returntype+'</td>\
															                <td>\
																				<a href="javascript:void(0)" class="deleteMesureBtn text-blue mgr-15"><i class="iconfont2">&#xe616;</i></a>\
																				<a data-toggle = "modal" data-target = "#cube_count_'+s+'" href="#" class="text-blue allMeasModel"><i class="iconfont2">&#xe63d;</i></a>\
																				<div class="modal newModel fade" index = "'+s+'" id="cube_count_'+s+'">\
													                                <div class="modal-dialog">\
													                                    <div class="modal-content">\
													                                        <div class="modal-header">\
													                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span\
													                                                    aria-hidden="true">&times;</span></button>\
													                                            <h4 class="modal-title">新增度量</h4>\
													                                        </div>\
													                                        <div class="modal-body">\
													                                            <div class="form-horizontal">\
													                                                <div class="form-group">\
													                                                    <label class="col-sm-3 control-label">名称：</label>\
													                                                    <div class="col-sm-8">\
													                                                        <input type="text" class="allMea cube_measureName form-control" placeholder="" value ="'+delteMeasures[s].name+'">\
													                                                    </div>\
													                                                </div>\
													                                                <div class="form-group">\
													                                                    <label class="col-sm-3 control-label">类型：</label>\
													                                                    <div class="col-sm-8">\
													                                                        <select class="form-control mixMeasureType new_measureTypes" id="cube_measureType">\
													                                                            <option value="SUM">SUM</option>\
													                                                            <option value="MIN" selected>MIN</option>\
													                                                            <option value="count">MAX</option>\
													                                                        </select>\
													                                                    </div>\
													                                                </div>\
													                                                <div class="form-group">\
													                                                    <label class="col-sm-3 control-label">统计字段：</label>\
													                                                    <div class="col-sm-8">\
													                                                        <select class="form-control mixMeasureFiled new_measureFiled">';
													                                                        for(var e = 0,measureOptionsLen = newMeasureFiledOptions.length;e < measureOptionsLen;e++) {
																												measureHtml += '<option value="order_num">'+newMeasureFiledOptions.eq(e).html()+'</option>'
																											}
													                                                       measureHtml += '</select>\
													                                                    </div>\
													                                                </div>\
													                                                <div class="form-group">\
													                                                    <label class="col-sm-3 control-label">返回值类型：</label>\
													                                                    <div class="col-sm-8">\
													                                                        <input type="text" class="cube_measureNumber f_measureNumber form-control" value = "'+delteMeasures[s].function.returntype+'" disabled>\
													                                                    </div>\
													                                                </div>\
													                                            </div>\
													                                        </div>\
													                                        <div class="modal-footer">\
													                                            <button type="button" class="btn btn-default" data-dismiss="modal">取 消</button>\
													                                            <button type="button" class="btn btn-success cube_measuerBtn"  data-dismiss="modal">确 定</button>\
													                                        </div>\
													                                    </div>\
													                                </div>\
													                            </div>\
																			</td>\
															            </tr>';
														}

														// 类型和弹出框取相同的
														$(".thirdProgress").on("click",".allMeasModel",function () {
															var allTypes = $(this).parent().siblings('.allMeasureCount').html();
															
															var allOptions = $(this).siblings('.newModel').find(".mixMeasureType").find("option");
															
															$.each(allOptions,function (i) {
																if(allTypes == allOptions.eq(i).text()) {
																	allOptions.eq(i).prop("selected",true)
																}
															})
														})

														$(".measureTable tbody").append(measureHtml);
						                            }
						                        })
						                    })
						                }
									}
					                isOne = false;
					                isTwo = true;
								}else if(!isOne && isTwo) {
									 isOne = false;
					                 isTwo = false;
								}
							});
							
							$(".preBtn").on("click",function () {
								if(!isOne && isTwo) {
									isOne = true;
					                isTwo = true;
								}else if(!isOne && !isTwo) {
									isOne = false;
					                isTwo = true;
								}
							})

							
							
						})
					})
				}
			},
			// 点击操作
			clickTypes:function () {
				$(".dbHandle").on("click",".dbOpen",function () {
					var dbIndex = $(this).siblings("input[type = 'hidden']").val();
					var trIlen = $(".dimeMeas_table_"+dbIndex).find("tr").length;
					var partiteFile = $(".partition_file_"+dbIndex);

					if(trIlen == 1) {
						$(".each_dime_table_"+dbIndex).hide();
					}
					if(partiteFile.html() == "") {
						partiteFile.parent().hide();
					}
				})
				// 展开和隐藏维度表
				$(".dbHandle").on("click",".d_dimensions",function (e) {
					// 当一个维度框出现时，点击不执行
					if($(".dimensions_wrapper").hasClass("showDime")) {
						return;
					}

					if(e.stopPropagation){
						e.stopPropagation();
					}else {
						e.cancleBubble = true;
					}
					$(".eject").fadeIn(100);
					var dbIndex = $(this).parent().siblings("input[type = 'hidden']").val();
					$(".dimensions_"+dbIndex).addClass("showDime");
				});
				$(".dbHandle").on("click",".closeMeasure",function () {
					$(".eject").fadeOut(100);
					var dimenHideP = $(this).parents(".dimensions_wrapper");
					dimenHideP.removeClass("showDime");
				})
				$(document).on("click",function (e) {
					var index = $(this).find(".dbIptHide").val();
					var currentDime = $(".dimensions_wrapper");
					
					if(e.stopPropagation){
						e.stopPropagation();
					}else {
						e.cancleBubble = true;
					}
					
					if(!currentDime.is(e.target) && currentDime.has(e.target).length == 0) {
						currentDime.removeClass("showDime");
						$(".eject").fadeOut(100);
					}
				})
				// 前面带一个小箭头的，让小箭头跟着翻转的jq实现方法
				$(".dbHandle").on("click",".dimes_table",function () {
					$(this).siblings(".dimes_cols").slideToggle("100");
					$(this).find("i").toggleClass("turnLeft");
				})
				
				// 删除,
				$(".dbHandle").on("click",".d_delete",function () {
					var index = $(this).parent().siblings("input[type = 'hidden']").val();
					var delName = $(".dbName_"+index).find("span").html();
					if($(this).hasClass("disabledel")) {
						$('#confirm').modal("show");
						$(".confirmBtn").on("click",function () {
							$(".mask").show();

							var delmodels = DatamodelStore.delModels(delName);
							if(delmodels) {
								delmodels.complete(function () {
									$(".mask").hide();
									delmodels.success(function (response) {
										if(response.success) {
											$(".dbInfos_"+index).remove();
											$(this).parents('tr').remove();
											window.location.reload();
											$('#prompTips .tipCont').html("删除成功");
											$('#prompTips').modal("show");
										}else {
											$('#prompTips .tipCont').html(response.message);
											$('#prompTips').modal("show");
										}
									});

								})
							}
						});
					}else {
						return;
					}
				})
			},
			// title固定
			fixTitle:function () {
				var dimHead = $(".dim_head");
				$('.dimensions_wrapper').scroll(function() {
					var topPos = $(this).scrollTop();
					if(topPos > 0) {
						dimHead.addClass('fix_dim_head');
					}else {
						dimHead.removeClass('fix_dim_head');
					}
				});
				$(window).scroll(function () {
					if(dimHead.hasClass("fix_dim_head")) {
						dimHead.removeClass('fix_dim_head');
					}else {
						return;
					}
				})
			}
		}

		new HandleData();
	})(jQuery);
	
	(function () {
		function DbProgress() {
			this.init.apply(this,arguments);
		}
		DbProgress.prototype = {
			constructor:DbProgress,
			init:function () {
				$(".secondProgress").hide();
				$(".thirdProgress").hide();
				$(".preBtn").hide();
				$(".doneBtn").hide();

				this.mulJson();
				this.eventProgress();
				this.modifyName();
				this.checkEvent();
				this.doneEvent();
				
			},
			mulJson:function () {
				this.mulDatas = {
					  "name": "",   //多维数据集名称
					  "description": "",  //多维数据集描述
					  "model_name": "",  //关联模型名称
					  'factTableName':'',
					  "dimensions": [   //此属性存放选择为维度的列数组	
					    ],
					    "measures": []
				};
				this.defaultCount = ' <tr class = "measureList allMeasureList">\
	                                <td class = "f_messureName_td allMeasureName new_messureName_1">_count_</td>\
	                                <td class = "allMeasureCount f_messureCount_td new_messureCount_1">COUNT</td class = "f_messureFile_td new_messureFile_1">\
	                                <td class = "allMeasureFile">1</td>\
	                                <td>bigint</td>\
	                                <td><a href="#" data-toggle = "modal" data-target = "#count" class="text-blue"><i class="iconfont2">&#xe63d;</i></a></td>\
	                            </tr>';
			},
			eventProgress:function () {
				var that = this;
				var currentHref = window.location.href;

				var isPre = true,isNext = true,measureName = 2;

				var measureInfos = '';
				$(".f_btn").addClass("current_progress");
				// 下一步
				$(".nextBtn").on("click",function () {
					if(isPre && isNext) {
						if($("#mulDataIpt").val().trim() == "") {
							$('#prompTips .tipCont').html("名称不能为空");
							$('#prompTips').modal("show");
							return;
						}
						//内容出现
						$(".firstProgress").hide();
						$(".secondProgress").show();	
						
						$(".f_step").removeClass("step-pass2").addClass("step-pass");
						$(".s_step").addClass("step-pass2");

						$(".preBtn").show();
						$(".nextBtn").show();
						$(".doneBtn").hide();

						isNext = true;
						isPre = false;
					}else if(!isPre && isNext) {
						// 判断是否全选
						if(!$(".secondProgress").find("input[type='checkbox']").is(":checked")) {
							$('#prompTips .tipCont').html("必须选择一个");
							$('#prompTips').modal("show");
							return;
						}
						if($(".input-group-addon").hasClass("btn-success"))	{
							$('#prompTips .tipCont').html("修改后的名称没保存");
							$('#prompTips').modal("show");
							return;
						}
						$(".secondProgress").hide();
						$(".thirdProgress").show();

						$(".s_step").removeClass("step-pass2").addClass("step-pass");
						$(".t_step").addClass("step-pass2");

						$(".nextBtn").hide();
						$(".preBtn").show();
						$(".doneBtn").show();
						isNext = false;
						isPre = false;
					}
				});
				// 上一步
				$(".preBtn").on("click",function () {
					if(!isPre && isNext) {
						$(".firstProgress").show();
						$(".secondProgress").hide();	
						$(".thirdProgress").hide();	
						$(".doneBtn").hide();

						$(".f_step").removeClass("step-pass").addClass("step-pass2");
						$(".s_step").removeClass("step-pass2");
						$(".preBtn").hide();
						$(".nextBtn").show();
						isPre = true;
						isNext = true;
					}else if(!isPre && !isNext) {
						$(".secondProgress").show();
						$(".thirdProgress").hide();
						$(".firstProgress").hide();
						$(".doneBtn").hide();
						$(".preBtn").show();

						$(".s_step").removeClass("step-pass").addClass("step-pass2");
						$(".t_step").removeClass("step-pass2");
						$(".nextBtn").show();
						isPre = false;
						isNext = true;
					}
				});
				// 取消
				if(currentHref.indexOf('?edit=') == -1) {
					$(".cancleBtn").on("click",function () {
						$(".mulDataModelWrapper").hide();
						$(".linkModelWrpaper").show();

						if(!isPre && isNext) {
							$(".secondProgress").hide();
							$(".thirdProgress").hide();
							$(".firstProgress").show();

							$(".doneBtn").hide();
							$(".preBtn").hide();
							$(".nextBtn").show();

							isNext = true;
							isPre = true;
						}
						if(!isPre && !isNext) {
							$(".thirdProgress").hide();
							$(".secondProgress").hide();
							$(".firstProgress").show();

							$(".doneBtn").hide();
							$(".preBtn").hide();
							$(".nextBtn").show();

							isNext = true;
							isPre = true;
						}

						$("#mulDataIpt").val("");
						$("#linkName").val("");
						$(".mulDescript").text("");
						$(".factList").html(" ");
						$(".dimeList").html(" ");
						$(".factTableName").html("");
						$("#allFactChecked").prop("checked",false);
						$(".factTable").html("");
						$(".diemsWrapper").html();
						measureInfos = '';
						$(".measureTable tbody").html(that.defaultCount);
					});
				}else {
					$(".cancleBtn").on("click",function () {
						window.location = '../dbSpeedDone/dbSpeedDone.html'
					})
				}
				
				// 新增度量框按钮 
				$(document).on("click",".measuerBtn",function () {

					var newMeasureFiledOptions = $("#measureFiled option"),
						newMeasureName = $(".measureName").val(),
						newMeasureType = $("#measureType option:selected").text(),
						newMeasureFiled = $("#measureFiled option:selected").text(),
						mewMeasureNumber = $(".measureNumber").val(),
						measureLists = $(".allMeasureList");
	 					
					measureInfos = '';
					var isBreak = false;

					// 编号还未获取
					if(newMeasureName.trim() == "") {
						$('#prompTips .tipCont').html("名称不能为空");
						$('#prompTips').modal("show");
						return;
					}
					measureInfos = '<tr class = "measureList allMeasureList">\
								<td class = "allMeasureName new_messureName_'+measureName+'">'+newMeasureName+'</td>\
								<td class = "allMeasureCount new_messureCount_'+measureName+'">'+newMeasureType+'</td>\
								<td class = "allMeasureFile new_messureFile_'+measureName+'">'+newMeasureFiled+'</td>\
								<td class = "allMeasureType new_messureType_'+measureName+'">'+mewMeasureNumber+'</td>\
								<td>\
									<a href="#" class="deleteMesureBtn text-blue mgr-15"><i class="iconfont2">&#xe616;</i></a>\
									<a data-toggle = "modal" data-target = "#count_'+measureName+'" href="#" class="text-blue allMeasModel"><i class="iconfont2">&#xe63d;</i></a>\
									<div class="modal fade newModal" index = "'+measureName+'" id="count_'+measureName+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
										<div class="modal-dialog" role = "document">\
											<div class="modal-content">\
												<div class="modal-header">\
													<button type = "button" class = "close" data-dismiss="modal" aria-label = "Close">\
														<span aria-hidden = "true">&times;</span>\
													</button>\
													<h4 class="modal-title" id="myModalLabel">新增度量</h4>\
												</div>\
												<div class="modal-body">\
													<div class="form-horizontal">\
														<div class="form-group">\
															<label class="col-sm-3 control-label" for="">名称：</label>\
															<div class="col-sm-8">\
																<input class="allMea new_measureName form-control" type="text" value = "'+newMeasureName+'">\
															</div>\
														</div>\
														<div class="form-group">\
															<label class="col-sm-3 control-label" for="">类型：</label>\
															<div class="col-sm-8">\
																<select class="form-control mixMeasureType new_measureTypes" name="" id="new_measureType">\
																	<option value="SUM">SUM</option>\
																	<option value="MAX">MAX</option>\
																	<option value="MIN">MIN</option>\
																</select>\
															</div>\
														</div>\
														<div class="form-group">\
															<label class="col-sm-3 control-label" for="">统计字段：</label>\
															<div class="col-sm-8">\
																<select class="form-control mixMeasureFiled new_measureFiled" name="">'

										for(var e = 0,measureOptionsLen = newMeasureFiledOptions.length;e < measureOptionsLen;e++) {
											measureInfos += '<option value="order_num">'+newMeasureFiledOptions.eq(e).html()+'</option>'
										}
											measureInfos += '</select>\
															</div>\
														</div>\
														<div class="form-group">\
															<label class="col-sm-3 control-label" for="">返回类型值：</label>\
															<div class="col-sm-8">\
																<input class="f_measureNumber form-control" type="text" value = "'+mewMeasureNumber+'" disabled>\
															</div>\
														</div>\
													</div>\
												</div>\
												<div class="modal-footer">\
													<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
													<button type="button" class="btn btn-success newMeasureBtn" data-dismiss="modal">确定</button>\
												</div>\
											</div>\
										</div>\
									</div>\
								</td>\
							</tr>';

					// 类型和弹出框取相同的
					$(".thirdProgress").on("click",".allMeasModel",function () {
						var allTypes = $(this).parent().siblings('.allMeasureCount').html();

						var allOptions = $(this).siblings('.newModal').find(".mixMeasureType").find("option");
						$.each(allOptions,function (i) {
							if(allTypes == allOptions.eq(i).text()) {
								allOptions.eq(i).prop("selected",true)
							}
						})
					})
							
					//判断第三步名字是否重复，类型和统计字段
					$.each(measureLists,function (j) {
						var meaSingleLists = measureLists.eq(j),
							meaSingelName = meaSingleLists.find(".allMeasureName").html(),
							meaSingleCount = meaSingleLists.find(".allMeasureCount").html(),
							meaSingleFile = meaSingleLists.find(".allMeasureFile").html();
						
						if(newMeasureName == meaSingelName) {
							$('#prompTips .tipCont').html("名称不能重复");
							$('#prompTips').modal("show");
							isBreak = true;
						}
						if(newMeasureType == meaSingleCount && newMeasureFiled == meaSingleFile) {
							$('#prompTips .tipCont').html("类型和统计字段名不能和已有的同时相同");
							$('#prompTips').modal("show");
							isBreak = true;
						}
					});
					
					if(isBreak){
						return;
					}else{
						measureName++;
						$(".measureTable").append(measureInfos);
					}
				})

				// 编辑第一个度量
				$(document).on("click",".f_countBtn",function () {
					
					var f_mn_val = $(".f_measureName").val();

					if(f_mn_val.trim() == "") {
						$('#prompTips .tipCont').html("名称不能为空");
						$('#prompTips').modal("show");
						return;
					}

					$(".f_messureName_td").html(f_mn_val);
				})

				// 编辑每个度量新增的
				$(".measureTable").on("click",".newMeasureBtn",function () {

					var newModalBody = $(this).parent().siblings(".modal-body");

					var index = $(this).parents(".newModal").attr("index");

					var allMea,isReturn = false;

					var new_mn_val =newModalBody.find(".new_measureName").val();
					var new_mt_text = newModalBody.find("#new_measureType option:selected").text();
					var new_mf_text = newModalBody.find(".new_measureFiled option:selected").text();
					var new_mt_val = newModalBody.find(".f_measureNumber").val();
					
					if(new_mn_val.trim() == "") {
						$('#prompTips .tipCont').html("名称不能为空");
						$('#prompTips').modal("show");
						return;
					}

					$(".new_messureName_"+index).removeClass("allMeasureName");

					allMea = $(".allMeasureName");
					$.each(allMea,function (i) {
						var currentName = allMea.eq(i).html();
						if(new_mn_val == currentName) {
							$('#prompTips .tipCont').html("名称不能重复");
							$('#prompTips').modal("show");
							isReturn = true;
						}else {
							$(".new_messureName_"+index).addClass("allMeasureName");
						}
					})

					if(isReturn) {
						return;
					}else {
						$(".new_messureName_"+index).html(new_mn_val);
						$(".new_messureCount_"+index).html(new_mt_text);
						$(".new_messureFile_"+index).html(new_mf_text);
						$(".new_messureType_"+index).html(new_mt_val);
					}
				})
				$(".measureTable").on("click",".cube_measuerBtn",function (){
					
					var newModalBody = $(this).parent().siblings(".modal-body");

					var index = $(this).parents(".newModel").attr("index");
					
					var allMea,isReturn = false;

					var new_mn_val =newModalBody.find(".cube_measureName").val();
					var new_mt_text = newModalBody.find("#cube_measureType option:selected").text();
					var new_mf_text = newModalBody.find(".new_measureFiled option:selected").text();
					var new_mt_val = newModalBody.find(".f_measureNumber").val();
					
					if(new_mn_val.trim() == "") {
						$('#prompTips .tipCont').html("名称不能为空");
						$('#prompTips').modal("show");
						return;
					}

					$(".cube_new_messureName_"+index).removeClass("allMeasureName");

					allMea = $(".allMeasureName");
					$.each(allMea,function (i) {
						var currentName = allMea.eq(i).html();
						if(new_mn_val == currentName) {
							$('#prompTips .tipCont').html("名称不能重复");
							$('#prompTips').modal("show");
							isReturn = true;
						}else {
							$(".cube_new_messureName_"+index).addClass("allMeasureName");
						}
					})

					if(isReturn) {
						return;
					}else {
						$(".cube_new_messureName_"+index).html(new_mn_val);
						$(".cube_new_messureCount_"+index).html(new_mt_text);
						$(".cube_new_messureFile_"+index).html(new_mf_text);
						$(".cube_new_messureType_"+index).html(new_mt_val);
					}
				})

				//ajax 点击每一个多维列表将数据加到里面
				$(".dbHandle").on("click",".d_addMul",function () {
					var $this = $(this);
					if($this.hasClass("disableaddMul")) {
						$(".mask").show();

						var index = $(this).parent().siblings(".dbIptHide").val();
						
						var singleModelName = $(".dbName_"+index).find("span").html();
						
						var singleModel = DatamodelStore.getSingleModel(singleModelName);

						if(singleModel) {
							var dimensionsName = [],dimensionFileName = [],factFileName = [];
							var dimeListHtml = '',factFileHtmlWrapper = '',factListHtml = '',dimesionsFileHtml = '';

							singleModel.complete(function(){
								$(".mulDataModelWrapper").show();
								$(".linkModelWrpaper").hide();
								$(".mask").hide();
								singleModel.success(function(response){
									if(response.success){
										var datas = response.data;
										var metadata = response.metadata;
										var factIndex;

										$("#linkName").val(datas['name']);
										// 事实表名称
										var factTableName = datas['fact_table'];

										// 只取dimes就行
										for (var i = 0,dimesLens = datas.dimensions.length; i < dimesLens; i++) {
											var dimesLists = datas.dimensions[i];
											if(datas.dimensions[0].table.toLowerCase() == datas['fact_table'].toLowerCase()) {
												if(dimesLists.table.toLowerCase() == datas['fact_table'].toLowerCase()) {
													factListHtml += '<a class="list-group-item bd-none" href="#fact">'+dimesLists.table+'</a>';
													for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
														factFileName +='<li class="list-group-item clearfix">\
													                        <div class="row">\
													                            <div class="checkbox col-xs-6">\
													                                <label class = "labelBlock">\
													                                    <input class = "factChecked" type="checkbox" value="">\
													                                    <span class = "factNames">'+dimesLists.columns[k]+'</span>\
													                                </label>\
													                            </div>\
													                            <div class=" col-xs-2">\
													                                <div class="input-group">\
													                                    <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
													                                    <span class="input-group-addon">\
													                                        <i class="iconfont2 fs-18">&#xe63d;</i>\
													                                        <span class="add-ok modifyBtn">确定</span>\
													                                    </span>\
													                                </div>\
													                            </div>\
													                        </div>\
													                    </li>';
													}
												}else {
													dimeListHtml += '<a class="list-group-item bd-none" href="#dime_'+(i-1)+'">'+dimesLists.table+'</a>';
													dimesionsFileHtml += '<div id="dime_'+(i-1)+'" class="panel border-radius panel-default">'
													dimesionsFileHtml += '<div class="panel-heading bg-grey">\
																		    <div class="checkbox"><label class = "labelBlock"><input type="hidden" value = "'+(i-1)+'" /><input class = "allDimeChecked allDimeChecked_'+(i-1)+'" type="checkbox" value=""><span class = "dimeTableName">'+dimesLists.table+'</span></label></div>\
																		  </div><ul class="list-group dimestionTable dimestionTable_'+(i-1)+'" index = "'+(i-1)+'">';
													for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
														dimesionsFileHtml += ' <li class="list-group-item clearfix">\
																                    <div class="row">\
																                        <div class="checkbox col-xs-6">\
																                             <label class = "labelBlock"><input class = "dimeChecked dimeChecked_'+(i-1)+'" index = "'+(i-1)+'" type="checkbox" value=""><span class = "dimesNames">'+dimesLists.columns[k]+'</span></label>\
																                        </div>\
																                        <div class=" col-xs-2">\
																                            <div class="input-group">\
																                                <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
																                                <span class="input-group-addon">\
																                                    <i class="iconfont2 fs-18">&#xe63d;</i>\
																                                    <span class="add-ok">确定</span>\
																                                </span>\
																                            </div>\
																                        </div>\
																                    </div>\
																                </li>';
													}
													dimesionsFileHtml += '</ul></div>';
												}
											}else {
												if(dimesLists.table.toLowerCase() == datas['fact_table'].toLowerCase()) {
													factListHtml += '<a class="list-group-item bd-none" href="#fact">'+dimesLists.table+'</a>';
													for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
														factFileName +='<li class="list-group-item clearfix">\
													                        <div class="row">\
													                            <div class="checkbox col-xs-6">\
													                                <label class = "labelBlock">\
													                                    <input class = "factChecked" type="checkbox" value="">\
													                                    <span class = "factNames">'+dimesLists.columns[k]+'</span>\
													                                </label>\
													                            </div>\
													                            <div class=" col-xs-2">\
													                                <div class="input-group">\
													                                    <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
													                                    <span class="input-group-addon">\
													                                        <i class="iconfont2 fs-18">&#xe63d;</i>\
													                                        <span class="add-ok modifyBtn">确定</span>\
													                                    </span>\
													                                </div>\
													                            </div>\
													                        </div>\
													                    </li>';
													}
												}else {
													dimeListHtml += '<a class="list-group-item bd-none" href="#dime_'+i+'">'+dimesLists.table+'</a>';
													dimesionsFileHtml += '<div id="dime_'+i+'" class="panel border-radius panel-default">'
													dimesionsFileHtml += '<div class="panel-heading bg-grey">\
																		    <div class="checkbox"><label class = "labelBlock"><input type="hidden" value = "'+i+'" /><input class = "allDimeChecked allDimeChecked_'+i+'" type="checkbox" value=""><span class = "dimeTableName">'+dimesLists.table+'</span></label></div>\
																		  </div><ul class="list-group dimestionTable dimestionTable_'+i+'" index = "'+i+'">';
													for (var k = 0,dimesFilesLen = dimesLists.columns.length; k < dimesFilesLen; k++) {
														dimesionsFileHtml += ' <li class="list-group-item clearfix">\
																                    <div class="row">\
																                        <div class="checkbox col-xs-6">\
																                             <label class = "labelBlock"><input class = "dimeChecked dimeChecked_'+i+'" index = "'+i+'" type="checkbox" value=""><span class = "dimesNames">'+dimesLists.columns[k]+'</span></label>\
																                        </div>\
																                        <div class=" col-xs-2">\
																                            <div class="input-group">\
																                                <input type="text" class="form-control modifyName" value="'+dimesLists.columns[k]+'" disabled>\
																                                <span class="input-group-addon">\
																                                    <i class="iconfont2 fs-18">&#xe63d;</i>\
																                                    <span class="add-ok">确定</span>\
																                                </span>\
																                            </div>\
																                        </div>\
																                    </div>\
																                </li>';
													}
													dimesionsFileHtml += '</ul></div>';
												}
											}
										}
										// 填充数据表
										$(".factList").html(factListHtml);
										$(".dimeList").html(dimeListHtml);
										
										// 维度
										$(".diemsWrapper").html(dimesionsFileHtml);

										// 事实表字段tou
										$(".factTableName").html(factTableName);
										$(".factTable").html(factFileName);

										

										// 新增度量
										var metricsHtml = '';
										for(var n = 0,metricsLen = datas.metrics.length;n < metricsLen;n++) {
											metricsHtml += '<option value="">'+datas.metrics[n]+'</option>'
										}
										$("#measureFiled").html(metricsHtml);


										// 取得默认返回值类型
										var measureSelectHtml = $("#measureFiled option:selected").html().toUpperCase();
										
										for(var r = 0,metaDataLen = metadata.length;r < metaDataLen;r++) {
											var metas = metadata[r];

											if(datas.fact_table.toUpperCase() == metas.name.toUpperCase()) {
												for(var t = 0,metacolLen = metas.columns.length;t<metacolLen;t++) {
													if(measureSelectHtml == metas.columns[t].name) {
														$(".measureNumber").val(metas.columns[t].dataType);
													}
												}
											}
										}

										// 获取名称添加到度量上
										$(".measureName").val('MIN_'+measureSelectHtml+'');	

										// 得到默认的返回值类型
										var defaultReturnType = $(".measureNumber").val();

										$("#measureType").on("change",function () {
											var oneMeaType = $("#measureType option:selected").text(),
												oneMeadFiled = $("#measureFiled option:selected").text(),
												measureNumber = $(".measureNumber"),
												returnType = measureNumber.val();
											
											$(".measureName").val(oneMeaType+'_'+oneMeadFiled);

											switch(oneMeaType){
												case "SUM":
												  if(defaultReturnType==="smallint"||defaultReturnType==="int"||defaultReturnType==="bigint"||defaultReturnType==="integer"){
												    returnType= 'bigint';
												  }else{
												    if(defaultReturnType.indexOf('decimal')!=-1){
												      returnType= defaultReturnType;
												    }else{
												      returnType= 'decimal';
												    }
												  }
												  break;
												case "MIN":
												case "MAX":
												  returnType = defaultReturnType;
												  break;
												default:
												  returnType = defaultReturnType;
												  break;
												}

											measureNumber.val(returnType);
										})
										// 返回值类型 ,新建度量的
										$("#measureFiled").on("change",function () {
											var oneMeaType = $("#measureType option:selected").text(),
												oneMeadFiled = $("#measureFiled option:selected").text(),
												measureNumber = $(".measureNumber"),
												returnType = measureNumber.val();

											$(".measureName").val(oneMeaType+'_'+oneMeadFiled);

											switch(oneMeaType){
												case "SUM":
												  if(defaultReturnType==="smallint"||defaultReturnType==="int"||defaultReturnType==="bigint"||defaultReturnType==="integer"){
												    returnType= 'bigint';
												  }else{
												    if(defaultReturnType.indexOf('decimal')!=-1){
												      returnType= defaultReturnType;
												    }else{
												      returnType= 'decimal';
												    }
												  }
												  break;
												case "MIN":
												case "MAX":
												  returnType = defaultReturnType;
												  break;
												default:
												  returnType = defaultReturnType;
												  break;
												}
												measureNumber.val(returnType);
										})
										
										// 每行修改的度量
										$(".thirdProgress").on("change",".new_measureFiled",function () {
											var oneMeaType = $(this).parents(".modal-body").find(".new_measureTypes option:selected").text();
											var oneMeaFiled = $(this).parents(".modal-body").find(".new_measureFiled option:selected").text();
											var oneMeaName = $(this).parents(".modal-body").find(".allMea");
											var measureNumber = $(this).parents(".modal-body").find(".f_measureNumber"),
											returnType = measureNumber.val();
											
											oneMeaName.val(oneMeaType+'_'+oneMeaFiled);

											switch(oneMeaType){
												case "SUM":
												  if(defaultReturnType==="smallint"||defaultReturnType==="int"||defaultReturnType==="bigint"||defaultReturnType==="integer"){
												    returnType= 'bigint';
												  }else{
												    if(defaultReturnType.indexOf('decimal')!=-1){
												      returnType= defaultReturnType;
												    }else{
												      returnType= 'decimal';
												    }
												  }
												  break;
												case "MIN":
												case "MAX":
												  returnType = defaultReturnType;
												  break;
												default:
												  returnType = defaultReturnType;
												  break;
												}
												measureNumber.val(returnType);
										})
										$(".thirdProgress").on("change",".new_measureTypes",function () {
											var oneMeaType = $(this).find('option:selected').text();
											var measureNumber = $(this).parents(".modal-body").find(".f_measureNumber");
											var oneMeaFiled = $(this).parents(".modal-body").find(".new_measureFiled option:selected").text();
											var oneMeaName = $(this).parents(".modal-body").find(".allMea");
											var returnType = measureNumber.val();

											oneMeaName.val(oneMeaType+'_'+oneMeaFiled);

											switch(oneMeaType){
												case "SUM":
												  if(defaultReturnType==="smallint"||defaultReturnType==="int"||defaultReturnType==="bigint"||defaultReturnType==="integer"){
												    returnType= 'bigint';
												  }else{
												    if(defaultReturnType.indexOf('decimal')!=-1){
												      returnType= defaultReturnType;
												    }else{
												      returnType= 'decimal';
												    }
												  }
												  break;
												case "MIN":
												case "MAX":
												  returnType = defaultReturnType;
												  break;
												default:
												  returnType = defaultReturnType;
												  break;
												}
												measureNumber.val(returnType);
										})
									}
								})
							})
						}
					}else {
						return;
					}
				}) 
				
				// 限制输入和名字不能重复
				$(".secondProgress").on("keyup",".addModifyName",function () {
					var valid = $(this).val().replace(/[^\w\u4e00-\u9fa5]/ig,'');
					$(this).val(valid);
				});

				// 删除度量
				$(".measureTable").on("click",".deleteMesureBtn",function () {
					var $this = $(this).parents("tr");
					$('#confirm').modal("show");
					$(".confirmBtn").on("click",function () {
						$this.remove();
						measureName--;
					})
				});
			},
			modifyName:function () {
				$('.secondProgress').on('click','.input-group-addon',function(){

		            var modifyName = $(".modifyName"),
		                $thisName = $(this).prev().val().trim(),
		                isReturn = false;

		            if($(this).prev().attr('disabled') == 'disabled'){
		                $(this).children('.iconfont2').hide();
		                $(this).children('.add-ok').show();
		                $(this).addClass('btn-success');
		                $(this).prev().removeAttr("disabled");
		                
		                $(this).prev().removeClass("modifyName").addClass("addModifyName");
		            }
		            else{
		                if($(this).prev().val()!=''){
		                	$.each(modifyName,function (i) {
		                    	if($thisName == modifyName.eq(i).val()) {
		                    		$('#prompTips .tipCont').html("名称不能重复");
									$('#prompTips').modal("show");
		                    		isReturn = true;
		                    	}
		                    })
		                	if(isReturn) {
		                		return;
		                	}else {
		                		$(this).children('.iconfont2').show();
			                    $(this).children('.add-ok').hide();
			                    $(this).removeClass('btn-success');
			                    $(this).prev().attr("disabled","disabled");

			                    $(this).prev().addClass("modifyName").removeClass("addModifyName");
		                	}
		                    
		                }else {
		                	$('#prompTips .tipCont').html("名称不能为空");
							$('#prompTips').modal("show");
		                }
		            }
		        });
			},
			checkEvent:function () {
				var dimeChecked = $(".allDimeChecked"),
					factChecked = $(".factChecked");

				$(".secondProgress").on("click","#allFactChecked",function () {
					if($(this).is(":checked")) {
						$(".factChecked").prop("checked","checked");
						$(".factChecked").closest(".list-group-item").addClass("checkColor");
					}else {
						
						$(".factChecked").prop("checked",false);
						$(".factChecked").closest(".list-group-item").removeClass("checkColor");
					}
				});

				$(".secondProgress").on("click",".factChecked",function () {

					var factCheckedLen = $(".factChecked:checked").length,
						factAllLen = $(".factChecked").length,
						$this = $(this);

					if(factCheckedLen == factAllLen) {
						$("#allFactChecked").prop("checked",true);
					}else {
						$("#allFactChecked").prop("checked",false);
					}

					if($this.is(":checked")) {
						$(this).closest(".list-group-item").addClass("checkColor");
					}else {
						$(this).closest(".list-group-item").removeClass("checkColor");
					}

				})

				$(".secondProgress").on("click",".allDimeChecked",function () {
					var index = $(this).siblings("input[type = 'hidden']").val();
					
					if($(this).is(":checked")) {
						$(".dimeChecked_"+index).prop("checked","checked");
						$(".dimeChecked_"+index).closest(".list-group-item").addClass("checkColor");
					}else {
						$(".dimeChecked_"+index).prop("checked","");
						$(".dimeChecked_"+index).closest(".list-group-item").removeClass("checkColor");
					}
				});

				$(".secondProgress").on("click",".dimeChecked",function () {
					var index = $(this).attr("index"),$this = $(this);
					
					var dimeCheckedLen = $(".dimestionTable_"+index).find(".dimeChecked:checked").length,
						dimeAllLen = $(".dimestionTable_"+index).find(".dimeChecked").length;

					if(dimeCheckedLen == dimeAllLen) {
						$(".allDimeChecked_"+index).prop("checked",true);
					}else {
						$(".allDimeChecked_"+index).prop("checked",false);
					}

					if($this.is(":checked")) {
						$(this).closest(".list-group-item").addClass("checkColor");
					}else {
						$(this).closest(".list-group-item").removeClass("checkColor");
					}

				})
			},
			doneEvent:function () {
				var mulDatas = this.mulDatas;
				var currentLocation = window.location.href;

				$(".doneBtn").on("click",function () {

					$(".mask").show();

					var measureList = $(".allMeasureList");

					mulDatas.name = $("#mulDataIpt").val();
					mulDatas.description = $(".mulDescript").val().trim();
					mulDatas.model_name = $("#linkName").val();
					mulDatas.factTableName = $(".factTableName").html();
					
					// 只选择维度表的情况
					if(!$(".factTable").find("input[type ='checkbox']").is(":checked")) {
						var dimeTableLen = $(".dimestionTable").length;
						
						var checkedDimTable = [];
						for(var j = 0;j < dimeTableLen;j++) {
							if($(".dimestionTable").eq(j).find("input[type ='checkbox']").is(":checked")) {
								checkedDimTable.push($(".dimestionTable").eq(j).attr("index"));
							}
						}
						
						// 选择一个维度表时
						if(checkedDimTable.length == 1) {
							var dime = {
							      "name": "",  //维度名称
							      "table": "",  //维度列所在的表名称 (格式为 数据库名.表名 大写)
							      "column": "{FK}",  //如果选择了非事实表的字段,此属性值为{FK},如果选择的是事实表中的字段,此属性值为具体的字段英文名称 大写
							      "derived": []
							}

							dime.table = $(".allDimeChecked_"+checkedDimTable[0]).siblings("span").html();
							var dimeFilesChecked = $(".dimestionTable_"+checkedDimTable[0]).find("input[type = 'checkbox']:checked");
							
							if(dimeFilesChecked.length == 1){
								dime.name = dimeFilesChecked.parents(".list-group-item").find(".modifyName").val();
								dime.derived.push(dimeFilesChecked.siblings('span').html());
								
							}else {
								var dimeNames = '',dimeDerived = [];
								$.each(dimeFilesChecked,function (k) {
									dimeNames += dimeFilesChecked.eq(k).parents(".list-group-item").find(".modifyName").val();
									dimeNames += ",";
									dimeDerived.push(dimeFilesChecked.eq(k).siblings('span').html());
								});
								dime.name = dimeNames.substring(0,dimeNames.length-1);
								dime.derived = dimeDerived;
							}
							mulDatas.dimensions.push(dime);
							
						}else {
							for(var h = 0,checkedDimesTables = checkedDimTable.length;h < checkedDimesTables;h++){
								var dimes = {
								      "name": "",  //维度名称
								      "table": "",  //维度列所在的表名称 (格式为 数据库名.表名 大写)
								      "column": "{FK}",  //如果选择了非事实表的字段,此属性值为{FK},如果选择的是事实表中的字段,此属性值为具体的字段英文名称 大写
								      "derived": []
								};

								dimes.table = $(".allDimeChecked_"+h).siblings('span').html();
								
								var dimesTablesCheckeds = $(".dimestionTable_"+h).find("input[type = 'checkbox']:checked");
								if(dimesTablesCheckeds.length == 1) {
									dimes.name = dimesTablesCheckeds.parents(".list-group-item").find(".modifyName").val();
									dimes.derived.push(dimesTablesCheckeds.siblings('span').html());
									
								}else {
									var dimesNames = '',dimesDeriveds = [];
									$.each(dimesTablesCheckeds,function (m) {
										dimesNames += dimesTablesCheckeds.eq(m).parents(".list-group-item").find(".modifyName").val();
										dimesNames += ",";
										dimesDeriveds.push(dimesTablesCheckeds.eq(m).siblings('span').html());
									});
									dimes.name = dimesNames.substring(0,dimesNames.length - 1);
									dimes.derived = dimesDeriveds;
								}

								mulDatas.dimensions.push(dimes);
							}
						}
						// $("input[type='checkbox']:checked")这样写可以，但是(".diemsWrapper").find("input[type ='checkbox']:checked")
						// 不可以，
						// // 只选择事实表的情况
					}else if(!$(".diemsWrapper").find("input[type ='checkbox']").is(":checked")){
						var factsName = $(".factTable").find("input[type = 'checkbox']:checked");
						
						var factsLen = factsName.length;
						if(factsLen == 1) {
							var fact = {
								"name": "", 
						        "table": "",  
						        "column": "", 
							    "derived": null
							}

							fact.name = factsName.parents(".list-group-item").find(".modifyName").val();
							fact.table = $("#allFactChecked").siblings('.factTableName').html();
							fact.column = factsName.siblings('span').html();
							mulDatas.dimensions.push(fact);
							
						}else {
							$.each(factsName,function (i) {
								var factsNameHtml = '';
								var factsCol = '';

								var facts = {
									"name": "", 
								      "table": "",  
								      "column": "", 
								      "derived": null
								}
								
								factsNameHtml += factsName.eq(i).parents(".list-group-item").find(".modifyName").val();
								factsCol += factsName.eq(i).siblings('span').html();

								facts.table = $("#allFactChecked").siblings('span').html();
								facts.name = factsNameHtml;
								facts.column = factsCol;
								mulDatas.dimensions.push(facts);
							})

						}
						// 都选的情况
					}else {
						var outherFactsName = $(".factTable").find("input[type = 'checkbox']:checked");
						
						var factsLen = outherFactsName.length;
						if(factsLen == 1) {
							var fact = {
								"name": "", 
						        "table": "",  
						        "column": "", 
							    "derived": null
							}

							fact.name = outherFactsName.parents(".list-group-item").find(".modifyName").val();
							fact.table = $("#allFactChecked").siblings('.factTableName').html();
							fact.column = outherFactsName.siblings('span').html();
							mulDatas.dimensions.push(fact);
							
						}else {
							$.each(outherFactsName,function (i) {
								var factsNameHtml = '';
								var factsCol = '';

								var facts = {
									"name": "", 
								      "table": "",  
								      "column": "", 
								      "derived": null
								}
								
								factsNameHtml += outherFactsName.eq(i).parents(".list-group-item").find(".modifyName").val();
								factsCol += outherFactsName.eq(i).siblings('span').html();

								facts.table = $("#allFactChecked").siblings('span').html();
								facts.name = factsNameHtml;
								facts.column = factsCol;
								mulDatas.dimensions.push(facts);
							})

						}
						var dimeTableLen = $(".dimestionTable").length;
						
						var checkedDimTable = [];
						for(var j = 0;j < dimeTableLen;j++) {
							if($(".dimestionTable").eq(j).find("input[type ='checkbox']").is(":checked")) {
								checkedDimTable.push($(".dimestionTable").eq(j).attr("index"));
							}
						}
						// 选择一个维度表时
						if(checkedDimTable.length == 1) {
							var dime = {
							      "name": "",  //维度名称
							      "table": "",  //维度列所在的表名称 (格式为 数据库名.表名 大写)
							      "column": "{FK}",  //如果选择了非事实表的字段,此属性值为{FK},如果选择的是事实表中的字段,此属性值为具体的字段英文名称 大写
							      "derived": []
							}

							dime.table = $(".allDimeChecked_"+checkedDimTable[0]).siblings("span").html();
							var dimeFilesChecked = $(".dimestionTable_"+checkedDimTable[0]).find("input[type = 'checkbox']:checked");
							if(dimeFilesChecked.length == 1){
								dime.name = dimeFilesChecked.parents(".list-group-item").find(".modifyName").val();
								dime.derived.push(dimeFilesChecked.siblings('span').html());
							}else {
								var dimeNames = '',dimeDerived = [];
								$.each(dimeFilesChecked,function (k) {
									dimeNames += dimeFilesChecked.eq(k).parents(".list-group-item").find(".modifyName").val();
									dimeNames += ",";
									dimeDerived.push(dimeFilesChecked.eq(k).siblings('span').html());
								});
								
								dime.name = dimeNames.substring(0,dimeNames.length - 1);
								dime.derived = dimeDerived;
							}
							mulDatas.dimensions.push(dime);

						}else {

							for(var h = 0,checkedDimesTables = checkedDimTable.length;h < checkedDimesTables;h++){
								var dimes = {
								      "name": "",  //维度名称
								      "table": "",  //维度列所在的表名称 (格式为 数据库名.表名 大写)
								      "column": "{FK}",  //如果选择了非事实表的字段,此属性值为{FK},如果选择的是事实表中的字段,此属性值为具体的字段英文名称 大写
								      "derived": []
								};

								dimes.table = $(".allDimeChecked_"+h).siblings('span').html();
								
								var dimesTablesCheckeds = $(".dimestionTable_"+h).find("input[type = 'checkbox']:checked");
								if(dimesTablesCheckeds.length == 1) {
									dimes.name = dimesTablesCheckeds.parents(".list-group-item").find(".modifyName").val();
									dimes.derived.push(dimesTablesCheckeds.siblings('span').html());
								}else {
									var dimesNames = '',dimesDeriveds = [];
									$.each(dimesTablesCheckeds,function (m) {
										dimesNames += dimesTablesCheckeds.eq(m).parents(".list-group-item").find(".modifyName").val();
										dimesNames += ",";
										dimesDeriveds.push(dimesTablesCheckeds.eq(m).siblings('span').html());
									});

									dimes.name = dimesNames.substring(0,dimesNames.length - 1);
									dimes.derived = dimesDeriveds;
								}

								mulDatas.dimensions.push(dimes);
							}
						}
					}

					//measure 
					$.each(measureList,function (g) {
						var eachMeasure = measureList.eq(g);
						var measuresHtmls = {
							"name": "",   //指标名称
						      "function": {     //指标计算函数属性
						        "expression": "",    //选择的具体计算函数名称(前台下拉框中固定为以下值:SUM, MAX, MIN)
						        "parameter": {       //属性存放具体函数的参数
						          "type": "",  //如果选择函数名称为SUM,MAX,MIN 则此属性值为column,如果是页面默认的COUNT函数,此属性值为constant
						          "value": ""
						        },
						        "returntype": ""    //选择的具体列名称  大写
					        }
						};

						measuresHtmls.name = eachMeasure.find(".allMeasureName").html();
						measuresHtmls.function.expression = eachMeasure.find(".allMeasureCount").html();
						if(g == 0) {
							measuresHtmls.function.parameter.type = 'constant';
							measuresHtmls.function.parameter.value = '1';
							measuresHtmls.function.returntype = 'bigint';
						}else {
							measuresHtmls.function.parameter.type = "column";
							measuresHtmls.function.parameter.value = eachMeasure.find(".allMeasureFile").html();
							measuresHtmls.function.returntype = eachMeasure.find(".allMeasureType").html();
						}
						mulDatas.measures.push(measuresHtmls);
						
					})

					if(currentLocation.indexOf("?edit=") == -1) {
						var commitDime = DatamodelStore.commitDimeData(mulDatas);
						if(commitDime){
							commitDime.complete(function(){
								$(".mask").hide();
								commitDime.success(function (response){
									if(response.success){
										$('#prompTips .tipCont').html("保存成功");
										$('#prompTips').modal("show");
											setTimeout(function () {
												window.location="../dbSpeedDone/dbSpeedDone.html";
											},1000)
									}else {
										$('#prompTips .tipCont').html(response.message);
										$('#prompTips').modal("show");
										mulDatas = {
										    "name": "",   //多维数据集名称
										    "description": "",  //多维数据集描述
										    "model_name": "",  //关联模型名称
										    'factTableName':'',
										    "dimensions": [],
										    "measures": []
										};
									}
								})
							})
						}
					}else {
						var modifyCommit = DatamodelStore.modifyCommitDime(mulDatas);
						if(modifyCommit) {
							modifyCommit.complete(function () {
								$(".mask").hide();
								modifyCommit.success(function (response) {
									if(response.success) {
										$('#prompTips .tipCont').html("修改成功");
										$('#prompTips').modal("show");
										setTimeout(function () {
											window.location="../dbSpeedDone/dbSpeedDone.html";
										},1000);
									}else {
										$('#prompTips .tipCont').html(response.message);
										$('#prompTips').modal("show");
										mulDatas = {
										    "name": "",   //多维数据集名称
										    "description": "",  //多维数据集描述
										    "model_name": "",  //关联模型名称
										    'factTableName':'',
										    "dimensions": [],
										    "measures": []
										};
									}
								})
							})
						}
					}
				})

				
			}
	 	}
		new DbProgress();
	})(jQuery);
})

