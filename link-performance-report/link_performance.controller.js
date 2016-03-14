(function() {

   angular
      .module('app')
      .controller('LinkPerformanceController', LinkPerformanceController);

   LinkPerformanceController.$inject = ['$scope', '$http'];
       
   function LinkPerformanceController($scope, $http) {
	
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

	$scope.report_type = localStorage.getItem("report_type");
	$scope.range_type = localStorage.getItem("range_type");

	$scope.readable_start_date = localStorage.getItem("readable_start_date");
	$scope.readable_end_date = localStorage.getItem("readable_end_date");

	$scope.start_date = localStorage.getItem("start_date");
	$scope.end_date = localStorage.getItem("end_date");
	
	$scope.email_value = localStorage.getItem("email_value");
	$scope.new_email_value = localStorage.getItem("new_email_value");
    
	data_to_send = {
				'r_type': $scope.range_type,
	            'sdate' : $scope.start_date,
	            'edate' : $scope.end_date,
	            'spec_email': $scope.email_value
	               };
	 
	 
	 $http.post("http://localhost/get-data/getLinkPerformance.php", data_to_send).success(function(data_to_receive){
         	$scope.allLinkData = data_to_receive["all_link"];
         	$scope.perLinkData = data_to_receive["per_link"];
         	
         	var All_Link_Array = [];

	        for (var i = 0; i < $scope.allLinkData[0].length; i++){           
	        	  All_Link_Array.push($scope.allLinkData[0][i].Link);
	          												      }
  	       
	        var unique_set = []
	        unique_set=_.uniq(All_Link_Array);
	        unique_set.sort();
		    $scope.allUniqueLinkData = unique_set;
         	
         	
         	if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined') ||(typeof google.charts === 'undefined')) {
             	  google.charts.load('43', {'packages':['corechart']});

         	  }  //ends if 
         		 
         	  
         	  //call drawChart when data returns...
        	google.charts.setOnLoadCallback(drawChart);
        	
    }).error(function(error){
            console.log(error);
    						});		
	   
	
	//Callback that creates and populates a data table,
	//instantiates the scatter chart, passes in the data and draws it
	function drawChart(){

	        	var all_link_graph_data = $scope.allLinkData;
	    		
	        	var per_link_graph_data = $scope.perLinkData;

	    		var count = 0;

	          var data = new google.visualization.DataTable();
	          
	          data.addColumn('date', 'Day');
	          data.addColumn('number', 'Link Clicks per Day');      
	          data.addColumn({type: 'string', role: 'tooltip'});
	  	      data.addColumn({ type: 'string', role: 'style' });

	          var position = 0;
        	  var linkid_label = "link id: ";
        	  var link_label = "link url: ";
        	  var dayofclick_label = "Day of Clicks: ";
        	  var count_label = "Count: ";


	          //make a scatter series for each link
	          for (var i = 0; i < per_link_graph_data[0].length; i++){           

	          	    //runs linkpoint times
	  	        	for(var j = 0; j < per_link_graph_data[0][i].link_points; j++){
	  	        			
	  	        		var day_of_click=all_link_graph_data[0][position].Datestamp;	
	  	        	    var split_date = day_of_click.split("-");       
	  		            var parsed_date = new Date(split_date[0],split_date[1]-1,split_date[2]);
	  		            
	  	        		count=all_link_graph_data[0][position].LinkCounts;
	  	        		
	  	        		var linkid =all_link_graph_data[0][position].LinkID; 		
	  	        		var link_string =all_link_graph_data[0][position].Link; 		
	  	        		var link_id_tool = linkid_label.concat(linkid);
	  	        		var link_tool = link_label.concat(link_string);
	  	        		var day_tool = dayofclick_label.concat(day_of_click);
	  	        		var count_tool = count_label.concat(count);

	  	        		count
	  	        		var link_info_tool_tip = link_id_tool+'\n'+link_tool+'\n'+day_tool+'\n'+count_tool;
	  	        	  		 
	  	        		
	  					var randomColor = Math.floor(Math.random()*16777215).toString(16);

	  		            data.addRow([new Date(parsed_date), parseInt(count), link_info_tool_tip, randomColor]);
	  		        	position++;
	  	        													              }
	             						}  //ends for loop

	          var options = {
	            title: 'Link Performances for Email: ' + $scope.email_value,
	            width: 1050,
	            height: 450,
	            hAxis: {
			      title: 'Days',
	              format: 'M/d/yy',
	              gridlines: {count: 15}
	                   },
	            vAxis: {
		          title: 'Number of Clicks',
	              gridlines: {count: 15},
	              minValue: 0
	            },
	            tooltip: {
	                isHtml: false
	            }
	          };
			        
	          document.getElementById("load").style.display = "none";
	          document.getElementById("Link_performance_chart").style.display = "inline-block"; 
	          var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

	          chart.draw(data, options);  
	        
	          
      	      var date_formatting_button = document.getElementById('change');

	          date_formatting_button.onclick = function () {

	            // If the format option matches, change it to the new option,
	            // if not, reset it to the original format.
	            options.hAxis.format === 'M/d/yy' ?
	            options.hAxis.format = 'MMM dd, yyyy' :
	            options.hAxis.format = 'M/d/yy';
	            chart.draw(data, options);
	          								};

	        		}  //ends drawChart function

	
	
	
    //watches for link url change
    $scope.$watch('link_url_list', function(newValue, oldValue) {
  	
  	  if(newValue){
  		  if(newValue=="All"){

	        	var all_link_graph_data = $scope.allLinkData;
	    		
	        	var per_link_graph_data = $scope.perLinkData;

	    		var count = 0;

	          var data = new google.visualization.DataTable();
	          
	          data.addColumn('date', 'Day');
	          data.addColumn('number', 'Link Clicks per Day');      
	          data.addColumn({type: 'string', role: 'tooltip'});
	  	      data.addColumn({ type: 'string', role: 'style' });

	          var position = 0;
      	  var linkid_label = "link id: ";
      	  var link_label = "link url: ";
      	  var dayofclick_label = "Day of Clicks: ";


	          //make a scatter series for each link
	          for (var i = 0; i < per_link_graph_data[0].length; i++){           

	          	    //runs linkpoint times
	  	        	for(var j = 0; j < per_link_graph_data[0][i].link_points; j++){
	  	        			
	  	        		var day_of_click=all_link_graph_data[0][position].Datestamp;	
	  	        	    var split_date = day_of_click.split("-");       
	  		            var parsed_date = new Date(split_date[0],split_date[1]-1,split_date[2]);
	  		            
	  	        		count=all_link_graph_data[0][position].LinkCounts;
	  	        		
	  	        		var linkid =all_link_graph_data[0][position].LinkID; 		
	  	        		var link_string =all_link_graph_data[0][position].Link; 		
	  	        		var link_id_tool = linkid_label.concat(linkid);
	  	        		var link_tool = link_label.concat(link_string);
	  	        		var day_tool = dayofclick_label.concat(day_of_click);
	
	  	        		var link_info_tool_tip = link_id_tool+'\n'+link_tool+'\n'+day_tool;
	  	        	  		 
	  	        		
	  					var randomColor = Math.floor(Math.random()*16777215).toString(16);

	  		            data.addRow([new Date(parsed_date), parseInt(count), link_info_tool_tip, randomColor]);
	  		        	position++;
	  	        													              }
	             						}  //ends for loop
	          
	          var options = {
	            title: 'Link Performances for Email: ' + $scope.email_value,
	            width: 1050,
	            height: 450,
	            hAxis: {
			      title: 'Days',
	              format: 'M/d/yy',
	              gridlines: {count: 15}
	                   },
	            vAxis: {
		          title: 'Number of Clicks',
	              gridlines: {count: 15},
	              minValue: 0
	            },
	            tooltip: {
	                isHtml: false
	            }
	          };
			
	          
	          document.getElementById("load").style.display = "none";
	          document.getElementById("Link_performance_chart").style.display = "inline-block"; 
	          var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

	          chart.draw(data, options);  
	        
	          
    	      var date_formatting_button = document.getElementById('change');

	          date_formatting_button.onclick = function () {

	            // If the format option matches, change it to the new option,
	            // if not, reset it to the original format.
	            options.hAxis.format === 'M/d/yy' ?
	            options.hAxis.format = 'MMM dd, yyyy' :
	            options.hAxis.format = 'M/d/yy';
	            chart.draw(data, options);
	          								};
  			  
  		  					}  //ends if
  	
  	  else{
  			    		  
  		  var all_link_graph_data = $scope.allLinkData;

  		  var counter = 0;
  		  var position = 0;
  		  var first = false;
  		  
  		  var link_id="";
  		  var day_of_click = "";
  		  var count = 0;
  		  var random_color = "#ff00ff"; 
  		  var data = null;
  		  data = new google.visualization.DataTable();
  		  
  		  data.addColumn('date', 'Day');
  		  data.addColumn('number', 'Link Clicks per Day');
  		  data.addColumn({ type: 'string', role: 'style' });
     	      	
    	var LinkID=0;
    	var first_position=0;
  		  for (key in all_link_graph_data[0]) {
  			  	  				  	
    		        if(all_link_graph_data[0][key].Link==newValue){
    		        	
    		        	if(!first){
        		            LinkID = all_link_graph_data[0][key].LinkID;
    		        	    first_position = key;
    		        		first=true;
    		        			  }
    		        	
    		        	if(all_link_graph_data[0][key].Link==newValue && all_link_graph_data[0][key].LinkID==LinkID){
    		        		counter++;
    		        																								}
    		        	
    		        	else{    	
    		        	    }
    		        				 						   													}  //ends if	 				    		    	
    	  									   } //ends for
    	    	  	  
    	  var last_link_appearance = +first_position+ +counter;
    	  counter = 0;
  		  first=false;

        	    //runs linkpoint times
	        	for(var first_link_appearance = first_position; first_link_appearance < last_link_appearance; first_link_appearance++){
	        				        		
	        		day_of_click=all_link_graph_data[0][first_link_appearance].Datestamp;
	        		count=all_link_graph_data[0][first_link_appearance].LinkCounts;
	        		linkid =all_link_graph_data[0][first_link_appearance].LinkID;
       
	        	    var split_date = day_of_click.split("-");
	                
		            var d = new Date(split_date[0],split_date[1]-1,split_date[2]);	  		           
	        		
		            data.addRow([new Date(d), parseInt(count), random_color]);
	        													              
           																															 }  //ends for loop
	           last_link_appearance=0;
	           var first_link_appearance=0;
	           first_position=0;
	           
	           var options = {
	    	            title: 'Link Performances for Email: ' + $scope.email_value,
	    	            width: 1050,
	    	            height: 450,
	    	            hAxis: {
	    			      title: 'Days',
	    	              format: 'M/d/yy',
	    	              gridlines: {count: 15}
	    	                   },
	    	            vAxis: {
	    		          title: 'Number of Clicks',
	    	              gridlines: {count: 15},
	    	              minValue: 0
	    	            }
	    	          };
  	                  
	    	          var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

	    	          chart.draw(data, options);
		        	    
	    	          var date_formatting_button_updated = document.getElementById('change');

	    	          date_formatting_button_updated.onclick = function () {

	    	            // If the format option matches, change it to the new option,
	    	            // if not, reset it to the original format.
	    	            options.hAxis.format === 'M/d/yy' ?
	    	            options.hAxis.format = 'MMM dd, yyyy' :
	    	            options.hAxis.format = 'M/d/yy';
	    	            
	    	            chart.draw(data, options);
	    	          								};		
  	  	  }  //ends else
  	  }  //ends if
        														   }); // ends $scope.$watch('link_url_list') 
   		}; //ends LinkPerformanceController function
})(); //ends file
