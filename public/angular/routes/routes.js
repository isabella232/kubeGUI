kubeGUI.config(function($routeProvider) {
  /* Sets the HTML file (templateUrl) and the controller (controller) for each entry
  with AngularJS Routing */
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
