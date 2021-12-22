function getData(name, svgFunc)
{
  var data =  
  [
    '<!DOCTYPE html>',
    '<html>',
      '<head>',
        '<meta charset="utf-8" />',
        '<title>' + name + '</title>',
      '</head>',
      '<body>',
        svgFunc(),
        '<script src="client.js"></script>',   
        '<script>'+ name + 'Update();</script>',
      '</body>',
    '</html>'
  ].join('\n');

  return data;
}

exports.getData = getData;
