if("undefined" == typeof(App)) { App = {}; }

App.ChartsView = Backbone.View.extend({
  initialize: function(options) {
    this.qsVis = options.qsVis;

    this.subviews = [
      new App.ChartView({
        qsVis: this.qsVis,
        el: this.$el.find("#chart-container")
      })
    ];
  },

  render: function() {
    this.renderSubviews();
  },

  renderSubviews: function() {
    _.each(this.subviews, function(subview) {
      subview.render();
    });
  }
})

