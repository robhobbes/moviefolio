var express = require('express');
var request = require('superagent');
var app = express();
var bodyParser = require('body-parser');
var normalize = require('./middleware/normalize').normalize;

var port = 8080;
var cache = {};

var routingSettings = {
  strict: true,
  caseSensitive: true
};
var publicRouter = express.Router(routingSettings);
var apiRouter = require('./routers/api').router;

app.use(normalize);

publicRouter.use(bodyParser.text());
publicRouter.use(express.static(__dirname + '/public'));
app.use('/', publicRouter);
app.use('/api', apiRouter);

console.log('listening on ' + port);
app.listen(port, 'localhost');
