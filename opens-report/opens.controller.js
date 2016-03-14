(function() {

	angular
	.module('app')
	.controller('OpensController', OpensController);

	OpensController.$inject = ['$scope', '$http'];

	function OpensController($scope, $http) {
		
		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

		$scope.report_type = localStorage.getItem("report_type");
		$scope.range_type = localStorage.getItem("range_type");

		$scope.readable_start_date = localStorage.getItem("readable_start_date");
		$scope.readable_end_date = localStorage.getItem("readable_end_date");

		$scope.start_date = localStorage.getItem("start_date");
		$scope.end_date = localStorage.getItem("end_date");

		$scope.email_value = localStorage.getItem("email_value");
		$scope.new_email_value = localStorage.getItem("new_email_value");
		
		$scope.campaign_value = localStorage.getItem("campaign_value");
		$scope.new_campaign_value = localStorage.getItem("new_campaign_value");
		
		$scope.opens_title = "Daily Open Totals";
		$scope.opens_hourly_title = "Hourly Opens Totals";
		$scope.all_opens_title = "All Opens Totals";
		
		// //**FOR TESTING NEW OPENS REPORT WHICH IS BROKEN DON"T USE "****
		// $http.post("http://localhost/currentMiles/get-date/getNewOpen.php").success(function(data){
			// $scope.newOpenData = data;
// 			
			// //check to make sure google charts is only loaded once
			// if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
             	  // google.charts.load('43', {'packages':['corechart']});
         	// }  //ends if 
         	// google.charts.setOnLoadCallback(drawNewChart); //New Opens
		// }).error(function(data, error){
			// console.error('data grab error', status, data);
		// });
// 		
		// //Get the All the Campaigns that match the client during the date range for the column names
		// $http.post("http://localhost/currentMiles/get-date/getAllCampaigns.php").success(function(data){
			// $scope.columnNames = data;
// 			
		// }).error(function(data, error){
			// console.error('data grab error', status, data);
		// });
// 		
		
		
		//****** THIS IS DAILY OPENS USAGE *********
		
		data_for_daily_opens = {
				'r_type': $scope.range_type,
	            'sdate' : $scope.start_date,
	            'edate' : $scope.end_date,
	            'spec_email': $scope.email_value
	     };
		
		$http.post("http://localhost/currentMiles/get-data/getOpens.php", data_for_daily_opens).success(function(data) {
					console.log(data[0].OpenCount);
					$scope.OpenDailyData = data;
					if ($scope.OpenDailyData === 'undefined'){
						$scope.opens_title = "Sorry database was undefined for those parameters";
					} else {
						//check to make sure google charts is only loaded once
						if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
             	  			google.charts.load('43', {'packages':['corechart','bar']});
         	  			}  //ends if 
							
						google.charts.setOnLoadCallback(drawChart); //Hourly Opens
					}								
				}).error(function(data, error) {
					console.error('data grab error', status, data);
				}); 
				
		//********** THIS IS HOURLY OPENS USAGE *********
				
		data_for_hourly_opens = {
			'r_type' : $scope.range_type,
			'sdate' : $scope.start_date,
			'edate' : $scope.end_date,
			'spec_email': $scope.email_value
		};

		$http.post("http://localhost/currentMiles/get-data/getHourlyOpens.php", data_for_hourly_opens).success(function(data) {
					$scope.OpenHourlyData = data;
					
					//check to make sure google charts is only loaded once
					if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
             	  		google.charts.load('43', {'packages':['corechart']});
         	  		}  //ends if 
							
					google.charts.setOnLoadCallback(drawHourChart); //Hourly Opens
				}).error(function(data, error) {
					console.error('data grab error', status, data);
				}); 
		
		//******** THIS IS ALL OPENS USAGE ***************
		
		data_for_all_opens = {
			'campaign' : $scope.campaign_value
		};
		console.log('campaign = ', $scope.campaign_value);
		
		$http.post("http://localhost/currentMiles/get-data/getAllOpens.php", data_for_all_opens).success(function(data){
			 $scope.allOpensData = data;
			 //check to make sure google charts is only loaded once
			if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
             	  google.charts.load('43', {'packages':['annotationchart']});
         	}  //ends if 
         	google.charts.setOnLoadCallback(drawAllOpensChart); //New Opens
		}).error(function(data, error){
			console.error('data grab error', status, data);
		});
			
	//THIS IS BROKEN!			
			// function drawNewChart(){
				// var openData = $scope.newOpenData;
				// var columnNames = $scope.columnNames;
				// var rows = new Array();
// 				
				// var emailName;
// 				
// 				
				// var data = new google.visualization.DataTable();
				// data.addColumn('date', Day);
				// for (var i = 0; i < columnNames.length; i++){
					// emailName = columnNames[i];
					// data.addColumn({type:'string', emailName);
				// }
// 				
				// for (var i = 0; i < openData.length; i++){
// 					
				// }
			// }


			function drawAllOpensChart(){
				var openData = $scope.allOpensData;
				var rows = new Array();
				
				var data = new google.visualization.DataTable();
				
				
				data.addColumn('date', 'Date');
				data.addColumn('number', 'Open Count');
				data.addColumn('string', 'Email Name');
				//data.addColumn({type: 'string', role:'annotation'});
				
				var emailName = "";
				
				var openCount = 0;
				
				for (var i = 0; i < openData.length; i++){
					emailName = openData[i].Mailing_Nm;
					var timeSent = openData[i].Start_Ts;
					var timeSentT = timeSent.substr(0,10) + "T" + timeSent.substr(11,8);
					openCount = openData[i].Open_Cnt;
					
					rows.push([new Date(timeSentT), parseInt(openCount), emailName]);				
				}
				data.addRows(rows);
				var options = {						
					displayAnnotations: true,
					displayAnnotationsFilter: true,
					height:500																							
				};
				document.getElementById("load").style.display = "none";
				document.getElementById("All_Opens_chart").style.display = "inline-block";
				var chart = new google.visualization.AnnotationChart(document.getElementById('all_opens_chart_div'));
				chart.draw(data, options);
			}
			
			function drawChart() {
				var openData = $scope.OpenDailyData;
				console.log('Open Data = ', openData[0].OpenCount);
				var rows = new Array();

				var data = new google.visualization.DataTable();
				data.addColumn('string', 'Day');
				data.addColumn('number', 'Open Count');
				data.addColumn({type: 'string', role:'annotation'});

				var day = "";
				var hour = "";
				var openCount = 0;

				for (var i = 0; i < openData.length; i++) {
									
					day = openData[i].Datestamp;
					openCount = openData[i].OpenCount;
					
					rows.push([day, parseInt(openCount), openCount.toString()]);
				}
				data.addRows(rows);
				var options = {		
					animation:{
						startup: true,
						duration: 2000,
						easing: 'inAndOut'
					},								
					format: 'h:mm a',
					height:550									
				};
				document.getElementById("load").style.display = "none";
				document.getElementById("Opens_chart").style.display = "inline-block";
				var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
				chart.draw(data, options);
			}
			
			function drawHourChart() {
				var openData = $scope.OpenHourlyData;
				console.log('Open Data = ', openData[0].OpenCount);
				var rows = new Array();
				var days = new Array();
				var hours = new Array();
				var opens = new Array();
				
				var start_date = $scope.start_date;
				
				var data = new google.visualization.DataTable();
				data.addColumn('date', 'Timestamp');
				data.addColumn('number', 'Hour');
				data.addColumn('number', 'Open Count');
				//data.addColumn({type:'string', role:'annotation'});
				//data.addColumn({type:'string', role:'annotationText'});

				//var day = "";
				var hour = "";
				var openCount = 0;
	
				for (var i = 0; i < openData.length; i++) {
					var timeSent = openData[i].Datestamp;
					console.log(timeSent);
					var timestamp = timeSent.substr(0,4) + "," + timeSent.substr(5,2) + "," + timeSent.substr(8,2) + "," + timeSent.substr(11,2) + "," + timeSent.substr(14,2);
					var timeSentT = timeSent.substr(0,10) + "T" + timeSent.substr(11,8);			
					//day = openData[i].Datestamp;				
					hour = openData[i].Hourstamp;
					openCount = openData[i].OpenCount;
					if (hour > 12){
						var tooltip = timeSent + " " + (hour-12) +'PM' + "\n" + openCount;
					}else {
						var tooltip = timeSent + " " + hour+"AM";
					}
										
					//console.log('Hours = ', hour);
					
					if (day = start_date){
						console.log('DAY = Start Day');
						
					}
					rows.push([new Date (timestamp), parseInt(hour), parseInt(openCount)]);
					//rows.push([new Date (timeSentT), parseInt(hour), parseInt(openCount), hour.toString(), tooltip]);					
				}
				data.addRows(rows);
				var options = {	
					height:600,	
					bar: {groupWidth: '95%'},
					legend: {position: 'none'},								
					chart:{
						height:'90%',
						width:'90%'
					},
					series: {
						0: {axis: 'hour'},
						1: {axis: 'day'}
					},
					axes:{
						x:{
							hour: {side: 'bottom', label: 'Hours'},
							day: {side: 'top', label: 'Days'}
						}
					}																
				};
				
				document.getElementById("load").style.display = "none";
				document.getElementById("Opens_hourly_chart").style.display = "inline-block";
				var chart = new google.visualization.ColumnChart(document.getElementById('hourly_chart_div'));
				chart.draw(data, options);
			}
		
		
		
		// //****** GEO MAP ***********
		// //Callback that creates and populates a data table,
		// //instantiates the bar chart, passes in the data and draws it
		// function drawGeoChart(){
// 			
	     	// var all_open_data = $scope.chartParams;
//     		
// 
          // var data = new google.visualization.DataTable();
//           
          // data.addColumn('string', 'State');
          // data.addColumn('number', 'Opens');
//   	      
         // // data.addColumn({type: 'string', role: 'tooltip'});
// 
  	     // // data.addColumn({ type: 'string', role: 'style' });
// 
          // var state = "";
//           
//           
      	// for (var i = 0; i < all_open_data.length; i++){                				
			// state = graph_data[i].STATE;
			// count = graph_data[i].OPENCOUNT;
// 	            
	            // switch(state){
	            // case "Alabama":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Alaska":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Arizona":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Arkansas":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "California":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Colorado":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Connecticut":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Delaware":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Florida":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Georgia":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Hawaii":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;    
	            // case "Idaho":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
// 	            
	            // case "Illinois":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Indiana":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Iowa":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Kansas":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Kentucky":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Louisiana":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Maine":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Maryland":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Massachusetts":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Michigan":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Minnesota":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Mississippi":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Missouri":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Montana":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Nebraska":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Nevada":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "New Hampshire":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "New Jersey":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
// 	            
	            // case "New Mexico":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "New York":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "North Carolina":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "North Dakota":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Ohio":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Oklahoma":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Oregon":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Pennsylvania":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Rhode Island":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "South Carolina":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "South Dakota":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Tennessee":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Texas":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Utah":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Vermont":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Virginia":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Washington":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "West Virginia":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Wisconsin":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
	            // case "Wyoming":
		            // data.addRow([state, , parseInt(count)]);
	            	// break;
//         
	            						// }  //ends switch
											       // }  //ends for loop
// 
			// var opts = {
					// region: 'US',
					// displayMode: 'regions',
					// resolution: 'provinces',
					// width: 640, 
					// height: 480
					    // };
// 	         
			// document.getElementById("Opens_chart").style.display = "inline-block"; 
// 
			// var geochart = new google.visualization.GeoChart(document.getElementById('chart_div'));
			// geochart.draw(data, opts);
						// };  //ends drawGeoChart function

	}  //ends OpensController function
})(); //ends file
