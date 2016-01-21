
/// <reference path = "angular.js" />

//create a module, controller and register the controller with method chaining
//At the moment, there are no dependencies in the array
var myHomeApp = angular.module("HomeModule", ['ngMaterial', 'ngAnimate']);


					myHomeApp.controller("myHomeController", function ($scope){
						$scope.welcome_message = "Welcome to the Miles Email Miner!";
						$scope.running_test_message = "Calculating...";
						$scope.ran_no_report_selected ="Please choose a report and fill in the criteria before clicking RUN";
						$scope.Miles_Logo= '/Users/MS/Documents/workspace/Miles_Project_Updated_1_21_2016/miles_logo_large_166px_0.png';
					});


          myHomeApp.controller('AppCtrl', function($scope) {
          
           $scope.license = {
              expirationdate: '2015-12-15T23:00:00.000Z'
                             };
           $scope.dt = new Date($scope.license.expirationdate);
           //$scope.tester = {};
          });
          
    
