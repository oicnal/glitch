const http = require('http');
const fs = require('fs');
const path = require('path');
const page = require('./page.js');
const widgets = require('./widgets.js');

function newSite()
{
  return {
    tempCode: 1,
    temp: 0.0,

    batCode: 1,
    batVolt: 0.0,
    batSOC: 0.0,
    batTemp: 0.0,
    batAmp: 0.0,

    sol:
    [
      { code: 1, day: 0, pow: 0.0, nrj: 0.0, volt: 0.0, temp: 0.0 },
      { code: 1, day: 0, pow: 0.0, nrj: 0.0, volt: 0.0, temp: 0.0 }
    ]
  };
}

var wanData =
{
  time: 0,
  v: newSite(),
  r: newSite()
};

const bootId = Date.now();
const token = process.env.TOKEN;
const js = fs.readFileSync(path.join(__dirname, 'client.js')).toString();

function send(res, type, body)
{
  res.writeHead(200,
  {
    "Content-Type": type + "; charset=utf-8",
    "Cache-Control": "no-cache"
  });
  res.end(body);
}

function fail(res, code, msg)
{
  res.writeHead(code, {"Content-Type": "text/plain; charset=utf-8"});
  res.end(msg);
}

http.createServer(function (req, res)
{
  var pathname = req.url.split('?')[0];

  if(pathname == "/client.js")
  {
    send(res, "application/javascript", js);
  }
  else if(pathname == "/setData")
  {
    if(req.method != 'POST')
    {
      return fail(res, 405, "POST only");
    }

    if(token && req.headers['x-token'] != token)
    {
      return fail(res, 401, "bad token");
    }

    var body = '';

    req.on('data', function(chunk)
    {
      body += chunk;
      if(body.length > 100000)
      {
        req.destroy();
      }
    });

    req.on('end', function()
    {
      var data;

      try
      {
        data = JSON.parse(body);
      }
      catch(e)
      {
        return fail(res, 400, "bad json");
      }

      if(typeof data.time == 'number')
      {
        wanData.time = data.time;
      }

      for(var key of ['v', 'r'])
      {
        if(data[key] && typeof data[key] == 'object')
        {
          wanData[key] = data[key];
        }
      }

      send(res, "text/plain", "success");
    });
  }
  else if(pathname == "/update")
  {
    send(res, "application/json", JSON.stringify(
    {
      boot: bootId,
      time: wanData.time,
      v: wanData.v,
      r: wanData.r
    }));
  }
  else
  {
    send(res, "text/html", page.getData('monitor', widgets.getMonitorSVG));
  }
}).listen(process.env.PORT || 8080);
