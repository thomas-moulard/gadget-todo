_IG_RegisterOnloadHandler(loadAPI);

function loadAPI() {
  google.load('visualization', '1');
  google.setOnLoadCallback(init);
}

var prefs = null;

function init() {
  prefs = new _IG_Prefs();
  var title = prefs.getString('title');
  if (title) {
    _IG_SetTitle(title);
  }
  sendQuery();
}

var gadgetHelper = null;
function sendQuery() {
  gadgetHelper = gadgetHelper || new google.visualization.GadgetHelper();
  var query = gadgetHelper.createQueryFromPrefs(prefs);
  query.send(handleQueryResponse);
}

function col(val, lf) {
    var dval = val / 100;

    var r = (dval < 0.3) ? 255 : (255 - 100 * (dval - 0.3));
    var g = 0 + dval * 240;
    var b = (Math.abs(0.5 - dval) * 0);


    if (r < 0) r = 0; if (r > 255) r = 255;
    if (g < 0) g = 0; if (g > 255) g = 255;
    if (b < 0) b = 0; if (b > 255) b = 255;

    r = r + (255 - r) * (lf - 1) / lf;
    g = g + (255 - g) * (lf - 1) / lf;
    b = b + (255 - b) * (lf - 1) / lf;

    r = Math.floor(r).toString(16);
    g = Math.floor(g).toString(16);
    b = Math.floor(b).toString(16);

    if (r.length < 2)
      r = "0" + r;
    if (g.length < 2)
      g = "0" + g;
    if (b.length < 2)
      b = "0" + b;

    return "#" + r + g + b;
}

function item(val, prio, text) {
  var bgcolor = col(val, 1.6);
  var color = col(prio, 6);

  return "<div class='pbct' style='background-color:" + color + ";'>" + text + "<div class='pb' style='width: " + val + "%; background-color:" + bgcolor + "'>" + text + "</div></div>";
}

function handleQueryResponse(response) {
  // Default error message handling
  if (!gadgetHelper.validateResponse(response))
    return;

  var groupby = null;
  switch (prefs.getString("groupby")) {
    case "CN": groupby=[{column: 3}, {column: 0}]; colhead="<h3>#val#</h3>"; break;
    case "CV": groupby=[{column: 3}, {column: 1}]; colhead="<h3>#val#</h3>";break;
    case "CP": groupby=[{column: 3}, {column: 2}]; colhead="<h3>#val#</h3>";break;
    case "V": groupby=[{column: 1}, {column: 0}]; colhead=""; break;
    case "P": groupby=[{column: 2, desc: true}, {column: 0}]; colhead=""; break;
  }

  var data = response.getDataTable();
  var coln = data.getNumberOfColumns();
  var rown = data.getNumberOfRows()
    if (coln < 2 ||
        groupby[0].column > coln - 1 ||
        groupby[1].column > coln - 1)
    {
      document.getElementById('viz').innerHTML = "<span color='red'><b>Error, Number of column too low or incompatible with the Groupby option</b></span>";
      return;
    }

  var master = groupby[0].column;
  var rows = data.getSortedRows(groupby);

  document.getElementById('viz').innerHTML = "";

  var old_mv = null;

  var buf = "";
  for (var i = 0; i < rows.length; i++) { // iterate over rows
    var mv = data.getValue(rows[i], master);
    if (mv != old_mv) {
      buf += (old_mv == null ? "" : "</ul></p></br>")
      var ch = colhead;
      ch = ch.replace("#val#", mv);
      old_mv = mv;
      buf += "<p>";
      buf += ch;
      buf += "<ul>";
    }
    var name = data.getValue(rows[i], 0);
    var val = data.getValue(rows[i], 1);
    var prio = coln < 2 ? data.getValue(rows[i], 2) : 50;

    buf += "<li>" + item(val, prio, name) + "</li>";
  }
  buf += old_mv == null ? "" : "</ul></p>";
  document.getElementById('viz').innerHTML = buf;
}
