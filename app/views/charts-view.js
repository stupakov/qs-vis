if("undefined" == typeof(App)) { App = {}; }

App.ChartsView = Backbone.View.extend({
  initialize: function(options) {
    this.qsVis = options.qsVis;

    this.template = _.template($('#charts-view').html());

    this.subviews = [];
  },

  events: {
    "click .add-line-chart" : function() {
      this.addLineChart();
    },

    "click .add-scatter-chart" : function() {
      this.addScatterChart();
    }
  },

  addLineChart: function() {
    var $element = $("<div class='chart-container'></div>");
    this.$el.append($element);

    var subview = new App.LineChartView({
      qsVis: this.qsVis,
      $el: $element
    });

    this.subviews.push(subview);
    subview.render();
  },

  addScatterChart: function() {
    var $element = $("<div class='chart-container'></div>");
    this.$el.append($element);

    var subview = new App.ScatterChartView({
      qsVis: this.qsVis,
      $el: $element
    });

    this.subviews.push(subview);
    subview.render();
  },

  render: function() {
    this.$el.html(this.template);
    this.addLineChart();
    return this;
  }
})

