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
  }

  obj.parse = function(data, kind) {
    var jsonData;
    jsonData = JSON.parse(data);

    var value = {
      uid: jsonData.object.metadata.uid,
      name: jsonData.object.metadata.name,
      namespace: jsonData.object.metadata.namespace
    }

    if(kind != 'services' && jsonData.type != 'DELETED') {
      value.containers = [];
      value.containers = obj.getContainers(jsonData.object.spec.containers);
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
    if (jsonData.type == 'ADDED' || jsonData.type == 'MODIFIED') {
      value.nodeName = jsonData.object.spec.nodeName;
      value.hostIP = jsonData.object.status.hostIP;
    }

    if (jsonData.type == 'ADDED') {
      dataStore[kind].push(value);
    } else if (jsonData.type == 'MODIFIED') {
      obj.modifyItem(value, kind);
    } else if (jsonData.type == 'DELETED') {
      obj.deleteItem(jsonData.object.metadata.uid, kind);
    }
    $rootScope.$apply();
  }

  obj.parseRC = function() {
    //parseRC
  }

  obj.parseService = function() {
    //parseService
  }

  obj.modifyItem = function(newValue, kind) {
    for (var i = 0; i < dataStore[kind].length; i++) {
      if (dataStore[kind][i].uid == newValue.uid) {
        dataStore[kind][i] = newValue;
        break;
      }
    }
  }

  obj.deleteItem = function(uid, kind) {
    for (var i = 0; i < dataStore[kind].length; i++) {
      if (dataStore[kind][i].uid == uid) {
        dataStore[kind].splice(i, 1);
        break;
      }
    }
  }

  obj.getContainers = function(containersIn) {
    var containersOut = [];
    containersIn.forEach(function(entry) {
      var container = {
        name: entry.name,
        image: entry.image
      }
      containersOut.push(container);
    });
    return containersOut;
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
