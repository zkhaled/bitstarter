var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.logger());

var str = fs.readFile('index.html', {encoding:'utf-8'});

app.get('/', function(request, response) {
  response.send('Blah');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
