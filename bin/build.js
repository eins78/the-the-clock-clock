var fs = require('fs-extra'),
    path = require('path'),
    f = require('underscore'),
    lineReader = require('line-reader'),
    hogan = require("hogan.js");

var config = require(path.join('..', 'config.json')),
    res = [];

// // what we want:
// res = [
//   {
//     "time": "11:43 PM",
//     "text": " In the Mood For Love…"
//   }
// ];

// read all lines:
lineReader.eachLine(path.join('crowdlist.txt'), function(line) {
  parseEntry(line);
}).then(function () {
  console.log("I'm done!!");
  res = { "list": res };
  console.log(JSON.stringify(res));
  fs.outputJSON(path.join('web','theclock-crowdsourced.json'), res);
  outputHTML(res);
});

// Functions

// function to parse the entries (lines)
function parseEntry(line) {

  // we are going to have a bad time…
  var regex = /(\d{1,2}):(\d{1,2})\s+([AP]M):?\s+(.+)/;
  
  // read line with regex
  var data = line.match(regex);
  
  // ignore empty lines and parse errors
  if (data) {
    var hour = parseInt(data[1], 10),
        min  = parseInt(data[2], 10),
        apm  = data[3],
        text = data[4];
  
    res.push({
      "time": {
        "24hour": hour + (apm === 'PM' ? 12 : (hour === 12 ? -12 : 0)),
        "hour": hour,
        "min": parseInt(min, 10),
        "timestamp": (hour < 10 ? ('0' + hour.toString()) : (hour)) + ':' + (min < 10 ? ('0' + min.toString()) : (min)) + ' ' + apm
      },
      "text": text
    });
  }
}

// function to build HTML page from list
function outputHTML(data) {
  
  data = f.extend(data, config);

  var template = hogan.compile(fs.readFileSync(path.join('templates', 'list.mustache')).toString());
  var output = template.render(data);
  
  fs.outputFileSync(path.join('web','index.html'), output);
  
}