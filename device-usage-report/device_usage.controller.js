(function() {

   angular
      .module('app')
      .controller('DeviceUsageController', DeviceUsageController);

   DeviceUsageController.$inject = ['$scope', '$http'];
       
   function DeviceUsageController($scope, $http) {
    
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

	$scope.report_type = localStorage.getItem("report_type");
	$scope.range_type = localStorage.getItem("range_type");

	$scope.readable_start_date = localStorage.getItem("readable_start_date");
	$scope.readable_end_date = localStorage.getItem("readable_end_date");

	$scope.start_date = localStorage.getItem("start_date");
	$scope.end_date = localStorage.getItem("end_date");
   
	data_to_send = {
				'r_type': $scope.range_type,
	            'sdate' : $scope.start_date,
	            'edate' : $scope.end_date
	               };

//  Generate Column and Pie Charts for Device Usage	 

	 
	 $http.post("http://localhost/currentMiles/get-data/getDeviceUsage.php", data_to_send).success(function(data_to_receive){
         	$scope.deviceUsageData = data_to_receive;

    		if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
    			    google.charts.load('43', {packages: ['corechart', 'bar']});
    		    																					}
    	                 
    		google.charts.setOnLoadCallback(drawDeviceBarChart);
    		google.charts.setOnLoadCallback(drawDevicePieChart);

    }).error(function(error){
            console.log(error);
    						});		
	 
//   Generate Bar Chart for Browser Usage	 
	 
	 $http.post("http://localhost/currentMiles/get-data/getBrowserUsage.php", data_to_send).success(function(data_to_receive){
      	$scope.browserUsageData = data_to_receive;
      	
 		google.charts.setOnLoadCallback(drawBrowserBarChart);

 }).error(function(error){
         console.log(error);
 						});	
	
	 
	//Callback that creates and populates a data table,
	//instantiates the bar chart, passes in the data and draws it
	function drawDeviceBarChart(){
		var rows = new Array();               			
		var graph_data = $scope.deviceUsageData;

		var device = "";
		var count = 0;		
		
		//Create the data table
		var data = new google.visualization.DataTable();
		
		data.addColumn('string', 'Devices');
		data.addColumn('number', 'Device Count');
	    data.addColumn({type: 'string', role: 'annotation'});
	    data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
	    data.addColumn({ type: 'string', role: 'style' });

			
		for (var i = 0; i < graph_data.length; i++){                				
			device = graph_data[i].DEVICEPLATFORM;
			count = graph_data[i].UserCount;
			var randomColor = Math.floor(Math.random()*16777215).toString(16);
			
			switch(device){
			
			case 'Android':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/android_image.jpg'><br>"+"Count: "+count;
				break;
			case 'Android Tablet':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/android_tablet_image.jpg'><br>"+"Count: "+count;
				break;
			case 'BlackBerry':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/blackberry_image.jpg'><br>"+"Count: "+count;
				break;
			case 'iPad':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/ipad_image.jpg'><br>"+"Count: "+count;
				break;
			case 'iPhone':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/iphone_image.jpg'><br>"+"Count: "+count;
				break;
			case 'iPod':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/ipod_image.jpg'><br>"+"Count: "+count;
				break;
			case 'Linux PC':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/linux_image.jpg'><br>"+"Count: "+count;
				break;
			case 'Mac PC':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/apple_image.jpg'><br>"+"Count: "+count;
				break;
			case 'Symbian':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/symbian_image.jpg'><br>"+"Count: "+count;
				break;		
			case 'Windows PC':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/windows_image.jpg'><br>"+"Count: "+count;
				break;		
			case 'Windows Phone':
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/windows_phone_image.jpg'><br>"+"Count: "+count;
				break;
			default:
				var html_pic = "device: "+device+"<br>"+"<img src='miles_images/mysql_image.jpg'><br>"+"Count: "+count;
				break;
						}  //ends switch
						
			data.addRow([ device, parseInt(count), count.toString(), html_pic, randomColor ]); 
											       }		
		
		//Set chart options		
	    var options = {
	            title: 'Device Usage Statistics',
	            width: 1050,
	            height: 450,
	            tooltip: {isHtml: true},
	    		annotations: {
	                alwaysOutside: true,
	                textStyle: {
	                  fontSize: 12,
	                  color: '#000',
	                  auraColor: 'none'
	                           }
	                         },	            
	            hAxis: {
	            	title: 'Types of Devices',
	                   },
	            vAxis: {
	            	title: 'Number of Devices'
	                   }
	                   };
		
	    
	    
	    document.getElementById("load").style.display = "none";
        document.getElementById("Device_usage_col_chart").style.display = "inline-block"; 
	    var col_chart = new google.visualization.ColumnChart(document.getElementById('col_chart_div'));

	    col_chart.draw(data, options);
		
	}  //ends drawDeviceBarChart function
	
	
    function drawDevicePieChart() {
    	var graph_data = $scope.deviceUsageData;

		var device = "";
		var count = 0;
    	var data = new google.visualization.DataTable();
	     
		  data.addColumn('string', 'Devices');
		  data.addColumn('number', 'Count');
  	      data.addColumn({ type: 'string', role: 'style' });

  	    for (var i = 0; i < graph_data.length; i++){                				
			device = graph_data[i].DEVICEPLATFORM;
			count = graph_data[i].UserCount;
			var randomColor = Math.floor(Math.random()*16777215).toString(16);
			data.addRow([ device, parseInt(count),randomColor ]); 
											       }  //ends for
  	    
  
        var options = {
          title: 'Device Usage Pie',
          width: 1050,
          height: 800,
          is3D: true,
          sliceVisibilityThreshold: 0
        			  };

        
        document.getElementById("Device_usage_pie_chart").style.display = "inline-block"; 
        var pie_chart = new google.visualization.PieChart(document.getElementById('pie_chart_div'));

		pie_chart.draw(data, options);
		
	    var total = 0;
	    
        for (var i = 0; i < data.getNumberOfRows(); i++) {
            total += data.getValue(i, 1);				 }  //ends for
        
        var device_breakdowns =[];

        for (var i = 0; i < data.getNumberOfRows(); i++) {
            var label = data.getValue(i, 0);
            var value = data.getValue(i, 1);
            var percent =  parseFloat(100 * value / total);
            
                
            if(percent<1){
                var long_string = "<br><font color='red'>"+label+":   "+value+"   ("+percent.toFixed(7)+"%)</font>";
                device_breakdowns.push(long_string);
      	    			 }
      	    else if(percent>25){
                var long_string = "<br><font color='green'>"+label+":   "+value+"   ("+percent.toFixed(7)+"%)</font>";	 
                device_breakdowns.push(long_string);
      	    				   }
      	    else{
                var long_string = "<br>"+label+":   "+value+"   ("+percent.toFixed(7)+"%)";
                device_breakdowns.push(long_string);
      	        }
        												 }  //ends for
        
        document.getElementById("PieTitle").style.display = "inline-block"; 
        document.getElementById("Pie_Breakdown_id").style.display = "inline-block"; 
        document.getElementById("Pie_Breakdown_id").innerHTML = device_breakdowns;
      				
    								}  //ends drawDevicePieChart function
	
	function drawBrowserBarChart(){
		var rows = new Array();               			
		var graph_data = $scope.browserUsageData;

		var browser = "";
		var count = 0;		
		
		//Create the data table
		var data = new google.visualization.DataTable();
		
		data.addColumn('string', 'Browsers');
		data.addColumn('number', 'Browser Count');
	    data.addColumn({type: 'string', role: 'annotation'});
	    data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
	    data.addColumn({ type: 'string', role: 'style' });

			
		for (var i = 0; i < graph_data.length; i++){                				
			browser = graph_data[i].DEVICEBROWSER;
			count = graph_data[i].UserCount;
			var randomColor = Math.floor(Math.random()*16777215).toString(16);
		
			switch(browser){
			
				case 'Chrome':
					var html_pic = "Browser: "+browser+"<br>"+"<img src='miles_images/chrome_image.jpg'><br>"+"Count: "+count;
					break;
				case 'Firefox':
					var html_pic = "Browser: "+browser+"<br>"+"<img src='miles_images/firefox_image.jpg'><br>"+"Count: "+count;
					break;
				case 'Internet Explorer':
					var html_pic = "Browser: "+browser+"<br>"+"<img src='miles_images/ie_image.jpg'><br>"+"Count: "+count;
					break;
				case 'Opera':
					var html_pic = "Browser: "+browser+"<br>"+"<img src='miles_images/opera_image.jpg'><br>"+"Count: "+count;
					break;
				case 'Safari':
					var html_pic = "Browser: "+browser+"<br>"+"<img src='miles_images/safari_image.jpg'><br>"+"Count: "+count;
					break;
				default:
					var html_pic = "Browser: "+browser+"<br>"+"<img src='miles_images/mysql_image.jpg'><br>"+"Count: "+count;
					break;
							}  //ends switch
					
			data.addRow([ browser, parseInt(count), count.toString(), html_pic, randomColor ]); 
											       }		
		
		//Set chart options		
	    var options = {
	            title: 'Browser Usage Statistics',
	            width: 1050,
	            height: 450,	
	    		annotations: {
	                alwaysOutside: true,
	                textStyle: {
	                  fontSize: 12,
	                  color: '#000',
	                  auraColor: 'none'
	                           }
	                         },    
                tooltip: {isHtml: true},
	            hAxis: {
	            	title: 'Types of Browsers',
	                   },
	            vAxis: {
	            	title: 'Number of Browser Uses'
	                   }
	                   };
	   
        document.getElementById("Browser_usage_bar_chart").style.display = "inline-block"; 
	    var bar_chart = new google.visualization.BarChart(document.getElementById('bar_chart_div'));

		bar_chart.draw(data, options);
		
		 var total = 0;
		    
	        for (var i = 0; i < data.getNumberOfRows(); i++) {
	            total += data.getValue(i, 1);				 }  //ends for
	        
	        var browser_breakdowns =[];

	        for (var i = 0; i < data.getNumberOfRows(); i++) {
	            var label = data.getValue(i, 0);
	            var value = data.getValue(i, 1);
	            var percent =  parseFloat(100 * value / total);
	            
	                
	            if(percent<1){
	                var long_string = "<br><font color='red'>"+label+":   "+value+"   ("+percent.toFixed(7)+"%)</font>";
	                browser_breakdowns.push(long_string);
	      	    			 }
	      	    else if(percent>25){
	                var long_string = "<br><font color='green'>"+label+":   "+value+"   ("+percent.toFixed(7)+"%)</font>";	 
	                browser_breakdowns.push(long_string);
	      	    				   }
	      	    else{
	                var long_string = "<br>"+label+":   "+value+"   ("+percent.toFixed(7)+"%)";
	                browser_breakdowns.push(long_string);
	      	        }
	        												 }  //ends for
	        
	        document.getElementById("BarTitle").style.display = "inline-block"; 
	        document.getElementById("Bar_Breakdown_id").style.display = "inline-block"; 
	        document.getElementById("Bar_Breakdown_id").innerHTML = browser_breakdowns;
		
	}  //ends drawBrowserBarChart function
}; //ends DeviceUsageController function
})(); //ends file
