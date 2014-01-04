var useCachedData = true;

var config = {
  feed: "list",
  scopes: 'https://spreadsheets.google.com/feeds'
};

(function () {
  if(useCachedData) {
    parseSpreadsheetData(cachedData);
  }
})();

// Functions for fetching data from google docs
function handleClientLoad() {
  if(!useCachedData) {
    gapi.client.setApiKey(credentials.apiKey);
    window.setTimeout(checkAuth,1);
  }
}

function checkAuth() {
    gapi.auth.authorize({client_id: credentials.clientId, scope: config.scopes, immediate: false}, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authButton = document.getElementById('authButton');
    authButton.style.display = 'none';
    if (authResult && !authResult.error) {
        loadClient();
    } else {
        console.log('failed auth', authResult);
        authButton.style.display = 'block';
        authButton.onclick = checkAuth;
    }
}

function loadClient() {
    var token = gapi.auth.getToken().access_token;
    var feedUrl = "https://spreadsheets.google.com/feeds/" + config.feed + "/" + credentials.key + "/od6/private/full?alt=json&access_token=" + token;
    $.get(feedUrl, parseSpreadsheetData);
}

// Parse and process a dataset and create graphs
function parseSpreadsheetData(data) {
  var model = new Tabletop.Model( { data: data,
                                    parseNumbers: false,
                                    postProcess: false,
                                    tabletop: undefined } );

  var property = "happiness";

  // Reformat the data
  var data = model.elements.map(function(element) {
    return reformat(element, property);
  });

  plotData(data, property);
};

// Helpers
function reformat(d, property) {
  if (d[property] != "") {
    d[property] = +d[property];
  } else {
    d[property] = undefined;
  }
  d.date = parseDate(d.date);
  return d;
}

function parseDate(date) {
  return d3.time.format("%-m/%-d/%Y").parse(date);
}


// Plotting the data
function plotData(data, property) {
  var margin = {top: 20, right: 20, bottom: 50, left: 40},
  width = 960 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

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

  var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, (function(d) { return d.date; })));
  y.domain(d3.extent(data, (function(d) { return d[property]; })));

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
      console.log(d);
      return d[property] != null; })
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d[property]); });

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  // Draw dots
  svg.selectAll(".dot")
    .data(data.filter(function(d) { return d[property]; }))
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5);
}
