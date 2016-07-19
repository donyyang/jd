(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2]; return null;
    }

    $.loadingAjax = function(options,fn,select){
    	$('#loading').removeClass('hide');
    	var def = $.ajax(options)
		    	   .done(function(data) {
			    		if(data.success){
			    			fn&&fn(data);
			    		}else{
			    			alert(data.message);
			    		}
			    	})
			    	.fail(function() {
			    		// alert("ajax fail error");
			    	})
			    	.always(function() {
			    		$('#loading').addClass('hide');
			    	});
		return def;	    	
    }

})(jQuery);