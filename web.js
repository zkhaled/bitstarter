var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.logger());

var str = fs.readFileSync('index.html', {encoding:'utf-8'});
console.log('ZK str is '+str);

var files = fs.readdirSync('.');
console.log('files -> ' + files.join(' '));

app.get('/', function(request, response) {
  response.send('Blah');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
