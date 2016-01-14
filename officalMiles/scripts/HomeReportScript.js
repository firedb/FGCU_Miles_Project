
/// <reference path = "angular.js" />

//create a module, controller and register the controller with method chaining
//At the moment, there are no dependencies in the array
var myHomeApp = angular
					.module("HomeModule", []) 
					.controller("myHomeController", function ($scope){
						
						$scope.welcome_message = "Welcome to the Miles Email Miner!";
						$scope.running_test_message = "Calculating...";
						$scope.logo = "/officalMiles/miles_logo_large_166px_0.png";
						$scope.ran_no_report_selected ="Please choose a report and fill in the criteria before clicking RUN";	
					});


var myHomeDateApp = angular
						.module('dateInputExample', [])
     					.controller('DateController', function($scope) {
       						$scope.range_from_model = "";
     					});

