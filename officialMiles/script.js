(function() {
  //create a module, controller and register the controller with method chaining
  //At the moment, there are no dependencies in the array
  var myHomeApp = angular.module("HomeModule", ['ngMaterial', 'ngAnimate', 'ngMessages']);

  myHomeApp.controller("HomeController", function($scope, $http, $interval) {

    $scope.welcome_message = "Welcome to the Miles Email Miner!";
    $scope.running_test_message = "Calculating...";
    $scope.Not_Enough = "Please choose a report and fill in the minimum required criteria before clicking RUN";
    $scope.Miles_Logo = 'https://github.com/firedb/FGCU_Miles_Project/blob/mike-branch/officialMiles/miles_logo_large_166px_0.png?raw=true';
    $scope.H3 = 'Please choose a type of report';
    $scope.Informal_Message = "Having report errors? Please contact the software maintenance team for this site";
    $scope.selected_report = "None";
    $scope.selected_range = "None";
    $scope.Chosen_Report_Message = "Please choose a report type to continue";
    $scope.user = {
      name: "Devin"
                  }
    $scope.client_list = "None";

    init();

    function init() {

      $http.post("http://localhost/GetClients.php").success(function(data) {
        $scope.client_names = data;})

      .error(function(data, status) {
        console.error('client grab error', status, data);
                                    });
                    }

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
    }); /* ends $scope.$watch('selected_report' */


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
      } /*ends switch*/
    }); /*ends chooseRange()*/

    var showAllParameters = function() {
      /* Make sure fields are visible*/
      document.getElementById("clientlabelid").style.display = "inline-block";
      document.getElementById("client_list_id").style.display = "inline-block";
      document.getElementById("new_client_ta").style.display = "inline-block";
      document.getElementById("emailcampaignid").style.display = "inline-block";
      document.getElementById("emailcampaign_ta").style.display = "inline-block";
      document.getElementById("specificemailid").style.display = "inline-block";
      document.getElementById("specificemail_ta").style.display = "inline-block";
      $scope.client_list = "None";
      $scope.new_client= null;
      $scope.email_campaign_value=null;
      $scope.specific_email_value=null;
      $scope.selected_range="None";
    }

    var limitParameters = function() {
      /* Make sure fields are visible*/
      document.getElementById("clientlabelid").style.display = "none";
      document.getElementById("client_list_id").style.display = "none";
      document.getElementById("new_client_ta").style.display = "none";
      document.getElementById("emailcampaignid").style.display = "none";
      document.getElementById("emailcampaign_ta").style.display = "none";
      document.getElementById("specificemailid").style.display = "none";
      document.getElementById("specificemail_ta").style.display = "none";
      $scope.client_list = "None";
      $scope.new_client= null;
      $scope.email_campaign_value=null;
      $scope.specific_email_value=null;
      $scope.selected_range="None";
    }

    $scope.generateReport = function(selected_report, selected_range, client_list_value, new_client, email_campaign_value,
                                     specific_email_value, modified_start_date, modified_end_date) {
        //   The six falsy values of JavaScript are:
        //   undefined,null,false, the empty string, 0 (of type number), and NaN.

        document.getElementById("NotEnoughForReport").style.display = "none";

        switch (selected_report) {

          case "Link Performance":
            if (client_list_value == "None" || !modified_start_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (selected_range == "From To" && !modified_end_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (client_list_value == "Not Listed" && !new_client) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else {
              document.getElementById("NotEnoughForReport").style.display = "none";
              document.getElementById("RunButtonClicked").style.display = "inline-block";
              console.log(selected_report);
              console.log(selected_range);
              console.log(client_list_value);
              console.log(new_client);
              console.log(email_campaign_value);
              console.log(specific_email_value);
              console.log(modified_start_date);
              console.log(modified_end_date);
              //call server program....
              // phpcall(client_value, email_campaign_value, specific_email_value, modified_start_date, modified_end_date);

            }
            break;

          case "Opens":
            if (client_list_value == "None" || !modified_start_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (selected_range == "From To" && !modified_end_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (client_list_value == "Not Listed" && !new_client) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else {
              document.getElementById("NotEnoughForReport").style.display = "none";
              document.getElementById("RunButtonClicked").style.display = "inline-block";
              console.log(selected_report);
              console.log(selected_range);
              console.log(client_value);
              console.log(email_campaign_value);
              console.log(specific_email_value);
              console.log(modified_start_date);
              console.log(modified_end_date);
              //call server program....
            }
            break;

          case "List Effectiveness":
            if (client_list_value == "None" || !modified_start_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (selected_range == "From To" && !modified_end_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (client_list_value == "Not Listed" && !new_client) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else {
              document.getElementById("NotEnoughForReport").style.display = "none";
              document.getElementById("RunButtonClicked").style.display = "inline-block";
              console.log(selected_report);
              console.log(selected_range);
              console.log(client_value);
              console.log(email_campaign_value);
              console.log(specific_email_value);
              console.log(modified_start_date);
              console.log(modified_end_date);
              //call server program....
            }
            break;

          case "Device Usage":
            if (client_list_value == "None" || !modified_start_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (selected_range == "From To" && !modified_end_date) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else if (client_list_value == "Not Listed" && !new_client) {
              $interval(function() {
                document.getElementById("NotEnoughForReport").style.display = "inline-block";
                document.getElementById("RunButtonClicked").style.display = "none";
              }, 1000);
            } else {
              document.getElementById("NotEnoughForReport").style.display = "none";
              document.getElementById("RunButtonClicked").style.display = "inline-block";
              console.log(selected_report);
              console.log(selected_range);
              console.log(client_value);
              console.log(email_campaign_value);
              console.log(specific_email_value);
              console.log(modified_start_date);
              console.log(modified_end_date);
              //call server program....
            }
            break;
          default:
            $interval(function() {
              document.getElementById("NotEnoughForReport").style.display = "inline-block";
              document.getElementById("RunButtonClicked").style.display = "none";
            }, 1000);
            break;
        } //ends switch
      } //ends function
  }); //ends controller code
}()); //ends file