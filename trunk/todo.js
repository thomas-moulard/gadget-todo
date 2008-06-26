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

function item(prio, text) {
    var pris = Math.floor((prio * 255.0 / 100.0)).toString(16);
    var pric = Math.floor(((100 - prio) * 255.0 / 100.0)).toString(16);
    return "<div class='pbct'><div class='pb' style='width: " + prio + "%; background-color:#" + pris + pric + "00' />" + text + "</div>";
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

  for (var i = 0; i < rows.length; i++) { // iterate over rows
    var mv = data.getValue(rows[i], master);
    if (mv != old_mv) {
      var ch = colhead;
      ch = ch.replace("#val#", mv);
      old_mv = mv;
      document.getElementById('viz').innerHTML += ch;
    }
    var name = data.getValue(rows[i], 0);
    var val = data.getValue(rows[i], 1);
    var prio = coln < 2 ? data.getValue(rows[i], 2) : 50;

    document.getElementById('viz').innerHTML += item(prio, name);
  }
}
