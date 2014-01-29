var ChartView = Backbone.View.extend({
  initialize: function(options) {
    this.qsVis = options.qsVis;
  },

  events: {
    "change #columns" : "columnSelected"
  },

  render: function() {
    this.populateDropdown(this.qsVis.columnNames);
    this.$el.find("#columns").trigger("change");
  },

  populateDropdown: function(columnNames) {
    var $columnsDropdown = this.$el.find("#columns");

    columnNames.forEach(function(columnName) {
      $columnsDropdown.append(
        $("<option></option>").
        attr("value", columnName).
        text(columnName)
      );
    })
  },

  columnSelected: function(event) {
    var selectedColumn = $(event.target).val();
    var graphElement = this.$el.find(".graph").get(0);
    this.qsVis.plotColumn(graphElement, selectedColumn);
  }
});

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
  this.chartView = new ChartView({
    el: "#chart-container",
    qsVis: this.qsVis
  });

  this.qsVis.fetchData({
    success: this.fetchCompleteHandler.bind(this)
  }); // dataset stored internally.
}).prototype = {
  fetchCompleteHandler: function() {
    this.chartView.render();
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
