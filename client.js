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
      "St-Tite - " +
      date.toLocaleDateString("fr-FR, options) + 
      " - " +
      date.toLocaleTimeString("fr-FR", {hourCycle: 'h23'});
  }).
  catch((err) =>
  {
    console.log(err);
    document.getElementById('title').textContent = 'X'; 
  });//.
//  finally(() =>
//  {
//    setTimeout(timeUpdate, 1000);
//  });
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
    document.getElementById('intHeartBeat').textContent = (json.heartBeat ? ' \u2665' : 'X');
  }).
  catch((err) =>
  {
    document.getElementById('intHeartBeat').textContent = 'E'; 
  });//.
//  finally(() =>
//  {
//    setTimeout(intUpdate, 1000);
//  });
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
  });//.
//  finally(() =>
//  {
//    setTimeout(batUpdate, 1000);
//  });
}

function solUpdate()
{
  fetch('/solUpdate').
  then((res) => 
  { 
    return res.json(); 
  }).
  then((json) => 
  {
    document.getElementById('solarDay').setAttribute("visibility", (json.dayLight ? "visible" : "hidden"));
    document.getElementById('solarNight').setAttribute("visibility", (json.dayLight ? "hidden" : "visible"));
    document.getElementById('solarPower').textContent = (json.power > 999) ? (json.power/1000).toFixed(1) + 'kW' : json.power.toFixed(0) + 'W';
    document.getElementById('solarEnergy').textContent = json.energy.toFixed(1) + 'kWh'; 
    document.getElementById('solarVoltage').textContent = json.voltage.toFixed(1) + 'V'; 
    document.getElementById('solarTemperature').textContent = json.temperature.toFixed(1) + '\xB0C'; 
    document.getElementById('solarHeartBeat').textContent = (json.heartBeat ? ' \u2665' : 'X'); 
  }).
  catch((err) =>
  {
    document.getElementById('solarHeartBeat').textContent = "E";
  });//.
//  finally(() =>
//  {
//    setTimeout(solUpdate, 1000);
//  });
}

function monitorUpdate()
{
  timeUpdate();
  intUpdate(); 
  batUpdate();
  solUpdate();
}
