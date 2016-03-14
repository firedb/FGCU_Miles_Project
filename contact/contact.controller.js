(function() {

   angular
      .module('app')
      .controller('ContactController', ContactController);

   ContactController.$inject = ['$scope'];
       
    function ContactController($scope) {
        $scope.contact_message = "If you have any trouble with this web application please contact your supervisor.";
    	 	
    	        }; //ends ContactController function
})(); //ends file
