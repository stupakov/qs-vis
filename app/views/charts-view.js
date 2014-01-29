if("undefined" == typeof(App)) { App = {}; }

App.ChartsView = Backbone.View.extend({
  initialize: function(options) {
    this.qsVis = options.qsVis;

    this.template = _.template($('#charts-view').html());

    this.subviews = [];
    this.addChart();
  },

  events: {
    "click .add-chart" : function() {
      this.addChart();
      this.render();
    }
  },

  addChart: function() {
    var subview = new App.ChartView({
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

