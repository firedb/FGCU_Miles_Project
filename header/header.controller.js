(function() {

	   angular
	      .module('app')
      .controller('HeaderController', HeaderController);

	   HeaderController.$inject = ['$scope'];
       
   function HeaderController($scope) {
 
       $scope.Miles_Logo = 'miles_images/miles_logo_large_166px_0.png';
   	   
   	   
   	   var logged_in_bool = localStorage.getItem("logged_in_bool");   	 
   	
   	   if(logged_in_bool){
   	   	   $scope.current_user_firstname = localStorage.getItem("current_logged_in_user");   	 
   	       document.getElementById("current_user_id").style.display = "inline-block";
   	   					 }
	   
     	$scope.logOutAction = function(){
        localStorage.setItem("logged_in_bool", false);
   		document.getElementById("current_user_id").style.display = "none";
   									    }
}; //ends HeaderController function
})(); //ends file
