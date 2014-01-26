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

  this.qsVis.fetchData({
    success: this.fetchCompleteHandler.bind(this)
  }); // dataset stored internally.
}).prototype = {
  fetchCompleteHandler: function() {
    this.columnNames = this.qsVis.columnNames;
    this.populateDropdown(this.columnNames);
    $("#columns").trigger("change");
  },

  // DOM handling
  populateDropdown: function(columnNames) {
    var self = this;
    var $columnsDropdown = $("#columns");

    columnNames.forEach(function(columnName) {
      $columnsDropdown.append(
        $("<option></option>").
        attr("value", columnName).
        text(columnName)
      );
    })

    $columnsDropdown.change(function(event) {
      var selectedColumn = $(event.target).val();
      self.qsVis.plotColumn(".graph", selectedColumn);
    })
  },

  'The' : 'End'
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
