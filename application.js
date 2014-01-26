(QsVisApp = function(config){
  this.config = config;
  this.qsVis = new QsVis(config); // TODO: strip out useCachedData before passing in

  if(config.useCachedData) {
    this.qsVis.fetchCachedData({
      success: this.fetchCompleteHandler.bind(this)
    }); // dataset stored internally.
  } else {
    // TODO: fetcher (or null fetcher) should be passed in
    // TODO: wait for gapiClientDidLoad before fetching data
    // this.qsVis.fetchData({
     // success: this.fetchCompleteHandler
    // }); // dataset stored internally.
  }
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
