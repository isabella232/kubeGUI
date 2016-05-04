app.factory('model', function($rootScope) {
  var obj = {};

  var socket;
  var url;
  var dataStore = {};

  obj.start = function() {
    dataStore = obj.getEmptyDataStore();
    //start
  }

  obj.parse = function() {
    //parse
  }

  obj.parsePod = function() {
    //parsePod
  }

  obj.parseRC = function() {
    //parseRC
  }

  obj.parseService = function() {
    //parseService
  }

  obj.getEmptyDataStore = function() {
    return {
      pods: [],
      replicationcontrollers: [],
      services: []
    }
  }

  return obj;
});
