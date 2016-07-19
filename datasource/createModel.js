/**********************************************************

create by zhangzhicheng  
date          2016-5-16
    
新建模型页面js    

**********************************************************/


var $j = window.$j || {};

(function(){


	var catchGuanLianMsg = {};

	var catchWeiDuJiLiangMsg = {};

	var fieldType = ['tinyint','smallint','integer','bigint','float','double','decimal','real','numeric'];


	function createModel(){

		this.weibiaomsg = {};

		this.mainDb = '';
		this.mainTableName = '';
		this.mainTableStruct = null;
		this.mainTableList = null;

		// this.db = '';
		// this.tableName = '';
		this.tableList = null;
		// this.tableStruct = null;


		this.edit = "";
		this.editJson = null;
		this.postJson = null;
		this.step = 1;

		this.step3list = [];

		this.init();
		// var me = this;
		// setTimeout(function(){
		// 	me.createModel("a13333");
		// },1000)
	}

	createModel.prototype.emptyhtml = function() {
		$("#next").val("下一步");
		$("#pre").addClass('hide');
		$("#second tbody tr").last().siblings().remove();
		$("#weiduziduan").empty();
		$("#zhibiaoziduan").empty();
		$("#modelname").val('');
		$('.step-lst>li').removeClass('step-pass2').first().addClass('step-pass2');
		$("#first").removeClass('hidden').siblings('#second,#third').addClass('hidden');

	}

	createModel.prototype.step1 = function  () {

		var name = $.trim($("#modelname").val());
		var me = this;
		var fq = $("#fenqu").val();
		var t = $("#dt").val();

		if(!name){
			$j.dataorigin.getIns().getlayer().showmodal2('请输入模型名称');
			return false;
		}else if(!(/^\w+$/.test(name))){
			$j.dataorigin.getIns().getlayer().showmodal2('模型名称请用数字字母下划线');
			return false;
		}
		if(fq && !t){
			$j.dataorigin.getIns().getlayer().showmodal2('请选择日期格式');
			return false;
		}
		$("#second").removeClass('hidden').siblings("#first,#third").addClass('hidden');

		me.postJson.name = name;

		if(fq){
			me.postJson.partition_desc = {
				partition_date_format:t,
				partition_date_column:me.mainDb.toUpperCase()+"."+me.mainTableName.toUpperCase()+"."+fq.toUpperCase()
			}
		}else{
			me.postJson.partition_desc = null;
		}
		$("#pre").removeClass('hide');
		$('.step-lst>li').eq(1).addClass('step-pass2');
		this.step ++ ;	
	}

	createModel.prototype.step2 = function  () {
		  var me = this;
		  me.step3list = [];
		  var list = $(".relativelist");
	 	  var lookups = [];
	 	  var isstep = true;
	 	 
		  if(list.length){
		  	 list.each(function(index, el) {
		  	 	var table = $(el).children('td').eq(3).find('option:selected').val();
	  	 		var item = {};
	  	 		var f1 =[];
	  	 		var f2 = [];
		  	 	var t = true;
		  	 	if(table){
		  	 		var p1 = $(el).children('td').eq(0).children('select');
		  	 		var p2 = $(el).children('td').eq(4).children('select');
		  	 		p1.each(function(index, el) {
		  	 			var option = p1.eq(index).find('option:selected');
		  	 			var option2 = p2.eq(index).find('option:selected');
		  	 			if(option.attr("data-type") == option2.attr("data-type")){
		  	 				var v1 = option.val();
		  	 				var v2 = option2.val();
		  	 				var ix = f1.indexOf(v1);
		  	 				if(ix != -1 && v2 == f2[ix]){
				  	 			$j.dataorigin.getIns().getlayer().showmodal2('同一个为表中有重复关联字段');
				  	 			t = false;
				  	 			return false;
				  	 		}else{
		  	 					f1.push(v1);
		  	 					f2.push(v2);
				  	 		}
		  	 			}else{
		  	 				$j.dataorigin.getIns().getlayer().showmodal2('类型不匹配');
		  	 				t = false;
		  	 				return false;
		  	 			}
		  	 		});
			  	 	if(!t){
			  	 		isstep = false;
			  	 		return false;
			  	 	}else if(f1.length){


			  	 		var db = $(el).children('td').eq(2).find('option:selected').text().toUpperCase();
			  	 		table = table.toUpperCase();
			  	 		item.table = db+"."+table;

			  	 		var isexit = false;

			  	 		$.each(lookups, function(index, val) {
			  	 			 if(val.table == item.table){
			  	 			 	isexit = true;
			  	 			 	return false;
			  	 			 }
			  	 		});

			  	 		if(!isexit){
				  	 		item.join = {
				  	 			type : $(el).children('td').eq(1).find('option:selected').text(),
				  	 			primary_key:f2,
				  	 			foreign_key:f1
				  	 		};
				  	 		lookups.push(item);

				  	 		//获取第3步数据

				  	 		// var optionlist = $(el).children('td').eq(4).find('select:first option');
				  	 		// // me.step3list = [];
				  	 		// var obj = {
				  	 		// 	table:item.table,
				  	 		// 	list:[]
				  	 		// }
				  	 		// optionlist.each(function(index, el) {
				  	 		// 	 obj.list.push({
				  	 		// 	 	// table  : item.table,
				  	 		// 	 	ziduan : $(el).val(),
				  	 		// 	 	type   : $(el).attr("data-type")
				  	 		// 	 })
				  	 		// });

				  	 		me.step3list.push(catchGuanLianMsg[item.table]);

			  	 		}else{
			  	 			$j.dataorigin.getIns().getlayer().showmodal2('同一个为表中的字段请在一个新建关联中进行');
			  	 			isstep = false;
			  	 			return false;
			  	 		}
			  	 	}
		  	 	}else{
		  	 		$j.dataorigin.getIns().getlayer().showmodal2('请选择维表以及相关字段');
		  	 		isstep = false;
		  	 		return false;
		  	 	}
		  	 });
		  }

		  if(isstep){

		  	me.postJson.lookups = lookups;
		  	
		  	
		  	me.intostep3();
		  }else{
		  	return false;
		  }
	}

	createModel.prototype.intostep3 = function  () {
		//进入第3个页面

		$('.step-lst>li').eq(2).addClass('step-pass2');

		$("#next").val("保存");
		var me  = this;
		var mainstruct = me.mainTableStruct;
		var type = ['tinyint','smallint','integer','bigint','float','double','decimal','real','numeric'];
		var weidulist = me.step3list;
		var zhibiaolist = [];
		var table =   me.mainDb.toUpperCase() + "." + me.mainTableName.toUpperCase();

		var obj = [];
		var obj2 = [];
  	 	// obj.columns = [];
  	 	// obj2.columns = [];

		$.each(mainstruct.data, function(index, val) {
			var index = type.indexOf(val.dataType);
			if(index == -1){
				obj.push(val);
			}else{
				obj2.push(val);
			}
		});

		if(obj.length){
			weidulist.unshift(obj);
		}

		if(obj2.length){
			zhibiaolist.push(obj2);
		}

		// debugger;


		function htmlStr(data){
			var str = '';
			var table;
			$.each(data, function(index, val) {

				var id = (val.table +'.'+ val.column).toUpperCase();
				catchWeiDuJiLiangMsg[id]  = val;
				var dataType = val.dataType ;
				var column = val.column;
				str +=   '<li style="height:30px">'+
						 '	<div class="checkbox">'+
						 '		<label>'+
						 '			<input type="checkbox" data-id="'+ id +'"> ' + column + '(' + dataType + ')' +
						 '		</label>'+
						 '		<button style="display:none;">转为维度</button>'+
						 '		<div class="pull-right" style="width:30%">'+
						 '				<div class="input-group">'+
						 '					<input type="text" class="form-control addModifyName" value="'+ val.name+'" disabled >'+
						 '					<span class="input-group-addon btn-success"> <i class="iconfont2 fs-18"></i>'+
						 '						<span class="add-ok">确定</span>'+
						 '					</span>'+
						 '				</div>'+
						 '		</div>'+
						 '	</div>'+
						 '</li>';
				table = val.table;		 
			});

			if(!table){
				table = data.database + '.' + data.name;
			}

			str = 	'<li>'+
					'	<h5>'+
					'		<div class="checkbox">'+
					'			<label>'+
					'				<input type="checkbox" data-id="'+table+'"> ' + table +
					'			</label>'+
					'		</div>	'+
					'	</h5>'+
					'	<ul style="padding-left:20px">'+
						str +
					'	</ul>'+
					'</li>';
			return str;
		}

		var str = "";
		$.each(weidulist, function(index, val) {

			str +=	htmlStr(val);
				// '<li class="list-group-item bd-none">'+
				// '    <div class="checkbox">'+
				// '        <label>'+
				// '            <input type="checkbox" value="'+val.ziduan+'" data-type="'+val.type+'" data-table="'+val.table+'">'+
				// 					val.ziduan+ '(' + val.type + ')' +
				// '        </label>'+
				// '        <div class="pull-right">'+val.table+'</div>'+
				// '    </div>'+
				// '</li>';
			
		});

		$("#weiduziduan").html(str);

		var str = "";	

		$.each(zhibiaolist, function(index, val) {
			 str += htmlStr(val);
 					// '<li class="list-group-item bd-none">'+
 					// '    <div class="checkbox">'+
 					// '        <label>'+
 					// '            <input type="checkbox" value="'+val.ziduan+'" data-type="'+val.type+'" data-table="'+val.table+'">'+
 					// 					val.ziduan+ '(' + val.type + ')' +
 					// '        </label>'+
 					// '        <div class="pull-right">'+val.table+'</div>'+
 					// '    </div>'+
 					// '</li>';

		});

		$("#zhibiaoziduan").html(str);

		edit();
		function edit(){
			if(me.edit){
				var arr = [];
				var lkups = me.postJson.lookups;
				var dim = me.editJson.data.dimensions;
				for (var i = 0; i < lkups.length; i++) {
					var ii = lkups[i]
					for (var j = 0; j < dim.length; j++) {
						var jj = dim[j];
						if(jj.table == ii.table){
							arr.push(jj);
							break;
						}
					}
				}

				for (var j = 0; j < dim.length; j++) {
					var jj = dim[j];
					if(jj.table == table){
						arr.push(jj);
						break;
					}
				}

				for (var i = 0; i < arr.length; i++) {
					var ii = arr[i];
					for (var j = 0; j < ii.columns.length; j++) {
						var jj = ii.columns[j];
						var ele = $('#third input[data-id="'+ii.table+'.'+jj+'"]');
						ele.prop('checked', true);
						if(ii.columnNames && ii.columnNames.length){
							ele.closest('li').find('input[type="text"]').val(ii.columnNames[j]);
						}
						if(ii.table == table ){
							var dataType = catchWeiDuJiLiangMsg[ele.attr('data-id')].dataType;
							if(fieldType.indexOf(dataType) != -1){
								// ele.closest('li').appendTo('#weiduziduan');
								toWeiDu(ele);
							}
						}
					}
				}
				var metrics = me.editJson.data.metrics;
				var metricNames = me.editJson.data.metricNames;
				for (var i = 0; i < metrics.length; i++) {
					var ii = metrics[i];
					var data_id = (table + '.' + ii).toUpperCase();
					var $ele = $('#zhibiaoziduan input[data-id="'+ data_id +'"]');
					$ele.prop('checked', true);
					if(metricNames && metricNames.length){
						$ele.closest('li').find('input[type="text"]').val(metricNames[i]);
					}
				}
				scanCheck();
				function scanCheck(){
					var $li = $('#third li');
					$li.each(function(index, el) {
						var $this = $(el);
						var len1 = $this.find('ul input[type="checkbox"]:checked').length;
						var len2 = $this.find('ul input[type="checkbox"]').length;

						if(len1 == len2){
							$this.find('h5 input[type="checkbox"]').prop('checked', true);
						}
					});
				}
			}
		}

		$("#third").removeClass('hidden').siblings('#first,#second').addClass('hidden');
		this.step ++ ;
	}

	function toWeiDu($this){
		var curTable = $.trim($this.closest('ul').prev().text()).toUpperCase();
		var table = $.trim($('#weiduziduan li:first').find('h5 label').text()).toUpperCase();

		if(curTable == table){
			$this.closest('li').appendTo('#weiduziduan li:first ul');
		}else{
			var $e = $this.closest('ul').parent().clone();
			$e.find('ul').empty().append($this.closest('li'));
			$('#weiduziduan').prepend($e);
		}
	}

	createModel.prototype.step3 = function  () {


		function domToData ($this){
			
			var text = $.trim( $this.parent().text() );
			var ix1 = text.indexOf('('),
				ix2 = text.lastIndexOf(')');

			var field = text.substring(0,ix1),
				dataType = text.substring(ix1+1,ix2);
			var val = $.trim(  $this.closest('li').find('input[type="text"]').val()  );	
			if(!val){
				val = field;
			}
			return {
				field : field,
				dataType:dataType,
				val:val
			}
		}

		var me =this;
		//
		var weidulist =  $('#weiduziduan li ul li input:checked');
		var zhibiaolist =  $('#zhibiaoziduan li ul li input:checked');
		if(weidulist.length && zhibiaolist.length){
			var w = [];
			var z = [];

			var metricNames = [];
			var metricColumnTypes = [];

			

			// var c =[];
			var a = {};

			weidulist.each(function(index, el) {
				var $this = $(this);
				var t = $.trim($this.closest('ul').prev().find('label').text());
				var obj = domToData($this);
				if(!a[t]){
					a[t] = {
						table:t,
						columns: [],
						columnNames:[],
						columnTypes:[]
					};	
					w.push(a[t])
				}

				a[t].columns.push(obj.field);	
				a[t].columnNames.push(obj.val);	
				a[t].columnTypes.push(obj.dataType);
			});

			zhibiaolist.each(function(index, el) {
				var $this = $(this);
				var obj = domToData($this);
				z.push(obj.field);
				metricNames.push(obj.val);
				metricColumnTypes.push(obj.dataType);
			});


			me.postJson.dimensions = w;
			me.postJson.metrics = z;
			me.postJson.metricNames = metricNames;
			me.postJson.metricColumnTypes = metricColumnTypes;

			// console.log(me.postJson);

			// return false;



			var url = AbstractStore.APP_URL+"cube/saveModel.do";
			var type = "post";
			if(me.edit){
				var url = AbstractStore.APP_URL+"cube/updateModel.do";
				type = "put";
			}


			$.loadingAjax({
			   type: type,
			   url: url,
			   data: JSON.stringify(me.postJson),
			   dataType:"json",
			   contentType: 'application/json'
			},function(msg){
		    	$j.dataorigin.getIns().getlayer().showmodal2('保存完成');
		    	setTimeout(function(){
					window.location = '../datamodel/datamodel.html';
		    	}, 1000)
			})
		}else{
			$j.dataorigin.getIns().getlayer().showmodal2('指标和维度两个都至少选一个字段');
		}
	}

	createModel.prototype.pre2 = function  () {
		 this.step -- ;
		 $('.step-lst>li').eq(2).removeClass('step-pass2');
		$("#first").removeClass('hidden').siblings('#second,#third').addClass('hidden');
		$("#pre").addClass('hide');
	}

	createModel.prototype.pre3 = function  () {
		$('.step-lst>li').eq(2).removeClass('step-pass2');
		this.step -- ;
		$("#next").val("下一步");
		$("#second").removeClass('hidden').siblings('#first,#third').addClass('hidden');
	}
	createModel.prototype.init = function() {
		var me = this;
		$("#cancelcreate").click(function(event) {
			if(edit){
				window.location = '../datamodel/datamodel.html';
			}else{
				me.emptyhtml();
				me.hide();
			}
		});

		$("#next").click(function() {
			if(me.step == 1){
				me.step1();
			}else if(me.step ==2){
				me.step2();
			}else if(me.step == 3){
				me.step3();
			}
		});

		$("#pre").click(function() {
			if(me.step == 2){
				me.pre2();
			}else if(me.step ==3){
				me.pre3();
			}
		});
		var edit = this.edit = $.getUrlParam("edit");
		if(edit){
			//编辑状态
			$.ajax({
			   type: "get",
			   url: AbstractStore.APP_URL+'cube/'+edit+'/model_desc.do',
			   dataType:"json"
			}).done(function(msg){
			    if(msg.success){
			    	me.editJson = msg;
					me.editModel();
			    }else{
			        alert(msg.message);
			    }
			});
			me.show();
		}
		this.step2bind();
		this.step3bind();
	};

	createModel.prototype.isadd = function($this) {
		var $f = $this.closest('tr');
		$f.children('td').eq(4).find('select').empty();
	}	

	createModel.prototype.gettables = function($this) {
		var me = this;
		if($this){
			var db = $this.find("option:selected").text();
		}else{
			var db = this.mainDb;
		}
		//var url = AbstractStore.APP_URL+ db + '/tables.do?status=LINKED&pageIndex=1&pageSize=1000';
		var url = AbstractStore.APP_URL+ db + '/tables_new.do';
		//var url = '/datafun-web/' + db + '/tables.do?status=LINKED&pageIndex=1&pageSize=1000';

		var def = $.loadingAjax({
		   type: "get",
		   url: url,
		   dataType:"json"
		},function(msg){
			if($this){
	    		if(db == me.mainDb){
	    			me.tablelist = me.mainTableList;
	    		}else{
		    		me.tablelist = msg;
	    		}
		    	var str = me.createtables(me.tablelist);
		    	$this.closest('tr').children('td').eq(3).find('select').html(str);
	    	}else{
	    		me.mainTableList = msg;
	    		$.each(msg.data, function(index, val) {
	    			if(val.tableName == me.mainTableName){
	    				msg.data.splice(index, 1);
	    				return false;
	    			}
	    		});
	    	}
		})

		return def;
    	
	}

	createModel.prototype.createtables = function(tablelist){
		var tablestr = '<option value="">请选择数据表</option>';
		$.each(tablelist.data, function(index, val) {
			tablestr += '<option value="'+val.tableName+'">'+ val.tableName +'</option>';
		});
		return tablestr;
	}

	createModel.prototype.createstruct = function(fieldlist){
		var fieldstr = '';
		$.each(fieldlist.data, function(index, val) {
			fieldstr += '<option value="'+val.name+'" data-type="'+val.dataType+'">'+ val.name 
			+'('+ val.dataType + ')'+'</option>';
		});
		return fieldstr;
	}

	createModel.prototype.getstruct = function($this) {

		var me = this;
		if($this){
			var db = $this.closest('tr').children('td').eq(2).find("option:selected").text();
			var tablename = $this.val();
		}else{
			var db = this.mainDb;
			var tablename = me.mainTableName;
		}

		// var url = AbstractStore.APP_URL+db+"/tables/"+tablename+"/meta.do";
		var url = AbstractStore.APP_URL+db+"/tables/"+tablename+"/metadata.do"; 


		var def = $.loadingAjax({
		   type: "get",
		   url: url,
		   dataType:"json"
		},function(msg){
			if($this){
				 var data = msg.data;
				 var tb = data[0].table.toUpperCase();
				 catchGuanLianMsg[tb] = data;
				 var str = me.createstruct(msg);
				 $this.closest('tr').children('td').eq(4).find('select').html(str);
	    	 }else{
	    	 	 me.mainTableStruct = msg;
	    	 	 me.rendermainTableStruct();
	    	 }
		})
    	return def;
	}

	createModel.prototype.stepinit = function() {
		var me = this;
		var ej = this.editJson;
		if(ej.data.partition_desc){
			$("#fenqu").val(ej.data.partition_desc.partition_date_column);
			$("#dt").val(ej.data.partition_desc.partition_date_format);
		}
		$("#modelname").prop('readonly',true).val(ej.data.name);

		var lookups = ej.data.lookups;
		if(lookups.length){
			var ms = me.mainTableStruct;
			var divstr = "";
			for (var i = 0; i < lookups.length; i++) {
				var ii = lookups[i];
				var s ; 
				$.each(ej.metadata, function(index, val) {
					 if(val.name == ii.table){
					 	s = val;
					 	return false;
					 }
				});

				var fo = ii.join.foreign_key;
				var pr = ii.join.primary_key;

				var optionstr1 = "";
				var optionstr2 = "";
				var optionstr3 = "";


				for (var j = 0; j < fo.length; j++) {
					var jj = fo[j];
					var prjj = pr[j];

					optionstr1 += "<select  class='form-control mgb-15'>";
					optionstr2 += "<select class='form-control mgb-15'>";

					for (var y = 0; y < ms.data.length; y++) {
						var yy = ms.data[y];
						if(yy.column.toUpperCase() == jj){
							optionstr1 += "<option data-type='"+yy.dataType+"' selected='selected' value='"+yy.name+"'>"+yy.name + "("+yy.dataType+")"+"</option>";
						}else{
							optionstr1 += "<option data-type='"+yy.dataType+"' value='"+yy.name+"'>"+yy.name + "("+yy.dataType+")"+"</option>";
						}
					}
					for (var x = 0; x < s.columns.length; x++) {
						var xx = s.columns[x];
						if(xx.column == prjj){
							optionstr2 += "<option data-type='"+xx.dataType+"' selected='selected' value='"+xx.name+"'>"+xx.name + "("+xx.dataType+")"+"</option>";
						}else{
							optionstr2 += "<option data-type='"+xx.dataType+"'  value='"+xx.name+"'>"+xx.name + "("+xx.dataType+")"+"</option>";
						}
					}

					optionstr1 += "</select>";
					optionstr2 += "</select>";
					if(j == fo.length-1){
						optionstr3 += 
						'<div class="form-item"><a href="javascript:;" class="text-blue fs-18 deletfield"><i class="iconfont2">&#xe616;</i></a> <a href="javascript:;" class="text-blue fs-18 addfield"><i class="iconfont2">&#xe63e;</i></a></div>';
					}else{
						optionstr3 += 
						'<div class="form-item"><a href="javascript:;" class="text-blue fs-18 deletfield"><i class="iconfont2">&#xe616;</i></a> </div>';
					}
				}

				if(ii.join.type == 'inner'){
					opstr = '<option selected="selected" value="">inner</option>'+
							'<option value="">left</option>'
				}else{
					opstr = '<option value="">inner</option>'+
							'<option selected="selected" value="">left</option>'
				}


				var dblist = $j.dataorigin.getIns().getswitchDB().dblist;
				var dbstr = '';
				var db = ii.table.split(".")[0].toLowerCase();
				$.each(dblist, function(index, val) {
					if(val == db){
						dbstr += '<option value="'+val+'" selected="selected">'+ val +'</option>';
					}else{
						dbstr += '<option value="'+val+'">'+ val +'</option>';
					}
				});
				var table = ii.table.split(".")[1].toLowerCase();


				var tablelist ;

				if(db == me.mainDb){
					tablelist = me.mainTableList.data;
				}else{
					$.each(me.relateDBtables, function(index, val) {
						 if(val.data[0].dbName == db){
						 	tablelist = val.data;
						 	return false;
						 }
					});
				}


				var tablestr = '<option value="">请选择数据表</option>';
				$.each(tablelist, function(index, val) {
					if(table == val.tableName){
						tablestr += '<option selected="selected" value="'+val.tableName+'">'+ val.tableName +'</option>';
					}else{
						tablestr += '<option value="'+val.tableName+'">'+ val.tableName +'</option>';
					}
				});

				divstr += 
				' <tr class="relativelist">'+
				'     <td>'+
							optionstr1 +
				'     </td>'+
				'     <td><select class="form-control">'+
							opstr +
				'      </select></td>'+
				'     <td><select class="form-control dblist">'+
							 dbstr+
				'         </select></td>'+
				'     <td><select class="form-control tablelist">'+
							tablestr +
				'         </select></td>'+
				'     <td>'+
							optionstr2+
				'     </td>'+
				'     <td>'+
							optionstr3 +
				'     </td>'+
				'</tr>';

			}
			$("#addrelation").closest('tr').before(divstr);
		}
		
	}

	createModel.prototype.step3bind = function() {


		var me = this;

		$('#weiduziduan').on('mouseenter','li ul li',function(e){
			var $this = $(this);
			var maintable = me.mainDb.toUpperCase() + "." +me.mainTableName.toUpperCase();
			var curTable = $.trim($this.closest('ul').prev().text()).toUpperCase();
			if(maintable == curTable){
				var curType = $this.find('label').text();
				var ix1 = curType.indexOf('('),
					ix2 = curType.lastIndexOf(')');
				curType = curType.substring(ix1+1 ,ix2);
				var index = fieldType.indexOf(curType);
				if(index != -1){
					$this.find('button').html("转为指标").show();
				}
				
			}

		})

		$('#third').on('click','h5 label',function (e) {
			var $this = $(this);
			 $this.closest('h5').next().find('input[type="checkbox"]').prop('checked', $this.find('input').prop('checked'));
		})

		$('#third').on('click','ul li ul li label',function (e) {
			var $this = $(this);
			var $ul = $this.closest('ul');

			var len1 = $ul.find('input[type="checkbox"]:checked').length;
			var len2 = $ul.find('input[type="checkbox"]').length;

			if(len1 == len2){
				$ul.prev().find('input[type="checkbox"]').prop('checked', true);
			}else{
				$ul.prev().find('input[type="checkbox"]').prop('checked', false);
			}
		})

		$('#weiduziduan').on('mouseleave','li ul li',function(e){
			$(this).find('button').hide();
		})

		$('#weiduziduan').on('click','li ul li button',function(e){
			$(this).closest('li').appendTo('#zhibiaoziduan li ul');
		})

		$('#zhibiaoziduan').on('mouseenter','li ul li',function(e){
			$(this).find('button').html('转为维度').show();
		})

		$('#zhibiaoziduan').on('mouseleave','li ul li',function(e){
			$(this).find('button').hide();
		})

		$('#zhibiaoziduan').on('click','li ul li button',function(e){
			toWeiDu($(this));
		})

		$('#third').on('click','.input-group-addon',function (e) {
			var $this = $(this);
			$this.children('i').toggle();
			$this.children('span').toggle();
			var $prev = $this.prev('input')
			$prev.prop('disabled', !$prev.prop('disabled'));
		})




		
		// $('#turntozhibiao').click(function(event) {
		// 	var type = ['tinyint','smallint','integer','bigint','float','double','decimal','real','numeric'];

		// 	var cklist = $('#weiduziduan input:checked');
		// 	if(cklist.length){
		// 		cklist.each(function(index, el) {
		// 			var i = type.indexOf($(el).attr("data-type"));
		// 			var maintable = me.mainDb.toUpperCase() + "." +me.mainTableName.toUpperCase();
		// 			if(i != -1 && $(el).attr('data-table') == maintable){
		// 				$(el).closest('li').appendTo('#zhibiaoziduan');
		// 			}else{
		// 				$j.dataorigin.getIns().getlayer().showmodal2('指标字段必须为数字类型且属于事实表');
		// 				return false;
		// 			}
		// 		});
		// 	}
		// });

		// $('#turntoweidu').click(function(event) {
		// 	var cklist = $('#zhibiaoziduan input:checked');
		// 	cklist.each(function(index, el) {
				
		// 		$(el).closest('li').appendTo('#weiduziduan');
				
		// 	});
		// });
	}

	createModel.prototype.step2bind = function() {
		var me = this;
		$("#second").on('change','.dblist',function(){
			var $this = $(this);
			me.isadd($this);
			// me.db = $this.find("option:selected").text();
			me.gettables($this);
		})

		$("#second").on('change','.tablelist',function(){
			var $this = $(this);
			// me.isadd($this);
			var tableName = $this.find("option:selected").val();
			if(!tableName){
				me.isadd($this);
			}else{
				me.getstruct($this);
			}
		})

		$("#second").on('click','.deletfield',function(){
			var $this = $(this);
			var parent = $this.parent();
			var slen = parent.siblings().length;

			if(slen){
				var index22 = parent.index();
				var f = $this.closest('tr');
				var list = [f.children('td').eq(0),f.children('td').eq(4)]
				$.each(list, function(index, val) {
					val.children('select').eq(index22).remove();
				});
				var $next = $this.next();
				if($next.is('.addfield')){
					parent.siblings().last().find('.deletfield').after($next);
				}
				parent.remove();
			}else{
				$this.closest('tr').remove();
			}
		})

		// $("#second").on('click','.deletrelative',function(){
		// 	$(this).closest('tr').remove();
		// })


		$("#second").on('click','.addfield',function(){
			var $this = $(this);
			var $f = $this.closest('tr');
			var list = [$f.children('td').eq(0),$f.children('td').eq(4)]
			$.each(list,function(a,b){
				var $p = b.children("select").last();
				$p.after($p.clone());
			})
			var $p = $f.children('td').eq(5).children('div').last();
			$p.after('<div class="form-item"><a href="javascript:;" class="text-blue fs-18 deletfield"><i class="iconfont2">&#xe616;</i></a> <a href="javascript:;" class="text-blue fs-18 addfield"><i class="iconfont2">&#xe63e;</i></a></div>');

			$this.remove();
		})

		$("#addrelation").click(function(event) {
			me.addrelation($(this));
		});
	};
	createModel.prototype.addrelation = function(target){
		var me = this;
		var dblist = $j.dataorigin.getIns().getswitchDB().dblist;

		var tablelist = this.mainTableList;

		var fieldlist = me.mainTableStruct;

		var fieldstr = me.createstruct(fieldlist);
		var tablestr = me.createtables(tablelist);

		var dbstr = '';
		$.each(dblist, function(index, val) {
			if(val == me.mainDb){
				dbstr += '<option value="'+val+'" selected="selected">'+ val +'</option>';
			}else{
				dbstr += '<option value="'+val+'">'+ val +'</option>';
			}
		});

		var str =

			' <tr class="relativelist">' +
			'      <td>' +
			'            <select class="form-control mgbt-15">' +
							fieldstr +
			'            </select>' +
			'      </td>' +
			'      <td><select class="form-control mgbt-15">' +
			'            <option value="">inner</option>' +
			'            <option value="">left</option>' +
			'       </select></td>' +
			'      <td><select class="form-control dblist mgbt-15">' +
						dbstr +
			'          </select></td>' +
			'      <td><select class="form-control tablelist mgbt-15">' +
						tablestr +
			'      </select></td>' +
			'       <td>' +
			'            <select class="form-control mgbt-15">' +
			'            </select>' +
			'       </td>' +
			'      <td>' +
			'			<div class="form-item"><a href="javascript:;" class="text-blue fs-18 deletfield"><i class="iconfont2">&#xe616;</i></a> <a href="javascript:;" class="text-blue fs-18 addfield"><i class="iconfont2">&#xe63e;</i></a></div>' +
			'       </td>' +
			'</tr>';
		target.closest('tr').before(str);
	}

	createModel.prototype.rendermainTableStruct = function(msg){
		$('#maintablename').val(this.mainTableName);
		var fq = this.mainTableStruct.data.partitionKeys;
		var str = "<option value=''>请选择分区列</option>";
		if(fq && fq.length){
			$.each(fq, function(index, val) {
				str += '<option value="'+val+'">'+val+'</option>';
			});
		}
		$("#fenqu").html(str);
	}

	

	createModel.prototype.editModel = function() {
		var me = this;
		var ej = me.editJson.data;
		var arr = ej.fact_table.split('.');
		var db = arr[0].toLowerCase();

		this.step = 1;
		this.mainDb = db;
		// this.db = db;
		this.mainTableName = arr[1].toLowerCase();
		this.postJson = {
			name : "",
			description : "",
			lookups:[], //关联模型
			dimensions:[],
			metrics:[],
			fact_table:this.mainDb.toUpperCase() + "."+ this.mainTableName.toUpperCase(),
			partition_desc :null
		};
		var metadata = me.editJson.metadata;
		var idx ;
		$.each(metadata, function(index, val) {
			if(ej.fact_table == val.name){
				idx = index;
			}else{
				catchGuanLianMsg[val.name.toUpperCase()] = val.columns;
			}
		});
		metadata.splice(idx,1);

		me.relateDBtables = [];

		var rr = [];
		$.each(ej.lookups, function(index, val) {
			 var db2 = val.table.split('.')[0].toLowerCase();
			 var ix = rr.indexOf(db2);
			 if(ix == -1 && db2!=me.mainTableName){
			 	rr.push(db2);
			 }
		});

		me.relateDBs = rr.length;

		$.each(rr, function(index, val) {
			var url = AbstractStore.APP_URL+ val + '/tables.do?status=LINKED&pageIndex=1&pageSize=1000';
			$.ajax({
			   type: "get",
			   url: url,
			   dataType:"json"
			}).done(function(msg){
			    if(msg.success){
			    	me.relateDBtables.push(msg);
			    }else{
			        alert(msg.message);
			    }
			});
			 
		});

		$.when(this.getstruct(),this.gettables(),
			$.ajax({
			   type: "get",
			   url: AbstractStore.APP_URL+"db/getAllDBs.do",
			   dataType:"json"
			}).done(function(msg){
			    if(msg.success){
			       $j.dataorigin.getIns().getswitchDB().dblist = msg.data;
			    }else{
			        alert(msg.message)
			    }
			})

			).done(function(){
				function init(){
					if(me.relateDBtables.length == me.relateDBs){
						me.stepinit();
					}else{
						setTimeout(init,200);
					}
				}
				init();
		});

		// me.show();
	}

	createModel.prototype.createModel = function(tablename) {

		this.step = 1;
		var me = this;
		var db = $j.dataorigin.getIns().getswitchDB().getCurrentDB();
		this.mainDb = db;
		// this.db = db;
		this.mainTableName = tablename;

		this.postJson = {
			name : "",
			description : "",
			lookups:[], //关联模型
			dimensions:[],
			metrics:[],
			fact_table:this.mainDb.toUpperCase() + "."+ this.mainTableName.toUpperCase(),
			partition_desc :null
		};

		this.getstruct();
		this.gettables();
		me.show();
	};

	createModel.prototype.show = function() {
		$("#datasource").addClass('hide');
		$("#createModel").removeClass('hide');
	};

	createModel.prototype.hide = function() {
		$("#createModel").addClass('hide');
		$("#datasource").removeClass('hide');
	};

	$j.createModel = createModel;	
})()
