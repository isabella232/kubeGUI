kubeGUI.config(function($routeProvider) {
  $routeProvider

    .when('/', {
    templateUrl: 'views/home.html',
    controller: 'homeController'
  })

  .when('/pods', {
    templateUrl: 'views/pods.html',
    controller: 'podsController'
  })

  .when('/rc', {
    templateUrl: 'views/rc.html',
    controller: 'rcController'
  })

  .when('/services', {
    templateUrl: 'views/services.html',
    controller: 'servicesController'
  });
});
