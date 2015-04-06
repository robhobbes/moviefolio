var express = require('express');
var request = require('superagent');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var externalAPI = 'http://www.omdbapi.com/';
var cache = {};

var routingSettings = {
  strict: true,
  caseSensitive: true
};
var publicRouter = express.Router(routingSettings);
var apiRouter = express.Router(routingSettings);

function getQueryString(obj) {
  var str = '';
  var piece;
  var k;
  for (k in obj) {
    if (obj.hasOwnProperty(k)) {
      piece = k + '=' + obj[k];
      piece = piece.replace(/\ /g, '+');
      if (str === '') {
        str = '?' + piece;
      } else {
        str += '&' + piece;
      }
    }
  }
  return str;
}

function normalizeRouteMiddleware(req, res, next) {
  var modified = false;
  var path = req.path;
  if (path !== path.toLowerCase()) {
    path = path.toLowerCase();
    modified = true;
  }
  if (path.substr(-1) == '/' && path.length > 1) {
    path = path.slice(0, -1);
    modified = true;
  }
  if (modified) {
    res.redirect(301, path + getQueryString(req.query));
  } else {
    next();
  }
}

function apiHandler(req, res, url, params) {
  if (cache.apiRouter[req.url] !== undefined) {
    console.log('serving ' + url + ' from cache with params: ' + JSON.stringify(params));
    // TODO add cache lifetime / use cache library?
    res.json(cache.apiRouter[req.url]);
  } else {
    request
      .get(url)
      .query(params)
      .send()
      .end(function (error, response) {
        if (error) {
          // TODO
          console.log(error); // connectivity error
          res.send('error');
        } else if (response.error) {
          // TODO
          console.log(response.error); // 400 or 500 error
          res.send('error');
        } else {
          if (cache.apiRouter[req.url] === undefined) {
            cache.apiRouter[req.url] = JSON.parse(response.text.replace(/(\n)+/, ''));
          }
          res.json(JSON.parse(response.text.replace(/(\n)+/, '')));
        }
      });
  }
}

app.use(normalizeRouteMiddleware);

publicRouter.use(bodyParser.text());
publicRouter.use(express.static(__dirname + '/public'));
app.use('/', publicRouter);

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({
  extended: true
}));
cache.apiRouter = {};
apiRouter.get('/movies/search/:id', function (req, res) {
  var url = externalAPI;
  var params = {
    i: req.params.id
  };
  apiHandler(req, res, url, params);
});
apiRouter.get('/movies/search', function (req, res) {
  var url = externalAPI;
  var params = {
    s: req.query.search
  };
  if (req.query.search === undefined) {
    // TODO error
    res.send('error');
  } else {
    apiHandler(req, res, url, params);
  }
});
/*apiRouter.get('/movies/:id', function (req, res) {

});
apiRouter.*/
apiRouter.get('/movies', function (req, res) {
  // TODO store title and year (so that we can display minimal information until the external API calls come back)
  var json = [
    {
      imdbID: "tt1772341",
      categories: [
        "Animation",
        "Adventure",
        "Comedy"
      ],
      formats: [
        "DVD",
        "Blu-ray"
      ]
    },
    {
      imdbID: "tt0481141",
      categories: [
        "Drama",
        "Romance"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt0417299",
      categories: [
        "Animation",
        "Action",
        "Adventure"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt0848537",
      categories: [
        "Animation",
        "Adventure",
        "Family"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt1155076",
      categories: [
        "Action",
        "Drama",
        "Family"
      ],
      formats: [
        "DVD"
      ]
    },
    {
      imdbID: "tt0414387",
      categories: [
        "Drama",
        "Romance"
      ],
      formats: [
        "DVD"
      ]
    }
  ]
  res.json(json);
});
app.use('/api', apiRouter);

console.log('listening on ' + port);
app.listen(port, 'localhost');