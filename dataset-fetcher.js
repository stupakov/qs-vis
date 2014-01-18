function datasetFetcher(options) {
  this.api = options.api;
  this.config = options.config;
  this.credentials = options.credentials;
  this.callback = options.callback;

  var self = this;

  this.fetchDataset = function() {
    this.api.client.setApiKey(this.credentials.apiKey);
    window.setTimeout(checkAuth,1);
  };

  // private functions
  var checkAuth = function() {
    console.log("checkauth");
      self.api.auth.authorize({
        client_id: self.credentials.clientId,
        scope: self.config.scopes,
        immediate: false
      }, handleAuthResult);
  };

  // TODO: get rid of this retry stuff (or decouple from DOM)
  var handleAuthResult = function(authResult) {
      var authButton = document.getElementById('authButton');
      authButton.style.display = 'none';
      if (authResult && !authResult.error) {
          loadClient();
      } else {
          console.log('failed auth', authResult);
          authButton.style.display = 'block';
          authButton.onclick = self.checkAuth;
      }
  };

  var loadClient = function() {
      var token = self.api.auth.getToken().access_token;
      var feedUrl = "https://spreadsheets.google.com/feeds/" + self.config.feed + "/" + self.credentials.key + "/od6/private/full?alt=json&access_token=" + token;
      $.get(feedUrl, self.callback);
  };
}


