kubeGUI.factory('model', function($rootScope, $location) {
  var obj = {};

  var socket;
  var url = $location.absUrl().split('#')[0];
  var dataStore = {};

  obj.start = function(kind) {
    dataStore = obj.getEmptyDataStore();
    var socket = io(url);
    socket.emit('start', kind);
    socket.on('update', function(data) {
      obj.parse(data, kind);
    });
    //start
  }

  obj.parse = function(data, kind) {
    var jsonData;
    jsonData = JSON.parse(data);

    var value = {
      uid: jsonData.object.metadata.uid,
      name: jsonData.object.metadata.name,
      namespace: jsonData.object.metadata.namespace
    }

    switch (kind) {
      case 'pods':
        obj.parsePod(kind, jsonData, value);
        break;
      case 'replicationcontrollers':
        //Parse RC
        break;
      case 'services':
        //Parse SVC
        break;
    }
  }

  obj.parsePod = function(kind, jsonData, value) {
    if (jsonData.type == 'ADDED' ||  jsonData.type == 'MODIFIED') {
      value.nodeName = jsonData.object.spec.nodeName;
      value.hostIP = jsonData.object.status.hostIP;
      value.containers = [];
      jsonData.object.spec.containers.forEach(function(entry) {
        var container = {
          name: entry.name,
          image: entry.image
        }
        value.containers.push(container);
      });
    }

    if (jsonData.type == 'ADDED') {
      dataStore[kind].push(value);
    } else if (jsonData.type == 'MODIFIED') {
      for (var i = 0; i < dataStore[kind].length; i++) {
        if (dataStore[kind][i].uid == value.uid) {
          dataStore[kind][i] = value;
          break;
        }
      }
    } else if (jsonData.type == 'DELETED') {
      console.log('DELETED');
      for (var i = 0; i < dataStore[kind].length; i++) {
        if (dataStore[kind][i].uid == value.uid) {
          dataStore[kind].splice(i, 1);
          break;
        }
      }
    }
    $rootScope.$apply();
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

  obj.getDataStore = function(kind) {
    return dataStore[kind];
  }

  return obj;
});
