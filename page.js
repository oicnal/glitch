function getData(name, svgFunc)
{
  var data =  
  [
    '<!DOCTYPE html>',
    '<html>',
      '<head>',
        '<meta charset="utf-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
        '<title>' + name + '</title>',
      '</head>',
      '<body>',
        svgFunc(),
        '<script src="client.js"></script>',   
        '<script>' + name + 'Update(); setInterval(' + name + 'Update, 5000);</script>',
      '</body>',
    '</html>'
  ].join('\n');

  return data;
}

exports.getData = getData;
