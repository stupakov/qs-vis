(QsVisApp = function(config){
  this.config = config;
  var fetcher;

  // TODO credentials should be passed in to QsVisApp
  if(config.useCachedData) {
    fetcher = new cachedDatasetFetcher();
  } else {
    fetcher = new datasetFetcher({
      api: gapi,
      config: config,  // TODO strip out useCachedData
      credentials: credentials
    });
  }

  this.qsVis = new QsVis(fetcher);
  this.chartsView = new App.ChartsView({
    el: "#charts-container",
    qsVis: this.qsVis
  });

  this.qsVis.fetchData({
    success: this.fetchCompleteHandler.bind(this)
  }); // dataset stored internally.
}).prototype = {
  fetchCompleteHandler: function() {
    this.chartsView.render();
  }
}

$(function () {
  config = {
    useCachedData: true,
    feed: "list",
    scopes: 'https://spreadsheets.google.com/feeds'
  };

  window.qsVisApp = new QsVisApp(config);
});


// TODO: implement this
function gapiClientDidLoad() {
}
