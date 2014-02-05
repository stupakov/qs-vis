if("undefined" == typeof(App)) { App = {}; }

App.ChartsView = Backbone.View.extend({
  initialize: function(options) {
    this.qsVis = options.qsVis;

    this.template = _.template($('#charts-view').html());

    this.subviews = [];
    this.addLineChart();
  },

  events: {
    "click .add-line-chart" : function() {
      this.addLineChart();
      this.render();
    },

    "click .add-scatter-chart" : function() {
      this.addScatterChart();
      this.render();
    }
  },

  addLineChart: function() {
    var subview = new App.LineChartView({
      qsVis: this.qsVis,
    });

    this.subviews.push(subview);
  },

  addScatterChart: function() {
    var subview = new App.ScatterChartView({
      qsVis: this.qsVis,
    });

    this.subviews.push(subview);
  },

  render: function() {
    this.$el.html(this.template);
    this.renderSubviews();
    return this;
  },

  // TODO: this re-renders all the charts!
  // should leave existing charts as-is.
  renderSubviews: function() {
    var self = this;
    _.each(this.subviews, function(subview) {
      var $element = $("<div class='chart-container'></div>");
      self.$el.append($element);
      subview.setElement($element);
      subview.render();
    });
  }
})

