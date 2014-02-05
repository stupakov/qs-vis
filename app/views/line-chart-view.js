if("undefined" == typeof(App)) { App = {}; }

App.LineChartView = App.ChartView.extend({
  template: function() {
    return _.template($('#line-chart-view').html());
  },

  columnSelected: function(event) {
    var selectedColumn = $(event.target).val();
    var graphElement = this.$el.find(".graph").get(0);
    this.qsVis.plotColumn(graphElement, selectedColumn);
  }
});
