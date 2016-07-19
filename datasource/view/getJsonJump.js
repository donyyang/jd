function Jump () {
}

Jump.prototype = {
	constructor:Jump,

	init:function () {
		this.progress();
		this.locationJump();
	},

	progress:function () {
		var that = this;

		$("#getJsonBtn").on("click",function () {
			$(".jsonOne").hide();
			$(".jsonTwo").show();
		});
	},

	locationJump:function () {
		$("#localFileIpt").on("click",function () {
			$(".jsonTwo").hide();
			$(".localdataWrapper").show();
		});

		/*$("#dcsframe").on("click",function () {
			$(".jsonTwo").hide();
			$(".dcsDataWrapper").show();
		});*/	
		$("#dcsframe").on("click",function () {
	        window.location.href = "./DCSData.html";
	    })

	    // 追加数据
	    $("#addDatas").on("click",function () {
            var tableName = $(this).attr("tableName"),
                dbBaseName = $(this).attr("dbBaseName");
            if(tableName == '' || dbBaseName == '') {
            	$('#prompTips .tipCont').html("请选择一个表");
				$('#prompTips').modal("show");
            	return;
            }
            
            window.open('./addData.html?'+tableName+'&'+dbBaseName+'','_self');
            // 在本窗口打开，可以使用window.opener的属性
            // window.open('./addData.html?dafadsf$we','_self');
        });

        // 创建工作表
        $("#createTable").on("click",function () {
        	var tableName = $(this).attr("tableName"),
        		dbBaseName = $(this).attr("dbBaseName");

        	if(tableName == '' || dbBaseName == '') {
            	$('#prompTips .tipCont').html("请选择一个表");
				$('#prompTips').modal("show");
            	return;
            }

            $(this).prop("href",'../worktable/app/index.html?type=hive&&name='+dbBaseName+'.'+tableName+'');
        })

        // 创建关联模型
        $("#createModel").on("click",function () {
        	var tableName = $(this).attr("tableName"),
        		dbBaseName = $(this).attr("dbBaseName");

        	if(tableName == '' || dbBaseName == '') {
            	$('#prompTips .tipCont').html("请选择一个表");
				$('#prompTips').modal("show");
            	return;
            }

            // $(this).prop("href",'../datasource/datasource.html?tableName='+tableName+'');
            window.open('../datasource/datasource.html?'+tableName+'&'+dbBaseName+'','_self')
        });

        // 點擊取消跳到本地數據那個頁面
        $("#cancelcreate").on("click",function () {
            console.log(213);
            location.href = '../datasource_new.html';
        })
	},
}
