const http = require('http');
const url = require('url');
const fs = require('fs');
const page = require('./page.js');
const widgets = require('./widgets.js');

var intTemp = 0.0;
var intHumi = 0.0;

const js = fs.readFileSync('client.js').toString();

http.createServer(function (req, res) 
{
  var query = url.parse(req.url, true);
  
  if(req.url == "/client.js")
  {
    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
    res.write(js);
    res.end();
  }
  else if(query.pathname == "/setData")
  {
    intTemp = parseFloat(query.query.intTemp);
    intHumi = parseFloat(query.query.intHumi);
    
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write("success");
    res.end();
  }
  else if(req.url == "/intUpdate")
  {
    var jsonObj = 
    { 
      heartBeat: false,
      temperature: intTemp,
      humidity: intHumi,
      heating: false
    };
    
    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
    res.write(JSON.stringify(jsonObj));
    res.end();
  }
  else
  {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write(page.getData('monitor',widgets.getMonitorSVG));
	  res.end();
  }
}).listen(8080);
