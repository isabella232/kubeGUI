// Read variables of Kubernetes Authentication from Environment and export it.
var host = process.env.KUBEGUIHOST || process.env.KUBERNETES_SERVICE_HOST;
var port = process.env.KUBEGUIPORT || process.env.KUBERNETES_SERVICE_PORT || '443';
var username = process.env.KUBEGUIUSERNAME;
var password = process.env.KUBEGUIPASSWORD;
var url = 'https://' + host + ':' + port + '/api/v1';

var options = {
  url: url,
  auth: {
    user: username,
    password: password
  },
  rejectUnauthorized: false
}

exports.options = options;
