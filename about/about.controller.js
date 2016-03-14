(function() {

   angular
      .module('app')
      .controller('AboutController', AboutController);

   AboutController.$inject = ['$scope'];
       
    function AboutController($scope) {
        $scope.about_message = "This web application was developed by a group of students at Florida Gulf Coast University." +
        						"The application allows an employee to run reports on email usage behavior collected by the company.";

    	 	
    	        }; //ends AboutController function
})(); //ends file
