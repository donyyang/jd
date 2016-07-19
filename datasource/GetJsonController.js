/**
   ****************
   **********************
   ***************************getJson by dony
   **********************
   ****************
   **/

$(function () {
	$("#localFileIpt").fileupload({
		replaceFileInput: false,
        sequentialUploads: true,
        autoUpload: false,
        // dataType: 'json',
        url:"/upload/upload.do"
    });

	var getJsons = {
		init:function () {
			$(function () {

				getJsons.jump();
				getJsons.loadLocation();
				getJsons.allDatas();

			}).bind(getJsons);
		}(),

		jump:function () {
			var jump = new Jump();

			jump.init();
		},
		// 本地数据
		loadLocation:function () {
			var loactionData = new LaodFile();

			loactionData.changeFile();

		},
		
		// 所有的数据
		allDatas:function () {
			var allData = new AllDatas();

			allData.allDataInit();
		}
	}
})