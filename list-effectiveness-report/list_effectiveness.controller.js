(function() {

   angular
      .module('app')
      .controller('ListEffectivenessController', ListEffectivenessController);

   ListEffectivenessController.$inject = ['$scope', '$http'];
       
   function ListEffectivenessController($scope, $http) {
    
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
	 
	 
	 $http.post("http://localhost/currentMiles/get-data/getListEffectiveness.php", data_to_send).success(function(data_to_receive){
         	$scope.chartParams = data_to_receive; 
    }).error(function(error){
            console.log(error);
    						});		
	   
	  if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
		    google.charts.load('current', {packages: ['corechart', 'bar']});
	    																					}
                 
	google.charts.setOnLoadCallback(drawChart);
	
	//Callback that creates and populates a data table,
	//instantiates the bar chart, passes in the data and draws it
	function drawChart(){
		var rows = new Array();               			
		var test = $scope.chartParams;
		var device = "";
		var count = 0;
		//Create the data table
		var data = new google.visualization.DataTable();
		
		data.addColumn('string', 'Devices');
		data.addColumn('number', 'Count');
	    data.addColumn({type: 'string', role: 'annotation'});

			
		for (var i = 0; i < test.length; i++){                				
			device = test[i].DEVICEPLATFORM;
			count = test[i].USERCOUNT;
			rows.push([device, parseInt(count), count.toString()]);           
		}
		data.addRows(rows);
		
		//Set chart options		
	    var options = {
	            title: 'Device Usage Statistics',
	            height: 600,
	            colors: ['#3399FF'],
	            annotations: {
	                alwaysOutside: true,
	                textStyle: {
	                  fontSize: 14,
	                  color: '#000',
	                  auraColor: 'none'
	                           }
	                         },	            
	            hAxis: {
	            	title: 'Types of Devices',
	            	viewWindow: {
	            			min: [7, 30, 0],
	            			max: [17, 30, 0]
	                          }
	                   },
	            vAxis: {
	            	title: 'Count per Device'
	                   }
	                   };
					
	    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

		document.getElementById("List_effectiveness_chart").style.display = "inline-block"; 
		chart.draw(data, options);
		
	}  //ends function
}; //ends ListEffectivenessController function
})(); //ends file
