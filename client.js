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
    document.getElementById('intHeartBeat').textContent = (json.heartBeat ? ' \u2665' : ' ');
    document.getElementById('intTemperature').textContent = json.temperature.toFixed(1) + '\xB0C';
    document.getElementById('intHumidity').textContent = ('H' + json.humidity.toFixed(0) + '%');
  }).
  catch((err) =>
  {
    document.getElementById('intHeartBeat').textContent = 'B'; 
  }).
  finally(() =>
  {
    setTimeout(intUpdate, 1000);
  });
}

function monitorUpdate()
{
  timeUpdate();
  extUpdate();
  intUpdate(); 
}
