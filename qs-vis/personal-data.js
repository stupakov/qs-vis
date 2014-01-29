var squareWindow = [.4,.6,.8,1,.8,.6,.4];

// TODO: fix missing values at ends
function convolve(values, windowValues, windowOffset) {
  // initialize weights and result to array of zeros
  var length = values.length;
  var weights = [];
  var result = [];
  while(--length >= 0) {
    weights[length] = 0;
    result[length] = 0;
  }

  // set each value in the result to the sum of all contributing values
  // save the total weight of contributing values
  // then divide each sum by the total weight to get weighted value
  values.forEach(function(value, valueIndex) {
    windowValues.forEach(function(coefficient, windowIndex) {
      resultIndex = valueIndex - windowIndex + windowOffset;
      if((resultIndex < 0) ||
         (resultIndex > values.length - 1) ||
          "undefined" == typeof(value)
        ) {
        return;
      }

      weights[resultIndex] = weights[resultIndex] + coefficient;
      result[resultIndex] = result[resultIndex] + coefficient*value;
    })
  });

  result.forEach(function(value, index) {
    if(weights[index] == 0) {
      result[index] = undefined;
    } else {
      result[index] = result[index] / weights[index];
    }
  });

  return result;
}

function filterData(data, property) {
  var values = data.map(function(el) {
    return el[property];
  });

  values = convolve(values, squareWindow, 3);

  return data.map(function(el, index) {
    return {
      date: el.date,
      value: values[index]
    };
  });
}

function pickData(data, property) {
  return data.map(function(el) {
    return {
      date: el.date,
      value: el[property]
    };
  });
}

// Plotting the data
function plotData(elementSelector, property, fullData) {
  var margin = {top: 20, right: 20, bottom: 50, left: 40},
  width = 960 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  var data = pickData(fullData, property);
  var filteredData = filterData(fullData, property);

  var x = d3.time.scale()
  .range([0, width]);

  var y = d3.scale.linear()
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10);

  d3.select(elementSelector).select("svg").remove();
  var svg = d3.select(elementSelector).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, (function(d) { return d.date; })));
  y.domain(d3.extent(data, (function(d) { return d.value; })));

  // Date axis
  var dateAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 20) + ")")
      .call(dateAxis);

  // Y axis
  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text(property);

  // Draw line
  var line = d3.svg.line()
    .defined(function(d) {
      return d.value != null; })
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  svg.append("path")
    .datum(filteredData)
    .attr("class", "redline")
    .attr("d", line);

  // Draw dots
  svg.selectAll(".dot")
    .data(data.filter(function(d) {
      return d.value != undefined;
    }))
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3);
}


(QsVis = function(fetcher){
  this.fetcher = fetcher;
}).prototype = {

  fetchData: function(options) {
    var self = this;
    this.fetcher.fetchDataset({
      callback: function(dataset) {
        self.parseSpreadsheetData.bind(self)(dataset);
        options.success();
      }
    });
  },

  plotColumn: function(elementSelector, selectedColumn) {
    plotData(elementSelector, selectedColumn, this.allData);
  },

  // TODO: this should be private
  // Parse and process a dataset
  // turns a spreadsheet into an array of objects (rows).
  // The keys of each row are "date" plus all the column names
  parseSpreadsheetData: function(dataset) {
    var self = this;
    var model = new Tabletop.Model( { data: dataset,
                                      parseNumbers: false,
                                      postProcess: false,
                                      tabletop: undefined } );

    // save off the column names
    this.columnNames = model.column_names;

    // Reformat the data
    this.allData = model.elements.map(function(element) {
      return self.reformat(element, self.columnNames);
    });
  },

  // Helpers
  //
  // date -> d3 parsed date
  // "y" -> 1.0
  // "n" -> 0.0
  // all numbers -> float
  // everything else -> undefined
  reformat: function(d, columnNames) {
    columnNames.forEach(function(columnName) {
      if(columnName != "date") {
        if(d[columnName] === "y") {
          d[columnName] = 1.0;
        }
        if(d[columnName] === "n") {
          d[columnName] = 0.0;
        }
        if (d[columnName] === "" || isNaN(d[columnName])) {
          d[columnName] = undefined;
        } else {
          d[columnName] = +d[columnName];
        }
      }
    });
    d.date = this.parseDate(d.date);
    return d;
  },

  parseDate: function (date) {
    return d3.time.format("%-m/%-d/%Y").parse(date);
  },

  'The' : 'End'
}
