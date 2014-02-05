if("undefined" == typeof(App)) { App = {}; }

App.ScatterChartView = App.ChartView.extend({
  template: function() {
    return _.template($('#scatter-chart-view').html());
  },

  columnSelected: function(event) {
    var $columns = this.$el.find(".columns");
    var selectedColumns = $columns.map(function(index, column) {
      return $(column).val();
    });

    var graphElement = this.$el.find(".graph").get(0);

    this.qsVis.plotScatter(graphElement, selectedColumns[0], selectedColumns[1]);
  }
});
