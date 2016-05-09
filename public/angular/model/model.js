kubeGUI.factory('model', function($rootScope, $location, $http) {
  var obj = {};

  var status = '';
  var socket;
  var url = $location.absUrl().split('#')[0];
  var dataStore = {};

  obj.start = function(kind) {
    dataStore = obj.getEmptyDataStore();
    status = 'Connecting...';

    $http({
      method: 'GET',
      url: url + 'status'
    }).then(function successCallback(response) {
      status = response.data.status +
      ' <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>';
      if(socket != null) {
        socket.disconnect();
      }
      socket = io(url);
      socket.emit('start', kind);
      socket.on('update', function(data) {
        obj.parse(data, kind);
      });
    }, function errorCallback(response) {
      status = response.data.status +
      ' <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>';
    });
  }

  obj.parse = function(data, kind) {
    var jsonData = JSON.parse(data);

    var value = {
      uid: jsonData.object.metadata.uid,
      name: jsonData.object.metadata.name,
      namespace: jsonData.object.metadata.namespace
    }

    if(kind != 'services' && jsonData.type != 'DELETED') {
      value.containers = [];
      if(kind == 'pods') {
        value.containers = obj.getContainers(jsonData.object.spec.containers);
      }
      else {
        value.containers = obj.getContainers(jsonData.object.spec.template.spec.containers);
      }
    }

    switch (kind) {
      case 'pods':
        obj.parsePod(kind, jsonData, value);
        break;
      case 'replicationcontrollers':
        obj.parseRC(kind, jsonData, value);
        break;
      case 'services':
        obj.parseService(kind, jsonData, value);
        break;
    }
  }

  /**
 * Adds, deleted or modifies a pod to the dataStore
 * @param {String} kind
 * @param {Object} jsonData
 * @param {Object} value
 * @return {void}
 */
  obj.parsePod = function(kind, jsonData, value) {
    if (jsonData.type != 'DELETED') {
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

  /**
 * Adds, deleted or modifies a replicationcontroller to the dataStore
 * @param {String} kind
 * @param {Object} jsonData
 * @param {Object} value
 * @return {void}
 */
  obj.parseRC = function(kind, jsonData, value) {
    if(jsonData.type != 'DELETED') {
      value.desiredReplicas = jsonData.object.spec.replicas;
      value.realReplicas = jsonData.object.status.replicas;
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

  obj.parseService = function(kind, jsonData, value) {
    if(jsonData.type != 'DELETED') {
      value.clusterIP = jsonData.object.spec.clusterIP;
      value.type = jsonData.object.spec.type;
      value.ports = obj.getPorts(jsonData.object.spec.ports);
    }
    dataStore[kind].push(value);
    $rootScope.$apply();
  }
  
  /**
 * Adds, deleted or modifies a replicationcontroller to the dataStore
 * @param {Object} newValue
 * @param {String} kind
 * @return {void}
 */
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

  obj.getPorts = function(portsIn) {
    var portsOut = [];
    portsIn.forEach(function(entry) {
      var port = {
        name: entry.name,
        protocol: entry.protocol,
        port: entry.port,
        targetPort: entry.targetPort
      }
      portsOut.push(port);
    });
    return portsOut;
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

  obj.getStatus = function() {
    return status;
  }

  return obj;
});
