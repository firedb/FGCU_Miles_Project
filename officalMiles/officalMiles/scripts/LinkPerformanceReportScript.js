
/// <reference path = "angular.js" />

//create a module, controller and register the controller with method chaining
//At the moment, there are no dependencies in the array
var myLinkPerformanceApp = angular
							.module("LinkPerformanceModule", []) 
							.controller("myLinkPerformanceController", function ($scope){
								$scope.message = "Link Performance Report";	
							});



