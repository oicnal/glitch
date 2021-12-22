Number.prototype.clamp = function(min,max)
{
  return Math.min(Math.max(min, this), max);
}

function titleUpdate()
{
  var date = new Date;
  document.getElementById('title').textContent = "Les Escoumins - " + date.toLocaleTimeString(); 
  setTimeout(titleUpdate, 1000);
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
  titleUpdate();
  intUpdate(); 
}
