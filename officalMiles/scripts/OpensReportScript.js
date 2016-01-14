
/// <reference path = "angular.js" />

//create a module, controller and register the controller with method chaining
//At the moment, there are no dependencies in the array
var myOpensApp = angular
					.module("OpensModule", []) 
					.controller("myOpensController", function ($scope){
						$scope.message = "Opens Report";	
					});



