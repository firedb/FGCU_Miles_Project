(function() {

   angular
      .module('app')
      .controller('CreateReportController', CreateReportController);

   CreateReportController.$inject = ['$scope', '$http', '$interval', '$location'];

    function CreateReportController($scope, $http, $interval, $location) {
    	
    	
    	 var logged_in_bool = localStorage.getItem("logged_in_bool");   	 
    	   	
     	   if(logged_in_bool){
     	   	   $scope.current_user_firstname = localStorage.getItem("current_logged_in_user");   	 
     	       document.getElementById("current_user_id").style.display = "inline-block";
     	   					 }
    	
    	
    	  // Data Binded Variables displayed in corresponding HTML file
          $scope.welcome_message = "Welcome to the Miles Email Miner!";
          $scope.Chosen_Report_Message = "Please choose a report type to continue";
          $scope.Not_Enough = "Please choose a report and fill in the minimum required criteria before clicking RUN";
          $scope.Informal_Message = "Having report errors? Please contact the software maintenance team for this site";      

          $scope.selected_report = "None";
          $scope.selected_range = "None";		

          $scope.running_test_message = "Calculating...";         
          
          $http.post("http://localhost/currentMiles/get-data/getClientsCampaignsEmails.php").success(function(data_to_receive){

  			  	$scope.client_campaign_mappings = data_to_receive["client_campaign_mappings"];
  	         	$scope.campaign_email_mappings = data_to_receive["campaign_email_mappings"];
  	             
  		    }).error(function(error){
  	            console.log(error);
  	    						});	
          
          //watches for changes in report type
          $scope.$watch('selected_report', function(newValue, oldValue) {

	        	  if (newValue == "None") {
	        		  $scope.Chosen_Report_Message = "Please choose a report type to continue";
	        		  showAllParameters();
	        	  } else if (newValue == "Device Usage") {
	        		  $scope.Chosen_Report_Message = "Please select the parameters for the " + newValue + " Report";
	        		  limitParameters();
	        	  } else if (newValue =="List Effectiveness"){
	        	  	$scope.Chosen_Report_Message = "Please select the parameters for the " + newValue + " Report";
	        	  	showListEffectivenessParameteres();
	        	  } else {
	        		  $scope.Chosen_Report_Message = "Please select the parameters for the " + newValue + " Report";
	        		  showAllParameters();
	        	  }
	          }); // ends $scope.$watch('selected_report')

 
          //watches for client change
          $scope.$watch('client_list', function(newValue, oldValue) {
        	 if(!newValue){
        		 //do nothing
        	 			  }	  
        	 else{
        	 var client_campaign_mappings = $scope.client_campaign_mappings;   	 
        	 var index = document.getElementById("client_list_id").selectedIndex;
        	 $scope.campaign_choices = client_campaign_mappings[index].Campaign_List;
        	     }
	          														}); // ends $scope.$watch('client_list')
          
          //watches for campaign change
          $scope.$watch('campaign_list', function(newValue, oldValue) {
        	
        	  if(newValue){
        	  var campaign_email_mappings = $scope.campaign_email_mappings;
         	  
        	  for (key in campaign_email_mappings) {
        		    if (campaign_email_mappings.hasOwnProperty(key)) {
        		        if(campaign_email_mappings[key].Campaign_Name==newValue){
        		        	 $scope.email_choices = campaign_email_mappings[key].Email_List;
        		        				 										}  //ends if
        		    												  } //ends if
        	  									   } //ends for
        	  	  }  //ends if
        	     	  
	          														   }); // ends $scope.$watch('campaign_list') 
          
         
          
          // watches for changes in the range type
          $scope.$watch('selected_range', function(newValue, oldValue) {
        	  switch (newValue) {
	        	  case 'None':	        		  
	        		  document.getElementById("from_to_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  document.getElementById("startfield_id").style.display = "none";
	        		  document.getElementById("endfield_id").style.display = "none";
	        		  break;
	        	  case 'From To':
	        		  document.getElementById("from_to_div").style.display = "inline-block";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  document.getElementById("startfield_id").style.display = "inline-block";
	        		  document.getElementById("endfield_id").style.display = "inline-block";
	        		  break;
	        	  case 'Single Day':
	        		  document.getElementById("from_to_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "inline-block";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  document.getElementById("startfield_id").style.display = "inline-block";
	        		  document.getElementById("endfield_id").style.display = "none";
	        		  break;
	        	  case 'One Week':
	        		  document.getElementById("from_to_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "inline-block";
	        		  document.getElementById("one_month_div").style.display = "none";
	        		  document.getElementById("startfield_id").style.display = "inline-block";
	        		  document.getElementById("endfield_id").style.display = "none";
	        		  break;
	        	  case 'One Month':
	        		  document.getElementById("from_to_div").style.display = "none";
	        		  document.getElementById("single_day_div").style.display = "none";
	        		  document.getElementById("one_week_div").style.display = "none";
	        		  document.getElementById("one_month_div").style.display = "inline-block";
	        		  document.getElementById("startfield_id").style.display = "inline-block";
	        		  document.getElementById("endfield_id").style.display = "none";
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
        	  
          };  //ends function
		
			var showListEffectivenessParameteres = function(){
				document.getElementById("clientlabelid").style.display = "inline-block";
        	  document.getElementById("client_list_id").style.display = "inline-block";
        	  document.getElementById("new_client_ta").style.display = "inline-block";
        	  document.getElementById("emailcampaignid").style.display = "inline-block";
        	  document.getElementById("campaign_list_id").style.display = "inline-block";
        	  document.getElementById("new_campaign_ta").style.display = "inline-block";
        	  document.getElementById("specificemailid").style.display = "none";
        	  document.getElementById("email_list_id").style.display = "none";
        	  document.getElementById("new_email_ta").style.display = "none";
			};
          
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
	                 	  document.getElementById("NotEnoughForReport").style.display = "none";
	                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
	                	  
	                	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
                		  var startDate = dateConverter(start_date);

	                	  if(modified_end_date){
	                		  var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
	                		  var endDate = dateConverter(end_date);
	                	  					   }
	                	  else{
	                		  var endDate =""; 
	                	      }
	 						
	                	  //pass js variables for chart view
                		  localStorage.setItem("report_type", selected_report);
                		  localStorage.setItem("range_type", selected_range);
                		 
                		  localStorage.setItem("readable_start_date", startDate);
                		  localStorage.setItem("readable_end_date", endDate);
                		  
                		  localStorage.setItem("start_date", start_date);
                		  localStorage.setItem("end_date", end_date);
                		 
                		 if(email_value) {
                		  localStorage.setItem("email_value", email_value);
                		 }
                		 if(new_email_value) {
                   		  localStorage.setItem("new_email_value", new_email_value);
                   		 }
                   		               	
                		 $location.path('/link-performance-report');

	                	  	}  // ends else
	                  	break;

                
			case "Opens":				
			
			//if a client or a start date was not chosen, print temporary error message
			if (!modified_start_date || client_value == "None" || client_value == undefined || client_value == null) {
				$scope.countdown = 3;
				startCountdown();
			}
			//if the range was "From To" and an end date was not chosen, print temporary error message
			else if (selected_range == "From To" && !modified_end_date) {
				$scope.countdown = 3;
				startCountdown();
			}
			//if the dropdown value passed was "Not Listed" and the user did not type in an unlisted client, print temporary error message
			else if (client_value == "" && new_client_value == undefined) {
				$scope.countdown = 3;
				startCountdown();
			}

			//If all required parameters are valid, remove the error message and print a calculating message to the user
			else {
				document.getElementById("NotEnoughForReport").style.display = "none";
				document.getElementById("RunButtonClicked").style.display = "inline-block";

				var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
				var startDate = dateConverter(start_date);

				if (modified_end_date) {
					var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
					var endDate = dateConverter(end_date);
				} else {
					var endDate = "";
				}
					//pass js variables for chart view
					localStorage.setItem("report_type", selected_report);
					localStorage.setItem("range_type", selected_range);
					localStorage.setItem("readable_start_date", startDate);
					localStorage.setItem("readable_end_date", endDate);

					localStorage.setItem("start_date", start_date);
					localStorage.setItem("end_date", end_date);

					if(email_value) {
                		localStorage.setItem("email_value", email_value);
                	}
                	if(new_email_value) {
                   		 localStorage.setItem("new_email_value", new_email_value);
                   	}
                   	if(campaign_value){
                   		 	localStorage.setItem("campaign_value", campaign_value);
                   	}
                	if(new_campaign_value){
                		 	localStorage.setItem("new_campaign_value", new_campaign_value);
                	} 
					$location.path('/opens-report');
					// console.log(selected_report);
					// console.log(client_value);

				// console.log(new_client_value);
				// console.log(campaign_value);
				// console.log(new_campaign_value);
				// console.log(email_value);
				// console.log(new_email_value);
				// console.log(selected_range);
				// console.log(startDate);
				// console.log(endDate);

				//todo: pass parameters to opens.php

			}
			// ends else
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
	                 	  document.getElementById("NotEnoughForReport").style.display = "none";
	                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
	                	  
	                	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
                		  var startDate = dateConverter(start_date);

	                	  if(modified_end_date){
	                		  var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
	                		  var endDate = dateConverter(end_date);
	                	  					   }
	                	  else{
	                		  var endDate =""; 
	                	      }
					//pass js variables for chart view
					localStorage.setItem("report_type", selected_report);
					localStorage.setItem("range_type", selected_range);
					localStorage.setItem("readable_start_date", startDate);
					localStorage.setItem("readable_end_date", endDate);

					localStorage.setItem("start_date", start_date);
					localStorage.setItem("end_date", end_date);
					
                   	if(campaign_value){
                   		 	localStorage.setItem("campaign_value", campaign_value);
                   	}
                	if(new_campaign_value){
                		 	localStorage.setItem("new_campaign_value", new_campaign_value);
                	} 
					$location.path('/list-effectiveness-report');	                	  
  
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
		                 	  document.getElementById("NotEnoughForReport").style.display = "none";
		                	  document.getElementById("RunButtonClicked").style.display = "inline-block";
		                	  
		                	  var start_date = modified_start_date.toISOString().slice(0, 19).replace('T', ' ');
	                		  var startDate = dateConverter(start_date);

		                	  if(modified_end_date){
		                		  var end_date = modified_end_date.toISOString().slice(0, 19).replace('T', ' ');
		                		  var endDate = dateConverter(end_date);
		                	  					   }
		                	  else{
		                		  var endDate =""; 
		                	      }
		  
	                		  //pass js variables for chart view
	                		  localStorage.setItem("report_type", selected_report);
	                		  localStorage.setItem("range_type", selected_range);
	                		  localStorage.setItem("readable_start_date", startDate);
	                		  localStorage.setItem("readable_end_date", endDate);
	                		  
	                		  localStorage.setItem("start_date", start_date);
	                		  localStorage.setItem("end_date", end_date);
	                		  
	                          $location.path('/device-usage-report');
		                	 
		                	  	}  // ends else
	                	break;
                
	            //print error message for any other case
                default:
                  $scope.countdown = 3;
                  startCountdown();
                  break;
              					 } //ends switch
            }; //ends function       
        
          
            var dateConverter = function(passed_date) {  
            var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            var myDate, myFormatDate;
            var split_date = passed_date.split("-");
            split_date[2] = split_date[2].substring(0, split_date[2].indexOf(' '));
            split_date[0].trim();  //year
            split_date[1].trim();  //month
            split_date[2].trim();  //day

           if(split_date[2]) {
                myDate = new Date(split_date[0], split_date[1] - 1, split_date[2]);
                myFormatDate = MONTHS[myDate.getMonth()] + " " + myDate.getDate() + ", " + myDate.getFullYear();
                return myFormatDate;
            } else {
                myDate = new Date(new Date().getFullYear(), split_date[1] - 1, split_date[2]);
                myFormatDate = MONTHS[myDate.getMonth()] + " " + mydate.getDate();
                return myFormatDate;
                    }
            
            };  //ends function
            
            
            
            
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