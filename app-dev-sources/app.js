(function() {

  angular
    .module('app', ['ngRoute', 'ngCookies','ngMaterial', 'ngAnimate', 'ngMessages'])
    .config(config)
    .run(run);

  config.$inject = ['$routeProvider', '$locationProvider'];

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeController',
        templateUrl: 'home/home.view.html',
        controllerAs: 'vm'
      })

     .when('/about', {
      controller: 'AboutController',
      templateUrl: 'about/about.view.html',
      controllerAs: 'vm'
      })  
 
      .when('/contact', {
      controller: 'ContactController',
      templateUrl: 'contact/contact.view.html',
      controllerAs: 'vm'
      }) 
      
      .when('/create-report', {
      controller: 'CreateReportController',
      templateUrl: 'create-report/create_report.view.html',
      controllerAs: 'vm'
      })
      
      .when('/device-usage-report', {
      controller: 'DeviceUsageController',
      templateUrl: 'device-usage-report/device_usage.view.html',
      controllerAs: 'vm'
      }) 
      
      .when('/home', {
        controller: 'HomeController',
        templateUrl: 'home/home.view.html',
        controllerAs: 'vm'
      })
      
      .when('/link-performance-report', {
      controller: 'LinkPerformanceController',
      templateUrl: 'link-performance-report/link_performance.view.html',
      controllerAs: 'vm'
      }) 
      
      .when('/list-effectiveness-report', {
      controller: 'ListEffectivenessController',
      templateUrl: 'list-effectiveness-report/list_effectiveness.view.html',
      controllerAs: 'vm'
      })
      
    .when('/login', {
      controller: 'LoginController',
      templateUrl: 'login/login.view.html',
      controllerAs: 'vm'
      })

     .when('/opens-report', {
      controller: 'OpensController',
      templateUrl: 'opens-report/opens.view.html',
      controllerAs: 'vm'
      })
      
    .when('/register', {
      controller: 'RegisterController',
      templateUrl: 'register/register.view.html',
      controllerAs: 'vm'
      })
   

    .otherwise({
      redirectTo: '/login'
      });
  }

  run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

  function run($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
      var loggedIn = $rootScope.globals.currentUser;
      if (restrictedPage && !loggedIn) {
        $location.path('/login');
      }

    });
  }

})();