if("undefined" == typeof(App)) { App = {}; }

App.ChartView = Backbone.View.extend({
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
