(function() {

   angular
      .module('app')
      .controller('ReportController', ReportController);

    ReportController.$inject = ['$scope', '$http', '$interval'];

    function ReportController($scope, $http, $interval) {

    	// Data Binded Variables displayed in corresponding HTML file
          $scope.Miles_Logo = 'miles_logo_large_166px_0.png';
          $scope.welcome_message = "Welcome to the Miles Email Miner!";
          $scope.Chosen_Report_Message = "Please choose a report type to continue";
          $scope.Not_Enough = "Please choose a report and fill in the minimum required criteria before clicking RUN";
          $scope.Informal_Message = "Having report errors? Please contact the software maintenance team for this site";
         
          
          $scope.selected_report = "None";
          $scope.selected_range = "None";
          $scope.client_list = "None";
          $scope.campaign_list = "None";
          $scope.email_list = "None";
          $scope.device_usage = "None";
          
          $scope.running_test_message = "Calculating...";


          // function called on page load
          init();

          // Calls three php scripts to pre-fill the drop down choices
          
		function init() {

			$http.post("http://localhost/currentMiles/GetClients.php").success(function(data) {
				$scope.client_names = data;
			}).error(function(data, status) {
				console.error('client grab error', status, data);
			});

			$http.post("http://localhost/currentMiles/GetCampaigns.php").success(function(data) {
				$scope.client_names_and_campaigns = data;

			}).error(function(data, status) {
				console.error('client grab error', status, data);
			});

			$http.post("http://localhost/currentMiles/GetEmails.php").success(function(data) {
				$scope.client_emails = data;

			}).error(function(data, status) {
				console.error('client grab error', status, data);
			});

			// Testing this at the case: device usage
			// $http.get("http://localhost/currentMiles/deviceUsage.php").success(function(data) {			                	  	
					// $scope.device_usage = data;
			// }).error(function(data, status) {
					// console.error('data grab error', status, data);
			// });
 			                	  

			// Google Charts init can only run once.
			// Load the visualization API and the corechart package
            google.charts.load('current', {'packages':['bar']});
            
		} //ends function


          
          //watches for changes in report type
          $scope.$watch('selected_report', function(newValue, oldValue) {

	        	  if (newValue == "None") {
	        		  $scope.Chosen_Report_Message = "Please choose a report type to continue";
	        		  showAllParameters();
	        	  } else if (newValue == "Device Usage") {
	        		  $scope.Chosen_Report_Message = "Please select the parameters for the " + newValue + " Report";
	        		  limitParameters();
	        	  } else {
	        		  $scope.Chosen_Report_Message = "Please select the parameters for the " + newValue + " Report";
	        		  showAllParameters();
	        	  }
	          }); // ends $scope.$watch('selected_report')

          // watches for changes in the range type
          $scope.$watch('selected_range', function(newValue, oldValue) {

        	  switch (newValue) {
	        	  case 'None':
	        		  document.getElementById("dp1and2_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  break;
	        	  case 'From To':
	        		  document.getElementById("dp1and2_div").style.display = "inline-block";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  break;
	        	  case 'Single Day':
	        		  document.getElementById("dp1and2_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "inline-block";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  break;
	        	  case 'One Week':
	        		  document.getElementById("dp1and2_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "inline-block";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  break;
	        	  case 'One Month':
	        		  document.getElementById("dp1and2_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "inline-block";
	        		  break;
        	  } //ends switch
          }); //ends  $scope.$watch('selected_range')

          //todo: Make sure all fields are emptied on every report type change								  
          //show all parameters if report type requires them
          var showAllParameters = function() {
        	  /* Make sure fields are visible*/
        	  document.getElementById("clientlabelid").style.display = "inline-block";
        	  document.getElementById("client_list_id").style.display = "inline-block";
        	  document.getElementById("new_client_ta").style.display = "inline-block";
        	  document.getElementById("emailcampaignid").style.display = "inline-block";
        	  document.getElementById("campaign_list_id").style.display = "inline-block";
        	  document.getElementById("new_campaign_ta").style.display = "inline-block";
        	  document.getElementById("specificemailid").style.display = "inline-block";
        	  document.getElementById("email_list_id").style.display = "inline-block";
        	  document.getElementById("new_email_ta").style.display = "inline-block";
        	               
        	     /*
        	  $scope.client_list = "None";
        	  $scope.new_client = null;
              $scope.campaign_list = "None";
        	  $scope.new_campaign = null;
        	  $scope.email_list = "None";
        	  $scope.new_email=null;
        	  $scope.selected_range = "None";	 */		 	
          									  };  //ends function

          //todo: Make sure all fields are emptied on every report type change								  
          //only show date range for device usage report type
          var limitParameters = function() {
        	  /* Make sure fields are visible*/
        	  document.getElementById("clientlabelid").style.display = "none";
        	  document.getElementById("client_list_id").style.display = "none";
        	  document.getElementById("new_client_ta").style.display = "none";
        	  document.getElementById("emailcampaignid").style.display = "none";
        	  document.getElementById("campaign_list_id").style.display = "none";
        	  document.getElementById("new_campaign_ta").style.display = "none";
        	  document.getElementById("specificemailid").style.display = "none";
        	  document.getElementById("email_list_id").style.display = "none";
        	  document.getElementById("new_email_ta").style.display = "none";
     /*
        	  $scope.client_list = "None";
        	  $scope.new_client = null;
              $scope.campaign_list = "None";
        	  $scope.new_campaign = null;
        	  $scope.email_list = "None";
        	  $scope.new_email=null;
        	  $scope.selected_range = "None";	 */	
        	  
        	  document.getElementById("Device_usage_chart").style.display = "inline-block";	   
          };

          //todo: Verify correct number and order of parameters
          $scope.generateReport = function(selected_report, selected_range, client_value, new_client_value, 
        		  						   campaign_value, new_campaign_value, email_value, new_email_value, modified_start_date, 
        		  						   modified_end_date) {
              //   The six false value types of JavaScript are: undefined, null, false, an empty string, 0 (of type number), and NaN.

              switch (selected_report) {

                case "Link Performance":         	
                	//if a client or a start date was not chosen, print temporary error message
                	 if (!modified_start_date || client_value == "None" ||client_value==undefined ||client_value==null) {
                		 $scope.countdown = 3;
	                    startCountdown();									    } 
                	  //if the range was "From To" and an end date was not chosen, print temporary error message
	                  else if (selected_range == "From To" && !modified_end_date) {
	                	  $scope.countdown = 3;
	                    startCountdown();										  } 
                	  //if the dropdown value passed was "Not Listed" and the user did not type in an unlisted client, print temporary error message
	                  else if (client_value=="" && new_client_value==undefined) {
	                	  $scope.countdown = 3;
	                    startCountdown();										 }       
                	  //If all required parameters are valid, remove the error message and print a calculating message to the user
	                  else {
	                	  //if only start date passed...
	                	  if(selected_range == "From To"){	  		
	                    	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
	                          var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
	                    	  document.getElementById("NotEnoughForReport").style.display = "none";
		                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
		                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
		                	  console.log(selected_report);
		                	  console.log(client_value);
		                	  console.log(new_client_value);
		                	  console.log(campaign_value);
		                	  console.log(new_campaign_value);
		                	  console.log(email_value);
		                	  console.log(new_email_value);
		                	  console.log(selected_range);
		                	  console.log(start_date);
		                	  console.log(end_date);

		                	  //todo: pass parameters to linkPerformance.php 
		                	  /*
		              	  	  $http.post("http://localhost/linkPerformance.php").success(function(data) {
		            		  $scope.client_names = data;	            	  						    })
		            	      .error(function(data, status) {
		            		  	console.error('client grab error', status, data);
		            		  								});
		                	   */
	
		                	  //Note: do further testing. Datestamps change formats from table to table
		                  		
	                		  
	                	  						}
	                	  else{
	                      	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
	                    	  document.getElementById("NotEnoughForReport").style.display = "none";
		                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
		                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
		                	  console.log(selected_report);
		                	  console.log(client_value);
		                	  console.log(new_client_value);
		                	  console.log(campaign_value);
		                	  console.log(new_campaign_value);
		                	  console.log(email_value);
		                	  console.log(new_email_value);
		                	  console.log(selected_range);
		                	  console.log(start_date);

		                	  //todo: pass parameters to linkPerformance.php 
		                	  /*
		              	  	  $http.post("http://localhost/linkPerformance.php").success(function(data) {
		            		  $scope.client_names = data;	            	  						    })
		            	      .error(function(data, status) {
		            		  	console.error('client grab error', status, data);
		            		  								});
		                	   */
	
		                	  //sample range query and sample format of datestamps: SELECT * FROM `sm_mailing_summary` 
		                	  //WHERE Start_Ts BETWEEN '2015-02-03' and '2015-02-03 23:59:59' 
		                	  //Note: do further testing. Datestamps change formats from table to table
		                  		
	                	  		}  //ends else
	                	  	}  // ends else
	                  	break;

                case "Opens":
                 	//if a client or a start date was not chosen, print temporary error message
               	 if (!modified_start_date || client_value == "None" ||client_value==undefined ||client_value==null) {
               		 $scope.countdown = 3;
	                    startCountdown();									    } 
               	  //if the range was "From To" and an end date was not chosen, print temporary error message
	                  else if (selected_range == "From To" && !modified_end_date) {
	                	  $scope.countdown = 3;
	                    startCountdown();										  } 
               	  //if the dropdown value passed was "Not Listed" and the user did not type in an unlisted client, print temporary error message
	                  else if (client_value=="" && new_client_value==undefined) {
	                	  $scope.countdown = 3;
	                    startCountdown();										 }       
               	  //If all required parameters are valid, remove the error message and print a calculating message to the user
	                  else {
	                	  
	                	  //if only start date passed...
	                	  if(selected_range == "From To"){	  		
	                    	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
	                          var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
	                    	  document.getElementById("NotEnoughForReport").style.display = "none";
		                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
		                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
		                	  console.log(selected_report);
		                	  console.log(client_value);
		                	  console.log(new_client_value);
		                	  console.log(campaign_value);
		                	  console.log(new_campaign_value);
		                	  console.log(email_value);
		                	  console.log(new_email_value);
		                	  console.log(selected_range);
		                	  console.log(start_date);
		                	  console.log(end_date);

		                	  //todo: pass parameters to opens.php 
		                	  /*
		              	  	  $http.post("http://localhost/opens.php").success(function(data) {
		            		  $scope.client_names = data;	            	  						    })
		            	      .error(function(data, status) {
		            		  	console.error('client grab error', status, data);
		            		  								});
		                	   */
	
		                	  //sample range query and sample format of datestamps: SELECT * FROM `sm_mailing_summary` 
		                	  //WHERE Start_Ts BETWEEN '2015-02-03' and '2015-02-03 23:59:59' 
		                	  //Note: do further testing. Datestamps change formats from table to table
		                  		
	                		  
	                	  						}
	                	  else{
	                      	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
	                    	  document.getElementById("NotEnoughForReport").style.display = "none";
		                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
		                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
		                	  console.log(selected_report);
		                	  console.log(client_value);
		                	  console.log(new_client_value);
		                	  console.log(campaign_value);
		                	  console.log(new_campaign_value);
		                	  console.log(email_value);
		                	  console.log(new_email_value);
		                	  console.log(selected_range);
		                	  console.log(start_date);

		                	  //todo: pass parameters to opens.php 
		                	  /*
		              	  	  $http.post("http://localhost/opens.php").success(function(data) {
		            		  $scope.client_names = data;	            	  						    })
		            	      .error(function(data, status) {
		            		  	console.error('client grab error', status, data);
		            		  								});
		                	   */
	
		                	  //sample range query and sample format of datestamps: SELECT * FROM `sm_mailing_summary` 
		                	  //WHERE Start_Ts BETWEEN '2015-02-03' and '2015-02-03 23:59:59' 
		                	  //Note: do further testing. Datestamps change formats from table to table
		                  		
	                	  		}  //ends else
	                	  	}  // ends else
                  		break;

                case "List Effectiveness":
                 	//if a client or a start date was not chosen, print temporary error message
               	 if (!modified_start_date || client_value == "None" ||client_value==undefined ||client_value==null) {
               		 $scope.countdown = 3;
	                    startCountdown();									    } 
               	  //if the range was "From To" and an end date was not chosen, print temporary error message
	                  else if (selected_range == "From To" && !modified_end_date) {
	                	  $scope.countdown = 3;
	                    startCountdown();										  } 
               	  //if the dropdown value passed was "Not Listed" and the user did not type in an unlisted client, print temporary error message
	                  else if (client_value=="" && new_client_value==undefined) {
	                	  $scope.countdown = 3;
	                    startCountdown();										 }       
               	  //If all required parameters are valid, remove the error message and print a calculating message to the user
	                  else {
	                	  
	                	  //if only start date passed...
	                	  if(selected_range == "From To"){	  		
	                    	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
	                          var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
	                    	  document.getElementById("NotEnoughForReport").style.display = "none";
		                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
		                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
		                	  console.log(selected_report);
		                	  console.log(client_value);
		                	  console.log(new_client_value);
		                	  console.log(campaign_value);
		                	  console.log(new_campaign_value);
		                	  console.log(email_value);
		                	  console.log(new_email_value);
		                	  console.log(selected_range);
		                	  console.log(start_date);
		                	  console.log(end_date);

		                	  //todo: pass parameters to listEffectiveness.php 
		                	  /*
		              	  	  $http.post("http://localhost/listEffectiveness.php").success(function(data) {
		            		  $scope.client_names = data;	            	  						    })
		            	      .error(function(data, status) {
		            		  	console.error('client grab error', status, data);
		            		  								});
		                	   */
	
		                	  //sample range query and sample format of datestamps: SELECT * FROM `sm_mailing_summary` 
		                	  //WHERE Start_Ts BETWEEN '2015-02-03' and '2015-02-03 23:59:59' 
		                	  //Note: do further testing. Datestamps change formats from table to table
		                  		
	                		  
	                	  						}
	                	  else{
	                      	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
	                    	  document.getElementById("NotEnoughForReport").style.display = "none";
		                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
		                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
		                	  console.log(selected_report);
		                	  console.log(client_value);
		                	  console.log(new_client_value);
		                	  console.log(campaign_value);
		                	  console.log(new_campaign_value);
		                	  console.log(email_value);
		                	  console.log(new_email_value);
		                	  console.log(selected_range);
		                	  console.log(start_date);

		                	  //todo: pass parameters to listEffectiveness.php 
		                	  /*
		              	  	  $http.post("http://localhost/listEffectiveness.php").success(function(data) {
		            		  $scope.client_names = data;	            	  						    })
		            	      .error(function(data, status) {
		            		  	console.error('client grab error', status, data);
		            		  								});
		                	   */
	
		                	  //sample range query and sample format of datestamps: SELECT * FROM `sm_mailing_summary` 
		                	  //WHERE Start_Ts BETWEEN '2015-02-03' and '2015-02-03 23:59:59' 
		                	  //Note: do further testing. Datestamps change formats from table to table
		                  		
	                	  		}  //ends else
	                	  	}  // ends else
	                  	break;

                case "Device Usage":

	                	//if a client or a start date was not chosen, print temporary error message
	                	if (!modified_start_date) {
	                		$scope.countdown = 3;
	                		startCountdown();		} 
	                	//if the range was "From To" and an end date was not chosen, print temporary error message
	                	else if (selected_range == "From To" && !modified_end_date) {
	                		$scope.countdown = 3;
	                		startCountdown();										 } 
	              	  //If all required parameters are valid, remove the error message and print a calculating message to the user
		                  else {
		                	  
		                	  //if only start date passed...
		                	  if(selected_range == "From To"){	  		
		                    	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
		                          var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
		                    	  document.getElementById("NotEnoughForReport").style.display = "none";
			                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
			                	  		
			                	  //Uses deviceUsage.php by giving it two dates and then being returned
			                	  // the data that match those dates
			                	  
			                	  
			                	  //THIS CURRENTLY IS NOT WORKING, not passing back any data....
			                	  	                	
			                	  var request = $http({
			                	  	method: "post",
			                	  	url: "http://localhost/currentMiles/deviceUsage.php",
			                	  	data: {
			                	  		start_date: start_date,
			                	  		end_date: end_date
			                	  	},
			                	  	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			                	  });
			                	  request.success(function(data){
			                	  	$scope.device_usage = data;
			                	  });
			                	  
			                	  
			                	  for (var i = 0; i < $scope.device_usage; i++){
			                	  	console.log($scope.device_usage[i].DEVICEPLATFORM);
			                	  	console.log($scope.device_usage[i].USERCOUNT);
			                	  }
			                	  // $http({
			                	  	// url: "http://localhost/currentMiles/deviceUsage.php",
			                	  	// method: "POST",
			                	  	// data: DateData,
			                	  	// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			                	  // }).success(function(response) {
			                	  	// $scope.device_usage = response.data;
			                	  // });
			                	  
			                	  
			                	  
			                	  // Set a callback to run when the Google Visualization API is loaded.
      								google.charts.setOnLoadCallback(drawChart);
																			               		
                					//Callback that creates and populates a data table,
                					//instantiates the bar chart, passes in the data and draws it
                					function drawChart(){
                						var rows = new Array();               			
                						var test = $scope.device_usage;
                						var device = "";
                						var count = 0;
                						//Create the data table
                						var data = new google.visualization.DataTable();
                			
                						data.addColumn('string', 'Device');
                						data.addColumn('number', 'Uses');
                			
                						//data.addRows(['test[].DEVICEPLATFORM', test[].USERCOUNT]);
                				
                						for (var i = 0; i < test.length; i++){                				
                							device = test[i].DEVICEPLATFORM;
                							count = test[i].USERCOUNT;
                							rows.push([device, parseInt(count)]);           
                						}
                						data.addRows(rows);
                			
                						//Set chart options
        								var options = {
        									chart:{
        										title: 'Device Usage Statistics',
        										subtitle: 'From X - Y',
        									},
        									height:400,
        									legend: {position: "none"},            						          						
        								};
        								var chart = new google.charts.Bar(document.getElementById('chart_div'));
        								chart.draw(data, options);	
                					}
			                	  
			                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
			                	  console.log(selected_report);
			                	  console.log(selected_range);
			                	  console.log(start_date);
			                	  console.log(end_date);

			                	  //todo: pass parameters to deviceUsage.php 
			                	  /*
			              	  	  $http.post("http://localhost/deviceUsage.php").success(function(data) {
			            		  $scope.client_names = data;	            	  						    })
			            	      .error(function(data, status) {
			            		  	console.error('client grab error', status, data);
			            		  								});
			                	   */
		
			                	  //sample range query and sample format of datestamps: SELECT * FROM `sm_mailing_summary` 
			                	  //WHERE Start_Ts BETWEEN '2015-02-03' and '2015-02-03 23:59:59' 
			                	  //Note: do further testing. Datestamps change formats from table to table
			                  		
		                		  
		                	  						}
		                	  else{
		                      	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
		                    	  document.getElementById("NotEnoughForReport").style.display = "none";
			                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
			                	  //todo: printout all passed parameters to examine and verify format to be passed to php report scripts
			                	  console.log(selected_report);
			                	  console.log(selected_range);
			                	  console.log(start_date);

			                	  //todo: pass parameters to deviceUsage.php 
			                	  /*
			              	  	  $http.post("http://localhost/deviceUsage.php").success(function(data) {
			            		  $scope.client_names = data;	            	  						    })
			            	      .error(function(data, status) {
			            		  	console.error('client grab error', status, data);
			            		  								});
			                	   */
		
			                	  //sample range query and sample format of datestamps: SELECT * FROM `sm_mailing_summary` 
			                	  //WHERE Start_Ts BETWEEN '2015-02-03' and '2015-02-03 23:59:59' 
			                	  //Note: do further testing. Datestamps change formats from table to table
			                  		
		                	  		}  //ends else
		                	  	}  // ends else
	                	break;
                
	            //print error message for any other case
                default:
                  $scope.countdown = 3;
                  startCountdown();
                  break;
              					 } //ends switch
            }; //ends function

            //startCountdown function displays temporary error message as long as condition is met every second in
            //the decrementCountdown function
            var startCountdown = function() {
            	document.getElementById("NotEnoughForReport").style.display = "inline-block";
            	document.getElementById("RunButtonClicked").style.display = "none";
            	$interval(decrementCountdown, 1000, $scope.countdown);
            								}; //ends function
          
			//makes error message go away when countdown is less than 1
			var decrementCountdown = function() {
				$scope.countdown -= 1;
				if ($scope.countdown < 1) {
					document.getElementById("NotEnoughForReport").style.display = "none";
				}
			}; //ends function
        } //ends ReportController function
})(); //ends file