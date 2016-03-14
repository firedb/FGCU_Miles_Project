(function() {

   angular
      .module('app')
      .controller('FooterController', FooterController);

   FooterController.$inject = ['$scope'];
       
   function FooterController($scope) {
 
	   $scope.current_year = new Date().getFullYear();

	   $scope.logOutAction = function(){
	        localStorage.setItem("logged_in_bool", false);
	   		document.getElementById("current_user_id").style.display = "none";
	   									}
}; //ends FooterController function
})(); //ends file
