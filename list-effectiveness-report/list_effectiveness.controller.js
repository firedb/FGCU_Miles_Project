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
	  
	$scope.campaign_value = localStorage.getItem("campaign_value");
	data_to_send = {
				'campaign' : $scope.campaign_value,
				'r_type': $scope.range_type,
	            'sdate' : $scope.start_date,
	            'edate' : $scope.end_date
	               };
	 
	 
	 $http.post("http://localhost/currentMiles/get-data/getListEffectiveness.php", data_to_send).success(function(data_to_receive){
         	$scope.chartParams = data_to_receive; 
         	
         	if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
		    	google.charts.load('43', {packages: ['line']});
	    	}
                 
			google.charts.setOnLoadCallback(drawChart);
    }).error(function(error){
            console.log(error);
    });		
	   
	  
	
	//Callback that creates and populates a data table,
	//instantiates the bar chart, passes in the data and draws it
	function drawChart(){
		var rows = new Array();               			
		var params = $scope.chartParams;
		var client = "";
		var campaign = "";
		var opens = 0;
		var bounces = 0;
		var total = 0;
		
		//Create the data table
		var data = new google.visualization.DataTable();
		
		data.addColumn('date', 'Day');
		//data.addColumn('string', 'Client Name');
		//data.addColumn('string', 'Campaign Name');
		data.addColumn('number', 'Open Count');
		data.addColumn('number', 'Bounce Count');
		data.addColumn('number', 'Mailed Count');
		
		
	   // data.addColumn({type: 'string', role: 'annotation'});
	   // data.addColumn({type:'string', role:'annotationText'});

			
		for (var i = 0; i < params.length; i++){  
			//client = params[i].From_Nm;
			campaign = params[i].Data_Source_Nm;
			opens = params[i].Open_Cnt;
			bounces = params[i].Bounce_Cnt;
			total = params[i].Mailed_Cnt;
			 
			var timeSent = params[i].Start_Ts;
			var timeSentT = timeSent.substr(0,10) + "T" + timeSent.substr(11,8);
			
					
			rows.push([new Date(timeSentT), parseInt(opens), parseInt(bounces), parseInt(total),]);	             				
           
		}
		data.addRows(rows);
		
		var options = {
			chart: {
				title: 'List Effectiveness Report for ' + params[1].From_Nm
			},
			height:700		
		};
		
		
	    var chart = new google.charts.Line(document.getElementById('chart_div'));
		document.getElementById("load").style.display = "none";
		document.getElementById("List_effectiveness_chart").style.display = "inline-block"; 
		chart.draw(data, options);
		
	}  //ends function
}; //ends ListEffectivenessController function
})(); //ends file
