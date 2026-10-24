Number.prototype.clamp = function(min,max)
{
  return Math.min(Math.max(min, this), max);
}

var bootId;

function el(id)
{
  return document.getElementById(id);
}

function visible(id, cond)
{
  el(id).setAttribute("visibility", (cond ? "visible" : "hidden"));
}

function heart(prefix, ok)
{
  el(prefix + 'HeartBeat').textContent = (ok ? ' \u2665' : 'X');
}

function showTime(time)
{
  var date = new Date();
  date.setTime(parseInt(time));

  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

  el('title').textContent =
    "St-Tite - " +
    date.toLocaleDateString("fr-CA", options) +
    " - " +
    date.toLocaleTimeString("fr-FR", {hourCycle: 'h23'});
}

function showTemp(prefix, site)
{
  const min = 0;     // colonne vide
  const max = 30;    // colonne pleine (les poêles à bois ne sont pas loin)
  const height = 68 * (site.temp.clamp(min,max) - min) / (max - min);
  const y = 24 + 68 - height;

  el(prefix + 'Mercure').setAttribute("y", y);
  el(prefix + 'Mercure').setAttribute("height", height);
  el(prefix + 'Temperature').textContent = site.temp.toFixed(1) + '\xB0C';

  heart(prefix, site.tempCode == 0);
}

function showBattery(prefix, site)
{
  // tension ramenée à 12V : 48V / 4, 24V / 2
  var volt12 = site.batVolt * 12 / (site.batNomi || 12);

  el(prefix + 'Voltage').textContent = volt12.toFixed(1) + 'V';
  el(prefix + 'SOC').textContent = site.batSOC.toFixed(0) + '%';
  el(prefix + 'Temperature').textContent = site.batTemp.toFixed(1) + '\xB0C';

  visible(prefix + 'SOC1', volt12 > 12.60);
  visible(prefix + 'SOC2', volt12 > 12.80);
  visible(prefix + 'SOC3', volt12 > 13.00);
  visible(prefix + 'SOC4', volt12 > 13.15);
  visible(prefix + 'SOC5', volt12 > 13.275);
  visible(prefix + 'Happy', volt12 >= 12.8);
  visible(prefix + 'Sad', volt12 < 12.8);

  var amps = site.batAmp;

  visible(prefix + 'Down', amps < 0);
  visible(prefix + 'Up', amps >= 0);

  amps = Math.abs(amps);

  var power = amps * site.batVolt;

  el(prefix + 'Amps').textContent = amps.toFixed(0) + 'A';
  el(prefix + 'Power').textContent = power.toFixed(0) + 'W';

  heart(prefix, site.batCode == 0);
}

function showSolar(prefix, sol)
{
  visible(prefix + 'Day', sol.day == 1);
  visible(prefix + 'Night', sol.day != 1);

  el(prefix + 'Power').textContent = (sol.pow > 999) ? (sol.pow/1000).toFixed(1) + 'kW' : sol.pow.toFixed(0) + 'W';
  el(prefix + 'Energy').textContent = sol.nrj.toFixed(1) + 'kWh';
  el(prefix + 'Voltage').textContent = sol.volt.toFixed(1) + 'V';
  el(prefix + 'Temperature').textContent = sol.temp.toFixed(1) + '\xB0C';

  heart(prefix, sol.code == 0);
}

// un bloc invalide affiche E sans bloquer les autres
function show(func, prefix, data)
{
  try
  {
    func(prefix, data);
  }
  catch(err)
  {
    console.log(prefix, err);
    var hb = el(prefix + 'HeartBeat');
    if(hb)
    {
      hb.textContent = 'E';
    }
  }
}

function monitorUpdate()
{
  fetch('/update').
  then((res) =>
  {
    return res.json();
  }).
  then((json) =>
  {
    if(bootId === undefined)
    {
      bootId = json.boot;
    }
    else if(json.boot != bootId)
    {
      location.reload();
      return;
    }

    showTime(json.time);

    show(showTemp,    'basev',    json.v);
    show(showBattery, 'batteryv', json.v);
    show(showSolar,   'solarv1',  json.v.sol[0]);
    show(showSolar,   'solarv2',  json.v.sol[1]);

    show(showTemp,    'baser',    json.r);
    show(showBattery, 'batteryr', json.r);
    show(showSolar,   'solarr1',  json.r.sol[0]);
    show(showSolar,   'solarr2',  json.r.sol[1]);
  }).
  catch((err) =>
  {
    console.log(err);
    el('title').textContent = 'X';
  });
}
