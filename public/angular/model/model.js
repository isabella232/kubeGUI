kubeGUI.factory('model', function($rootScope, $location, $http) {
  var obj = {};

  var status = '';
  var socket;
  /* Get URL, split it at the hashtag and get the first part. Needed for requests and
   * socket connection */
  var url = $location.absUrl().split('#')[0];
  var dataStore = {};

  /**
 * HTTP Request to check status of Kubernetes Cluster, start socket connection
 * when status request was successful
 * @param {String} kind
 * @return {void}
 */
  obj.start = function(kind) {
    // Clear dataStore
    dataStore = obj.getEmptyDataStore();
    status = 'Connecting...';

    // HTTP Request /status. Append green tick or red cross.
    $http({
      method: 'GET',
      url: url + 'status'
    }).then(function successCallback(response) {
      status = response.data.status +
      ' <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>';
      // Remove any existing socket connection
      if(socket != null) {
        socket.disconnect();
      }
      // Start connection and send start event to start the watch request of the webserver
      socket = io(url);
      socket.emit('start', kind);
      // When an update comes, call parse.
      socket.on('update', function(data) {
        obj.parse(data, kind);
      });
    }, function errorCallback(response) {
      status = response.data.status +
      ' <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>';
    });
  }

  /**
 * Parses the String (data) into JSON, creates value object,
 * switch case for specific parse function
 * @param {String} data
 * @param {String} kind
 * @return {void}
 */
  obj.parse = function(data, kind) {
    var jsonData = JSON.parse(data);

    // Create value object with important values
    var value = {
      uid: jsonData.object.metadata.uid,
      name: jsonData.object.metadata.name,
      namespace: jsonData.object.metadata.namespace
    }

    /* If it's a pod or a replicationcontroller and it's not "DELETED", then add
     * the containers
    */
    if(kind != 'services' && jsonData.type != 'DELETED') {
      value.containers = [];
      if(kind == 'pods') {
        value.containers = obj.getContainers(jsonData.object.spec.containers);
      }
      else {
        value.containers = obj.getContainers(jsonData.object.spec.template.spec.containers);
      }
    }

    // Call the specific parse function
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
 * Adds, modifies or deletes a pod to / from the dataStore
 * @param {String} kind
 * @param {Object} jsonData
 * @param {Object} value
 * @return {void}
 */
  obj.parsePod = function(kind, jsonData, value) {
    // If not deleted, then add more information
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
    // Refresh
    $rootScope.$apply();
  }

  /**
 * Adds, modifies or deletes a replicationcontroller to / from the dataStore
 * @param {String} kind
 * @param {Object} jsonData
 * @param {Object} value
 * @return {void}
 */
  obj.parseRC = function(kind, jsonData, value) {
    // If not deleted, then add more information
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
    // Refresh
    $rootScope.$apply();
  }

  /**
 * Adds, modifies or deletes a service to / from the dataStore
 * @param {String} kind
 * @param {Object} jsonData
 * @param {Object} value
 * @return {void}
 */
  obj.parseService = function(kind, jsonData, value) {
    // If not deleted, then add more informations
    if(jsonData.type != 'DELETED') {
      value.clusterIP = jsonData.object.spec.clusterIP;
      value.type = jsonData.object.spec.type;
      value.ports = jsonData.object.spec.ports;
    }

    if(jsonData.type == 'ADDED') {
      dataStore[kind].push(value);
    } else if (jsonData.type == 'MODIFIED') {
      obj.modifyItem(value, kind);
    } else if (jsonData.type == 'DELETED') {
      obj.deleteItem(value.uid, kind);
    }
    // Refresh
    $rootScope.$apply();
  }

  /**
 * Modifies item by saving the newValue to a specific element in the dataStore
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

  /**
 * Deletes item of the dataStore by given uid
 * @param {String} uid
 * @param {String} kind
 * @return {void}
 */
  obj.deleteItem = function(uid, kind) {
    for (var i = 0; i < dataStore[kind].length; i++) {
      if (dataStore[kind][i].uid == uid) {
        dataStore[kind].splice(i, 1);
        break;
      }
    }
  }

  /**
 * Create Array of Containers with name and image and returns it
 * @param {Array} containersIn
 * @return {Array} containersOut
 */
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

  /**
 * Returns an empty dataStore for the start function to clear the dataStore
 * @return {Object}
 */
  obj.getEmptyDataStore = function() {
    return {
      pods: [],
      replicationcontrollers: [],
      services: []
    }
  }

  /**
 * Get function for Controller. Returns specific Array of dataStore object by given kind
 * @param {String} kind
 * @return {Array}
 */
  obj.getDataStore = function(kind) {
    return dataStore[kind];
  }

  /**
 * Returns the status variable to show the status of the connection
 * @return {String} status
 */
  obj.getStatus = function() {
    return status;
  }

  return obj;
});
