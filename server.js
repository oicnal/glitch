const http = require('http');
const url = require('url');
const fs = require('fs');
const page = require('./page.js');
const widgets = require('./widgets.js');

var wanData = 
{ 
  time: 0,

  extCode: 0,
  extTemp: 0.0,
  extMinTemp:0.0,
  extMaxTemp:0.0,
  extMinTime:0,
  extMaxTime:0,

  intCode: 0,
  intTemp: 0.0, 
  intHumi: 0.0,

  baseCode: 1,
  batCode: 1,
  solCode: 1
};

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
    wanData.time = parseInt(query.query.time);

    wanData.extCode = parseInt(query.query.extCode);
    wanData.extTemp = parseFloat(query.query.extTemp);
    wanData.extMinTemp = parseFloat(query.query.extMinTemp);
    wanData.extMaxTemp = parseFloat(query.query.extMaxTemp);
    wanData.extMinTime = parseInt(query.query.extMinTime);
    wanData.extMaxTime = parseInt(query.query.extMaxTime);
    
    wanData.intCode = parseInt(query.query.intCode);
    wanData.intTemp = parseFloat(query.query.intTemp);
    wanData.intHumi = parseFloat(query.query.intHumi);
    
    wanData.baseCode = parseInt(query.query.baseCode);
    wanData.batCode = parseInt(query.query.batCode);
    wanData.solCode = parseInt(query.query.solCode);

    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write("success");
    res.end();
  }
  else if(req.url == "/timeUpdate")
  {
    var jsonObj = 
    { 
      time: wanData.time,
    };
    
    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
    res.write(JSON.stringify(jsonObj));
    res.end();
  }
  else if(req.url == "/extUpdate")
  {
    var jsonObj = 
    { 
      heartBeat: wanData.extCode == 0,
      temperatureExt: wanData.extTemp,
      temperatureMin: wanData.extMinTemp,
      temperatureMinTime: wanData.extMinTime,
      temperatureMax: wanData.extMaxTemp,
      temperatureMaxTime: wanData.extMaxTime,
      heating: false
    };
    
    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
    res.write(JSON.stringify(jsonObj));
    res.end();
  }
  else if(req.url == "/intUpdate")
  {
    var jsonObj = 
    { 
      heartBeat: false,
      temperature: wanData.intTemp,
      humidity: wanData.intHumi,
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
