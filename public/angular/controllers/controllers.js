kubeGUI.controller('HeaderController', function($scope, $location) {
  $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
  };
});

kubeGUI.controller('homeController', function($scope) {
  $scope.message = 'Home';
});

kubeGUI.controller('podsController', function($scope, model, $sce) {
  model.start('pods');
  $scope.pods = model.getDataStore('pods');
  $scope.$watch(function() {
    $scope.status = $sce.trustAsHtml(model.getStatus());
  });
});

kubeGUI.controller('rcController', function($scope, model, $sce) {
  model.start('replicationcontrollers');
  $scope.replicationcontrollers = model.getDataStore('replicationcontrollers');
  $scope.$watch(function() {
    $scope.status = $sce.trustAsHtml(model.getStatus());
  });
});

kubeGUI.controller('servicesController', function($scope) {
  $scope.message = 'Services';
});
