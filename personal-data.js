var feed = "list";
var scopes = 'https://spreadsheets.google.com/feeds';

function handleClientLoad() {
    gapi.client.setApiKey(credentials.apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: credentials.clientId, scope: scopes, immediate: false}, handleAuthResult);
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
    var feedUrl = "https://spreadsheets.google.com/feeds/" + feed + "/" + credentials.key + "/od6/private/full?alt=json&access_token=" + token;
    $.get(feedUrl, parseSpreadsheetData);
}

function parseSpreadsheetData(data) {
  var model = new Tabletop.Model( { data: data,
                                    parseNumbers: false,
                                    postProcess: false,
                                    tabletop: undefined } );
  plotData(model);
};










function plotData(model) {
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


  // Reformat the data
  var data = model.elements.map(function(element) {
    return reformat(element);
  });

  x.domain(d3.extent(data, (function(d) { return d.date; })));
  y.domain(d3.extent(data, (function(d) { return d.weight; })));

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
  .text("Weeks");

  // Draw line
  var line = d3.svg.line()
    .defined(function(d) {
      console.log(d);
      return d.weight != null; })
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.weight); });

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  // Draw dots
  svg.selectAll(".dot")
    .data(data.filter(function(d) { return d.weight; }))
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5);

  // Helpers
  function reformat(d) {
    console.log(d.weight);
    if (d.weight != "") {
      d.weight = +d.weight;
    } else {
      d.weight = undefined;
    }
    d.date = parseDate(d.date);
    return d;
  }

  function parseDate(date) {
    return d3.time.format("%-m/%-d/%Y").parse(date);
  }
}
