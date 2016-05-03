var kubeGUI = angular.module('kubeGUI', ['ngRoute']);

// configure our routes
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

kubeGUI.controller('homeController', function($scope) {
  $scope.message = 'Home';
});

kubeGUI.controller('podsController', function($scope) {
  $scope.message = 'Pods';
});

kubeGUI.controller('rcController', function($scope) {
  $scope.message = 'Replicationcontrollers';
});

kubeGUI.controller('servicesController', function($scope) {
  $scope.message = 'Services';
});
