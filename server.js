const http = require('http');
const url = require('url');
const fs = require('fs');
const page = require('./page.js');
const widgets = require('./widgets.js');

var wanData = 
{ 
  time: 0,

  extCode: 1,
  extTemp: 0.0,
  extMinTemp:0.0,
  extMaxTemp:0.0,
  extMinTime:0,
  extMaxTime:0,

  intCode: 1,
  intTemp: 0.0, 
  intHumi: 0.0,

  baseCode: 1,
  baseTemp: 0.0,
  baseHeat: 0,
  baseForce: 0,
  baseLow: 0.0,
  baseDelta: 0.0,

  batCode: 1,
  batVolt: 0.0,
  batSOC: 0.0,
  batTemp: 0.0,
  batAmp: 0.0,

  solCode: 1,
  solDay: 0,
  solPow: 0.0,
  solNrj: 0.0,
  solVolt: 0.0,
  solTemp: 0.0
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
    if(req.method == 'POST') 
    {
      req.on('data', function(postData) 
      {
        Object.assign(wanData,JSON.parse(postData.toString()));
      });
    }

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
      heartBeat: wanData.intCode == 0,
      temperature: wanData.intTemp,
      humidity: wanData.intHumi,
      heating: false
    };
    
    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
    res.write(JSON.stringify(jsonObj));
    res.end();
  }
  else if(req.url == "/baseUpdate")
  {
    var jsonObj = 
    { 
      heartBeat: wanData.baseCode == 0,
      temp: wanData.baseTemp,
      heat: wanData.baseHeat,
      force: wanData.baseForce,
      low: wanData.baseLow,
      delta: wanData.baseDelta
    }

    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
    res.write(JSON.stringify(jsonObj));
    res.end();
  }
  else if(req.url == "/batUpdate")
  {
    var jsonObj = 
    { 
      heartBeat: wanData.batCode == 0,
      voltage: wanData.batVolt,
      stateOfCharge: wanData.batSOC,
      temperature: wanData.batTemp,
      amps: wanData.batAmp
    }

    res.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
    res.write(JSON.stringify(jsonObj));
    res.end();
  }
  else if(req.url == "/solUpdate")
  {
    var jsonObj = 
    { 
      heartBeat: wanData.solCode == 0,
      dayLight: wanData.solDay == 1,
      power: wanData.solPow,
      energy: wanData.solNrj,
      voltage: wanData.solVolt,
      temperature: wanData.solTemp
    }

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
