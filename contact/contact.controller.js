(function() {

   angular
      .module('app')
      .controller('ContactController', ContactController);

   ContactController.$inject = ['$scope'];
       
    function ContactController($scope) {
        $scope.Miles_Logo = 'miles_logo_large_166px_0.png';
        $scope.contact_message = "If you have any trouble with this web application please contact your supervisor.";

    	 	
    	        }; //ends ContactController function
})(); //ends file
