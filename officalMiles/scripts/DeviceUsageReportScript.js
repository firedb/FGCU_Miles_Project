
/// <reference path = "angular.js" />

//create a module, controller and register the controller with method chaining
//At the moment, there are no dependencies in the array
var myDeviceUsageApp = angular
							.module("DeviceUsageModule", []) 
							.controller("myDeviceUsageController", function ($scope){
								$scope.message = "Device Usage Report";	
							});
