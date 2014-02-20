if("undefined" == typeof(App)) { App = {}; }

App.ChartView = Backbone.View.extend({
  initialize: function(options) {
    this.qsVis = options.qsVis;
    this.$el = options.$el;
  },

  events: {
    "change .columns" : "columnSelected"
  },

  render: function() {
    var self = this;
    this.$el.html(this.template);
    $.each(this.$el.find(".columns"), function($dropdown) {
      self.populateDropdown(self.qsVis.columnNames);
    });
    this.$el.find(".columns").trigger("change");
    return this;
  },

  populateDropdown: function(columnNames) {
    var $columnsDropdown = this.$el.find(".columns");

    columnNames.forEach(function(columnName) {
      $columnsDropdown.append(
        $("<option></option>").
        attr("value", columnName).
        text(columnName)
      );
    })
  }
});
