var fs = require('fs-extra'),
    path = require('path'),
    lineReader = require('line-reader'),
    hogan = require("hogan.js");

var res = [];

// // what we want:
// res = [
//   {
//     "time": "11:43 PM",
//     "text": " In the Mood For Love…"
//   }
// ];

// read all lines:
lineReader.eachLine('crowdlist.txt', function(line) {
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
    var hour = data[1],
        min  = data[2],
        apm  = data[3],
        text = data[4];
  
    res.push({
      "time": {
        "24hour": parseInt(hour, 10) + (apm==='PM' ? 12 : 0),
        "hour": parseInt(hour, 10),
        "min": parseInt(min, 10),
        "apm": apm
      },
      "text": text
    });
  }
}

// function to build HTML page from list
function outputHTML(data) {

  var template = hogan.compile(fs.readFileSync("list.mustache").toString());
  var output = template.render(data);
  
  fs.outputFileSync(path.join('web','index.html'), output);
  
}