
/// <reference path = "angular.js" />

//create a module, controller and register the controller with method chaining
//At the moment, there are no dependencies in the array
var myListEffectivenessApp = angular
								.module("ListEffectivenessModule", []) 
								.controller("myListEffectivenessController", function ($scope){
									$scope.message = "List Effectiveness Report";	
								});
