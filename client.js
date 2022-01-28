Number.prototype.clamp = function(min,max)
{
  return Math.min(Math.max(min, this), max);
}

function timeUpdate()
{
  fetch('/timeUpdate').
  then((res) => 
  { 
    return res.json(); 
  }).
  then((json) => 
  {
    var date = new Date();
    date.setTime(parseInt(json.time));

    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    document.getElementById('title').textContent =
      "Escous - " +
      date.toLocaleDateString("fr-CA", options) + 
      " - " +
      date.toLocaleTimeString("en-US", {hour12: false});
  }).
  catch((err) =>
  {
    document.getElementById('title').textContent = 'X'; 
  }).
  finally(() =>
  {
    setTimeout(timeUpdate, 1000);
  });
}

function extUpdate()
{
  fetch('/extUpdate').
  then((res) => 
  { 
    return res.json(); 
  }).
  then((json) => 
  {
    const min = -15;
    const max = 25;
    const height = 68 * (json.temperatureExt.clamp(min,max) - min) / (max - min);
    const y = 24 + 68 - height;

    var minDate = new Date();
    minDate.setTime(parseInt(json.temperatureMinTime));

    var maxDate = new Date();
    maxDate.setTime(parseInt(json.temperatureMaxTime));

    document.getElementById('extMercure').setAttribute("y", y);
    document.getElementById('extMercure').setAttribute("height", height);    
    document.getElementById('extTemperature').textContent = json.temperatureExt.toFixed(1) + '\xB0C';
    document.getElementById('extMinTemp').textContent = json.temperatureMin.toFixed(1) + '\xB0C';
    document.getElementById('extMinTime').textContent = minDate.toLocaleTimeString();
    document.getElementById('extMaxTemp').textContent = json.temperatureMax.toFixed(1) + '\xB0C';
    document.getElementById('extMaxTime').textContent = maxDate.toLocaleTimeString();
    document.getElementById('extHumidity').textContent = '';
    document.getElementById('extHeating').setAttribute("visibility", "hidden");
    document.getElementById('extHeartBeat').textContent = json.heartBeat ? ' \u2665' : "X"; 
  }).
  catch((err) =>
  {
    document.getElementById('intHeartBeat').textContent = 'E'; 
  }).
  finally(() =>
  {
    setTimeout(extUpdate, 1000);
  });
}

function intUpdate()
{
  fetch('/intUpdate').
  then((res) => 
  { 
    return res.json(); 
  }).
  then((json) => 
  {
    const min = -15;
    const max = 25;
    const height = 68 * (json.temperature.clamp(min,max) - min) / (max - min);
    const y = 24 + 68 - height;

    document.getElementById('intMercure').setAttribute("y", y);
    document.getElementById('intMercure').setAttribute("height", height);    
    document.getElementById('intTemperature').textContent = json.temperature.toFixed(1) + '\xB0C';
    document.getElementById('intHumidity').textContent = ('H' + json.humidity.toFixed(0) + '%');
    document.getElementById('intHeartBeat').textContent = (json.heartBeat ? ' \u2665' : 'X');
  }).
  catch((err) =>
  {
    document.getElementById('intHeartBeat').textContent = 'E'; 
  }).
  finally(() =>
  {
    setTimeout(intUpdate, 1000);
  });
}

function baseUpdate()
{
  fetch('/baseUpdate').
  then((res) => 
  { 
    return res.json(); 
  }).
  then((json) => 
  {
    const min = -15;
    const max = 25;
    const height = 68 * (json.temp.clamp(min,max) - min) / (max - min);
    const y = 24 + 68 - height;

    document.getElementById('baseMercure').setAttribute("y", y);
    document.getElementById('baseMercure').setAttribute("height", height);    
    document.getElementById('baseTemperature').textContent = json.temp.toFixed(1) + '\xB0C';
    document.getElementById('baseHeating').setAttribute("visibility", (json.heat || json.force ? "visible" : "hidden"));
    document.getElementById('baseRelay').setAttribute("visibility", "visible");
    document.getElementById('baseOpen').setAttribute("visibility", (json.force ?  "hidden" : "visible"));
    document.getElementById('baseClose').setAttribute("visibility", (json.force  ? "visible" : "hidden"));
    document.getElementById('baseLow').textContent = json.low.toFixed(1) + '\xB0C';
    document.getElementById('baseHigh').textContent = (json.low+json.delta).toFixed(1) + '\xB0C';
    document.getElementById('baseHeartBeat').textContent = (json.heartBeat ? ' \u2665' : 'X');
  }).
  catch(() =>
  {
    document.getElementById('baseHeartBeat').textContent = "E"; 
  }).
  finally(() =>
  {
    setTimeout(baseUpdate, 1000);
  });
}

function batUpdate()
{
  fetch('/batUpdate').
  then((res) => 
  { 
    return res.json(); 
  }).
  then((json) => 
  {
    document.getElementById('batteryVoltage').textContent = json.voltage.toFixed(1) + 'V';
   document.getElementById('batterySOC').textContent = json.stateOfCharge.toFixed(0) + '%';
    document.getElementById('batteryTemperature').textContent = json.temperature.toFixed(1) + '\xB0C';
    document.getElementById('batterySOC1').setAttribute("visibility", (json.voltage > 12.60 ? "visible" : "hidden"));
    document.getElementById('batterySOC2').setAttribute("visibility", (json.voltage > 12.80 ? "visible" : "hidden"));
    document.getElementById('batterySOC3').setAttribute("visibility", (json.voltage > 13.00 ? "visible" : "hidden"));
    document.getElementById('batterySOC4').setAttribute("visibility", (json.voltage > 13.15 ? "visible" : "hidden"));
    document.getElementById('batterySOC5').setAttribute("visibility", (json.voltage > 13.275 ? "visible" : "hidden"));
    document.getElementById('batteryHappy').setAttribute("visibility", (json.voltage >= 12.8 ? "visible" : "hidden"));
    document.getElementById('batterySad').setAttribute("visibility", (json.voltage < 12.8 ? "visible" : "hidden"));
  
    var amps = json.amps;

    if(amps < 0)
    {
        amps *= -1;
        document.getElementById('batteryDown').setAttribute("visibility","visible");
        document.getElementById('batteryUp').setAttribute("visibility","hidden");
    }
    else
    {
      document.getElementById('batteryUp').setAttribute("visibility","visible");
      document.getElementById('batteryDown').setAttribute("visibility","hidden");
    }

    var power = amps * json.voltage;

    document.getElementById('batteryAmps').textContent = amps.toFixed(0) + 'A';
    document.getElementById('batteryPower').textContent = power.toFixed(0) + 'W';

    document.getElementById('batteryHeartBeat').textContent = (json.heartBeat ? ' \u2665' : 'X');
  }).
  catch((err) =>
  {
    document.getElementById('batteryHeartBeat').textContent = "E"; 
  }).
  finally(() =>
  {
    setTimeout(batUpdate, 1000);
  });
}

function monitorUpdate()
{
  timeUpdate();
  extUpdate();
  intUpdate(); 
  baseUpdate();
  batUpdate();
}
