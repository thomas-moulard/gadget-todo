//////////////// Beginning of Google Gadget Code ///////////////////////////////

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

function handleQueryResponse(response) {
  // Default error message handling
  if (!gadgetHelper.validateResponse(response))
    return;
  var data = response.getDataTable();
  gadgetMain(data);
}

//////////////// End of Google Gadget Code ////////////////////////////////////



//////////////// Beginning of crappy code /////////////////////////////////////

function gadgetMain(data) {
  var groupby = null;
  switch (prefs.getString("groupby")) {
    case "CN": groupby=[{column: 3}, {column: 0}]; bgroupby=true; break;
    case "CV": groupby=[{column: 3}, {column: 1}]; bgroupby=true;break;
    case "CP": groupby=[{column: 3}, {column: 2}]; bgroupby=true;break;
    case "V": groupby=[{column: 1}, {column: 0}]; bgroupby=false; break;
    case "P": groupby=[{column: 2, desc: true}, {column: 0}]; bgroupby=false; break;
  }

  var root = document.getElementById("viz");
  for (var i = 0; i < root.childNodes.length; ++i)
    root.removeChild(root.childNodes[i]);

  var coln = data.getNumberOfColumns();
  var rown = data.getNumberOfRows()
    if (coln < 2 ||
        groupby[0].column > coln - 1 ||
        groupby[1].column > coln - 1)
    {
      var span = document.createElement("span");
      span.textContent = "Error, Number of column too low or incompatible with the Groupby option.";
      span.className ="gadgetSettingsError";
      document.getElementById('viz').appendChild(span);
      return;
    }

  var master = groupby[0].column;
  var rows = data.getSortedRows(groupby);

  var model = {groupby: bgroupby, data: []};
  if (bgroupby)
    model.data.push({elts: []});

  var old_mv = null;

  for (var i = 0; i < rows.length; i++) { // iterate over rows
    var mv = data.getValue(rows[i], master);
    if (mv != old_mv) {
      model.data.push({text: mv, elts: [], val: 0, prio: 0});
      old_mv = mv;
    }
    var text = data.getValue(rows[i], 0);
    var val = data.getValue(rows[i], 1);
    var prio = coln < 2 ? 50 : data.getValue(rows[i], 2);
    model.data[model.data.length - 1].elts.push({text: text, val: val, prio: prio});
  }

  // Compute the mean
  if (model.groupby) {
    for (var i = 0; i < model.data.length; ++i) {
      if (model.data[i].elts.length == 0)
        continue;
    }
    for (var j = 0; j < model.data[i].elts.length; ++j) {
      model.data[i].val += model.data[i].elts[j].val;
      model.data[i].prio += model.data[i].elts[j].prio;
    }
    model.data[i].val /= model.data[i].elts.length;
    model.data[i].prio /= model.data[i].elts.length;
  }

  view(model);
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

function update(obj, val, max) {
  if (val < max)
    window.setTimeout(update, 50, obj, val + 3, max);
  if (val > 100)
    val = 100;
  obj.style.backgroundColor = col(val, 1);
  obj.style.width = val + "%";
}

function itemize(obj, elt) {
  var prio = elt.prio;
  var val = elt.val;
  var text = elt.text;

  var bgcolor = col(val, 1);
  var color = col(prio, 6);
  text = text.replace(/ /g, "&nbsp;"); // For nice black/grey text.
  text = "&nbsp;" + text;

  var container = document.createElement("div");
  container.className = "barcontainer";
  container.style.backgroundColor = color;

  var hack = document.createElement("div");
  hack.className = "barhack";
  hack.innerHTML = text;

  var bar = document.createElement("div");
  bar.className = "bar";
  bar.style.backgroundColor = bgcolor;
  bar.style.width = val + "%";
  bar.innerHTML = text;
  window.setTimeout(update, 50, bar, 0, val);

  container.appendChild(hack);
  hack.appendChild(bar);

  obj.appendChild(container);
}




function view(model) {
  var root = document.getElementById("viz");
  for (var i = 0; i < root.childNodes.length; ++i)
    root.removeChild(root.childNodes[i]);

  for (var i = 0; i < model.data.length; ++i) {
    if (model.data[i].elts.length == 0)
      continue;
    var p = document.createElement("p");
    root.appendChild(p);
    if (model.groupby) {
      var h3 = document.createElement("h3");
      model.data[i].text = "(" + model.data[i].val + "%) " + model.data[i].text;
      itemize(h3, model.data[i]);
      p.appendChild(h3);
    }
    var ul = document.createElement("ul");
    p.appendChild(ul);
    for (var j = 0; j < model.data[i].elts.length; ++j) {
      var li = document.createElement("li");
      ul.appendChild(li);
      model.data[i].elts[j].text = "(" + model.data[i].elts[j].val + "%) " + model.data[i].elts[j].text;
      itemize(li, model.data[i].elts[j]);
    }
  }
}
