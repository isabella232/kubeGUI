kubeGUI.controller('HeaderController', function($scope, $location) {
  /**
 * Compares given location with real location, returns true or false.
 * @param {String} viewLocation
 * @return {boolean}
 */
  $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
  };
});

// Controller of Home Page
kubeGUI.controller('homeController', function($scope) {
  $scope.title = "Welcome to the KubeGUI";
});

// Controller of Pods Page
kubeGUI.controller('podsController', function($scope, model, $sce) {
  // Start Connection and get the pods from the dataStore
  model.start('pods');
  $scope.pods = model.getDataStore('pods');
  // Watch variable status to render connection status in realtime
  // and trust String to render it on the Page
  $scope.$watch(function() {
    $scope.status = $sce.trustAsHtml(model.getStatus());
  });
});

// Controller of Replicationcontrollers Page
kubeGUI.controller('rcController', function($scope, model, $sce) {
  // Start Connection and get the replicationcontrollers from the dataStore
  model.start('replicationcontrollers');
  $scope.replicationcontrollers = model.getDataStore('replicationcontrollers');
  // Watch variable status to render connection status in realtime
  // and trust String to render it on the Page
  $scope.$watch(function() {
    $scope.status = $sce.trustAsHtml(model.getStatus());
  });
});

// Controller of Services Page
kubeGUI.controller('servicesController', function($scope, model, $sce) {
  // Start Connection and get the services from the dataStore
  model.start('services');
  $scope.services = model.getDataStore('services');
  // Watch variable status to render connection status in realtime
  // and trust String to render it on the Page
  $scope.$watch(function() {
    $scope.status = $sce.trustAsHtml(model.getStatus());
  });
});
